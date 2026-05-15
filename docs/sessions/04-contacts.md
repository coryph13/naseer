# Сессия 04: Редизайн контактов

## Цель
Переписать `/contacts` под чистый editorial-стиль. Эта страница — конечная точка всех CTA на сайте, форма должна выглядеть **серьёзно и спокойно**, а не как «вписать данные побыстрее».

## Контекст
- Файл: `src/app/[locale]/contacts/page.tsx`. Сейчас — `'use client'` со сложной формой и iframe-картой с сепиа-фильтром. API-эндпоинт `/api/contact` (Telegram + Resend) трогать не нужно.
- Дизайн-система — та же.
- Honeypot для антиспама нужно добавить (см. memory `[[project_catalog]]`), но это можно сделать в сессии 06 (deploy/polish). В этой — только дизайн.

## Что делать

### 1. Hero

- Editorial: `eyebrow` («Контакты»), display-заголовок «Поговорим.» / «Let's talk.» / «Gaplashamiz.» — короткий и человечный.
- `body-lead` подзаголовок: «Менеджер ответит в течение рабочего дня. Прайс пришлём в Telegram или на почту.»
- Без brand-плашки в hero.

### 2. Layout под hero

Двухколоночный grid (1fr 1fr на desktop, stack на mobile):

**Левая колонка — контакты + карта:**
- `eyebrow` («Связь»)
- Editorial-список (без круглых иконок-чипов!):
  - Каждая строка: лейбл `text-xs text-ink/45 uppercase tracking-wider` + крупный `display-section text-3xl` со значением.
  - Телефон, Telegram, Email — три блока друг под другом с разделителями (1px `border-ink/10`).
  - На hover значение подчёркивается тонкой brand-линией.
- Карта снизу: убрать сепиа-фильтр (filter: none или очень мягкий grayscale). Скруглить углы как на главной (`rounded-3xl`). Высота 320–400px.
- Под картой — `eyebrow` «Адрес», адрес офиса/завода (генерируй временный).

**Правая колонка — форма:**
- Без `bg-gray-50` заливки полей. Поля с тонкой нижней границей (`border-b border-ink/15`), на focus — `border-ink` или `border-brand`. Стиль — Apple-style: лейбл сверху мелкий, поле снизу. Это даёт editorial-аутентичность.
- Поля: name, shop, phone, message — как сейчас.
- Кнопка submit: brand-цвет, large pill, как на главной (`bg-brand hover:bg-brand-dark text-white pl-7 pr-6 py-4 rounded-full`).
- Success state — оставить, но переоформить под editorial: вместо зелёного кружка с галочкой — крупный `display-section` «Заявка получена.» + строка mono со временем-меткой и кнопка «Отправить ещё».
- Loading state — тонкий бар прогресса под кнопкой вместо `...` в тексте кнопки.

### 3. Под формой — мини-блок «когда отвечаем»

- Тонкая горизонтальная плашка `border-y border-ink/10`, с двумя-тремя пунктами:
  - «Пн–Сб, 9:00–18:00» / часовой пояс
  - «Заявки до 17:00 — отгружаем в день обращения»
  - «По выходным — отвечаем в понедельник утром»
- `eyebrow` сверху, `body` мелкий.

### 4. i18n

Использовать существующие `contacts.*` где можно. Добавить:
- `contacts.heroEyebrow`, `contacts.heroTitle`, `contacts.heroBody`
- `contacts.connectEyebrow` («Связь»)
- `contacts.addressEyebrow`, `contacts.address` (генерируй: «Узбекистан, Ташкент, …» — заглушка)
- `contacts.scheduleEyebrow` («Когда мы на связи»), `contacts.scheduleItems` (массив строк)
- `contacts.success.body` (для editorial-success)

## Definition of done

- [ ] Страница рендерится во всех локалях.
- [ ] Hero без brand-плашки, чисто editorial.
- [ ] Контакты — editorial-список, без круглых иконок.
- [ ] Форма — Apple-style underline-поля, без gray-50.
- [ ] Карта без сепиа-фильтра, скруглена.
- [ ] Submit работает, success state переоформлен.
- [ ] На мобиле обе колонки стекаются, форма удобная.
- [ ] Пометить сессию 04 как `done` в `session_roadmap.md`.

## Что НЕ делать

- Не трогать `/api/contact` (back-end).
- Не добавлять honeypot — он в сессии 06.
- Не добавлять Telegram-виджет/чат — это отдельный проект (Telegram-бот).
