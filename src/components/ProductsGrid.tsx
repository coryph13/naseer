'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface Product {
  id: string
  line: string
  name: { uz: string; ru: string; en: string }
  flavor: { uz: string; ru: string; en: string }
  weight: string
  packaging: { uz: string; ru: string; en: string }
  color: string
  image?: string
}

interface Props {
  products: Product[]
  locale: string
  color: string
  lineImage: string
}

export default function ProductsGrid({ products, locale, color, lineImage }: Props) {
  const loc = locale as 'uz' | 'ru' | 'en'
  const t = useTranslations('catalog')
  const [activeWeight, setActiveWeight] = useState<string | null>(null)
  const [activeFlavor, setActiveFlavor] = useState<string | null>(null)
  const [modal, setModal] = useState<Product | null>(null)

  const weights = Array.from(new Set(products.map(p => p.weight)))
  const flavors = Array.from(new Set(products.map(p => p.flavor[loc])))
  const flavorColors: Record<string, string> = {}
  products.forEach(p => { flavorColors[p.flavor[loc]] = p.color })

  const filtered = products.filter(p => {
    if (activeWeight && p.weight !== activeWeight) return false
    if (activeFlavor && p.flavor[loc] !== activeFlavor) return false
    return true
  })

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-7">
        <span className="w-6 h-px" style={{ backgroundColor: color }} />
        <span className="eyebrow" style={{ color }}>{t('filtersEyebrow')}</span>
        <span className="ml-auto text-sm text-ink/45 tabular-nums">
          {filtered.length} {t('items')}
        </span>
      </div>

      <div className="flex flex-col gap-5 mb-12 md:flex-row md:items-start md:gap-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-[0.2em] mr-2">
            {t('weightLabel')}
          </span>
          {['__all__', ...weights].map(w => {
            const isAll = w === '__all__'
            const active = isAll ? !activeWeight : activeWeight === w
            return (
              <button
                key={w}
                onClick={() => setActiveWeight(isAll ? null : (activeWeight === w ? null : w))}
                className="relative px-3.5 py-1.5 text-[12px] font-medium tracking-wide transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="weight-active-line"
                    className="absolute left-2 right-2 -bottom-0.5 h-px"
                    style={{ backgroundColor: color }}
                    transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  />
                )}
                <span className="relative z-10" style={{ color: active ? 'var(--color-ink)' : 'rgba(20,17,15,0.45)' }}>
                  {isAll ? t('all') : w}
                </span>
              </button>
            )
          })}
        </div>

        {flavors.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 md:border-l md:border-ink/10 md:pl-10">
            <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-[0.2em] mr-2">
              {t('flavorLabel')}
            </span>
            {flavors.map(f => {
              const active = activeFlavor === f
              const fc = flavorColors[f]
              return (
                <button
                  key={f}
                  onClick={() => setActiveFlavor(active ? null : f)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium tracking-wide transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="flavor-active-line"
                      className="absolute left-2 right-2 -bottom-0.5 h-px"
                      style={{ backgroundColor: fc }}
                      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                    />
                  )}
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative z-10" style={{ backgroundColor: fc }} />
                  <span className="relative z-10" style={{ color: active ? 'var(--color-ink)' : 'rgba(20,17,15,0.45)' }}>
                    {f}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(product => (
            <motion.article
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setModal(product)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-ink/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-24px_rgba(20,17,15,0.25)] hover:border-ink/15"
            >
              <div className="relative aspect-square bg-cream overflow-hidden">
                <Image
                  src={product.image ?? lineImage}
                  alt={product.name[loc]}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-5 md:p-6 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: product.color }}
                  />
                  <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-ink/55 leading-none truncate max-w-[140px]">
                    {product.flavor[loc]}
                  </span>
                </div>
                <div className="absolute bottom-3.5 right-3.5 text-[11px] font-medium tabular-nums text-ink/55 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-full">
                  {product.weight}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-ink/8 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2 mb-1">
                    {product.name[loc]}
                  </p>
                  <p className="text-[11px] text-ink/45 truncate">{product.packaging[loc]}</p>
                </div>
                <span className="flex-shrink-0 text-[11px] text-ink/40 tracking-wide transition-colors group-hover:text-ink">
                  →
                </span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
            />
            <motion.div
              className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50 w-full max-w-lg bg-white rounded-t-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(20,17,15,0.45)] max-h-[92vh] overflow-y-auto"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            >
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 bg-ink/15 rounded-full" />
              </div>

              <div className="relative aspect-[5/4] bg-cream overflow-hidden">
                <Image
                  src={modal.image ?? lineImage}
                  alt={modal.name[loc]}
                  fill
                  sizes="512px"
                  className="object-contain p-8"
                />
                <button
                  onClick={() => setModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white border border-ink/10 hover:border-ink/30 rounded-full flex items-center justify-center text-ink text-sm transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: modal.color }} />
                  <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-ink/65">
                    {modal.flavor[loc]}
                  </span>
                </div>
              </div>

              <div className="px-7 pt-7 pb-8">
                <h2 className="display-section text-2xl md:text-3xl text-ink mb-6 leading-tight">
                  {modal.name[loc]}
                </h2>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 border-t border-ink/8 pt-5">
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink/40 mb-1.5">
                      {t('modal.weight')}
                    </dt>
                    <dd className="text-base font-medium text-ink tabular-nums">{modal.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink/40 mb-1.5">
                      {t('modal.packaging')}
                    </dt>
                    <dd className="text-base font-medium text-ink leading-snug">{modal.packaging[loc]}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink/40 mb-1.5">
                      {t('modal.flavor')}
                    </dt>
                    <dd className="text-base font-medium text-ink leading-snug flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: modal.color }} />
                      {modal.flavor[loc]}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/${locale}/contacts`}
                  className="group flex items-center justify-center gap-3 w-full bg-brand hover:bg-brand-dark text-white font-medium py-4 rounded-full text-[15px] transition-colors"
                  onClick={() => setModal(null)}
                >
                  {t('modal.cta')}
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
