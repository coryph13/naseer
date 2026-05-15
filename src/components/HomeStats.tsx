'use client'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Stat {
  key: string
  value: string
  detail?: string
}

const stats: Stat[] = [
  { key: 'production', value: '60' },
  { key: 'lines', value: '5' },
  { key: 'delivery', value: '24ч' },
  { key: 'city', value: 'Tashkent' }
]

export default function HomeStats() {
  const t = useTranslations('home.stats')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink/10">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 py-10 md:py-14 flex flex-col gap-3"
        >
          <span
            className={`display-mono text-ink ${s.value.length > 4 ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl'}`}
          >
            {s.value}
          </span>
          <span className="text-sm text-ink/55 font-medium leading-snug max-w-[14ch]">
            {t(`${s.key}.label`)}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
