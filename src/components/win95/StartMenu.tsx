import { useEffect, useRef } from 'react'

type StartMenuProps = {
  open: boolean
  onClose: () => void
  /** Menu items (e.g. buttons/links). */
  children: React.ReactNode
  /** Text shown vertically on the navy side stripe. */
  brand?: string
}

/**
 * The Start menu panel with the classic navy side stripe. Closes on Escape and
 * on outside click. Pure UI: it knows nothing about which sections exist —
 * callers pass items as children. Renders nothing while closed.
 */
export function StartMenu({ open, onClose, children, brand = 'Winfolio' }: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Use capture so the Start button's own toggle still works predictably.
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Start menu"
      className="bevel-raised flex bg-w95-bg"
    >
      <div className="flex w-6 items-end justify-center bg-w95-titlebar pb-2">
        <span className="rotate-180 text-[11px] font-bold text-w95-titlebar-text [writing-mode:vertical-rl]">
          {brand}
        </span>
      </div>
      <ul className="flex min-w-40 flex-col py-1">{children}</ul>
    </div>
  )
}
