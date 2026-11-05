<?php

use App\Models\Product;

function makeCatalogProduct(array $attrs = []): Product
{
    static $bazonId = 5000;

    return Product::create(array_merge([
        'bazon_id' => $bazonId++,
        'name' => 'Тестовая запчасть',
        'type' => 'part',
        'price' => 1000,
        'amount' => 5,
        'reserved' => 0,
    ], $attrs));
}

test('catalog page loads', function () {
    $this->get('/catalog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Catalog/Index'));
});

test('catalog shows only in-stock products by default', function () {
    makeCatalogProduct(['name' => 'В наличии', 'amount' => 3]);
    makeCatalogProduct(['name' => 'Нет в наличии', 'amount' => 0]);

    $this->get('/catalog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'В наличии')
        );
});

test('catalog filters by partname via indexed column', function () {
    makeCatalogProduct(['name' => 'Бампер передний', 'partname_name' => 'Бампер']);
    makeCatalogProduct(['name' => 'Фара левая', 'partname_name' => 'Фара']);

    $this->get('/catalog?' . http_build_query(['partname' => 'Фара']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Фара левая')
        );
});

test('catalog filters by price range', function () {
    makeCatalogProduct(['name' => 'Дешёвый', 'price' => 100]);
    makeCatalogProduct(['name' => 'Средний', 'price' => 500]);
    makeCatalogProduct(['name' => 'Дорогой', 'price' => 5000]);

    $this->get('/catalog?' . http_build_query(['price_min' => 200, 'price_max' => 1000]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Средний')
        );
});

test('catalog search finds product by mfrnumber', function () {
    makeCatalogProduct(['name' => 'Колодки тормозные', 'mfrnumber' => 'DB1234X']);
    makeCatalogProduct(['name' => 'Фильтр масляный', 'mfrnumber' => 'OC90']);

    $this->get('/catalog?' . http_build_query(['search' => 'DB1234X']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Колодки тормозные')
            ->missing('products.data.1')
        );
});

test('catalog search matches every word regardless of order and case', function () {
    // Кейс пользователя: «крыло solaris» должен находить «Крыло Hyundai Solaris»
    makeCatalogProduct(['name' => 'Крыло Hyundai Solaris']);
    makeCatalogProduct(['name' => 'Крыло Toyota Corolla']);
    makeCatalogProduct(['name' => 'Бампер Hyundai Solaris']);

    $this->get('/catalog?' . http_build_query(['search' => 'крыло solaris']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Крыло Hyundai Solaris')
        );
});

test('catalog search is case-insensitive for cyrillic', function () {
    makeCatalogProduct(['name' => 'Крыло Hyundai Solaris']);
    makeCatalogProduct(['name' => 'Фара Kia Rio']);

    foreach (['КРЫЛО', 'крыло', 'КрЫлО'] as $variant) {
        $this->get('/catalog?' . http_build_query(['search' => $variant]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('products.data', 1)
                ->where('products.data.0.name', 'Крыло Hyundai Solaris')
            );
    }
});

test('catalog search matches mfrnumber case-insensitively', function () {
    makeCatalogProduct(['name' => 'Колодки тормозные', 'mfrnumber' => 'DB1234X']);
    makeCatalogProduct(['name' => 'Фильтр масляный', 'mfrnumber' => 'OC90']);

    $this->get('/catalog?' . http_build_query(['search' => 'db1234x']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Колодки тормозные')
        );
});

test('product page loads with similar products', function () {
    $product = makeCatalogProduct([
        'name' => 'Рычаг передний левый',
        'partname_name' => 'Рычаг',
        'mfrnumber' => '3520Q1',
    ]);
    makeCatalogProduct(['name' => 'Рычаг передний правый', 'partname_name' => 'Рычаг']);
    makeCatalogProduct(['name' => 'Рычаг задний', 'partname_name' => 'Рычаг']);
    makeCatalogProduct(['name' => 'Рычаг поперечный', 'partname_name' => 'Рычаг']);
    makeCatalogProduct(['name' => 'Рычаг продольный', 'partname_name' => 'Рычаг']);

    $this->get("/catalog/{$product->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Catalog/Show')
            ->where('product.id', $product->id)
            ->has('similar', 4)
        );
});

test('mirrored side part comes first in similar products', function () {
    $right = makeCatalogProduct([
        'name' => 'Арка передняя правая',
        'partname_name' => 'Арка передняя',
        'left_right_rus' => 'прав.',
        'front_back_rus' => 'перед.',
        'mfrnumber' => 'R1234',
    ]);
    $left = makeCatalogProduct([
        'name' => 'Арка передняя левая',
        'partname_name' => 'Арка передняя',
        'left_right_rus' => 'лев.',
        'front_back_rus' => 'перед.',
    ]);
    // Конкуренты: та же правая сторона и другие детали
    makeCatalogProduct(['name' => 'Арка задняя правая', 'partname_name' => 'Арка задняя', 'left_right_rus' => 'прав.']);
    makeCatalogProduct(['name' => 'Порог правый', 'partname_name' => 'Порог', 'left_right_rus' => 'прав.']);

    $this->get("/catalog/{$right->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar.0.id', $left->id)
        );
});

test('mirror pair prefers the same car over another model', function () {
    // Кейс: арка крыла Sprinter Carib — парная ей левая арка того же авто,
    // а не левая арка от Honda Fit
    $current = makeCatalogProduct([
        'name' => 'Арка крыла TOYOTA SPRINTER CARIB AE95G 4AFE задн. прав.',
        'partname_name' => 'Арка крыла',
        'left_right_rus' => 'прав.',
        'front_back_rus' => 'задн.',
        'mfrnumber' => 'TOYCAR95ARSKARR',
    ]);
    // Чужая модель с меньшим id — попадёт в выборку первой по порядку
    $otherCar = makeCatalogProduct([
        'name' => 'Арка крыла HONDA FIT GE2 задн. лев.',
        'partname_name' => 'Арка крыла',
        'left_right_rus' => 'лев.',
        'front_back_rus' => 'задн.',
        'mfrnumber' => '38378351',
    ]);
    $sameCar = makeCatalogProduct([
        'name' => 'Арка крыла TOYOTA SPRINTER CARIB AE95G 4AFE задн. лев.',
        'partname_name' => 'Арка крыла',
        'left_right_rus' => 'лев.',
        'front_back_rus' => 'задн.',
        'mfrnumber' => 'TOYCAR95ARSKARL',
    ]);

    expect($otherCar->id)->toBeLessThan($sameCar->id);

    $this->get("/catalog/{$current->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar.0.id', $sameCar->id)
        );
});

test('same-side duplicates are excluded from similar products', function () {
    // Кейс габарита FB15: два дубля левой стороны с одним артикулом
    $current = makeCatalogProduct([
        'name' => 'Габарит NISSAN SUNNY FB15 перед. лев.',
        'partname_name' => 'Габарит',
        'left_right_rus' => 'лев.',
        'front_back_rus' => 'перед.',
        'mfrnumber' => 'ST3418L',
    ]);
    $duplicate = makeCatalogProduct([
        'name' => 'Габарит NISSAN SUNNY FB15 перед. лев.',
        'partname_name' => 'Габарит',
        'left_right_rus' => 'лев.',
        'front_back_rus' => 'перед.',
        'mfrnumber' => 'ST3418L',
    ]);
    $mirror = makeCatalogProduct([
        'name' => 'Габарит NISSAN SUNNY FB15 перед. прав.',
        'partname_name' => 'Габарит',
        'left_right_rus' => 'прав.',
        'front_back_rus' => 'перед.',
    ]);

    $this->get("/catalog/{$current->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar.0.id', $mirror->id)
            ->missing('similar.1')
        );
});

test('similar falls back to partname when no side is set', function () {
    $product = makeCatalogProduct([
        'name' => 'Радиатор охлаждения',
        'partname_name' => 'Радиатор',
        'mfrnumber' => 'RAD900',
    ]);
    $samePartname = makeCatalogProduct(['name' => 'Радиатор кондиционера', 'partname_name' => 'Радиатор']);

    $this->get("/catalog/{$product->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar.0.id', $samePartname->id)
        );
});

test('search suggest returns matching in-stock products', function () {
    makeCatalogProduct(['name' => 'Крыло Hyundai Solaris', 'price' => 4500]);
    makeCatalogProduct(['name' => 'Крыло Toyota Corolla']);
    makeCatalogProduct(['name' => 'Крыло Solaris распроданное', 'amount' => 0]);

    $this->getJson('/api/search/suggest?' . http_build_query(['q' => 'крыло SOLARIS']))
        ->assertOk()
        ->assertJsonCount(1, 'suggestions')
        ->assertJsonPath('suggestions.0.name', 'Крыло Hyundai Solaris')
        ->assertJsonPath('suggestions.0.price', 4500);
});

test('search suggest requires at least two characters', function () {
    makeCatalogProduct(['name' => 'Крыло Hyundai Solaris']);

    $this->getJson('/api/search/suggest?q=%D0%BA')
        ->assertOk()
        ->assertJsonCount(0, 'suggestions');
});

test('catalog search matches word forms via stemming', function () {
    // «свечи» должно находить наименование «Свеча»
    makeCatalogProduct(['name' => 'Свеча зажигания TOYOTA COROLLA', 'partname_name' => 'Свеча']);
    makeCatalogProduct(['name' => 'Фара левая']);
    makeCatalogProduct(['name' => 'Крыло Hyundai Solaris']);

    $this->get('/catalog?' . http_build_query(['search' => 'свечи']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Свеча зажигания TOYOTA COROLLA')
        );

    $this->get('/catalog?' . http_build_query(['search' => 'фары']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.name', 'Фара левая')
        );

    $this->get('/catalog?' . http_build_query(['search' => 'крылья']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.name', 'Крыло Hyundai Solaris')
        );
});

test('catalog search normalizes ё', function () {
    makeCatalogProduct(['name' => 'Стёкла комплект']);
    makeCatalogProduct(['name' => 'Фара левая']);

    $this->get('/catalog?' . http_build_query(['search' => 'стекла']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Стёкла комплект')
        );
});

test('catalog search stemming keeps article tokens exact', function () {
    makeCatalogProduct(['name' => 'Свеча зажигания', 'mfrnumber' => 'BKR6E-11']);
    makeCatalogProduct(['name' => 'Свеча накаливания', 'mfrnumber' => 'Y-607AS']);

    $this->get('/catalog?' . http_build_query(['search' => 'Y-607AS']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Свеча накаливания')
        );
});


test('catalog search expands synonyms', function () {
    // «дворники» должно находить «Щётка стеклоочистителя»
    makeCatalogProduct(['name' => 'Щётка стеклоочистителя TOYOTA CAMRY']);
    makeCatalogProduct(['name' => 'Антифриз концентрат']);
    makeCatalogProduct(['name' => 'Отопитель салона NISSAN SUNNY']);
    makeCatalogProduct(['name' => 'Опора двигателя правая']);
    makeCatalogProduct(['name' => 'Фара левая']);

    $this->get('/catalog?' . http_build_query(['search' => 'дворники']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Щётка стеклоочистителя TOYOTA CAMRY')
        );

    // симметрично: «щётка» находит «дворник» в наименовании
    $this->get('/catalog?' . http_build_query(['search' => 'щетки']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
        );

    // «тосол» находит «Антифриз»
    $this->get('/catalog?' . http_build_query(['search' => 'тосол']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Антифриз концентрат')
        );

    // «печка» находит «Отопитель»
    $this->get('/catalog?' . http_build_query(['search' => 'печка']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Отопитель салона NISSAN SUNNY')
        );

    // «подушка двигателя» находит «Опора двигателя»
    $this->get('/catalog?' . http_build_query(['search' => 'подушка двигателя']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Опора двигателя правая')
        );
});
