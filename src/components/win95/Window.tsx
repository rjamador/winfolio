import { clsx } from 'clsx'
import { TitleBar } from './TitleBar'

type WindowProps = {
  title: string
  icon?: React.ReactNode
  active?: boolean
  children: React.ReactNode
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  className?: string
}

/**
 * A Win95 window: raised surface with a TitleBar and a scrollable content area.
 *
 * Static in Phase 2a — it just renders in normal flow. Phase 4 wraps this in
 * react-rnd for desktop drag/resize and switches to a full-bleed branch on
 * mobile (driven by useMediaQuery).
 */
export function Window({
  title,
  icon,
  active = true,
  children,
  onMinimize,
  onMaximize,
  onClose,
  className,
}: WindowProps) {
  // Phase 4: wrap the returned <section> in <Rnd> (desktop) and branch to a
  // full-bleed, non-draggable layout on small screens.
  return (
    <section className={clsx('bevel-raised flex flex-col bg-w95-bg p-0.5', className)}>
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
}
