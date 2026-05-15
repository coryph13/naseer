'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const cards = [
  {
    src: '/products/lollis/lollipop-drum-160.jpg',
    color: '#f5bc44',
    label: 'Lollis',
    style: { top: '6%', left: '8%', width: '46%', rotate: -6, z: 2 }
  },
  {
    src: '/products/choco-cone/all-615.jpg',
    color: '#906a54',
    label: 'Choco Cone',
    style: { top: '32%', left: '38%', width: '54%', rotate: 4, z: 4 }
  },
  {
    src: '/products/bamboonee/strawberry-110.jpg',
    color: '#dbafd0',
    label: 'Bamboonee',
    style: { top: '60%', left: '4%', width: '38%', rotate: 8, z: 3 }
  },
  {
    src: '/products/toffical/mint-320.jpg',
    color: '#90cc8d',
    label: 'Toffical',
    style: { top: '2%', left: '60%', width: '34%', rotate: 9, z: 1 }
  }
] as const

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y0 = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -60])
  const y1 = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -40])
  const y3 = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -90])
  const ys = [y0, y1, y2, y3]

  return (
    <div ref={ref} className="relative w-full aspect-[4/5] lg:aspect-[5/6]">
      <motion.div
        aria-hidden
        className="absolute -top-12 -right-16 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,188,68,0.32), transparent 70%)' }}
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 -left-12 w-80 h-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(143,21,56,0.18), transparent 70%)' }}
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {cards.map((card, i) => (
        <motion.div
          key={card.src}
          className="absolute"
          style={{
            top: card.style.top,
            left: card.style.left,
            width: card.style.width,
            zIndex: card.style.z,
            y: ys[i]
          }}
          initial={{ opacity: 0, y: 30, rotate: card.style.rotate - 3 }}
          animate={{ opacity: 1, y: 0, rotate: card.style.rotate }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.04, rotate: card.style.rotate * 0.5 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(20,17,15,0.35)] ring-1 ring-black/5"
            style={{ backgroundColor: card.color + '18' }}
          >
            <Image
              src={card.src}
              alt={card.label}
              fill
              sizes="(max-width: 1024px) 50vw, 30vw"
              className="object-cover"
              priority={i < 2}
            />
            <div
              className="absolute inset-0 mix-blend-overlay opacity-40"
              style={{ background: `linear-gradient(150deg, ${card.color}66 0%, transparent 70%)` }}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-white/90 backdrop-blur rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.color }} />
              <span className="text-[10px] font-semibold tracking-wide text-ink/80">{card.label}</span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
