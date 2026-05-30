import { clsx } from 'clsx'

type DesktopIconProps = {
  label: string
  /** Image, emoji, or SVG shown above the label. */
  icon: React.ReactNode
  onClick?: () => void
  onDoubleClick?: () => void
  selected?: boolean
}

/**
 * Clickable desktop shortcut: icon above label, selectable state.
 * Built on `<button>` so it is keyboard-activatable and accessible.
 */
export function DesktopIcon({
  label,
  icon,
  onClick,
  onDoubleClick,
  selected = false,
}: DesktopIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      aria-label={label}
      aria-pressed={selected}
      className={clsx(
        'focus-ring flex w-16 flex-col items-center gap-1 p-1 text-center',
        'text-w95 text-w95-light',
        selected && 'bg-w95-titlebar',
      )}
    >
      <span aria-hidden className="text-3xl leading-none">
        {icon}
      </span>
      <span
        className={clsx(
          'w-full break-words leading-tight',
          selected ? 'bg-w95-titlebar text-w95-light' : 'text-w95-light',
        )}
      >
        {label}
      </span>
    </button>
  )
}
