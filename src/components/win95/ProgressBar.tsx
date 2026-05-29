type ProgressBarProps = {
  /** 0–100 */
  value: number
  label?: string
}

const SEGMENTS = 20

/** Win95 segmented progress bar with discrete blue blocks. */
export function ProgressBar({ value, label }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const filledSegments = Math.round((clampedValue / 100) * SEGMENTS)

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="bevel-sunken flex h-5 gap-px bg-w95-bg p-px"
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <div
          key={i}
          className={
            i < filledSegments
              ? 'flex-1 bg-w95-titlebar'
              : 'flex-1 bg-transparent'
          }
        />
      ))}
    </div>
  )
}
