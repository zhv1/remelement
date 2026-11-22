<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Перенос данных из SQLite-файла в текущую (боевую) БД.
 *
 * Использование на сервере после переключения .env на MySQL:
 *   php artisan bazon:sqlite-to-mysql /путь/к/старой-базе/laravel --force
 *
 * Копирует таблицу products (13 тыс. товаров) чанками с upsert по id —
 * безопасно запускать повторно. Пользователи/заказы прототипа не переносятся:
 * их проще пересоздать, но при необходимости добавьте таблицу в TABLES.
 */
class SqliteToMysql extends Command
{
    protected $signature = 'bazon:sqlite-to-mysql
                            {path : Путь к файлу SQLite-базы}
                            {--force : Не спрашивать подтверждение}';

    protected $description = 'Переносит данные из SQLite-файла в боевую БД (MySQL)';

    /** Таблицы для переноса. Порядок важен при внешних ключах. */
    private const TABLES = ['products'];

    public function handle(): int
    {
        $path = (string) $this->argument('path');

        if (! is_file($path)) {
            $this->error("Файл не найден: {$path}");
            return self::FAILURE;
        }

        // Защита от копирования файла самого в себя
        $default = config('database.default');
        if (config("database.connections.{$default}.driver") === 'sqlite'
            && realpath($path) !== false
            && realpath((string) config("database.connections.{$default}.database")) === realpath($path)) {
            $this->error('Источник совпадает с текущей базой. Сначала переключите .env на MySQL.');
            return self::FAILURE;
        }

        if (! $this->option('force')
            && ! $this->confirm('Данные будут записаны в ' . config('database.default') . '. Продолжить?')) {
            return self::FAILURE;
        }

        config(['database.connections.sqlite_src' => [
            'driver' => 'sqlite',
            'database' => $path,
            'prefix' => '',
            'foreign_key_constraints' => false,
        ]]);
        DB::purge('sqlite_src');

        foreach (self::TABLES as $table) {
            $this->copyTable($table);
        }

        $this->info('Перенос завершён.');
        return self::SUCCESS;
    }

    private function copyTable(string $table): void
    {
        $src = DB::connection('sqlite_src');

        if (! $src->getSchemaBuilder()->hasTable($table)) {
            $this->warn("Таблица {$table} отсутствует в SQLite-файле — пропускаю.");
            return;
        }

        // Копируем только те колонки, что есть в целевой таблице
        $columns = array_flip(Schema::getColumnListing($table));
        $total = $src->table($table)->count();
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $copied = 0;
        $src->table($table)->orderBy('id')->chunk(500, function ($rows) use (&$copied, $columns, $table, $bar) {
            $batch = $rows->map(
                fn ($row) => array_intersect_key((array) $row, $columns)
            );

            $updatable = array_diff(array_keys($batch->first() ?? []), ['id']);

            DB::table($table)->upsert($batch->all(), ['id'], array_values($updatable));

            $copied += $batch->count();
            $bar->advance($rows->count());
        });

        $bar->finish();
        $this->newLine();
        $this->info("{$table}: перенесено {$copied} записей.");
    }
}
