import { useEffect } from 'react'
import { useDismissableLayer } from '@/hooks/useDismissableLayer'

const MENU_ITEM_SELECTOR = '[role="menuitem"]'

/** Moves focus among a menu's `[role="menuitem"]` descendants (wraps at the ends). */
function moveItemFocus(panel: HTMLElement, delta: 1 | -1 | 'home' | 'end') {
  const items = Array.from(panel.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
  if (items.length === 0) return
  const current = items.indexOf(document.activeElement as HTMLElement)
  const next =
    delta === 'home' ? 0 : delta === 'end' ? items.length - 1 : (current + delta + items.length) % items.length
  items[next]?.focus()
}

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
  const panelRef = useDismissableLayer<HTMLDivElement>({
    onDismiss: onClose,
    ignoreRef: triggerRef,
    enabled: open,
  })

  // Opening the menu focuses its first item, matching the ARIA menu pattern.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR)?.focus()
  }, [open, panelRef])

  if (!open) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const panel = panelRef.current
    if (!panel) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveItemFocus(panel, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveItemFocus(panel, -1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      moveItemFocus(panel, 'home')
    } else if (e.key === 'End') {
      e.preventDefault()
      moveItemFocus(panel, 'end')
    }
  }

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Start menu"
      onKeyDown={handleKeyDown}
      className="bevel-raised flex w-full bg-w95-bg"
    >
      <div className="flex w-6 items-end justify-center bg-w95-titlebar pb-2">
        <span className="rotate-180 text-w95 font-bold text-w95-titlebar-text [writing-mode:vertical-rl]">
          {brand}
        </span>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col py-1">{children}</ul>
    </div>
  )
}
