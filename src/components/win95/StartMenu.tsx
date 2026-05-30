import { useEffect, useRef } from 'react'

type StartMenuProps = {
  open: boolean
  onClose: () => void
  /** Menu items (e.g. buttons/links). */
  children: React.ReactNode
  /** Text shown vertically on the navy side stripe. */
  brand?: string
  /**
   * The toggle button that opens this menu. Clicks on it are not treated as
   * "outside", so the trigger can close the menu itself without the
   * outside-click handler reopening it.
   */
  triggerRef?: React.RefObject<HTMLElement | null>
}

/**
 * The Start menu panel with the classic navy side stripe. Closes on Escape and
 * on outside click. Pure UI: it knows nothing about which sections exist —
 * callers pass items as children. Renders nothing while closed.
 */
export function StartMenu({
  open,
  onClose,
  children,
  brand = 'Winfolio',
  triggerRef,
}: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      const insidePanel = panelRef.current?.contains(target)
      const onTrigger = triggerRef?.current?.contains(target)
      if (!insidePanel && !onTrigger) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Start menu"
      className="bevel-raised flex w-full bg-w95-bg"
    >
      <div className="flex w-6 items-end justify-center bg-w95-titlebar pb-2">
        <span className="rotate-180 text-[11px] font-bold text-w95-titlebar-text [writing-mode:vertical-rl]">
          {brand}
        </span>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col py-1">{children}</ul>
    </div>
  )
}
