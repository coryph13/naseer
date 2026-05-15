# Сессия 07: UX-полировка

## Цель
Закрыть UX-долги, накопленные за время редизайнов: кнопка «наверх», улучшенный лоадер, лучший лого в шапке, серьёзный Footer, базовая accessibility, удаление мёртвого кода.

## Контекст
- Все страницы переработаны, SEO-минимум сделан.
- Главная теперь длинная (несколько экранов) — кнопке «наверх» там самое место.
- Лоадер сейчас: `src/components/PageLoader.tsx`, 2 секунды, лого ~160px, brand-фон. Нужно крупнее, изящнее, и **показывать только при первой загрузке за сессию**.
- Лого `/logo.svg` — тонкие линии, в шапке h-9 (36px) теряется.
- Footer переоформлен в сессии 01, но можно усилить.

## Что делать

### 1. Кнопка «наверх»

Создать `src/components/ScrollToTop.tsx` (`'use client'`):
- Появляется при `window.scrollY > 600`.
- Спрятана при `< 600`.
- Анимация opacity + scale через framer-motion.
- Положение: `fixed bottom-6 right-6` (на mobile тоже).
- Дизайн: круглая кнопка ~48px, brand-фон, белая стрелка вверх (тонкая SVG). Hover — лёгкий lift.
- При клике: `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- Уважает `prefers-reduced-motion`: при reduce — без scale, мгновенный jump-to-top вместо smooth.
- Подключить в `[locale]/layout.tsx` (один раз на весь сайт).

### 2. Лоадер — улучшить

Файл: `src/components/PageLoader.tsx`. Изменения:

**Поведение:**
- Использовать `sessionStorage`: показывать лоадер только при первой загрузке за сессию.
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('naseer_loaded')) {
    setVisible(false)
    return
  }
  sessionStorage.setItem('naseer_loaded', '1')
  const t = setTimeout(() => setVisible(false), 2200)
  return () => clearTimeout(t)
}, [])
```

**Дизайн:**
- Лого крупнее: `width=240 height=240` (было 160). На больших экранах — до 280.
- Под лого — тонкая editorial-подпись через `display-section text-sm tracking-[0.4em] uppercase`: `Confectionery · Tashkent · 2018`. Появляется через 0.5s после лого с FadeUp.
- Прогресс-бар — **сверху**, не снизу. Тоньше (1px), brand-золотой `#f5bc44`.
- Фон — оставить brand `#8f1538`, но добавить тонкий шум-grain через CSS-фильтр (есть `.grain` утилита в `globals.css`).
- Убрать вращающиеся кольца — они визуально шумят и отвлекают от лого. Оставить только мягкий радиальный glow.
- Анимация выхода: scale-out лого + opacity → 0, длительность 0.6s.
- Уважать `prefers-reduced-motion`: при reduce — мгновенно показать и за 0.5s скрыть.

**Логотип:**
- Если SVG логотипа тонкий и плохо читается на крупном размере — попросить пользователя положить более жирную версию в `public/logo-bold.svg` и использовать её для лоадера. ИЛИ ничего не делать с самим SVG, просто сделать крупнее (визуальная масса увеличивается).

### 3. Лого в шапке

В `src/components/Header.tsx` после сессии 01:
- Размер: с `h-9` → **`h-11`** (44px), на мобиле `h-9`. Это даёт читаемость без перекоса баланса.
- Если лого `/logo.svg` написан в белом цвете и шапка теперь белая (после сессии 01) — логотип невидим. Нужны варианты:
  - **Best:** перекрасить `currentColor` в SVG, чтобы можно было `text-ink` через CSS. Открой `public/logo.svg`, замени `fill="#ffffff"` или `fill="white"` на `fill="currentColor"`. Тогда `<img>` не сработает (CSS не применяется), нужен `<svg>` inline или `<Image>` через CSS-mask. Самое простое: создать `public/logo-dark.svg` (копия с brand-цветом или ink) и использовать в Header, оставив `logo.svg` для тёмных мест (PageLoader, Footer).
  - **Alt:** если лого должен быть brand-красным — сделать `public/logo-brand.svg` и использовать в Header.
- На скролле > 20px — лого может уменьшаться до h-9 для компактности (опционально, не критично).

### 4. Footer — усилить

После сессии 01 Footer переоформлен. Усилить:

**Структура (4 колонки на desktop, stack на mobile):**

1. **Brand-блок:**
   - Крупное лого (h-12)
   - Под ним: тагляйн в одну строку (`display-section text-xl`): «Сладости с собственной фабрики в Ташкенте.» — генерируй
   - Под ним: address-строка маленьким `eyebrow`-стилем: «Ташкент · Узбекистан · с 2018»
   - Соц-иконка Instagram (круглая или просто текст-ссылка)

2. **Навигация:**
   - Eyebrow «Сайт»
   - Список: Главная, Каталог, Производство, О компании, Контакты

3. **Линейки:**
   - Eyebrow «Линейки»
   - Список 5 линеек со ссылками `/catalog/<slug>`
   - Цветная точка слева у каждой

4. **Контакты:**
   - Eyebrow «Связь»
   - Телефон (display-section, заметный)
   - Email (mailto)
   - Instagram (link)
   - Маленькая строка: «Пн–Сб, 9:00–18:00» — генерируй

**Низ Footer:**
- Тонкая разделительная линия `border-t border-white/10`
- Слева: copyright «© 2026 Naseer LLC. All rights reserved.» (заменяй на актуальный год через `new Date().getFullYear()`)
- По центру: переключатель языков (мини, как в Header)
- Справа: «Сделано с ◇ в Ташкенте» (опционально, можно скип)

**Цвет:** `bg-ink text-white/70`, акценты в brand. Без gradient-оверлеев. Чистая editorial-плотность.

### 5. Skip-to-content link

В `[locale]/layout.tsx` добавить первым после `<body>`:
```tsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-full"
>
  {t('common.skipToContent')}
</a>
```
И на каждой странице у `<main>` или у первой `<section>` поставить `id="main" tabIndex={-1}`.

Текст уже добавлен в i18n в сессии 06.

### 6. Кастомные focus-стили

В `globals.css` добавить:
```css
*:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
  border-radius: 4px;
}
```

### 7. Удаление мёртвого кода

Запустить `grep -r CatalogNav src` — если не используется, удалить `src/components/CatalogNav.tsx`.

В `assets/`:
- Удалить `assets/test-logo.html` если есть.
- Удалить большой `assets/logo.svg` (1 МБ) если в коде используется только `public/logo.svg`.

Проверить `data/products.json` на ссылки на несуществующие файлы.

### 8. prefers-reduced-motion — финальный проверочный обход

Пройтись по всем компонентам с framer-motion `repeat: Infinity` или `whileHover: { scale: ... }` — обернуть в `useReducedMotion()` если ещё не сделано:
- `HeroVisual.tsx` — уже сделано
- `LineShowcase.tsx` — auto-rotate отключается, проверить hover
- Любые новые компоненты из сессий 02-05

## Definition of done

- [ ] Кнопка «наверх» появляется на главной при скролле, плавно скроллит наверх.
- [ ] Лоадер показывается только один раз за сессию, лого крупное, есть подпись.
- [ ] Лого в шапке заметнее и читается на белом фоне.
- [ ] Footer с 4 колонками, заметным телефоном, переключателем локалей внизу.
- [ ] Skip-to-content link работает (Tab после загрузки страницы — должен фокусироваться).
- [ ] Все hover/infinite-анимации уважают `prefers-reduced-motion` (проверить через DevTools → Rendering → Emulate CSS prefers-reduced-motion).
- [ ] CatalogNav и прочий мёртвый код удалены.
- [ ] Пометить сессию 07 как `done` в `session_roadmap.md`.

## Что НЕ делать

- Не вводить новых анимационных библиотек.
- Не делать «корзину» / «избранное» — нет такой логики в проекте.
- Не делать тёмную тему — отдельная задача, не в скоупе релиза.
