'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface NavLine {
  slug: string
  name: string
  color: string
  count: number
}

export default function CatalogNav({ lines }: { lines: NavLine[] }) {
  const [active, setActive] = useState<string>(lines[0]?.slug ?? '')

  useEffect(() => {
    const sections = lines
      .map(l => document.getElementById(l.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [lines])

  return (
    <nav className="sticky top-16 md:top-[72px] z-40 bg-white/85 backdrop-blur-md border-b border-ink/8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-7 md:gap-10 overflow-x-auto scrollbar-none py-3.5">
          {lines.map(line => {
            const isActive = active === line.slug
            return (
              <a
                key={line.slug}
                href={`#${line.slug}`}
                className="relative flex-shrink-0 flex items-center gap-2.5 text-[13px] py-2 transition-colors"
                style={{ color: isActive ? 'var(--color-ink)' : 'rgba(20,17,15,0.5)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform"
                  style={{
                    backgroundColor: line.color,
                    transform: isActive ? 'scale(1.4)' : 'scale(1)'
                  }}
                />
                <span className="font-medium tracking-wide">{line.name}</span>
                <span className="text-[11px] tabular-nums" style={{ color: 'rgba(20,17,15,0.35)' }}>
                  {String(line.count).padStart(2, '0')}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="catalog-nav-underline"
                    className="absolute left-0 right-0 -bottom-px h-px"
                    style={{ backgroundColor: line.color }}
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
