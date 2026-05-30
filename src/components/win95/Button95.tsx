import { clsx } from 'clsx'

type Button95Props = {
  children: React.ReactNode
  onClick?: () => void
  /** `primary` adds the classic extra dark outline of a default button. */
  variant?: 'default' | 'primary'
  disabled?: boolean
  type?: 'button' | 'submit'
  /** When false, the button doesn't show the sunken "pressed" look on click. */
  pressable?: boolean
  /** Tighter horizontal padding (e.g. for dense taskbar/icon-only buttons). */
  compact?: boolean
  className?: string
  'aria-label'?: string
  ref?: React.Ref<HTMLButtonElement>
}

/**
 * Win95 push button: raised bevel, sunken on press, dotted focus rectangle.
 * Built on a real `<button>` so click + keyboard (Enter/Space) work for free.
 */
export function Button95({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  type = 'button',
  pressable = true,
  compact = false,
  className,
  'aria-label': ariaLabel,
  ref,
}: Button95Props) {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'bevel-raised focus-ring bg-w95-bg py-0.5 leading-tight',
        compact ? 'px-1.5' : 'px-4',
        pressable
          ? 'active:pt-[3px] active:pb-px' // nudge label down when pressed
          : 'bevel-no-press',
        variant === 'primary' && 'outline outline-w95-text',
        disabled ? 'text-w95-shadow' : 'text-w95-text',
        className,
      )}
    >
      {children}
    </button>
  )
}
