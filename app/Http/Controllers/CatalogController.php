<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Carsrc;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Поиск: каждое слово запроса — отдельный токен, все обязаны совпасть (AND).
        if ($request->filled('search')) {
            $this->applySearch($query, (string) $request->search);
        }

        // Категория
        if ($request->filled('category')) {
            $query->where('category_slug', $request->category);
        }

        // Тип
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Наименование запчасти — по индексированной колонке
        if ($request->filled('partname')) {
            $query->where('partname_name', $request->partname);
        }

        // Наличие: по умолчанию — только в наличии
        $inStock = $request->has('in_stock')
            ? $request->boolean('in_stock')
            : true;

        if ($inStock) {
            $query->where('amount', '>', 0);
        }

        // Цена
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Донор
        if ($request->filled('carsrc_id')) {
            $query->where('carsrc_id', $request->carsrc_id);
        }

        // Сортировка
        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc'   => $query->orderBy('name', 'asc'),
            default      => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate(24)->withQueryString();

        // Категории: только с товарами в наличии, одним запросом (кеш на 1 час)
        $categories = \Cache::remember('catalog_categories', 3600, function () {
            $slugsWithProducts = Product::where('amount', '>', 0)
                ->whereNotNull('category_slug')
                ->distinct()
                ->pluck('category_slug');

            return Category::whereIn('slug', $slugsWithProducts)
                ->orderBy('sort_order')
                ->get();
        });

        // Наименования запчастей с количеством — один GROUP BY (кеш на 1 час)
        $partnames = \Cache::remember('catalog_partnames_v3', 3600, function () {
            return Product::where('amount', '>', 0)
                ->whereNotNull('partname_name')
                ->where('partname_name', '!=', '')
                ->selectRaw('partname_name as name, COUNT(*) as count')
                ->groupBy('partname_name')
                ->orderBy('partname_name')
                ->get()
                ->map(fn ($row) => ['name' => $row->name, 'count' => (int) $row->count])
                ->all();
        });

        $carsrcs = Carsrc::orderBy('mark')->orderBy('model')->get(['id', 'mark', 'model', 'year']);

        return Inertia::render('Catalog/Index', [
            'products'   => $products,
            'categories' => $categories,
            'partnames'  => $partnames,
            'carsrcs'    => $carsrcs,
            'filters'    => $request->only([
                'search', 'category', 'type', 'in_stock',
                'price_min', 'price_max', 'carsrc_id', 'partname', 'sort',
            ]) + ['in_stock' => $inStock],
        ]);
    }

    public function show(Product $product)
    {
        $product->load('carsrc');
        $similar = $this->findSimilar($product, 8);

        return Inertia::render('Catalog/Show', [
            'product' => $product,
            'similar' => $similar,
        ]);
    }

    /**
     * Автодополнение для живого поиска в шапке.
     * Возвращает до 7 товаров в наличии, лёгкий JSON.
     */
    public function suggest(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['suggestions' => []]);
        }

        $query = Product::query()->where('amount', '>', 0);
        $this->applySearch($query, $q);

        $products = $query->latest()
            ->limit(7)
            ->get(['id', 'name', 'price', 'pictures_urls']);

        return response()->json([
            'suggestions' => $products->map(fn (Product $p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'price' => $p->price,
                'url'   => route('catalog.show', $p),
                'image' => $p->pictures_urls[0] ?? null,
            ]),
        ]);
    }

    /**
     * Токенизированный case-insensitive поиск по search_index.
     * Кириллические токены дополнительно ищутся по основе слова (без окончания):
     * «свечи» → «свеч» находит и «Свеча», и «свечи». Артикулы не стеммятся.
     */
    private function applySearch($query, string $search): void
    {
        $tokens = preg_split('/\s+/u', \App\Support\RuStemmer::normalize(trim($search))) ?: [];

        foreach ($tokens as $token) {
            $variants = array_unique([$token, \App\Support\RuStemmer::stem($token)]);

            $query->where(function ($q) use ($variants) {
                foreach ($variants as $variant) {
                    // '!' как ESCAPE-символ — работает одинаково и в SQLite, и в MySQL
                    $escaped = addcslashes($variant, '%_!');
                    $q->orWhereRaw("search_index LIKE ? ESCAPE '!'", ["%{$escaped}%"]);
                }
            });
        }
    }

    /**
     * Подбор похожих товаров.
     *
     * Приоритеты:
     * 1. Парная деталь — то же наименование, но зеркальная сторона
     *    (правая ↔ левая, передняя ↔ задняя): именно её чаще всего ищут.
     * 2. Тот же артикул (точно, затем по префиксу) — аналоги.
     * 3. То же наименование — применимость по типу детали.
     * 4. Категория + производитель.
     * 5. Только категория.
     *
     * Дубликаты той же стороны (та же позиция, что открыта) исключаются —
     * посетитель уже смотрит на эту деталь.
     */
    protected function findSimilar(Product $product, int $limit = 8): array
    {
        $results = collect();

        $add = function ($items) use (&$results, $limit): bool {
            $results = $results->merge($items)->unique('id')->take($limit)->values();
            return $results->count() >= $limit;
        };

        $base = fn () => Product::where('id', '!=', $product->id)->where('amount', '>', 0);

        // Префиксы сторон: 'лев', 'прав', 'перед', 'зад' (в базе — сокращения вида «лев.», «прав.»)
        $ownSide = $this->sidePrefix($product->left_right_rus);
        $ownFb   = $this->sidePrefix($product->front_back_rus);

        // Исключаем дубликаты той же стороны из fallback-ступеней
        $excludeSameSide = function ($query) use ($ownSide) {
            if ($ownSide) {
                $query->where(function ($q) use ($ownSide) {
                    $q->whereNull('left_right_rus')
                      ->orWhere('left_right_rus', 'not like', $ownSide . '%');
                });
            }
            return $query;
        };

        // 1. Парная деталь: то же наименование + зеркальная сторона
        if ($product->partname_name) {
            $ownTokens = $this->nameTokens($product->name);
            $partTokens = $this->nameTokens($product->partname_name);
            // Токены автомобиля: модель, код кузова, двигатель (без марки — она слишком частотная)
            $carTokens = array_values(array_diff($ownTokens, $partTokens, $this->brandTokens()));

            $findPair = function (string $column, string $oppositePrefix, ?string $keepColumn, ?string $keepPrefix) use ($base, $product, $carTokens) {
                $query = $base()
                    ->where('partname_name', $product->partname_name)
                    ->where($column, 'like', $oppositePrefix . '%');

                if ($keepColumn && $keepPrefix) {
                    $query->where($keepColumn, 'like', $keepPrefix . '%');
                }

                // Кандидатов с нужной стороной могут быть сотни (одна деталь на разные авто).
                // Сужаем выборку SQL-фильтром по токенам авто, иначе нужная пара
                // может не попасть в лимит:
                //  1) AND всех токенов (SPRINTER + CARIB + AE95G + 4AFE) — та же модель
                //  2) OR токенов — близкие модели
                //  3) без фильтра — любые кандидаты
                $candidates = collect();

                if ($carTokens) {
                    $sameModel = (clone $query);
                    foreach ($carTokens as $token) {
                        $sameModel->where('name', 'like', "%{$token}%");
                    }
                    $candidates = $sameModel->limit(50)->get();

                    if ($candidates->isEmpty()) {
                        $candidates = (clone $query)->where(function ($q) use ($carTokens) {
                            foreach ($carTokens as $token) {
                                $q->orWhere('name', 'like', "%{$token}%");
                            }
                        })->limit(200)->get();
                    }
                }

                if ($candidates->isEmpty()) {
                    $candidates = $query->limit(200)->get();
                }

                // Ранжируем по совпадению авто и близости артикула
                return $this->rankPairCandidates($product, $candidates);
            };

            if ($ownSide && ($opposite = $this->oppositeSidePrefix($ownSide))) {
                // Левая ↔ правая; расположение (перед/зад) сохраняем
                $ranked = $findPair('left_right_rus', $opposite, 'front_back_rus', $ownFb);

                if ($add($ranked->take($limit))) {
                    return $results->all();
                }
            } elseif (!$ownSide && $ownFb && ($oppositeFb = $this->oppositeSidePrefix($ownFb))) {
                // Передняя ↔ задняя (когда сторона не указана)
                $ranked = $findPair('front_back_rus', $oppositeFb, null, null);

                if ($add($ranked->take($limit))) {
                    return $results->all();
                }
            }
        }

        // 2. По артикулу: точное совпадение, затем по префиксу
        if ($product->mfrnumber) {
            $add($excludeSameSide($base())->where('mfrnumber', $product->mfrnumber)->limit($limit)->get());

            if ($results->count() < $limit) {
                $normalized = preg_replace('/[^A-Za-z0-9]/', '', $product->mfrnumber);
                $prefix = substr($normalized, 0, max(4, (int) (strlen($normalized) * 0.7)));

                if ($prefix !== '') {
                    $add($excludeSameSide($base())->where('mfrnumber', 'like', "{$prefix}%")->limit($limit)->get());
                }
            }

            if ($results->count() >= min(4, $limit)) {
                return $results->all();
            }
        }

        // 3. То же наименование (другая сторона или без стороны — применимость)
        if ($product->partname_name) {
            $add($excludeSameSide($base())->where('partname_name', $product->partname_name)->limit($limit)->get());

            if ($results->count() >= min(4, $limit)) {
                return $results->all();
            }
        }

        // 4. Категория + производитель
        $query = $excludeSameSide($base());

        if ($product->category_slug) {
            $query->where('category_slug', $product->category_slug);
        }

        if ($product->manufacturer) {
            $query->where('manufacturer', $product->manufacturer);
        }

        $add($query->limit($limit)->get());
        if ($results->count() >= min(4, $limit)) {
            return $results->all();
        }

        // 5. Только категория
        if ($product->category_slug) {
            $add($excludeSameSide($base())->where('category_slug', $product->category_slug)->limit($limit)->get());
        }

        return $results->all();
    }

    /**
     * Префикс стороны из значения вида «лев.», «Правая», «перед.»:
     * 'лев' | 'прав' | 'перед' | 'зад' | null
     */
    protected function sidePrefix(?string $side): ?string
    {
        if (!$side) {
            return null;
        }

        $normalized = mb_strtolower(trim($side));

        return match (true) {
            str_starts_with($normalized, 'лев')   => 'лев',
            str_starts_with($normalized, 'прав')  => 'прав',
            str_starts_with($normalized, 'перед') => 'перед',
            str_starts_with($normalized, 'зад')   => 'зад',
            default => null,
        };
    }

    /**
     * Марки авто — слишком частотные для SQL-фильтрации парных деталей.
     */
    protected function brandTokens(): array
    {
        return [
            'TOYOTA', 'NISSAN', 'HONDA', 'MITSUBISHI', 'MAZDA', 'SUBARU',
            'SUZUKI', 'DAIHATSU', 'LEXUS', 'ISUZU', 'HYUNDAI', 'KIA',
            'FORD', 'BMW', 'AUDI', 'VOLKSWAGEN', 'MERCEDES', 'RENAULT',
            'PEUGEOT', 'CITROEN', 'OPEL', 'VOLVO', 'SKODA', 'CHEVROLET',
            'LADA', 'ВАЗ', 'ГАЗ', 'УАЗ',
        ];
    }

    /**
     * Зеркальный префикс стороны: левая ↔ правая, передняя ↔ задняя.
     */
    protected function oppositeSidePrefix(string $prefix): ?string
    {
        return match ($prefix) {
            'лев'   => 'прав',
            'прав'  => 'лев',
            'перед' => 'зад',
            'зад'   => 'перед',
            default => null,
        };
    }

    /**
     * Ранжирование кандидатов в парные детали.
     *
     * Одно наименование («Арка крыла») покрывает десятки авто, поэтому среди
     * кандидатов с нужной стороной выбираем наиболее близкие к текущему товару:
     *  - общие слова в названии (марка, модель, код кузова, двигатель) ×10
     *  - длина общего префикса артикулов (парные артикулы обычно отличаются
     *    только суффиксом L/R: TOYCAR95ARSKARR ↔ TOYCAR95ARSKARL)
     */
    protected function rankPairCandidates(Product $product, $candidates)
    {
        $ownTokens = $this->nameTokens($product->name);
        $ownMfr = strtolower((string) preg_replace('/[^A-Za-z0-9]/', '', (string) $product->mfrnumber));

        return $candidates->sortByDesc(function ($candidate) use ($ownTokens, $ownMfr) {
            $sharedTokens = count(array_intersect($ownTokens, $this->nameTokens($candidate->name)));

            $candidateMfr = strtolower((string) preg_replace('/[^A-Za-z0-9]/', '', (string) $candidate->mfrnumber));
            $commonPrefix = 0;
            $maxLen = min(strlen($ownMfr), strlen($candidateMfr));
            while ($commonPrefix < $maxLen && $ownMfr[$commonPrefix] === $candidateMfr[$commonPrefix]) {
                $commonPrefix++;
            }

            return $sharedTokens * 10 + $commonPrefix;
        })->values();
    }

    /**
     * Значимые слова названия: марка, модель, код кузова, двигатель.
     */
    protected function nameTokens(string $name): array
    {
        $tokens = preg_split('/[^A-Za-zА-Яа-яЁё0-9]+/u', mb_strtoupper($name)) ?: [];

        // Стороны не участвуют в сравнении — они заведомо различаются
        $stop = [
            'ЛЕВ', 'ПРАВ', 'ПЕРЕД', 'ЗАД',
            'ЛЕВАЯ', 'ПРАВАЯ', 'ПЕРЕДНЯЯ', 'ЗАДНЯЯ',
            'ЛЕВЫЙ', 'ПРАВЫЙ', 'ПЕРЕДНИЙ', 'ЗАДНИЙ',
            'ЗАДН', 'ПЕРЕДН',
        ];

        return array_values(array_filter($tokens, function ($t) use ($stop) {
            return mb_strlen($t) >= 2 && !in_array($t, $stop, true);
        }));
    }
}