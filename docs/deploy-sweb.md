# Деплой на виртуальный хостинг SpaceWeb

Пошаговая инструкция по развёртыванию проекта (Laravel 12 + Inertia/React)
на виртуальном (shared) хостинге SpaceWeb. Расчётное время первого деплоя: 1–2 часа.

Рекомендуемый тариф для старта — «Ракета» (436 ₽/мес при оплате за год).
Если понадобятся Redis/Memcached для кеша — «Уран».

---

## 0. Что подготовить заранее

- Зарегистрированный домен (можно купить у SpaceWeb при заказе — .ru от 189 ₽/год).
- SSH-доступ: включается в панели SpaceWeb (раздел «SSH»), там же хост, логин, порт.
- Доступ к GitHub-репозиторию с сервера (репозиторий публичный — ничего не нужно;
  приватный — добавить deploy key).

## 1. Создание сайта в панели

1. Панель SpaceWeb → «Сайты» → «Создать сайт» → привязать домен.
2. Выбрать версию **PHP 8.4** для сайта.
3. **Корень сайта (document root) указать на `public`** — в настройках сайта
   есть поле «Корневая директория». Если панель не даёт указать подпапку,
   см. раздел 8 (запасной вариант через .htaccess).
4. Включить бесплатный SSL (Let's Encrypt) в разделе «SSL».

## 2. Создание базы MySQL

1. Панель → «Базы данных» → «Создать БД»: имя, пользователь, пароль.
2. Сохранить: хост (обычно `localhost`), имя БД, пользователя и пароль —
   понадобятся для `.env`.

## 3. Заливка кода

Подключаемся по SSH (данные из панели):

```bash
ssh логин@хост -p порт
```

В домашней директории аккаунта:

```bash
# Клонируем проект (имя папки — как создан в п.1, обычно совпадает с доменом)
git clone https://github.com/zhv1/remelement.git site.ru
cd site.ru
```

Если папка сайта уже создана панелью и не пуста — клонируем во временную
и переносим, либо `git init && git remote add origin ... && git pull`.

## 4. Composer и права

```bash
composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate --force
```

Если `composer` не найден — уточнить путь у поддержки SpaceWeb или скачать
`composer.phar` и запускать через `php composer.phar ...`.
Также убедиться, что CLI-PHP — версии 8.4 (`php -v`); если нет,
уточнить в панели/поддержке алиас нужной версии.

## 5. Настройка .env

```bash
cp .env.example .env
```

Правим `.env`:

```ini
APP_NAME="Ремэлемент"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://site.ru

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=имя_бд_из_панели
DB_USERNAME=пользователь_из_панели
DB_PASSWORD=пароль_из_панели

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=...   # SMTP SpaceWeb (почта на домене) или внешний сервис
```

Почему `file` для сессий и кеша: снимает лишнюю нагрузку с MySQL;
на тарифе «Уран» можно переключить на `redis`.

## 6. Миграции и перенос данных

```bash
php artisan migrate --force
```

Перенос товаров из текущей SQLite-базы (файл `laravel` в корне проекта —
залить его на сервер, например в домашнюю папку аккаунта, НЕ в public):

```bash
php artisan bazon:sqlite-to-mysql ~/laravel-sqlite-backup --force
```

Команда копирует таблицу `products` чанками с upsert — безопасна
при повторном запуске. Заказы/пользователей прототипа не переносим
(на проде они появятся заново); при необходимости добавить таблицы
в константу TABLES команды `app/Console/Commands/SqliteToMysql.php`.

## 7. Сборка и заливка фронтенда

Node.js на shared-хостинге нет — фронт собираем **локально**:

```bash
npm run build
```

Папку `public/build` заливаем на сервер (она в .gitignore):

```bash
# с локальной машины, из корня проекта
scp -P порт -r public/build логин@хост:~/site.ru/public/
```

(или архивом через файловый менеджер панели).

## 8. Запасной вариант document root

Если панель не позволяет направить домен в `public/`, положить в корень
папки сайта `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^$ public/ [L]
    RewriteRule (.*) public/$1 [L]
</IfModule>
```

Работает, но предпочтительнее настроить document root правильно.

## 9. Cron

Панель → «Cron» → добавить задачу, выполнение **каждую минуту**:

```bash
php ~/site.ru/artisan schedule:run >> /dev/null 2>&1
```

Это запускает планировщик Laravel (синхронизация товаров в 03:17 и др.).
Путь к PHP CLI уточнить в панели/поддержке (может быть `php8.4` или
полный путь вида `/usr/local/php84/bin/php`).

## 10. Оптимизация (обязательно после каждого деплоя)

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

OPcache на SpaceWeb включён по умолчанию.

## 11. Почта о заказах (опционально, но желательно)

Сейчас письмо менеджеру отправляется синхронно при оформлении заказа.
Для shared-хостинга (нет supervisor) очередь запускается кроном — добавить
задачу раз в минуту:

```bash
php ~/site.ru/artisan queue:work --stop-when-empty --max-time=50 >> /dev/null 2>&1
```

и в коде заменить `Mail::send(...)` на `Mail::queue(...)`
(отдельная задача, делается после переезда).

## 12. Чеклист после деплоя

- [ ] Главная открывается по https, каталог показывает товары
- [ ] Поиск работает («свечи», «дворники» — с синонимами)
- [ ] Оформление заказа проходит, письмо приходит менеджеру
- [ ] Админка /admin доступна
- [ ] Cron запущен (`php artisan schedule:list` — проверить расписание)
- [ ] APP_DEBUG=false, в логах нет ошибок (`storage/logs/laravel.log`)
- [ ] Бэкап SQLite-файла сохранён локально

## Обновление сайта (регулярный деплой)

```bash
cd ~/site.ru
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

Локально: `npm run build` → залить `public/build` (п.7).
