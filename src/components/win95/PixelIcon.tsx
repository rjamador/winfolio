import { clsx } from 'clsx'

type PixelIconProps = {
  /** Icon name without the `hn-` prefix, e.g. "folder", "user", "cog". */
  name: string
  /** Font size in px (icons are a font glyph). */
  size?: number
  className?: string
  spin?: boolean
}

/**
 * A pixelated glyph from the HackerNoon Pixel Icon Library (icon font).
 * Decorative by default (`aria-hidden`); pair it with real text/labels.
 */
export function PixelIcon({ name, size = 16, className, spin = false }: PixelIconProps) {
  return (
    <i
      aria-hidden
      className={clsx('hn', `hn-${name}`, spin && 'animate-spin', className)}
      style={{ fontSize: size, lineHeight: 1 }}
    />
  )
}
