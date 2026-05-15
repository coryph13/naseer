import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogNav from '@/components/CatalogNav'
import { FadeUp } from '@/components/Motion'
import { SITE_URL, alternateLanguages, canonical } from '@/lib/seo'
import lines from '../../../../data/lines.json'
import allProducts from '../../../../data/products.json'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const title = t('title')
  const description = t('heroBody')
  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, '/catalog'),
      languages: alternateLanguages('/catalog')
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, '/catalog'),
      type: 'website'
    }
  }
}

const lineColors: Record<string, string> = {
  lollis: '#f5bc44',
  'choco-cone': '#906a54',
  toffical: '#90cc8d',
  'choco-bisco': '#b01e23',
  bamboonee: '#dbafd0'
}

const lineHeroImages: Record<string, string> = {
  lollis: '/products/lollis/lollipop-fruit-mix-900.jpg',
  'choco-cone': '/products/choco-cone/all-2000.jpg',
  toffical: '/products/toffical/mint-450.jpg',
  'choco-bisco': '/products/choco-bisco/hazelnut-700.jpg',
  bamboonee: '/products/bamboonee/strawberry-330.jpg'
}

type Loc = 'uz' | 'ru' | 'en'

interface Product {
  id: string
  line: string
  name: { uz: string; ru: string; en: string }
  flavor: { uz: string; ru: string; en: string }
  weight: string
  packaging: { uz: string; ru: string; en: string }
  color: string
  image: string
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as Loc
  const tc = await getTranslations({ locale, namespace: 'catalog' })
  const th = await getTranslations({ locale, namespace: 'home.lines' })

  const grouped = lines.map(line => ({
    ...line,
    color: lineColors[line.slug],
    hero: lineHeroImages[line.slug],
    products: allProducts.filter((p): p is Product => p.line === line.slug)
  }))

  const navLines = grouped.map(l => ({
    slug: l.slug,
    name: l.name,
    color: l.color,
    count: l.products.length
  }))

  const totalCount = grouped.reduce((acc, l) => acc + l.products.length, 0)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Naseer',
        item: `${SITE_URL}/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tc('title').toString(),
        item: `${SITE_URL}/${locale}/catalog`
      }
    ]
  }

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <section id="main" tabIndex={-1} className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-brand" />
            <span className="eyebrow text-brand">{tc('heroEyebrow')}</span>
          </div>
          <h1 className="display-hero text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] text-ink mb-8 whitespace-pre-line max-w-4xl">
            {tc('heroTitle')}
          </h1>
          <p className="body-lead max-w-xl">
            {tc('heroBody')}
          </p>
          <div className="mt-12 flex items-center gap-6 text-sm text-ink/45">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              {lines.length} · {loc === 'ru' ? 'линеек' : loc === 'en' ? 'lines' : 'liniya'}
            </div>
            <span className="w-px h-4 bg-ink/15" />
            <div className="flex items-center gap-2 tabular-nums">
              {totalCount} {tc('sku')}
            </div>
          </div>
        </div>
      </section>

      <CatalogNav lines={navLines} />

      <main>
        {grouped.map(({ slug, name, color, hero, products }, idx) => (
          <section
            key={slug}
            id={slug}
            className="scroll-mt-32 py-20 md:py-28 first:pt-12 md:first:pt-16"
            style={idx % 2 === 1 ? { backgroundColor: 'var(--color-cream)' } : undefined}
          >
            <div className="max-w-7xl mx-auto px-6">
              <FadeUp>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-px" style={{ backgroundColor: color }} />
                  <span className="eyebrow tabular-nums" style={{ color }}>
                    {String(idx + 1).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12 mb-10 md:mb-14">
                  <h2 className="display-section text-5xl md:text-6xl lg:text-7xl text-ink">
                    {name}
                  </h2>
                  <p className="body-lead lg:max-w-md lg:text-right lg:pb-2">
                    {th(slug)}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.05}>
                <Link
                  href={`/${locale}/catalog/${slug}`}
                  className="group relative block aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-14 md:mb-16"
                >
                  <Image
                    src={hero}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(150deg, transparent 30%, ${color}cc 100%)` }}
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: `linear-gradient(0deg, ${color}80, transparent 55%)` }}
                  />
                  <div className="absolute inset-0 p-6 md:p-10 lg:p-14 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-2 mb-3 eyebrow-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {products.length} {tc('sku')}
                    </div>
                    <div className="flex items-end justify-between gap-6">
                      <span className="display-mono text-4xl md:text-6xl lg:text-7xl">{name}</span>
                      <span className="inline-flex items-center gap-2.5 bg-white text-ink font-medium text-[15px] pl-5 pr-4 py-3 rounded-full transition-all group-hover:gap-3.5">
                        {tc('openLine')}
                        <span className="w-6 h-6 rounded-full bg-ink/10 flex items-center justify-center text-xs">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeUp>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                {products.map(product => (
                  <Link
                    key={product.id}
                    href={`/${locale}/catalog/${slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-ink/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(20,17,15,0.25)] hover:border-ink/15"
                  >
                    <div className="relative aspect-square bg-cream overflow-hidden">
                      <Image
                        src={product.image ?? hero}
                        alt={product.name[loc]}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-ink/55 leading-none truncate max-w-[100px]">
                          {product.flavor[loc]}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3.5 border-t border-ink/8">
                      <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2 mb-1.5">
                        {product.name[loc]}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-ink/45">
                        <span className="truncate">{product.packaging[loc]}</span>
                        <span className="tabular-nums font-medium text-ink/65 flex-shrink-0">{product.weight}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}
