# Деплой на VDS (Ubuntu 24.04 + Nginx + PHP-FPM + MySQL)

Пошаговая инструкция по развёртыванию проекта на выделенном виртуальном сервере.
Расчётное время первого деплоя: 1,5–2,5 часа.

**Рекомендуемая конфигурация VDS:** 2 vCPU / 4 ГБ RAM / 40 ГБ NVMe, Ubuntu 24.04 LTS
(~500–800 ₽/мес у Timeweb, Selectel, aeza и т.п.). Для 20–50 одновременных
пользователей — с большим запасом, хватит и на рост до 100+.

> Shared-хостинг SpaceWeb остаётся запасным вариантом: см. `docs/deploy-sweb.md`.

---

## 0. Подготовка

- Заказать VDS с Ubuntu 24.04, получить root-доступ по SSH.
- В DNS домена создать A-запись на IP сервера (и AAAA, если есть IPv6).
- Дождаться распространения DNS: `ping site.ru` должен показывать IP сервера.

## 1. Базовая настройка сервера

```bash
ssh root@IP_СЕРВЕРА

# Обновление системы
apt update && apt upgrade -y

# Нерутовый пользователь для деплоя
adduser deploy
usermod -aG sudo deploy

# Firewall: только SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Дальше работаем под `deploy` (или настраиваем SSH-ключ и заходим им).

## 2. Установка стека

```bash
# Nginx
sudo apt install -y nginx

# PHP 8.4 (репозиторий ondrej)
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4-fpm php8.4-cli php8.4-mysql php8.4-mbstring \
    php8.4-xml php8.4-curl php8.4-zip php8.4-gd php8.4-intl \
    php8.4-bcmath php8.4-opcache

# MySQL 8
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php

# Git и утилиты
sudo apt install -y git unzip
```

## 3. База данных

```bash
sudo mysql
```

```sql
CREATE DATABASE remelement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'remelement'@'localhost' IDENTIFIED BY 'СИЛЬНЫЙ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON remelement.* TO 'remelement'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Код проекта

```bash
sudo mkdir -p /var/www/remelement
sudo chown deploy:deploy /var/www/remelement
git clone https://github.com/zhv1/remelement.git /var/www/remelement
cd /var/www/remelement

composer install --no-dev --optimize-autoloader --no-interaction
```

## 5. Настройка .env

```bash
cp .env.example .env
nano .env
```

```ini
APP_NAME="Ремэлемент"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://site.ru

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=remelement
DB_USERNAME=remelement
DB_PASSWORD=СИЛЬНЫЙ_ПАРОЛЬ

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.yandex.ru   # или другой SMTP
MAIL_PORT=465
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=info@site.ru
MAIL_FROM_NAME="Ремэлемент"
```

```bash
php artisan key:generate --force
php artisan storage:link --relative
```

Права на storage и кеш:

```bash
sudo chown -R deploy:www-data /var/www/remelement/storage /var/www/remelement/bootstrap/cache
chmod -R 775 /var/www/remelement/storage /var/www/remelement/bootstrap/cache
```

## 6. Миграции и перенос товаров

```bash
php artisan migrate --force
```

Перенос товаров из SQLite (залить файл `laravel` на сервер, например в `/home/deploy/`):

```bash
# с локальной машины
scp -P 22 laravel deploy@IP_СЕРВЕРА:/home/deploy/laravel-sqlite

# на сервере
php artisan bazon:sqlite-to-mysql /home/deploy/laravel-sqlite --force
```

Команда копирует таблицу `products` чанками с upsert — безопасна при повторе.

## 7. Сборка фронтенда

Вариант А — локально и заливка (проще, не ставит Node на сервер):

```bash
# локально
npm run build
scp -r public/build deploy@IP_СЕРВЕРА:/var/www/remelement/public/
```

Вариант Б — на сервере:

```bash
sudo apt install -y nodejs npm
npm ci && npm run build
```

## 8. Nginx

```bash
sudo nano /etc/nginx/sites-available/remelement
```

```nginx
server {
    listen 80;
    server_name site.ru www.site.ru;
    root /var/www/remelement/public;

    index index.php;
    charset utf-8;

    # Статика с долгим кешем (сборка Vite с хешами в именах)
    location /build/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Запрещаем доступ к скрытым файлам (.env, .git)
    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 20m;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/remelement /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 9. HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d site.ru -d www.site.ru
```

Certbot сам поправит конфиг nginx и настроит автообновление сертификата.

## 10. PHP-FPM и OPcache (производительность)

```bash
sudo nano /etc/php/8.4/fpm/conf.d/99-remelement.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.jit=tracing
opcache.jit_buffer_size=64M
memory_limit=256M
```

> `validate_timestamps=0` — OPcache не проверяет изменения файлов;
> при деплое обязательно `sudo systemctl reload php8.4-fpm` (есть в скрипте ниже).

Пул PHP-FPM (`/etc/php/8.4/fpm/pool.d/www.conf`) для 4 ГБ RAM:

```ini
pm = dynamic
pm.max_children = 20
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 500
```

```bash
sudo systemctl restart php8.4-fpm
```

## 11. Cron и queue worker

Cron (планировщик Laravel — синхронизация товаров в 03:17 и др.):

```bash
crontab -e
# добавить:
* * * * * cd /var/www/remelement && php artisan schedule:run >> /dev/null 2>&1
```

Queue worker для писем (через supervisor, надёжнее крона):

```bash
sudo apt install -y supervisor
sudo nano /etc/supervisor/conf.d/remelement-worker.conf
```

```ini
[program:remelement-worker]
command=php /var/www/remelement/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=deploy
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/remelement-worker.log
```

```bash
sudo supervisorctl reread && sudo supervisorctl update
sudo supervisorctl start remelement-worker:*
```

## 12. Prod-кеши Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## 13. Деплой-скрипт для обновлений

Создать `/home/deploy/deploy.sh`:

```bash
#!/bin/bash
set -e
cd /var/www/remelement

git pull
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.4-fpm
sudo supervisorctl restart remelement-worker:*

echo "Деплой завершён: $(date)"
```

```bash
chmod +x /home/deploy/deploy.sh
```

Перед запуском — локально `npm run build` и залить `public/build` (п.7).
(Дать `deploy` право на reload сервисов: `sudo visudo` →
`deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload php8.4-fpm, /usr/bin/supervisorctl *`)

## 14. Бэкапы

Простой вариант — ежедневный mysqldump по крону:

```bash
crontab -e
# добавить:
17 4 * * * mysqldump -u remelement -p'СИЛЬНЫЙ_ПАРОЛЬ' remelement | gzip > /home/deploy/backups/remelement-$(date +\%F).sql.gz
```

```bash
mkdir -p /home/deploy/backups
```

Плюс включить бэкап на уровне VDS-провайдера (обычно +10–20% к цене) — снимки диска.

## 15. Чеклист после деплоя

- [ ] https://site.ru открывается, валидный сертификат
- [ ] Каталог, карточка товара, поиск («свечи», «дворники») работают
- [ ] Оформление заказа проходит, письмо приходит менеджеру
- [ ] Админка /admin работает
- [ ] `php artisan schedule:list` — расписание на месте, cron запущен
- [ ] `sudo supervisorctl status` — воркер RUNNING
- [ ] APP_DEBUG=false, `storage/logs/laravel.log` без ошибок
- [ ] Бэкап БД настроен и проверен (`ls /home/deploy/backups/`)
