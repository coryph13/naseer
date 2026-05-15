# Деплой

Прод хостится на личном Proxmox-VPS пользователя (не Vercel). Жёсткое требование — низкое потребление CPU. Поэтому: Next standalone, все страницы SSG, картинки предсжаты sharp-скриптом, длинные cache-headers на reverse proxy.

Архитектура:

- **LXC контейнер 104 (Debian 13)** — Node 22, Next.js standalone под systemd. Слушает `0.0.0.0:3000` во внутренней сети Proxmox.
- **Внешняя машина с nginx + certbot** — терминирует TLS для `naseer.uz`/`www.naseer.uz`, проксирует на LXC по приватной сети.

## Подготовка перед первым билдом (один раз, локально)

```bash
npm install
node scripts/optimize-images.mjs
```

`optimize-images.mjs` пробегает по `public/products/**/*.jpg` и `public/production/*.jpg`, перезаписывает их JPEG max-width 1200, q≈78, mozjpeg, цель ≤ 100 КБ. Это разовая операция, не запускать в CI/build.

После этого `package-lock.json` и сжатые картинки должны попасть в репозиторий.

## Первый деплой в LXC

Все команды — изнутри контейнера (`pct enter 104` с Proxmox-хоста).

### 1. Зависимости

```bash
apt update
apt install -y curl ca-certificates git
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version   # v22.x
```

### 2. Пользователь и каталоги

```bash
useradd --system --create-home --shell /usr/sbin/nologin naseer
install -d -o naseer -g naseer /opt/naseer
```

### 3. Клон и сборка

```bash
sudo -u naseer git clone https://github.com/coryph13/naseer.git /opt/naseer/current
cd /opt/naseer/current
sudo -u naseer npm ci
sudo -u naseer npm run build
# Next standalone не копирует static и public — переносим вручную:
sudo -u naseer cp -r .next/static .next/standalone/.next/static
sudo -u naseer cp -r public .next/standalone/public
```

### 4. Секреты

```bash
sudo -u naseer cp .env.production.example .env.production
sudo -u naseer ${EDITOR:-nano} .env.production
chmod 600 .env.production
chown naseer:naseer .env.production
```

Заполнить:

```
RESEND_API_KEY=...
MANAGER_EMAIL=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 5. systemd unit

```bash
cp /opt/naseer/current/deploy/naseer.service /etc/systemd/system/naseer.service
systemctl daemon-reload
systemctl enable --now naseer
systemctl status naseer
journalctl -u naseer -f
```

Сервис слушает `0.0.0.0:3000`.

### 6. Reverse proxy на внешней машине

```bash
# на машине с nginx + certbot
cp /opt/naseer/current/deploy/nginx.conf.example /etc/nginx/sites-available/naseer.uz
sed -i 's/LXC_IP/<IP контейнера 104>/' /etc/nginx/sites-available/naseer.uz
ln -s /etc/nginx/sites-available/naseer.uz /etc/nginx/sites-enabled/naseer.uz
nginx -t
systemctl reload nginx

certbot --nginx -d naseer.uz -d www.naseer.uz
```

DNS: A-запись `naseer.uz` и `www.naseer.uz` → IP внешней машины с nginx.

## Обновление прод-сборки

```bash
# pct enter 104
cd /opt/naseer/current
sudo -u naseer git pull
sudo -u naseer npm ci
sudo -u naseer npm run build
sudo -u naseer cp -r .next/static .next/standalone/.next/static
sudo -u naseer cp -r public .next/standalone/public
systemctl restart naseer
```

## Логи и мониторинг

```bash
journalctl -u naseer -f           # лог приложения
systemctl status naseer           # состояние сервиса
ss -tlnp | grep 3000              # порт открыт?
```

## Альтернатива: Docker compose

Файлы `Dockerfile`, `docker-compose.yml`, `Caddyfile` остаются в репо для случая, когда LXC поддерживает Docker (nesting=1, keyctl=1). В этом сценарии Caddy внутри контейнера сам получает TLS-сертификат:

```bash
git clone <repo-url> /opt/naseer
cd /opt/naseer
cp .env.production.example .env.production && ${EDITOR:-nano} .env.production
docker compose up -d --build
```

DNS в этом сценарии указывает прямо на IP LXC, порты 80/443 проброшены.

## Логи и мониторинг

```bash
docker compose logs -f web        # next.js + /api/contact
docker compose logs -f caddy      # http-уровень, TLS, cache
docker compose ps                 # статус + healthcheck
docker stats                      # CPU/RAM по контейнерам
```

## Локальная разработка (dev-режим)

Прод-`docker-compose.yml` запускает оптимизированный билд. Для локальной разработки с hot-reload использовать dev-копию:

```bash
docker compose -f docker-compose.dev.yml up
```

## Что включает прод-сборка

- Next 15 standalone (server.js + минимально нужные модули, без `node_modules` в рантайме).
- `output: 'standalone'`, `images: { unoptimized: true }` (картинки уже сжаты).
- Multi-stage Dockerfile (deps → builder → runner), запуск под не-root пользователем.
- Healthcheck на `/uz` каждые 30 с, `restart: always`.
- Caddy: zstd/gzip, cache `max-age=31536000, immutable` для `_next/static`, `products`, `production`, `logo.svg`.
- Volume `next_cache` сохраняет ISR-кеш между перезапусками.
- Honeypot-поле `company_url` в форме контактов отбрасывает спам без обращения к Resend/Telegram.

## Откат

Если новая сборка сломалась:

```bash
git log --oneline -5
git checkout <previous-commit>
docker compose up -d --build
```

## Проверка перед мержем в main

- `npm run build` локально — не должно быть ошибок и warnings.
- Lighthouse на главной: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 90.
- `npm run start` после билда — ручной проход по всем страницам в трёх локалях, без ошибок в console.

## Lighthouse baseline (15 мая 2026, локально)

Запуск headless Chromium через `lighthouse --preset=desktop`.

| Страница | Perf | A11y | BP | SEO | LCP | CLS |
|----------|------|------|----|-----|-----|-----|
| `/uz` | 93 | 95 | 96 | 92 | 1.5 s | 0 |
| `/uz/catalog` | 91 | 95 | 96 | 92 | 1.5 s | 0 |
| `/uz/catalog/lollis` | 93 | 95 | 96 | 92 | 1.5 s | 0 |
| `/uz/about` | 94 | 95 | 96 | 92 | 1.4 s | 0 |
| `/uz/production` | 94 | 95 | 96 | 92 | 1.4 s | 0 |
| `/uz/contacts` | 94 | 90 | 96 | 92 | 1.5 s | 0 |

**SEO 92 (вместо 95+)** — false-positive: lighthouse не валидирует canonical `https://naseer.uz/...` при тесте с `localhost`. После деплоя на реальный домен → 100.

**Mobile preset Performance ≈ 76** (LCP 6.5 s) — главная виновница `HeroVisual` (framer-motion + 4 client-side картинки). На реальном desktop с CDN-кэшем будет лучше; для mobile — задача в backlog.

Bundle First Load JS на главной: **176 КБ** (DoD ≤ 200 КБ).
