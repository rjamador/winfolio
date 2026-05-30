import { clsx } from 'clsx'

type TitleBarProps = {
  title: string
  /** id applied to the title text, so a Dialog can label itself by it. */
  titleId?: string
  /** Optional pixel icon shown left of the title. */
  icon?: React.ReactNode
  /** Active windows get the navy→blue gradient; inactive get flat gray. */
  active?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

/**
 * Window title bar: gradient (or inactive gray) strip with the title and the
 * minimize/maximize/close cluster. The `win95-titlebar` class is the stable
 * drag handle that Phase 4's react-rnd will target. Control handlers stop
 * propagation so a future drag isn't initiated by clicking a button.
 */
export function TitleBar({
  title,
  titleId,
  icon,
  active = true,
  onMinimize,
  onMaximize,
  onClose,
}: TitleBarProps) {
  return (
    <div
      className={clsx(
        'titlebar win95-titlebar h-[18px] select-none gap-1 px-0.5',
        !active && 'titlebar--inactive',
      )}
    >
      {icon && <span className="flex h-4 w-4 items-center">{icon}</span>}
      <span id={titleId} className="flex-1 truncate px-1 text-w95 font-bold">
        {title}
      </span>

      <div className="flex items-center gap-0.5">
        {onMinimize && (
          <TitleBarButton label="Minimize" onClick={onMinimize}>
            <span aria-hidden className="block h-px w-2 bg-w95-text" />
          </TitleBarButton>
        )}
        {onMaximize && (
          <TitleBarButton label="Maximize" onClick={onMaximize}>
            <span
              aria-hidden
              className="block h-2 w-2 border border-t-2 border-w95-text"
            />
          </TitleBarButton>
        )}
        {onClose && (
          <TitleBarButton label="Close" onClick={onClose}>
            <span aria-hidden className="text-[10px] font-bold leading-none">
              ✕
            </span>
          </TitleBarButton>
        )}
      </div>
    </div>
  )
}

type TitleBarButtonProps = {
  label: string
  onClick: () => void
  children: React.ReactNode
}

/** Small raised control button; stops propagation to protect future dragging. */
function TitleBarButton({ label, onClick, children }: TitleBarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="bevel-raised focus-ring flex h-4 w-4 items-center justify-center bg-w95-bg p-0 text-w95-text"
    >
      {children}
    </button>
  )
}
