import { clsx } from 'clsx'

/** Semantic icon name → desktop icon artwork (32x32 source). */
const SOURCES: Record<string, string> = {
  user: '/icons/user.png',
  folder: '/icons/folder.png',
  'laptop-code': '/icons/laptop-code.png',
  briefcase: '/icons/briefcase.png',
  clipboard: '/icons/clipboard.png',
  globe: '/icons/globe.png',
  trash: '/icons/trash.png',
  cog: '/icons/cog.png',
}

type DesktopIconArtProps = {
  /** Semantic icon name (see SOURCES registry). */
  name: string
  /** Width/height in px. */
  size?: number
  className?: string
}

/**
 * A full-color desktop icon. Sized for desktop icons (32px+) — this art
 * doesn't hold up at taskbar/title-bar sizes, so keep using `PixelIcon` there.
 */
export function DesktopIconArt({ name, size = 32, className }: DesktopIconArtProps) {
  const src = SOURCES[name]
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={clsx('shrink-0', className)}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
