import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductsGrid from '@/components/ProductsGrid'
import { SITE_URL, alternateLanguages, canonical } from '@/lib/seo'
import lines from '../../../../../data/lines.json'
import allProducts from '../../../../../data/products.json'

export async function generateStaticParams() {
  const locales = ['uz', 'ru', 'en']
  return locales.flatMap(locale =>
    lines.map(line => ({ locale, line: line.slug }))
  )
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; line: string }>
}): Promise<Metadata> {
  const { locale, line } = await params
  const loc = locale as 'uz' | 'ru' | 'en'
  const lineData = lines.find(l => l.slug === line)
  if (!lineData) return {}
  const path = `/catalog/${line}`
  const title = lineData.name
  const description = lineData.description[loc]
  return {
    title,
    description,
    alternates: {
      canonical: canonical(locale, path),
      languages: alternateLanguages(path)
    },
    openGraph: {
      title: `${title} · Naseer`,
      description,
      url: canonical(locale, path),
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

export default async function LinePage({ params }: { params: Promise<{ locale: string; line: string }> }) {
  const { locale, line } = await params
  setRequestLocale(locale)
  const loc = locale as 'uz' | 'ru' | 'en'

  const lineData = lines.find(l => l.slug === line)
  if (!lineData) notFound()

  const tc = await getTranslations({ locale, namespace: 'catalog' })
  const th = await getTranslations({ locale, namespace: 'home.lines' })

  const products = allProducts.filter(p => p.line === line)
  const color = lineColors[line] ?? '#8f1538'
  const hero = lineHeroImages[line]
  const idx = lines.findIndex(l => l.slug === line)

  const lineThumbs = lines.map(l => ({
    slug: l.slug,
    name: l.name,
    color: lineColors[l.slug],
    image: lineHeroImages[l.slug]
  }))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: tc('title').toString(),
        item: `${SITE_URL}/${locale}/catalog`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lineData.name,
        item: `${SITE_URL}/${locale}/catalog/${line}`
      }
    ]
  }

  const productListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${lineData.name} — Naseer`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name[loc],
        description: `${p.flavor[loc]} · ${p.weight} · ${p.packaging[loc]}`,
        image: p.image ? `${SITE_URL}${p.image}` : undefined,
        brand: { '@type': 'Brand', name: 'Naseer' },
        category: lineData.name
      }
    }))
  }

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }}
      />
      <Header />

      <section id="main" tabIndex={-1} className="relative h-[60vh] md:h-[72vh] min-h-[420px] overflow-hidden">
        <Image
          src={hero}
          alt={lineData.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(170deg, rgba(20,17,15,0.55) 0%, ${color}aa 60%, ${color}f0 100%)` }}
        />

        <div className="absolute inset-x-0 top-16 md:top-[72px] pt-6 md:pt-8">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-[12px] tracking-wide text-white/70">
              <Link href={`/${locale}/catalog`} className="hover:text-white transition-colors">
                {tc('title')}
              </Link>
              <span className="opacity-50">/</span>
              <span className="text-white">{lineData.name}</span>
            </nav>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <div className="flex items-center gap-3 mb-6 eyebrow-light tabular-nums">
              <span className="w-6 h-px bg-white/60" />
              {tc('lineLabel')} {String(idx + 1).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}
            </div>
            <h1 className="display-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 -ml-1">
              {lineData.name}
            </h1>
            <div className="h-px w-24 mb-6" style={{ backgroundColor: color }} />
            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl">
              {th(line)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/8 bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-7">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="eyebrow flex-shrink-0 mr-2">{tc('allLines')}</span>
            {lineThumbs.map(l => {
              const isActive = l.slug === line
              return (
                <Link
                  key={l.slug}
                  href={`/${locale}/catalog/${l.slug}`}
                  className="flex-shrink-0 group flex items-center gap-3"
                >
                  <div
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      outline: isActive ? `2px solid ${l.color}` : '2px solid transparent',
                      outlineOffset: '2px',
                      opacity: isActive ? 1 : 0.6
                    }}
                  >
                    <Image
                      src={l.image}
                      alt={l.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <span
                    className="text-[13px] font-medium tracking-wide transition-colors hidden sm:inline"
                    style={{ color: isActive ? 'var(--color-ink)' : 'rgba(20,17,15,0.5)' }}
                  >
                    {l.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-14 md:py-20 pb-24">
        <ProductsGrid
          products={products}
          locale={locale}
          color={color}
          lineImage={hero}
        />

        <div className="mt-20 text-center">
          <Link
            href={`/${locale}/catalog`}
            className="inline-flex items-center gap-2 text-ink/55 hover:text-ink font-medium text-sm transition-colors border-b border-ink/15 hover:border-ink pb-1"
          >
            <span>←</span> {tc('allLines')}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
