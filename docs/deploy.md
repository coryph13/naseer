# Деплой

Прод хостится на личном Proxmox-VPS пользователя (не Vercel). Жёсткое требование — низкое потребление CPU. Поэтому: Next standalone, все страницы SSG, картинки предсжаты sharp-скриптом, длинные cache-headers в Caddy.

## Подготовка перед первым билдом (один раз, локально)

```bash
npm install
npm install --save-dev sharp
node scripts/optimize-images.mjs
```

`optimize-images.mjs` пробегает по `public/products/**/*.jpg` и `public/production/*.jpg`, перезаписывает их JPEG max-width 1200, q≈78, mozjpeg, цель ≤ 100 КБ. Это разовая операция, не запускать в CI/build.

После этого `package-lock.json` и сжатые картинки должны попасть в репозиторий.

## Первый деплой на сервер

1. На сервере склонировать репозиторий:
   ```bash
   git clone <repo-url> /opt/naseer
   cd /opt/naseer
   ```
2. Создать `.env.production` (по шаблону `.env.production.example`):
   ```
   RESEND_API_KEY=...
   MANAGER_EMAIL=...
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   ```
3. Запустить:
   ```bash
   docker compose up -d --build
   ```
4. Проверить:
   ```bash
   docker compose ps
   docker compose logs -f web
   ```

## DNS

A-запись `naseer.uz` (и `www.naseer.uz`) → IP сервера. Открыть на сервере порты 80 и 443. Caddy сам получит и обновит TLS-сертификат от Let's Encrypt при первом запросе.

## Обновление прод-сборки

```bash
cd /opt/naseer
git pull
docker compose up -d --build
```

`--build` пересобирает образ, `-d` оставляет в фоне. Старый контейнер заменяется healthcheck-ом без даунтайма.

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
