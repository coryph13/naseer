import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import { FadeUp } from '@/components/Motion'
import { alternateLanguages, canonical } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const title = t('title')
  const description = t('description')
  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, '/about'),
      languages: alternateLanguages('/about')
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, '/about'),
      type: 'website'
    }
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })
  const faq = await getTranslations({ locale, namespace: 'faq' })

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') }
  ]

  const advantages = [
    { num: '01', title: t('advantage1Title'), body: t('advantage1Body') },
    { num: '02', title: t('advantage2Title'), body: t('advantage2Body') },
    { num: '03', title: t('advantage3Title'), body: t('advantage3Body') }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <section id="main" tabIndex={-1} className="relative pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('heroEyebrow')}</span>
            </div>

            <h1 className="display-hero text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] text-ink mb-8 whitespace-pre-line">
              {t('heroTitle')}
            </h1>

            <p className="body-lead max-w-xl">
              {t('heroBody')}
            </p>

            <div className="mt-12 flex items-center gap-6 text-sm text-ink/45">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Naseer · Tashkent
              </div>
              <span className="w-px h-4 bg-ink/15" />
              <span>2018 → ∞</span>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(20,17,15,0.4)]">
            <Image
              src="/production/factory-line.jpg"
              alt="Naseer"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-ink/8 py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-y-10 md:gap-x-12">
            <FadeUp className="md:col-span-3">
              <div className="flex items-center gap-3 md:sticky md:top-28">
                <span className="w-8 h-px bg-ink/30" />
                <span className="eyebrow">{t('storyEyebrow')}</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.05} className="md:col-span-9 max-w-2xl">
              <p className="text-2xl md:text-3xl lg:text-[34px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink mb-10">
                {t('storyP1')}
              </p>
              <p className="text-ink/65 text-lg leading-relaxed mb-6">
                {t('storyP2')}
              </p>
              <p className="text-ink/65 text-lg leading-relaxed">
                {t('storyP3')}
              </p>

              <blockquote className="mt-16 md:mt-20 relative pl-8 md:pl-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 font-serif text-7xl md:text-8xl text-brand/30 leading-none select-none"
                >
                  “
                </span>
                <p className="font-serif italic text-[26px] md:text-4xl lg:text-[40px] text-ink leading-[1.2] tracking-tight">
                  {t('quote')}
                </p>
              </blockquote>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-y border-ink/8">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-ink/30" />
              <span className="eyebrow">{t('statsEyebrow')}</span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink/10">
            {stats.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.06}>
                <div className="px-6 py-10 md:py-14 flex flex-col gap-3 h-full">
                  <span
                    className={`display-mono text-ink ${s.value.length > 4 ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl'}`}
                  >
                    {s.value}
                  </span>
                  <span className="text-sm text-ink/55 font-medium leading-snug max-w-[14ch]">
                    {s.label}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-6 mb-16 md:mb-24 items-end">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-brand" />
                <span className="eyebrow text-brand">{t('advEyebrow')}</span>
              </div>
              <h2 className="display-section text-3xl md:text-5xl lg:text-6xl text-ink max-w-3xl">
                {t('advTitle')}
              </h2>
            </div>
          </FadeUp>

          <ul className="border-t border-ink/10">
            {advantages.map((adv) => (
              <li key={adv.num} className="border-b border-ink/10">
                <FadeUp>
                  <div className="grid grid-cols-12 gap-y-6 md:gap-x-12 py-12 md:py-20">
                    <div className="col-span-12 md:col-span-4 lg:col-span-5 flex items-baseline gap-6 md:gap-10">
                      <span className="display-mono text-2xl md:text-3xl text-ink/30 w-10 md:w-14">
                        {adv.num}
                      </span>
                      <h3 className="display-section text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.05]">
                        {adv.title}
                      </h3>
                    </div>
                    <div className="col-span-12 md:col-span-8 lg:col-span-7 md:pl-6 lg:pl-0">
                      <p className="body-lead max-w-2xl">
                        {adv.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeUp>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-brand" />
                <span className="eyebrow text-brand">{t('productionTeaserEyebrow')}</span>
              </div>
              <h2 className="display-section text-4xl md:text-5xl lg:text-6xl text-ink mb-8 whitespace-pre-line">
                {t('productionTeaserTitle')}
              </h2>
              <p className="body-lead max-w-md mb-10">
                {t('productionTeaserBody')}
              </p>
              <Link
                href={`/${locale}/production`}
                className="inline-flex items-center gap-3 text-ink font-semibold border-b border-ink/30 hover:border-brand hover:text-brand transition-colors pb-1"
              >
                {t('productionTeaserCta')}
                <span>→</span>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative aspect-[5/6] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(20,17,15,0.4)]">
              <Image
                src="/production/factory-line.jpg"
                alt={t('productionTeaserTitle')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold tracking-[0.22em] uppercase opacity-70 mb-1">
                  Naseer Factory · Tashkent
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <FAQ
        title={faq('title')}
        items={faq.raw('items') as { q: string; a: string }[]}
      />

      <section className="py-28 md:py-40 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="w-8 h-px bg-brand" />
              <span className="eyebrow text-brand">{t('ctaEyebrow')}</span>
              <span className="w-8 h-px bg-brand" />
            </div>
            <h2 className="display-section text-4xl md:text-6xl lg:text-7xl text-ink mb-8 whitespace-pre-line">
              {t('ctaTitle')}
            </h2>
            <p className="body-lead max-w-xl mx-auto mb-12">
              {t('ctaText')}
            </p>
            <Link
              href={`/${locale}/contacts`}
              className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white font-medium text-[15px] pl-7 pr-6 py-4 rounded-full transition-colors group shadow-[0_20px_40px_-15px_rgba(143,21,56,0.5)]"
            >
              {t('ctaBtn')}
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
