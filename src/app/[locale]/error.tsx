'use client'

import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()
  const t = useTranslations('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div id="main" tabIndex={-1} className="min-h-screen bg-white overflow-x-hidden flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="w-8 h-px bg-brand" />
          <span className="eyebrow text-brand">{t('errorEyebrow')}</span>
          <span className="w-8 h-px bg-brand" />
        </div>

        <h1 className="display-section text-4xl md:text-6xl lg:text-7xl text-ink mb-8 leading-[1.05]">
          {t('errorTitle')}
        </h1>

        <p className="body-lead max-w-md mx-auto mb-12">
          {t('errorBody')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 bg-ink text-white font-medium text-[15px] pl-6 pr-5 py-3.5 rounded-full hover:bg-brand transition-colors group"
          >
            {t('errorCtaRetry')}
            <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:rotate-180 duration-500">
              ↻
            </span>
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-ink/70 hover:text-ink font-medium text-[15px] px-4 py-3.5 transition-colors"
          >
            {t('errorCtaHome')}
            <span className="text-xs">→</span>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-16 text-xs text-ink/30 font-mono tracking-wider">
            ref · {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
