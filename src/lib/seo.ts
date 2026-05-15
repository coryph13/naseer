export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://naseer.uz'

export const LOCALES = ['uz', 'ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const OG_LOCALE: Record<Locale, string> = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US'
}

export function alternateLanguages(path: string) {
  const clean = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/uz${clean}`
  }
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${clean}`
  }
  return languages
}

export function canonical(locale: string, path: string) {
  const clean = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}/${locale}${clean}`
}
