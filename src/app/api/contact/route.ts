import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, shop, phone, message, company_url } = await req.json()

  if (company_url) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !shop || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const text = `📦 Новая заявка!\n\n👤 Имя: ${name}\n🏪 Магазин: ${shop}\n📞 Телефон: ${phone}${message ? `\n\n💬 ${message}` : ''}`

  const results = await Promise.allSettled([
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
      ? fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
        })
      : Promise.resolve(),

    process.env.RESEND_API_KEY && process.env.MANAGER_EMAIL
      ? fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'info@naseer.uz',
            to: process.env.MANAGER_EMAIL,
            subject: `Новая заявка от ${shop}`,
            text
          })
        })
      : Promise.resolve()
  ])

  results.forEach(r => {
    if (r.status === 'rejected') console.error('contact provider failed:', r.reason)
  })

  const allFailed = results.every(
    r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value)
  )

  return NextResponse.json({ ok: !allFailed }, { status: allFailed ? 502 : 200 })
}
