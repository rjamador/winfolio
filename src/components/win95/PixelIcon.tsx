import type { ComponentType, SVGProps } from 'react'
import { clsx } from 'clsx'
import { User } from 'pixelarticons/react/User'
import { Folder } from 'pixelarticons/react/Folder'
import { Terminal } from 'pixelarticons/react/Terminal'
import { Briefcase } from 'pixelarticons/react/Briefcase'
import { FileText } from 'pixelarticons/react/FileText'
import { Settings2 } from 'pixelarticons/react/Settings2'
import { Menu } from 'pixelarticons/react/Menu'
import { Star } from 'pixelarticons/react/Star'
import { GitBranch } from 'pixelarticons/react/GitBranch'
import { InfoBox } from 'pixelarticons/react/InfoBox'
import { SquareAlert } from 'pixelarticons/react/SquareAlert'
import { Close } from 'pixelarticons/react/Close'
import { Loader } from 'pixelarticons/react/Loader'
import { ExternalLink } from 'pixelarticons/react/ExternalLink'
import { Globe } from 'pixelarticons/react/Globe'
import { ArrowLeft } from 'pixelarticons/react/ArrowLeft'
import { ArrowRight } from 'pixelarticons/react/ArrowRight'
import { Reload } from 'pixelarticons/react/Reload'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic icon name → pixelarticons component (SVG, inherits currentColor). */
const ICONS: Record<string, IconComponent> = {
  user: User,
  folder: Folder,
  'laptop-code': Terminal,
  briefcase: Briefcase,
  clipboard: FileText,
  cog: Settings2,
  grid: Menu,
  star: Star,
  fork: GitBranch,
  'info-circle': InfoBox,
  'exclamation-triangle': SquareAlert,
  'octagon-times': Close,
  spinner: Loader,
  'external-link': ExternalLink,
  globe: Globe,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  reload: Reload,
}

type PixelIconProps = {
  /** Semantic icon name (see ICONS registry). */
  name: string
  /** Width/height in px. */
  size?: number
  className?: string
  spin?: boolean
}

/**
 * A pixel-art glyph from `pixelarticons` (SVG, inherits the current text color).
 * Decorative by default (`aria-hidden`); pair it with real text/labels.
 */
export function PixelIcon({ name, size = 16, className, spin = false }: PixelIconProps) {
  const Icon = ICONS[name] ?? InfoBox
  return (
    <Icon
      width={size}
      height={size}
      aria-hidden
      className={clsx('inline-block shrink-0', spin && 'animate-spin', className)}
    />
  )
}
