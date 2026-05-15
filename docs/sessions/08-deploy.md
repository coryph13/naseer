# Сессия 08: Деплой на Proxmox с low CPU

## Цель
Подготовить проект к продакшен-деплою на личный сервер пользователя (Proxmox-VPS). Жёсткое требование: **низкое потребление CPU**, по памяти ограничений нет.

## Контекст
- Цель не Vercel, а личный сервер.
- Текущий Dockerfile запускает `npm run dev` с `WATCHPACK_POLLING=true` — постоянный CPU-жор. Это и есть основная проблема.
- Все страницы фактически статические (данные — JSON, `generateStaticParams` уже работает). Только `/api/contact` нужен на runtime.
- См. memory `[[project_catalog]]` — там цель деплоя зафиксирована.

## Что делать (по порядку)

### 1. `.dockerignore` (новый файл)
```
node_modules
.next
assets
docs
.env*
*.log
.git
.claude
```

### 2. `package-lock.json`
Сгенерировать локально: `npm install` в проекте. Закоммитить. Без него `npm ci` в Docker сломается.

### 3. `next.config.ts`
Добавить `output: 'standalone'`:
```ts
const nextConfig: NextConfig = {
  output: 'standalone'
}
```
Если все картинки предсжаты в шаге 5 — можно добавить `images: { unoptimized: true }` (тогда Node не будет пересжимать на лету). Иначе оставить дефолт.

### 4. `Dockerfile` — переписать на multi-stage

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### 5. Скрипт оптимизации картинок
Создать `scripts/optimize-images.mjs` (использует `sharp`). Пробежать по `public/products/**/*.jpg` и `public/production/*.jpg`, перезаписать оптимизированными JPEG (max-width 1200, q=78, mozjpeg). Цель: каждый файл ≤ 100 КБ. Запустить один раз, закоммитить результат. Не запускать в CI/build — это разовая операция.

```bash
npm install --save-dev sharp
node scripts/optimize-images.mjs
```

### 6. `docker-compose.yml` — переписать под прод

```yaml
services:
  web:
    build: .
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: always
    volumes:
      - next_cache:/app/.next/cache
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/uz"]
      interval: 30s
      timeout: 5s
      retries: 3

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
    restart: always

volumes:
  caddy_data:
  caddy_config:
  next_cache:
```

Сохранить старый dev-вариант как `docker-compose.dev.yml` (с bind-mount исходников и WATCHPACK_POLLING) — для локальной разработки.

### 7. `Caddyfile` — прод-вариант

```
naseer.uz, www.naseer.uz {
  encode zstd gzip

  @static {
    path /_next/static/* /products/* /production/* /logo.svg
  }
  header @static Cache-Control "public, max-age=31536000, immutable"

  reverse_proxy web:3000
}
```

Заменить `naseer.uz` на актуальный домен пользователя если другой.

### 8. `.env.production.example`
Создать с пустыми значениями:
```
RESEND_API_KEY=
MANAGER_EMAIL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```
Реальный `.env.production` — на сервере, в репо не коммитим (`.gitignore` уже покрывает `.env*`).

### 9. Honeypot в `/api/contact`
В `src/app/api/contact/route.ts` принять поле `company_url` (или подобное скрытое). Если заполнено — `return NextResponse.json({ ok: true })` без отправки. В форме `src/app/[locale]/contacts/page.tsx` добавить скрытый input с этим именем.

### 10. Логирование ошибок Telegram/Resend
Сейчас `Promise.allSettled` молча проглатывает. Заменить на:
```ts
const results = await Promise.allSettled([...])
results.forEach(r => {
  if (r.status === 'rejected') console.error('contact provider failed:', r.reason)
})
const allFailed = results.every(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value))
return NextResponse.json({ ok: !allFailed }, { status: allFailed ? 502 : 200 })
```

### 11. Документация
В `docs/deploy.md` (новый или обновить существующий) описать:
- Команды для первого деплоя на сервер: `git clone`, создать `.env.production`, `docker compose up -d --build`.
- Как настроить DNS: A-запись на IP сервера, открыть 80/443.
- Как обновлять: `git pull && docker compose up -d --build`.
- Как смотреть логи: `docker compose logs -f web`.

## Definition of done

- [ ] `.dockerignore` создан.
- [ ] `package-lock.json` есть в репо.
- [ ] `next.config.ts` с `output: 'standalone'`.
- [ ] Multi-stage Dockerfile, образ собирается локально (`docker build .`).
- [ ] Скрипт `optimize-images.mjs` отработал, картинки ≤ 100 КБ.
- [ ] Прод `docker-compose.yml` + dev-копия отдельно.
- [ ] Caddyfile прод-вариант.
- [ ] `.env.production.example` есть.
- [ ] Honeypot работает (тест: заполненное скрытое поле → success без реальной отправки).
- [ ] Ошибки контактов логируются.
- [ ] `docs/deploy.md` написан.
- [ ] **Lighthouse прогнан** на главной (Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 90). Если ниже — найти узкое место и исправить.
- [ ] **Bundle analysis**: после `npm run build` посмотреть размеры First Load JS. Если для главной > 200 КБ — разобраться (тяжёлый импорт framer-motion на server, лишний `'use client'`).
- [ ] Финальный обход: открыть прод-сборку (`npm run build && npm start`), пройтись по всем страницам в трёх локалях. Никаких ошибок в console, никаких 404 на ассеты, никаких CLS-скачков.
- [ ] Пометить сессию 08 как `done` в `session_roadmap.md`.
- [ ] Если все сессии done — обновить `MEMORY.md`: переименовать ссылку `session_roadmap` на «Релиз готов».

## Что НЕ делать

- Не пушить на GitHub без явной просьбы пользователя.
- Не делать `docker login` / `docker push` — деплой ручной через git pull.
- Не настраивать CI/CD — пока ручной процесс.
- Не трогать редизайн страниц — это в сессиях 01–05.
