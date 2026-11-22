<?php

use Illuminate\Support\Facades\DB;

test('sqlite-to-mysql command copies products with upsert', function () {
    // Создаём временный SQLite-файл-«источник» с парой товаров
    $path = tempnam(sys_get_temp_dir(), 'srcdb_');

    $pdo = new PDO('sqlite:' . $path);
    $pdo->exec("CREATE TABLE products (id INTEGER PRIMARY KEY, bazon_id INTEGER, name TEXT, type TEXT DEFAULT 'part', price REAL, amount REAL)");
    $pdo->exec("INSERT INTO products VALUES (1, 101, 'Порог левый', 'part', 2500, 3)");
    $pdo->exec("INSERT INTO products VALUES (2, 102, 'Арка правая', 'part', 3100, 1)");
    $pdo = null;

    $this->artisan('bazon:sqlite-to-mysql', ['path' => $path, '--force' => true])->assertSuccessful();

    expect(DB::table('products')->count())->toBe(2)
        ->and(DB::table('products')->find(2)->name)->toBe('Арка правая');

    // Повторный запуск — upsert, дубликатов нет
    $this->artisan('bazon:sqlite-to-mysql', ['path' => $path, '--force' => true])->assertSuccessful();
    expect(DB::table('products')->count())->toBe(2);

    // Windows держит файл, пока живо PDO-соединение sqlite_src
    DB::purge('sqlite_src');
    @unlink($path);
});

test('sqlite-to-mysql refuses when source is the current database file', function () {
    // В тестах основная БД — :memory:, имитируем файловое совпадение
    $path = tempnam(sys_get_temp_dir(), 'srcdb_');
    file_put_contents($path, 'x');

    config(['database.connections.sqlite.database' => $path]);

    $this->artisan('bazon:sqlite-to-mysql', ['path' => $path, '--force' => true])
        ->assertFailed();

    unlink($path);
});
