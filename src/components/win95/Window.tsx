import { clsx } from 'clsx'
import { Rnd } from 'react-rnd'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { TitleBar } from './TitleBar'

type WindowProps = {
  title: string
  icon?: React.ReactNode
  active?: boolean
  children: React.ReactNode
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  onFocus?: () => void
  className?: string
  /** Enables react-rnd drag/resize on desktop. Requires position props. */
  draggable?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  zIndex?: number
  minWidth?: number
  minHeight?: number
  /** react-rnd movement bounds; defaults to the positioned parent. */
  bounds?: string
  onDragStop?: (x: number, y: number) => void
  onResizeStop?: (width: number, height: number, x: number, y: number) => void
}

const MIN_WIDTH = 240
const MIN_HEIGHT = 120
const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * A Win95 window: raised surface with a TitleBar and a scrollable content area.
 *
 * On desktop (≥1024px), when `draggable` is set with position props, it is
 * draggable (by the title bar) and resizable via react-rnd. On smaller screens
 * — or when not draggable — it renders full-bleed in normal flow.
 */
export function Window({
  title,
  icon,
  active = true,
  children,
  onMinimize,
  onMaximize,
  onClose,
  onFocus,
  className,
  draggable = false,
  x = 0,
  y = 0,
  width,
  height,
  zIndex,
  minWidth = MIN_WIDTH,
  minHeight = MIN_HEIGHT,
  bounds = 'parent',
  onDragStop,
  onResizeStop,
}: WindowProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const floats = draggable && isDesktop

  const surface = (
    <section
      onMouseDown={onFocus}
      className={clsx(
        'bevel-raised flex flex-col bg-w95-bg p-0.5',
        floats ? 'h-full w-full' : 'w-full',
        className,
      )}
    >
      <TitleBar
        title={title}
        icon={icon}
        active={active}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
      <div className="win95-scroll flex-1 overflow-auto p-2 text-[11px]">
        {children}
      </div>
    </section>
  )

  if (!floats) return surface

  return (
    <Rnd
      className="win95-window-rnd"
      bounds={bounds}
      dragHandleClassName="win95-titlebar"
      position={{ x, y }}
      size={{ width: width ?? minWidth, height: height ?? minHeight }}
      minWidth={minWidth}
      minHeight={minHeight}
      style={{ zIndex }}
      onDragStop={(_e, d) => onDragStop?.(d.x, d.y)}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onResizeStop?.(ref.offsetWidth, ref.offsetHeight, pos.x, pos.y)
      }
    >
      {surface}
    </Rnd>
  )
}
