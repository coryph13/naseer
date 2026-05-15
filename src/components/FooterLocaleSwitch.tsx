'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const locales = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Ру' },
  { code: 'en', label: 'En' }
]

export default function FooterLocaleSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  return (
    <div className="inline-flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase">
      {locales.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => switchLocale(l.code)}
            className="px-1 transition-colors"
            style={{ color: locale === l.code ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)' }}
          >
            {l.label}
          </button>
          {i < locales.length - 1 && <span className="text-white/15">·</span>}
        </span>
      ))}
    </div>
  )
}
