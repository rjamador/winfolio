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

/**
 * Modal dialog with a Win95 title bar, built on the native `<dialog>` element:
 * `showModal()`/`close()` give us the top-layer backdrop, focus trap, Escape
 * handling, and focus restore for free. `role="dialog"` + `aria-modal` are
 * kept explicit for older AT/browser combinations that don't infer them.
 */
export function Dialog({ open, title, onClose, children, footer }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openRef = useRef(open)
  const titleId = useId()
  const bodyId = useId()

  // Keep openRef in sync, and — declared first — ahead of the effect below in
  // the same commit's effect order, so it already reflects a caller-driven
  // close before that effect (possibly) synchronously fires "close" below.
  useEffect(() => {
    openRef.current = open
  }, [open])

  // Sync React's `open` prop to the imperative dialog API.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // The dialog can also close itself natively (Escape triggers the default
  // "cancel" action). Only forward that to `onClose` when we didn't already
  // initiate the close above (i.e. `open` was still true) — otherwise a
  // caller-driven close (e.g. an OK button setting `open` to false) would
  // fire `onClose` a second time.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => {
      if (openRef.current) onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className="bevel-raised m-auto min-w-64 max-w-md bg-w95-bg p-0.5 outline-none backdrop:bg-black/20"
    >
      <TitleBar title={title} titleId={titleId} onClose={() => dialogRef.current?.close()} />
      <div id={bodyId} className="px-3 py-4 text-w95">
        {children}
      </div>
      {footer && <div className="flex justify-center gap-2 px-3 pb-3">{footer}</div>}
    </dialog>
  )
}
