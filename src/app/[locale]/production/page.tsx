import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FadeUp } from '@/components/Motion'
import { alternateLanguages, canonical } from '@/lib/seo'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'production' })
  const title = t('title')
  const description = t('intro')
  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, '/production'),
      languages: alternateLanguages('/production')
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, '/production'),
      type: 'website'
    }
  }
}

export default async function ProductionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'production' })

  const stages = [
    { num: '01', title: t('stage1Title'), text: t('stage1Text'), img: '/production/ingredients.jpg' },
    { num: '02', title: t('stage2Title'), text: t('stage2Text'), img: '/production/factory-line.jpg' },
    { num: '03', title: t('stage3Title'), text: t('stage3Text'), img: '/production/quality.jpg' },
    { num: '04', title: t('stage4Title'), text: t('stage4Text'), img: '/production/packaging.jpg' }
  ]

  const certs = [
    { num: '01', name: t('cert1') },
    { num: '02', name: t('cert2') },
    { num: '03', name: t('cert3') }
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
                {t('heroCaption')}
              </div>
              <span className="w-px h-4 bg-ink/15" />
              <span>2018 → ∞</span>
            </div>
          </div>

          <div className="relative grid grid-cols-5 grid-rows-5 gap-3 aspect-square">
            <div className="relative col-span-3 row-span-3 rounded-3xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(20,17,15,0.4)]">
              <Image
                src="/production/factory-line.jpg"
                alt={t('heroCaption')}
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-2 col-start-4 row-start-1 rounded-2xl overflow-hidden">
              <Image
                src="/production/ingredients.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-3 col-start-4 row-start-3 rounded-2xl overflow-hidden">
              <Image
                src="/production/quality.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-3 row-span-2 col-start-1 row-start-4 rounded-2xl overflow-hidden">
              <Image
                src="/production/packaging.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/8 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-6 mb-20 md:mb-28 items-end">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-ink/30" />
                <span className="eyebrow">{t('stagesEyebrow')}</span>
              </div>
              <h2 className="display-section text-3xl md:text-5xl lg:text-6xl text-ink max-w-3xl">
                {t('stagesTitle')}
              </h2>
            </div>
          </FadeUp>

          <div className="space-y-32 md:space-y-48">
            {stages.map((stage) => (
              <article
                key={stage.num}
                className="grid grid-cols-12 gap-y-10 md:gap-x-10 lg:gap-x-16"
              >
                <div className="col-span-12 md:col-span-4 lg:col-span-3 order-1">
                  <div className="md:sticky md:top-28">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <span className="w-6 h-px bg-brand" />
                      <span className="eyebrow text-brand">{t('stageEyebrow')}</span>
                    </div>
                    <div className="display-mono text-[120px] sm:text-[160px] md:text-[200px] lg:text-[240px] text-ink/10 select-none">
                      {stage.num}
                    </div>
                  </div>
                </div>

                <FadeUp className="col-span-12 md:col-span-8 lg:col-span-9 order-2">
                  <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden mb-10 md:mb-12 shadow-[0_40px_80px_-30px_rgba(20,17,15,0.3)]">
                    <Image
                      src={stage.img}
                      alt={stage.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="display-section text-3xl md:text-4xl lg:text-5xl text-ink mb-6 max-w-2xl">
                    {stage.title}
                  </h3>
                  <p className="body-lead max-w-2xl">
                    {stage.text}
                  </p>
                </FadeUp>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-6 mb-16 items-end">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-ink/30" />
                <span className="eyebrow">{t('certEyebrow')}</span>
              </div>
              <h2 className="display-section text-3xl md:text-5xl text-ink max-w-3xl">
                {t('certListTitle')}
              </h2>
            </div>
            <p className="body-lead max-w-2xl mb-16">
              {t('certText')}
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <ul className="border-t border-ink/15">
              {certs.map((cert) => (
                <li
                  key={cert.num}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-12 py-7 md:py-9 border-b border-ink/15"
                >
                  <span className="display-mono text-2xl md:text-4xl text-ink/30 w-12 md:w-16">
                    {cert.num}
                  </span>
                  <span className="text-ink text-lg md:text-2xl font-display tracking-tight leading-snug">
                    {cert.name}
                  </span>
                  <span
                    className="eyebrow text-ink/35 whitespace-nowrap"
                    title={t('certComing')}
                  >
                    {t('certNote')}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

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
