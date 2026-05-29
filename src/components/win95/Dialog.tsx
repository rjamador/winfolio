import { useEffect, useId, useRef } from 'react'
import { TitleBar } from './TitleBar'

type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  /** Footer area, typically the OK/Cancel buttons. */
  footer?: React.ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal dialog with a Win95 title bar. `role="dialog"` + `aria-modal`,
 * labelled by its title, Escape to close, focus trapped while open, and focus
 * restored to the previously focused element on close. Renders nothing while
 * closed.
 */
export function Dialog({ open, title, onClose, children, footer }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into the dialog (first focusable, else the panel itself).
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    ;(focusables && focusables.length > 0 ? focusables[0] : panelRef.current)?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]!
      const last = items[items.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className="bevel-raised min-w-64 max-w-md bg-w95-bg p-0.5 outline-none"
      >
        <TitleBar title={title} titleId={titleId} onClose={onClose} />
        <div id={bodyId} className="px-3 py-4 text-[11px]">
          {children}
        </div>
        {footer && (
          <div className="flex justify-center gap-2 px-3 pb-3">{footer}</div>
        )}
      </div>
    </div>
  )
}
