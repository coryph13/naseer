'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

export default function ContactForm() {
  const t = useTranslations('contacts')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', shop: '', phone: '', message: '', company_url: '' })
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setSubmittedAt(new Date())
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setSubmittedAt(null)
    setForm({ name: '', shop: '', phone: '', message: '', company_url: '' })
  }

  if (status === 'success') {
    const stamp = submittedAt
      ? submittedAt.toLocaleString(locale === 'uz' ? 'uz-UZ' : locale === 'en' ? 'en-GB' : 'ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short'
        })
      : ''

    return (
      <div className="lg:pl-14 lg:border-l lg:border-ink/10">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-px bg-brand" />
          <span className="eyebrow text-brand">{t('success.eyebrow')}</span>
        </div>
        <h2 className="display-section text-5xl md:text-6xl text-ink mb-8">
          {t('success.title')}
        </h2>
        <p className="body-lead max-w-md mb-10">
          {t('success.body')}
        </p>
        <div className="flex items-center gap-4 text-xs text-ink/45 tracking-wider uppercase mb-12">
          <span className="font-mono">{stamp}</span>
          <span className="w-6 h-px bg-ink/15" />
          <span>#{Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-3 text-ink font-medium text-[15px] border-b border-ink/30 pb-1 hover:border-brand hover:text-brand transition-colors"
        >
          <span>{t('success.again')}</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="lg:pl-14 lg:border-l lg:border-ink/10">
      <input
        type="text"
        name="company_url"
        value={form.company_url}
        onChange={e => setForm({ ...form, company_url: e.target.value })}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
      />
      <div className="flex items-center gap-3 mb-10">
        <span className="w-8 h-px bg-brand" />
        <span className="eyebrow text-brand">{locale === 'ru' ? 'Заявка' : locale === 'en' ? 'Request' : 'Buyurtma'}</span>
      </div>

      <div className="flex flex-col gap-9">
        {(['name', 'shop', 'phone'] as const).map(field => (
          <Field
            key={field}
            label={t(`form.${field}`)}
            required
            type={field === 'phone' ? 'tel' : 'text'}
            value={form[field]}
            onChange={v => setForm({ ...form, [field]: v })}
          />
        ))}

        <div className="flex flex-col">
          <label className="text-xs text-ink/45 uppercase tracking-wider mb-2">
            {t('form.message')}
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="bg-transparent border-b border-ink/15 focus:border-ink focus:outline-none text-ink text-lg py-2 transition-colors resize-none"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-8 text-sm text-brand">{t('form.error')}</p>
      )}

      <div className="mt-12 flex flex-col gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="self-start inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white font-medium text-[15px] pl-7 pr-6 py-4 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_20px_40px_-15px_rgba(143,21,56,0.5)] group"
        >
          {t('form.submit')}
          <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>

        <div className="h-px bg-ink/10 overflow-hidden relative">
          {status === 'loading' && (
            <span className="absolute inset-y-0 left-0 w-1/3 bg-brand contact-progress-bar" />
          )}
        </div>

        <p className="text-xs text-ink/45 tracking-wide">{t('form.submitNote')}</p>
      </div>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-ink/45 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-brand ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent border-b border-ink/15 focus:border-ink focus:outline-none text-ink text-lg py-2 transition-colors"
      />
    </div>
  )
}
