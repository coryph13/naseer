# Сессия 06: SEO + базовые страницы

## Цель
Добавить то, без чего сайт «не считается законченным»: 404/error/loading-страницы, favicon-набор, OG-картинку, hreflang, canonical, JSON-LD, мета-теги. После этой сессии сайт корректно индексируется поисковиками и переживает любые ошибки.

## Контекст
- Все основные страницы уже переработаны (главная + caталог + production + contacts + about).
- Дизайн-система зафиксирована в `globals.css`.
- Сайт на трёх локалях (uz / ru / en) с next-intl. **Это значит hreflang КРИТИЧНО** — без него поисковики увидят 3 «дублирующих» сайта.
- Деплой ещё впереди — поэтому работаем с прод-доменом `https://naseer.uz` (или подтверди другой у пользователя).
- Источник иконок: `public/logo.svg` (тонкая SVG, 5КБ).

## Что делать

### 1. Базовые страницы Next.js

Все три файла кладутся в `src/app/[locale]/` чтобы сохранить локаль и единый header/footer.

#### `src/app/[locale]/not-found.tsx`
- Editorial-страница 404. Layout с `Header` + центральный блок + `Footer`.
- Большой `display-mono` «404», под ним display-section заголовок («Страница не найдена.» / `Page not found.` / `Sahifa topilmadi.` — генерируй сам).
- Короткий body-lead с предложением «Возможно, вы искали…» + три ссылки: каталог, главная, контакты.
- НЕ используй `getTranslations` напрямую если возникают проблемы — можно захардкодить тексты на трёх языках через `useLocale()`.

#### `src/app/[locale]/error.tsx`
- `'use client'` (обязательно для error boundary в Next.js).
- Принимает `error` и `reset`.
- Editorial-страница: «Что-то пошло не так.» + кнопка «Попробовать снова» (`reset()`) + ссылка на главную.
- Логирует `console.error(error)` в `useEffect`.
- Стиль — спокойный, без red-alert. Тон бренда не меняется на ошибке.

#### `src/app/[locale]/loading.tsx`
- Простая Suspense fallback. НЕ полноэкранный лоадер (он отдельно через `PageLoader`).
- Достаточно лёгкого skeleton: тонкая градиентная полоска под Header + центральный блок-плейсхолдер.
- Альтернатива: пустой `<div className="min-h-screen" />` чтобы избежать CLS — это тоже допустимо.

#### `src/app/global-error.tsx` (опционально)
- Полная catch-all для случаев, когда падает сам layout. Можно скип, но если делать — тоже editorial.

### 2. Favicon + иконки

В `src/app/` положить:
- `icon.svg` — копия `public/logo.svg` (Next 13+ автоматически делает favicon)
- `apple-icon.png` — 180×180, можно сгенерить из лого через sharp или вручную

Если SVG-иконка тонкая на favicon-размере (16×16) — нужна **отдельная упрощённая monogram**: только буква «N» в brand-цвете на cream-фоне. Создать `src/app/icon.tsx` (динамический) если простая SVG не читается:

```tsx
import { ImageResponse } from 'next/og'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    (<div style={{ background: '#8f1538', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'serif' }}>N</div>),
    size
  )
}
```

### 3. Open Graph картинка

Создать `src/app/opengraph-image.tsx` — динамическая OG-картинка через `next/og`:
- 1200×630
- Cream фон + brand-акценты
- Большой display-mono «Naseer»
- Подзаголовок «Кондитерские изделия · Ташкент»
- Маленькая полоска брендовых цветов снизу

```tsx
import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Naseer — кондитерские изделия'
export default function OG() { ... }
```

Аналогично `src/app/twitter-image.tsx` (можно ре-экспорт того же).

### 4. Manifest

Создать `src/app/manifest.ts`:
```ts
import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naseer',
    short_name: 'Naseer',
    description: '...',
    start_url: '/uz',
    display: 'standalone',
    background_color: '#faf6ef',
    theme_color: '#8f1538',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
  }
}
```

### 5. Метаданные на каждой странице

Сейчас:
- `[locale]/layout.tsx` — есть базовые
- `/about`, `/production`, `/catalog`, `/catalog/[line]` — частично есть `generateMetadata`
- `/` (главная) — НЕТ своего `generateMetadata`, наследует layout (одинаково на всех 3 локалях)
- `/contacts` — нет

Добавить `generateMetadata` в:
- `src/app/[locale]/page.tsx` (главная)
- `src/app/[locale]/contacts/page.tsx`

Структура каждого `generateMetadata`:
```ts
export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: '...' })
  const path = '...' // например '' для главной, '/catalog' для каталога

  return {
    title: '...',
    description: '...',
    alternates: {
      canonical: `https://naseer.uz/${locale}${path}`,
      languages: {
        'uz': `https://naseer.uz/uz${path}`,
        'ru': `https://naseer.uz/ru${path}`,
        'en': `https://naseer.uz/en${path}`,
        'x-default': `https://naseer.uz/uz${path}`
      }
    },
    openGraph: { title: '...', description: '...', locale, type: 'website' },
    twitter: { card: 'summary_large_image', title: '...', description: '...' }
  }
}
```

`alternates.languages` — это и есть hreflang. **Делать на каждой странице**.

### 6. JSON-LD structured data

#### Organization — в `[locale]/layout.tsx` (один раз на весь сайт)
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Naseer',
  url: 'https://naseer.uz',
  logo: 'https://naseer.uz/logo.svg',
  description: '...',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tashkent',
    addressCountry: 'UZ'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+998991150302',
    contactType: 'sales',
    availableLanguage: ['uz', 'ru', 'en']
  },
  sameAs: ['https://instagram.com/naseer_uz']
}) }} />
```

#### BreadcrumbList — на `/catalog/[line]`
- Главная → Каталог → Lollis (для текущей линейки).

#### Product (опционально) — на `/catalog/[line]` для каждого SKU
- Скрытый JSON-LD с массивом Product. Без цены — `priceSpecification` пропустить или указать `priceCurrency` без `price`.

### 7. theme-color и viewport

В `[locale]/layout.tsx`:
```tsx
export const viewport: Viewport = {
  themeColor: '#8f1538',
  width: 'device-width',
  initialScale: 1
}
```

### 8. Поправить sitemap

В `src/app/sitemap.ts` сейчас захардкожен `BASE_URL = 'https://naseer.uz'`. Сделать через `process.env.NEXT_PUBLIC_SITE_URL` с фолбэком на `https://naseer.uz`. Это поможет на staging.

### 9. i18n

Добавить namespace `common`:
- `common.notFoundTitle`, `common.notFoundBody`, `common.notFoundCtaCatalog`, `common.notFoundCtaHome`
- `common.errorTitle`, `common.errorBody`, `common.errorCtaRetry`
- `common.skipToContent` (для accessibility skip-link, см. сессию 07)

Тексты — генерируй.

## Definition of done

- [ ] `not-found.tsx`, `error.tsx`, `loading.tsx` созданы и работают (проверить вручную: открыть `/uz/abracadabra`, бросить throw в каком-то компоненте).
- [ ] `icon.svg` или `icon.tsx` отдаёт читаемый favicon (открой `/icon` в браузере).
- [ ] `opengraph-image.tsx` отдаёт PNG (`/opengraph-image`).
- [ ] `manifest.ts` отдаёт корректный `/manifest.webmanifest`.
- [ ] У всех страниц есть `generateMetadata` с canonical и `alternates.languages` (hreflang).
- [ ] `<Organization>` JSON-LD есть в HTML главной (View Source → найти `application/ld+json`).
- [ ] `viewport.themeColor` установлен.
- [ ] `sitemap.ts` берёт URL из env с fallback.
- [ ] Пометить сессию 06 как `done` в `session_roadmap.md`.

## Что НЕ делать

- Не добавлять Google Analytics / Yandex.Metrika — отдельное решение пользователя.
- Не делать privacy/terms-страницы — нет данных от клиента.
- Не настраивать Google Search Console / Yandex Webmaster — это руки пользователя после деплоя.
- Не делать AMP-версии страниц.
