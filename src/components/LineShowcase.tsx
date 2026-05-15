'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'

interface Line {
  slug: string
  name: string
  color: string
  hero: string
  detail: string
}

const lines: Line[] = [
  {
    slug: 'lollis',
    name: 'Lollis',
    color: '#f5bc44',
    hero: '/products/lollis/lollipop-fruit-mix-900.jpg',
    detail: '8 SKU · 10–900 г'
  },
  {
    slug: 'choco-cone',
    name: 'Choco Cone',
    color: '#906a54',
    hero: '/products/choco-cone/all-2000.jpg',
    detail: '8 SKU · 145–360 г'
  },
  {
    slug: 'toffical',
    name: 'Toffical',
    color: '#90cc8d',
    hero: '/products/toffical/mint-450.jpg',
    detail: '15 SKU · 150–900 г'
  },
  {
    slug: 'choco-bisco',
    name: 'Choco Bisco',
    color: '#b01e23',
    hero: '/products/choco-bisco/hazelnut-700.jpg',
    detail: '8 SKU · 320–700 г'
  },
  {
    slug: 'bamboonee',
    name: 'Bamboonee',
    color: '#dbafd0',
    hero: '/products/bamboonee/strawberry-330.jpg',
    detail: '13 SKU · 20–330 г'
  }
]

const ROTATE_MS = 6500

export default function LineShowcase() {
  const t = useTranslations('home.lines')
  const locale = useLocale()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || reduceMotion) return
    const id = setInterval(() => setActive(i => (i + 1) % lines.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, reduceMotion])

  const current = lines[active]

  return (
    <div
      className="grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-stretch"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-3xl overflow-hidden bg-ink/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.hero}
              alt={current.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority={active === 0}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, transparent 35%, ${current.color}d0 100%)` }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-[0.22em] uppercase opacity-80">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.color }} />
                {String(active + 1).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}
                <span className="opacity-60">·</span>
                <span className="opacity-80">{current.detail}</span>
              </div>
              <h3 className="display-section text-5xl md:text-7xl mb-3">{current.name}</h3>
              <p className="max-w-md text-sm md:text-base text-white/80 leading-relaxed mb-5">
                {t(current.slug)}
              </p>
              <Link
                href={`/${locale}/catalog/${current.slug}`}
                className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-ink font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:gap-3"
              >
                {t('cta')}
                <span>→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          aria-hidden
          className="absolute top-0 left-0 h-0.5"
          style={{ backgroundColor: current.color }}
          initial={{ width: '0%' }}
          animate={{ width: paused || reduceMotion ? '0%' : '100%' }}
          transition={{ duration: paused || reduceMotion ? 0 : ROTATE_MS / 1000, ease: 'linear' }}
          key={`bar-${active}-${paused}`}
        />
      </div>

      <div className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible scrollbar-none lg:w-32">
        {lines.map((line, i) => {
          const isActive = i === active
          return (
            <button
              key={line.slug}
              onClick={() => setActive(i)}
              className="relative flex-shrink-0 group"
              style={{
                width: 96,
                height: 116
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-black/5"
                animate={{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.55
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <Image
                  src={line.hero}
                  alt={line.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, transparent 50%, ${line.color}aa 100%)` }}
                />
                <div className="absolute inset-x-0 bottom-1.5 text-center">
                  <span className="text-[10px] font-bold text-white tracking-wide leading-none">
                    {line.name}
                  </span>
                </div>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="line-active-ring"
                  className="absolute -inset-1 rounded-[20px] pointer-events-none"
                  style={{ boxShadow: `0 0 0 2px ${line.color}` }}
                  transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
