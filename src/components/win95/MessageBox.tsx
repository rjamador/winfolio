import { Button95 } from './Button95'
import { Dialog } from './Dialog'
import { PixelIcon } from './PixelIcon'

type MessageBoxButton = 'ok' | 'cancel'

type MessageBoxProps = {
  open: boolean
  title: string
  message: string
  /** Glyph shown left of the message. Defaults to an info pixel icon. */
  icon?: React.ReactNode
  buttons?: MessageBoxButton[]
  onOk?: () => void
  onCancel?: () => void
  /** Called by Escape / the title-bar close button. Falls back to onCancel/onOk. */
  onClose?: () => void
}

/**
 * Convenience modal for errors/confirmations, composed from Dialog + Button95.
 */
export function MessageBox({
  open,
  title,
  message,
  icon = <PixelIcon name="info-circle" size={24} />,
  buttons = ['ok'],
  onOk,
  onCancel,
  onClose,
}: MessageBoxProps) {
  const handleClose = onClose ?? onCancel ?? onOk ?? (() => {})

  return (
    <Dialog
      open={open}
      title={title}
      onClose={handleClose}
      footer={
        <>
          {buttons.includes('ok') && (
            <Button95 variant="primary" onClick={onOk}>
              OK
            </Button95>
          )}
          {buttons.includes('cancel') && (
            <Button95 onClick={onCancel}>Cancel</Button95>
          )}
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-2xl leading-none">
          {icon}
        </span>
        <p className="flex-1">{message}</p>
      </div>
    </Dialog>
  )
}
