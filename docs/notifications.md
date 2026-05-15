# Форма заявки и уведомления

## Форма заявки

Расположена на странице `/contacts`.

### Поля формы
| Поле | Тип | Обязательное |
|---|---|---|
| Имя | text | да |
| Название магазина | text | да |
| Телефон | tel | да |
| Комментарий / список товаров | textarea | нет |

### Обработка
API route: `POST /api/contact`

При отправке формы срабатывают два канала одновременно:
1. **Email** — на почту менеджера через Resend
2. **Telegram** — уведомление менеджеру через Telegram Bot API

---

## Email уведомления

- Провайдер: **Resend**
- Отправитель: `info@naseer.uz` (Cloudflare Email Routing → почта менеджера)
- Получатель: email менеджера (уточнить у клиента)
- ENV переменные: `RESEND_API_KEY`, `MANAGER_EMAIL`

---

## Telegram уведомления

При каждой заявке менеджер получает сообщение в Telegram.

### Настройка
1. Создать бота через [@BotFather](https://t.me/BotFather) → получить `BOT_TOKEN`
2. Менеджер пишет боту `/start` → получить его `CHAT_ID`
3. Сохранить в `.env`: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

### Реализация
```js
await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `📦 Новая заявка!\n\nИмя: ${name}\nМагазин: ${shop}\nТелефон: ${phone}\n\n${message}`,
    parse_mode: 'HTML'
  })
})
```

### ENV переменные проекта
```env
RESEND_API_KEY=
MANAGER_EMAIL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```
