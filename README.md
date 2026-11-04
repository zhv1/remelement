# Ремэлемент — портал автозапчастей

![CI](https://github.com/zhv1/remelement/actions/workflows/ci.yml/badge.svg)

Веб-портал компании «Ремэлемент» (Новосибирск): собственное производство кузовных
ремонтных деталей (пороги, арки) и продажа б/у автозапчастей с разборки.
Каталог синхронизируется с Bazon API.

## Стек

- **Backend:** Laravel 13, PHP 8.3+
- **Frontend:** Inertia.js, React 19, TypeScript, Tailwind CSS 4, Vite
- **Админка:** Filament 5
- **Тесты:** Pest 4 (59 тестов)
- **База данных:** SQLite (разработка) → MySQL (планируется)
- **CI:** GitHub Actions (тесты + типы + линт + сборка)

## Возможности

- **Каталог** с фильтрами: категория, наименование, донор, цена, наличие
- **Умный поиск**: токенизация запроса (порядок слов не важен), поиск без учёта
  регистра кириллицы через колонку `search_index`, поиск по названию / артикулу / бренду
- **Живое автодополнение** в шапке и на главной (дебаунс, отмена запросов)
- **Похожие товары** с приоритетом парной зеркальной детали (лев. ↔ прав., перед. ↔ зад.)
- **Корзина** с лимитом количества по остаткам на складе
- **Заказы** с резервированием остатков (блокировка гонок через `lockForUpdate`),
  защита от IDOR и троттлинг
- **Личный кабинет**: регистрация, история заказов
- **Админка Filament** (`/admin`): управление заказами и их статусами
- **Синхронизация с Bazon API** — по расписанию (ночью) или вручную
- Страницы: главная, каталог, карточка товара, о компании, доставка, контакты
  с переключаемыми картами (2ГИС / Яндекс)

## Локальный запуск

Требования: PHP 8.3+, Composer, Node.js 22+

```bash
composer install
npm ci
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # или файл из DB_DATABASE в .env
php artisan migrate
npm run build                    # прод-сборка
# или: npm run dev               # dev-сервер с HMR
```

Синхронизация товаров из Bazon:

```bash
php artisan bazon:sync-products
```

Автоматическая ночная синхронизация настроена в `routes/console.php` —
на сервере достаточно cron-записи `* * * * * php artisan schedule:run`.

## Тесты и проверки

```bash
php artisan test      # Pest: 59 тестов
npx tsc --noEmit      # типы TypeScript
npm run lint          # ESLint
npm run build         # сборка фронтенда
```

Всё это автоматически прогоняется в GitHub Actions на каждый пуш
(`.github/workflows/ci.yml`).

## Админка

Панель доступна по адресу `/admin`. Создать администратора:

```bash
php artisan make:filament-user
```

В продакшене доступ ограничивается списком email в переменной `ADMIN_EMAILS`
(см. `.env.example`); локально панель открыта для любого пользователя.

## Структура

```
app/Http/Controllers/   CatalogController (каталог, поиск, автодополнение), OrderController
app/Console/Commands/   SyncBazonProducts (синхронизация Bazon)
app/Filament/           админка заказов
resources/js/pages/     страницы Inertia (Home, Catalog, Checkout, Contacts…)
resources/js/components/ SiteHeader, SearchAutocomplete, ProductCard, CartDrawer…
tests/Feature/          Pest-тесты: заказы, каталог, поиск, админка, страницы
```

## Роадмап

- [ ] Переход на MySQL
- [ ] Деплой на продакшен-сервер
- [ ] Email-уведомления о смене статуса заказа
- [ ] Оплата онлайн
