import { clsx } from 'clsx'

type Button95Common = {
  children: React.ReactNode
  /** `primary` adds the classic extra dark outline of a default button. */
  variant?: 'default' | 'primary'
  disabled?: boolean
  /** When false, the button doesn't show the sunken "pressed" look on click. */
  pressable?: boolean
  /** Tighter horizontal padding (e.g. for dense taskbar/icon-only buttons). */
  compact?: boolean
  className?: string
  'aria-label'?: string
}

type Button95AsButton = Button95Common & {
  href?: undefined
  onClick?: () => void
  type?: 'button' | 'submit'
  ref?: React.Ref<HTMLButtonElement>
}

type Button95AsLink = Button95Common & {
  /**
   * Renders a real `<a>` instead of a `<button>` — use this for navigation or
   * a file download (e.g. "Download CV"), not for in-app actions, so
   * right-click "save link as", middle-click, and Ctrl+click all keep working.
   */
  href: string
  target?: string
  rel?: string
  download?: boolean | string
  ref?: React.Ref<HTMLAnchorElement>
}

type Button95Props = Button95AsButton | Button95AsLink

/**
 * Win95 push button: raised bevel, sunken on press, dotted focus rectangle.
 * Built on a real `<button>` (or, with `href`, a real `<a>`) so click +
 * keyboard (Enter/Space) work for free.
 */
export function Button95(props: Button95Props) {
  const {
    children,
    variant = 'default',
    disabled = false,
    pressable = true,
    compact = false,
    className,
    'aria-label': ariaLabel,
  } = props

  const sharedClassName = clsx(
    'bevel-raised focus-ring bg-w95-bg py-0.5 leading-tight',
    compact ? 'px-1.5' : 'px-4',
    pressable
      ? 'active:pt-[3px] active:pb-px' // nudge label down when pressed
      : 'bevel-no-press',
    variant === 'primary' && 'outline outline-w95-text',
    disabled ? 'text-w95-shadow' : 'text-w95-text',
    className,
  )

  if (props.href !== undefined) {
    const { href, target, rel, download, ref } = props
    return (
      <a
        ref={ref}
        // A disabled link has no real "not interactive" state, so drop href
        // (making it unfocusable/inert, like a disabled button) instead.
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={sharedClassName}
      >
        {children}
      </a>
    )
  }

  const { onClick, type = 'button', ref } = props
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={sharedClassName}
    >
      {children}
    </button>
  )
}
