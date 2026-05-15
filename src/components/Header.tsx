'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const locales = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Ру' },
  { code: 'en', label: 'En' }
]

const PHONE_RAW = '+998991150302'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 4.5h3.2l1.6 4-2.1 1.4a12 12 0 0 0 6.9 6.9l1.4-2.1 4 1.6v3.2a1.6 1.6 0 0 1-1.7 1.6A16.8 16.8 0 0 1 2.9 6.2 1.6 1.6 0 0 1 4.5 4.5z" />
    </svg>
  )
}

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  const navLinks = [
    { href: `/${locale}/catalog`, label: t('catalog') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/production`, label: t('production') },
    { href: `/${locale}/contacts`, label: t('contacts') }
  ]

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-ink/10 transition-shadow duration-300"
      style={{
        backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.88)' : '#ffffff',
        boxShadow: scrolled ? '0 2px 24px -12px rgba(20,17,15,0.18)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 md:h-[72px] flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center text-ink flex-shrink-0"
          aria-label="Naseer"
        >
          <Logo className="h-9 md:h-11 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors"
              style={{ color: isActive(link.href) ? 'var(--color-ink)' : 'rgba(20,17,15,0.55)' }}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-3 right-3 -bottom-px h-px bg-brand"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center bg-ink/5 rounded-full p-0.5">
            {locales.map(l => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className="relative px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors"
                style={{ color: locale === l.code ? '#ffffff' : 'rgba(20,17,15,0.55)' }}
              >
                {locale === l.code && (
                  <motion.div
                    layoutId="locale-active"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            ))}
          </div>

          <a
            href={`tel:${PHONE_RAW}`}
            className="hidden md:inline-flex items-center gap-2 bg-ink text-white pl-4 pr-5 py-2 rounded-full text-sm font-medium hover:bg-brand transition-colors group"
            aria-label={t('callUs')}
          >
            <PhoneIcon className="w-4 h-4 transition-transform group-hover:-rotate-12" />
            <span>{t('phone')}</span>
          </a>

          <a
            href={`tel:${PHONE_RAW}`}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-ink text-white hover:bg-brand transition-colors"
            aria-label={t('callUs')}
          >
            <PhoneIcon className="w-4 h-4" />
          </a>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/15 text-ink"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden overflow-hidden bg-white border-t border-ink/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="display-section text-3xl tracking-tight"
                    style={{ color: isActive(link.href) ? 'var(--color-brand)' : 'var(--color-ink)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="h-px bg-ink/10" />

              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">Language</span>
                <div className="flex items-center bg-ink/5 rounded-full p-0.5">
                  {locales.map(l => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className="relative px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors"
                      style={{ color: locale === l.code ? '#ffffff' : 'rgba(20,17,15,0.55)' }}
                    >
                      {locale === l.code && (
                        <motion.div
                          layoutId="locale-active-mobile"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`tel:${PHONE_RAW}`}
                className="inline-flex items-center justify-center gap-2 bg-ink text-white py-3 rounded-full text-sm font-medium hover:bg-brand transition-colors"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>{t('phone')}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
