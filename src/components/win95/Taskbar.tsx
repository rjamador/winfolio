import { clsx } from 'clsx'
import { Button95 } from './Button95'

type TaskbarProps = {
  /** Open-window buttons (or any taskbar items) rendered between Start and clock. */
  children?: React.ReactNode
  onStartClick?: () => void
  /** Whether the Start menu is open, for the pressed Start-button look. */
  startActive?: boolean
  /** Forwarded to the Start button so a StartMenu can exclude it from outside-click. */
  startButtonRef?: React.Ref<HTMLButtonElement>
  /** Clock/tray node; Phase 3 supplies a live clock. */
  clock?: React.ReactNode
}

/**
 * Fixed bottom taskbar: Start button, open-window buttons, and a clock tray.
 * Presentational only — the live clock and window list are wired in Phase 3.
 */
export function Taskbar({
  children,
  onStartClick,
  startActive,
  startButtonRef,
  clock,
}: TaskbarProps) {
  return (
    <footer className="bevel-raised flex h-[var(--taskbar-height)] w-full items-center gap-1 bg-w95-bg px-0.5">
      <Button95
        ref={startButtonRef}
        onClick={onStartClick}
        aria-label="Start"
        className={clsx('font-bold', startActive && 'bevel-sunken')}
      >
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="inline-block h-3 w-3 bg-w95-titlebar" />
          Start
        </span>
      </Button95>

      <div className="flex flex-1 items-center gap-1 overflow-x-auto">{children}</div>

      {clock != null && (
        <div className="bevel-sunken px-2 py-0.5 text-[11px] tabular-nums">{clock}</div>
      )}
    </footer>
  )
}
