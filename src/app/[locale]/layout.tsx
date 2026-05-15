import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Source_Serif_4, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import PageLoader from '@/components/PageLoader'
import ScrollToTop from '@/components/ScrollToTop'
import { SITE_URL, OG_LOCALE, alternateLanguages, canonical, type Locale } from '@/lib/seo'
import '../globals.css'

const sans = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap'
})

const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz']
})

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf6ef' },
    { media: '(prefers-color-scheme: dark)', color: '#14110f' }
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light'
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const title = `Naseer — ${t('hero.eyebrow').split('·')[1]?.trim() ?? 'Кондитерская фабрика'}`
  const description = t('promise.body')

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s · Naseer'
    },
    description,
    applicationName: 'Naseer',
    keywords: ['Naseer', 'кондитерская фабрика', 'оптом', 'Ташкент', 'Узбекистан', 'lollis', 'choco cone', 'toffical', 'choco bisco', 'bamboonee'],
    authors: [{ name: 'Naseer' }],
    creator: 'Naseer',
    publisher: 'Naseer',
    alternates: {
      canonical: canonical(locale, ''),
      languages: alternateLanguages('')
    },
    openGraph: {
      title,
      description,
      url: canonical(locale, ''),
      siteName: 'Naseer',
      locale: OG_LOCALE[locale as Locale] ?? OG_LOCALE.uz,
      alternateLocale: Object.values(OG_LOCALE).filter(l => l !== OG_LOCALE[locale as Locale]),
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'format-detection': 'telephone=no'
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'uz' | 'ru' | 'en')) notFound()

  setRequestLocale(locale)

  const messages = await getMessages()
  const f = await getTranslations({ locale, namespace: 'footer' })
  const c = await getTranslations({ locale, namespace: 'common' })

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Naseer',
    legalName: 'Naseer',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description: f('tagline'),
    foundingDate: '2018',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Кондитерская, 14',
      addressLocality: 'Tashkent',
      addressRegion: 'Tashkent',
      addressCountry: 'UZ'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+998991150302',
        contactType: 'sales',
        areaServed: 'UZ',
        availableLanguage: ['uz', 'ru', 'en']
      }
    ],
    sameAs: ['https://t.me/naseer_uz']
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Naseer',
    url: SITE_URL,
    inLanguage: ['uz', 'ru', 'en']
  }

  return (
    <html lang={locale}>
      <body className={`${sans.variable} ${serif.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
        >
          {c('skipToContent')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <PageLoader />
          {children}
          <ScrollToTop />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  )
}
