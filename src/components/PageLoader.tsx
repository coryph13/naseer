'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Logo from './Logo'

const SESSION_KEY = 'naseer_loaded'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [duration, setDuration] = useState(2200)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false)
      return
    }
    sessionStorage.setItem(SESSION_KEY, '1')
    const d = reduce ? 500 : 2200
    setDuration(d)
    const t = setTimeout(() => setVisible(false), d)
    return () => clearTimeout(t)
  }, [reduce])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden grain text-white"
          style={{ backgroundColor: '#8f1538' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0.25 : 0.6, ease: [0.4, 0, 0.2, 1] } }}
        >
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 520,
              height: 520,
              background: 'radial-gradient(circle, rgba(245,188,68,0.22) 0%, transparent 70%)',
              filter: 'blur(56px)'
            }}
            animate={reduce ? undefined : { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={reduce ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo className="w-[240px] md:w-[280px] h-auto" />

            <motion.div
              className="mt-7 flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white/70"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>Confectionery</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Tashkent</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>2018</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-0 left-0 h-px"
            style={{ background: '#f5bc44' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: (duration - 200) / 1000, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
