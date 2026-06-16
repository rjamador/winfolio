import { useState } from 'react'
import { Button95, PixelIcon } from '@/components/win95'
import { useT } from '@/i18n'

const SITE_URL = 'https://ramador.vercel.app/'

/**
 * A faux Win95 web browser that embeds the previous portfolio.
 */
export function OldPortfolioWindow() {
  const { t } = useT()
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)

  const handleReload = () => {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <div className="flex h-full min-h-72 flex-col gap-1 text-w95">
      <div className="flex items-center gap-1">
        <Button95 compact disabled aria-label={t('oldPortfolio.back')}>
          <PixelIcon name="arrow-left" />
        </Button95>
        <Button95 compact disabled aria-label={t('oldPortfolio.forward')}>
          <PixelIcon name="arrow-right" />
        </Button95>
        <Button95 compact aria-label={t('oldPortfolio.reload')} onClick={handleReload}>
          <PixelIcon name="reload" />
        </Button95>
        <div className="bevel-sunken flex min-w-0 flex-1 items-center gap-1 bg-w95-light px-1 py-0.5">
          <PixelIcon name="globe" />
          <span className="truncate text-w95-text">{SITE_URL}</span>
        </div>
      </div>

      <div className="bevel-sunken relative min-h-64 flex-1 bg-w95-light">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-w95-bg"
            aria-live="polite"
          >
            <PixelIcon name="spinner" spin />
            <span>{t('oldPortfolio.loading')}</span>
          </div>
        )}
        <iframe
          key={reloadKey}
          title={t('oldPortfolio.frameTitle')}
          src={SITE_URL}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="h-full w-full"
        />
      </div>

      <a
        href={SITE_URL}
        target="_blank"
        rel="noreferrer"
        className="focus-ring self-start text-w95-titlebar underline"
      >
        {t('oldPortfolio.openExternal')}
      </a>
    </div>
  )
}
