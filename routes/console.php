<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Синхронизация товаров из Bazon — каждую ночь.
// На сервере достаточно одной cron-записи: * * * * * php /path/to/artisan schedule:run
Schedule::command('bazon:sync-products')->dailyAt('03:17')->withoutOverlapping();
