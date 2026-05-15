import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Logo from './Logo'
import FooterLocaleSwitch from './FooterLocaleSwitch'

const LINES = [
  { slug: 'lollis', label: 'Lollis', color: '#f5bc44' },
  { slug: 'choco-cone', label: 'Choco Cone', color: '#906a54' },
  { slug: 'toffical', label: 'Toffical', color: '#90cc8d' },
  { slug: 'choco-bisco', label: 'Choco Bisco', color: '#b01e23' },
  { slug: 'bamboonee', label: 'Bamboonee', color: '#dbafd0' }
]

const PHONE_RAW = '+998991150302'
const PHONE_HUMAN = '+998 99 115 03 02'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-white"
              aria-label="Naseer"
            >
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="display-section text-xl md:text-[22px] mt-7 leading-snug text-white/85 max-w-sm">
              {t('footer.tagline')}
            </p>
            <p className="eyebrow-light mt-5">{t('footer.address')}</p>
            <a
              href="https://instagram.com/naseer_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-white/70 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              @naseer_uz
            </a>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow-light mb-5">{t('footer.linksTitle')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/catalog`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/production`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {t('nav.production')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contacts`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {t('nav.contacts')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow-light mb-5">{t('footer.linesTitle')}</h4>
            <ul className="space-y-2.5 text-sm">
              {LINES.map(line => (
                <li key={line.slug}>
                  <Link
                    href={`/${locale}/catalog/${line.slug}`}
                    className="inline-flex items-center gap-2.5 text-white/65 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: line.color }}
                    />
                    {line.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow-light mb-5">{t('footer.contactsTitle')}</h4>
            <a
              href={`tel:${PHONE_RAW}`}
              className="display-section text-2xl text-white hover:text-brand-light transition-colors block"
            >
              {PHONE_HUMAN}
            </a>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:info@naseer.uz"
                  className="text-white/65 hover:text-white transition-colors"
                >
                  info@naseer.uz
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/naseer_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-white transition-colors"
                >
                  @naseer_uz
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-white/45">{t('footer.hoursBody')}</p>
          </div>
        </div>

        <div className="mt-16 h-px bg-white/10" />

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/40">
          <p>© {year} Naseer LLC. {t('footer.rights')}.</p>
          <FooterLocaleSwitch />
          <p className="text-white/35">{t('footer.madeIn')}</p>
        </div>
      </div>
    </footer>
  )
}
