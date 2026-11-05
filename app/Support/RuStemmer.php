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

    /** Единая нормализация для запроса и индекса: нижний регистр, ё→е. */
    public static function normalize(string $text): string
    {
        return mb_strtolower(str_replace(['Ё', 'ё'], ['Е', 'е'], $text));
    }
}
