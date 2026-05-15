import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'common' })

  const links = [
    { href: `/${locale}/catalog`, label: t('notFoundCtaCatalog') },
    { href: `/${locale}`, label: t('notFoundCtaHome') },
    { href: `/${locale}/contacts`, label: t('notFoundCtaContacts') }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 flex items-center pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('notFoundEyebrow')}</span>
            </div>

            <h1 className="display-section text-5xl md:text-7xl lg:text-[88px] text-ink mb-8 leading-[0.95]">
              {t('notFoundTitle')}
            </h1>

            <p className="body-lead max-w-lg mb-12">
              {t('notFoundBody')}
            </p>

            <ul className="border-t border-ink/10">
              {links.map(l => (
                <li key={l.href} className="border-b border-ink/10">
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between py-5 transition-colors"
                  >
                    <span className="text-ink text-lg md:text-xl font-medium tracking-tight group-hover:text-brand transition-colors">
                      {l.label}
                    </span>
                    <span className="text-ink/30 group-hover:text-brand group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            aria-hidden
            className="relative hidden lg:flex items-center justify-center select-none"
          >
            <span
              className="display-mono text-[260px] xl:text-[340px] text-ink/[0.06] leading-none tracking-tighter"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t('notFoundCode')}
            </span>
            <span
              className="absolute display-mono text-[160px] xl:text-[200px] text-brand/15 leading-none -rotate-6"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t('notFoundCode')}
            </span>
          </div>

          <div
            aria-hidden
            className="display-mono text-[140px] sm:text-[200px] text-ink/[0.06] leading-none lg:hidden text-center"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {t('notFoundCode')}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
