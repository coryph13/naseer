# Управление контентом — Насир

Всё содержимое сайта управляется через JSON-файлы в папке `data/` и изображения в `public/`.
Для изменений не нужен программист — достаточно отредактировать файлы.

---

## Добавить новый товар

Открыть файл `data/products.json` и добавить объект в конец массива:

```json
{
  "id": "уникальный-id-через-дефис",
  "line": "slug-линейки",
  "name": {
    "uz": "Название на узбекском",
    "ru": "Название на русском",
    "en": "Name in English"
  },
  "flavor": {
    "uz": "Вкус uz",
    "ru": "Вкус ru",
    "en": "Flavor en"
  },
  "weight": "440 г",
  "packaging": {
    "uz": "Тип упаковки uz",
    "ru": "Тип упаковки ru",
    "en": "Packaging en"
  },
  "color": "#f5bc44"
}
```

### Slug линеек
| Линейка | slug |
|---|---|
| Lollis | `lollis` |
| Choco Cone | `choco-cone` |
| Toffical | `toffical` |
| Choco Bisco | `choco-bisco` |
| Bamboonee | `bamboonee` |

### Цвета вкусов
Используй HEX-цвета из [design.md](design.md).

---

## Добавить новую линейку

**Шаг 1.** Добавить в `data/lines.json`:

```json
{
  "slug": "new-line",
  "name": "New Line",
  "description": {
    "uz": "Tavsif uz",
    "ru": "Описание ru",
    "en": "Description en"
  }
}
```

**Шаг 2.** Добавить цвет в `src/app/[locale]/catalog/page.tsx` и `src/app/[locale]/page.tsx`:

```ts
const lineColors: Record<string, string> = {
  ...
  'new-line': '#hexcolor'
}
```

**Шаг 3.** Добавить изображение-обложку: `public/products/new-line.jpg` (размер ~800×600px).

**Шаг 4.** Добавить путь к изображению в `lineImages`:

```ts
const lineImages: Record<string, string> = {
  ...
  'new-line': '/products/new-line.jpg'
}
```

---

## Добавить фотографии товаров

### Структура папки
```
public/
└── products/
    ├── lollis.jpg          ← обложка линейки
    ├── choco-cone.jpg
    ├── toffical.jpg
    ├── choco-bisco.jpg
    └── bamboonee.jpg
```

### Требования к фото
- Формат: JPG или WebP
- Минимальный размер: 800×600 px
- Соотношение: 4:3 или 16:9 (горизонтальные)
- Размер файла: до 500 КБ (оптимизировать через [squoosh.app](https://squoosh.app))

### Когда будут фото по линейкам
Заменить файл в `public/products/[line-slug].jpg` — сайт подхватит автоматически.

### Когда будут фото отдельных товаров
1. Добавить поле `"image"` в объект товара в `products.json`:
```json
"image": "/products/items/lollis-cola-440.jpg"
```
2. Положить файл в `public/products/items/`
3. В компоненте карточки поменять `lineImages[product.line]` на `product.image ?? lineImages[product.line]`

---

## Изменить тексты (переводы)

Файлы переводов: `messages/uz.json`, `messages/ru.json`, `messages/en.json`

Структура:
```json
{
  "nav": { "catalog": "...", "about": "...", "contacts": "..." },
  "hero": { "tagline": "...", "subtitle": "...", "cta": "..." },
  "about": { "title": "...", "description": "..." },
  "catalog": { "title": "...", "all": "...", "orderBtn": "..." },
  "contacts": { "title": "...", "form": { ... } },
  "footer": { "rights": "..." }
}
```

---

## Изменить контакты

Файл: `src/components/Footer.tsx` и `src/app/[locale]/contacts/page.tsx`

Текущие контакты:
- Телефон: +998 99 115 03 02
- Instagram: @naseer_uz
- Email: info@naseer.uz

---

## ENV переменные (секреты)

Файл: `.env.local` (не попадает в git)

```env
RESEND_API_KEY=           # API ключ от resend.com
MANAGER_EMAIL=            # Email куда слать заявки
TELEGRAM_BOT_TOKEN=       # Токен бота от @BotFather
TELEGRAM_CHAT_ID=         # chat_id менеджера
```

После изменения `.env.local` нужно перезапустить Docker:
```bash
docker compose restart web
```

---

## Перезапуск / обновление

```bash
# Перезапустить сервер
docker compose restart web

# Полная пересборка (после изменения package.json)
docker compose up --build

# Посмотреть логи
docker compose logs web -f
```
