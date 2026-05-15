import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { FadeUp } from '@/components/Motion'
import { alternateLanguages, canonical } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contacts' })
  const title = t('title')
  const description = t('heroBody')
  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, '/contacts'),
      languages: alternateLanguages('/contacts')
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, '/contacts'),
      type: 'website'
    }
  }
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'contacts' })
  const schedule = t.raw('scheduleItems') as string[]

  const channels = [
    { label: t('phoneLabel'), value: '+998 99 115 03 02', href: 'tel:+998991150302' },
    { label: t('telegramLabel'), value: t('telegramHandle'), href: t('telegramHref'), external: true },
    { label: t('emailLabel'), value: 'info@naseer.uz', href: 'mailto:info@naseer.uz' }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <section id="main" tabIndex={-1} className="pt-28 pb-12 lg:pt-36 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('heroEyebrow')}</span>
            </div>
            <h1 className="display-hero text-[56px] sm:text-7xl lg:text-[120px] text-ink mb-8 leading-none">
              {t('heroTitle')}
            </h1>
            <p className="body-lead max-w-xl">
              {t('heroBody')}
            </p>
          </FadeUp>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-8 h-px bg-ink/20" />
              <span className="eyebrow">{t('connectEyebrow')}</span>
            </div>

            <ul className="flex flex-col">
              {channels.map((c, i) => (
                <li
                  key={c.href}
                  className={i === 0 ? 'border-t border-ink/10' : ''}
                >
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="group block border-b border-ink/10 py-6"
                  >
                    <div className="text-xs text-ink/45 uppercase tracking-wider mb-2">
                      {c.label}
                    </div>
                    <div className="display-section text-3xl md:text-4xl text-ink relative inline-block">
                      <span>{c.value}</span>
                      <span className="absolute left-0 right-0 -bottom-1 h-px bg-brand scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-ink/20" />
                <span className="eyebrow">{t('mapEyebrow')}</span>
              </div>
              <div className="rounded-3xl overflow-hidden border border-ink/8" style={{ height: 360 }}>
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=69.026398%2C41.112078%2C69.042398%2C41.128078&layer=mapnik&marker=41.120078%2C69.034398"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block', filter: 'grayscale(0.35) contrast(1.02)' }}
                  loading="lazy"
                  title="Naseer"
                />
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span className="w-8 h-px bg-ink/20 mt-3 flex-shrink-0" />
                <div>
                  <div className="eyebrow mb-1.5">{t('addressEyebrow')}</div>
                  <p className="text-ink text-base leading-relaxed max-w-sm">{t('address')}</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />

        </div>

        <div className="mt-24 border-y border-ink/10 py-10">
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('scheduleEyebrow')}</span>
            </div>
            <ul className="grid md:grid-cols-3 gap-6 md:gap-10">
              {schedule.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs text-ink/40 mt-1.5">0{i + 1}</span>
                  <span className="text-ink text-[15px] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
