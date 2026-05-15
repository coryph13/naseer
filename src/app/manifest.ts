import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naseer — Кондитерская фабрика',
    short_name: 'Naseer',
    description:
      'Кондитерская фабрика в Ташкенте. Пять линеек, шестьдесят позиций, собственное производство и доставка.',
    start_url: '/uz',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf6ef',
    theme_color: '#8f1538',
    lang: 'uz',
    categories: ['food', 'business', 'shopping'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}
