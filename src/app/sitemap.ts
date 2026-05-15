import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const locales = ['uz', 'ru', 'en']
const lines = ['lollis', 'choco-cone', 'toffical', 'choco-bisco', 'bamboonee']
const pages = ['', '/about', '/production', '/contacts', '/catalog']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of locales) {
    for (const page of pages) {
      const others = locales.filter(l => l !== locale)
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            others.map(l => [l, `${SITE_URL}/${l}${page}`])
          )
        }
      })
    }

    for (const line of lines) {
      const others = locales.filter(l => l !== locale)
      entries.push({
        url: `${SITE_URL}/${locale}/catalog/${line}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            others.map(l => [l, `${SITE_URL}/${l}/catalog/${line}`])
          )
        }
      })
    }
  }

  return entries
}
