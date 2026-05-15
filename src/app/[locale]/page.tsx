import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import HeroVisual from '@/components/HeroVisual'
import LineShowcase from '@/components/LineShowcase'
import HomeStats from '@/components/HomeStats'
import { FadeUp } from '@/components/Motion'
import { alternateLanguages, canonical } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const title = t('hero.title').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  const description = t('hero.body')

  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, ''),
      languages: alternateLanguages('')
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, ''),
      type: 'website'
    }
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  const faq = await getTranslations({ locale, namespace: 'faq' })

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <section id="main" tabIndex={-1} className="relative pt-28 pb-20 lg:pt-36 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('hero.eyebrow')}</span>
            </div>

            <h1 className="display-hero text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] text-ink mb-8 whitespace-pre-line">
              {t('hero.title')}
            </h1>

            <p className="body-lead max-w-xl mb-10">
              {t('hero.body')}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center gap-3 bg-ink text-white font-medium text-[15px] pl-6 pr-5 py-3.5 rounded-full hover:bg-brand transition-colors group"
              >
                {t('hero.ctaPrimary')}
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href={`/${locale}/contacts`}
                className="inline-flex items-center gap-2 text-ink/70 hover:text-ink font-medium text-[15px] px-4 py-3.5 transition-colors"
              >
                {t('hero.ctaSecondary')}
                <span className="text-xs">→</span>
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-6 text-sm text-ink/45">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t('hero.proof')}
              </div>
              <span className="w-px h-4 bg-ink/15" />
              <span>{t('hero.since')}</span>
            </div>
          </div>

          <div className="relative">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-ink/8">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-8 h-px bg-ink/30" />
              <span className="eyebrow">{t('promise.eyebrow')}</span>
            </div>
            <h2 className="display-section text-4xl md:text-6xl lg:text-7xl text-ink mb-8 max-w-4xl">
              {t('promise.title')}
            </h2>
            <p className="body-lead max-w-2xl">
              {t('promise.body')}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-ink/30" />
                  <span className="eyebrow">{t('lines.eyebrow')}</span>
                </div>
                <h2 className="display-section text-4xl md:text-5xl lg:text-6xl text-ink whitespace-pre-line max-w-2xl">
                  {t('lines.title')}
                </h2>
              </div>
              <p className="body-lead hidden md:block max-w-sm pb-2">
                {t('lines.body')}
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <LineShowcase />
          </FadeUp>
        </div>
      </section>

      <section className="py-20 md:py-28 border-y border-ink/8">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-ink/30" />
              <span className="eyebrow">{t('stats.eyebrow')}</span>
            </div>
          </FadeUp>
          <HomeStats />
        </div>
      </section>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeUp>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-brand" />
                <span className="eyebrow text-brand">{t('production.eyebrow')}</span>
              </div>
              <h2 className="display-section text-4xl md:text-5xl lg:text-6xl text-ink mb-8 whitespace-pre-line">
                {t('production.title')}
              </h2>
              <p className="body-lead max-w-md mb-10">
                {t('production.body')}
              </p>
              <Link
                href={`/${locale}/production`}
                className="inline-flex items-center gap-3 text-ink font-semibold border-b border-ink/30 hover:border-brand hover:text-brand transition-colors pb-1"
              >
                {t('production.cta')}
                <span>→</span>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative aspect-[5/6] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(20,17,15,0.4)]">
              <Image
                src="/production/factory-line.jpg"
                alt={t('production.title')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold tracking-[0.22em] uppercase opacity-70 mb-1">
                  Naseer Factory · Tashkent
                </div>
                <div className="text-sm opacity-90">{t('production.caption')}</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-ink text-white py-24 md:py-32 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(245,188,68,0.18), transparent 65%), radial-gradient(ellipse 70% 50% at 20% 80%, rgba(143,21,56,0.35), transparent 60%)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <FadeUp>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-white/40" />
                <span className="eyebrow-light">{t('delivery.eyebrow')}</span>
              </div>
              <h2 className="display-section text-4xl md:text-5xl lg:text-6xl mb-8">
                {t('delivery.title')}
              </h2>
              <p className="text-white/65 text-lg leading-relaxed max-w-md mb-10">
                {t('delivery.body')}
              </p>
              <Link
                href={`/${locale}/contacts`}
                className="inline-flex items-center gap-3 bg-white text-ink font-medium text-[15px] pl-6 pr-5 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors group"
              >
                {t('delivery.cta')}
                <span className="w-7 h-7 rounded-full bg-ink/10 group-hover:bg-white/15 flex items-center justify-center text-xs transition-all group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
              {(
                [
                  { v: 'Tashkent', l: t('delivery.cityLabel') },
                  { v: '24ч', l: t('delivery.timeLabel') },
                  { v: '0₽', l: t('delivery.costLabel') },
                  { v: t('delivery.fleetValue'), l: t('delivery.fleetLabel') }
                ] as { v: string; l: string }[]
              ).map((c, i) => (
                <div key={i} className="bg-ink/95 p-7 md:p-8 flex flex-col gap-3">
                  <span
                    className={`display-mono ${c.v.length > 4 ? 'text-2xl md:text-3xl' : 'text-5xl md:text-6xl'}`}
                  >
                    {c.v}
                  </span>
                  <span className="text-sm text-white/55">{c.l}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <FAQ
        title={faq('title')}
        items={faq.raw('items') as { q: string; a: string }[]}
      />

      <section className="py-28 md:py-40 bg-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('final.eyebrow')}</span>
              <span className="w-8 h-px bg-brand" />
            </div>
            <h2 className="display-section text-4xl md:text-6xl lg:text-7xl text-ink mb-8 whitespace-pre-line">
              {t('final.title')}
            </h2>
            <p className="body-lead max-w-xl mx-auto mb-12">
              {t('final.body')}
            </p>
            <Link
              href={`/${locale}/contacts`}
              className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white font-medium text-[15px] pl-7 pr-6 py-4 rounded-full transition-colors group shadow-[0_20px_40px_-15px_rgba(143,21,56,0.5)]"
            >
              {t('final.cta')}
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
