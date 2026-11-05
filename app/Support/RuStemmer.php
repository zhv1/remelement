<?php

namespace App\Support;

class RuStemmer
{
    /**
     * Упрощённое снятие окончаний русских слов для поиска.
     *
     * Это не полный стеммер Портера — только частые окончания существительных
     * и прилагательных, от длинных к коротким. Основа не короче 3 символов,
     * поэтому основа почти всегда является префиксом словоформ («свеч» ⊂ «свеча»),
     * что позволяет искать подстрокой по существующему search_index.
     *
     * Не-кириллические токены (артикулы, номера) возвращаются без изменений.
     */
    private const ENDINGS = [
        // длинные
        'иями', 'ами', 'ями', 'иях', 'иям', 'ией', 'ием', 'ия',
        'ого', 'его', 'ому', 'ему', 'ыми', 'ими',
        // средние
        'ах', 'ях', 'ам', 'ям', 'ов', 'ев', 'ей', 'ом', 'ем', 'им', 'ым',
        'ый', 'ий', 'ой', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие', 'ья',
        'ую', 'юю',
        // однобуквенные
        'а', 'я', 'о', 'е', 'ы', 'и', 'у', 'ю', 'ь', 'й',
    ];

    public static function stem(string $word): string
    {
        $word = self::normalize($word);

        if (mb_strlen($word) < 4 || ! preg_match('/^[а-я]+$/u', $word)) {
            return $word;
        }

        foreach (self::ENDINGS as $ending) {
            if (mb_strlen($word) - mb_strlen($ending) >= 3
                && mb_substr($word, -mb_strlen($ending)) === $ending) {
                return mb_substr($word, 0, mb_strlen($word) - mb_strlen($ending));
            }
        }

        return $word;
    }

    /**
     * Группы синонимов (основы слов, уже после нормализации ё→е).
     * Если токен запроса входит в группу, поиск идёт по всем её членам:
     * «дворники» находит «Щётка стеклоочистителя», «тосол» — «Антифриз».
     * Группы симметричны: работает и в обратную сторону.
     */
    private const SYNONYM_GROUPS = [
        ['дворник', 'щетк'],           // дворники ↔ щётки стеклоочистителя
        ['тосол', 'антифриз', 'охлаждающ'], // тосол ↔ антифриз ↔ охлаждающая жидкость
        ['печк', 'отопител'],          // печка ↔ отопитель
        ['подушк', 'опор'],            // подушка двигателя ↔ опора двигателя
    ];

    /** Единая нормализация для запроса и индекса: нижний регистр, ё→е. */
    public static function normalize(string $text): string
    {
        return mb_strtolower(str_replace(['Ё', 'ё'], ['Е', 'е'], $text));
    }

    /**
     * Все варианты поиска для одного токена: сам токен, его основа
     * и основы синонимов из групп. Использовать как OR-условия.
     *
     * @return list<string>
     */
    public static function expand(string $token): array
    {
        $token = self::normalize($token);
        $stem = self::stem($token);
        $variants = [$token, $stem];

        foreach (self::SYNONYM_GROUPS as $group) {
            if (in_array($stem, $group, true) || in_array($token, $group, true)) {
                foreach ($group as $member) {
                    $variants[] = $member;
                }
            }
        }

        return array_values(array_unique($variants));
    }
}
