import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { ProgressBar } from '@/components/win95'
import { useT } from '@/i18n'

const DEFAULT_DURATION_MS = 1800
const STEP_MS = 90
const FADE_MS = 350

type BootScreenProps = {
  onDone: () => void
  /** How long the progress bar takes to fill (ms). */
  durationMs?: number
}

/**
 * Win95-style boot splash shown on every visit: a progress bar fills, then the
 * screen fades to reveal the desktop. Honors `prefers-reduced-motion`.
 */
export function BootScreen({ onDone, durationMs = DEFAULT_DURATION_MS }: BootScreenProps) {
  const { t } = useT()
  const [progress, setProgress] = useState(0)
  const leaving = progress >= 100

  // Advance the progress bar (setState in the interval callback is fine).
  useEffect(() => {
    const step = Math.ceil(100 / Math.max(1, durationMs / STEP_MS))
    const id = setInterval(
      () => setProgress((p) => (p >= 100 ? p : Math.min(100, p + step))),
      STEP_MS,
    )
    return () => clearInterval(id)
  }, [durationMs])

  // Once full, fade out then finish (immediately if reduced-motion).
  useEffect(() => {
    if (progress < 100) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = setTimeout(onDone, reduce ? 0 : FADE_MS)
    return () => clearTimeout(id)
  }, [progress, onDone])

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-w95-desktop transition-opacity duration-300',
        leaving && 'pointer-events-none opacity-0',
      )}
    >
      <div className="bevel-raised flex w-72 max-w-[90vw] flex-col gap-3 bg-w95-bg p-4">
        <div className="titlebar h-[18px] select-none px-1">
          <span className="text-w95 font-bold">Winfolio</span>
        </div>
        <p className="text-w95-lg font-bold">Winfolio 95</p>
        <p className="text-w95">{t('boot.starting')}</p>
        <ProgressBar value={progress} label={t('boot.starting')} />
      </div>
    </div>
  )
}
