import { useNavigate } from 'react-router-dom'
import { Button95, PixelIcon } from '@/components/win95'
import { useT } from '@/i18n'

/** Themed 404 shown for unknown paths, centered over the desktop. */
export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <div className="absolute inset-0 z-[900] flex items-center justify-center p-4">
      <div
        role="alertdialog"
        aria-labelledby="notfound-title"
        aria-describedby="notfound-body"
        className="bevel-raised w-80 max-w-full bg-w95-bg p-0.5"
      >
        <div className="titlebar h-[18px] select-none px-1">
          <span id="notfound-title" className="text-w95 font-bold">
            {t('notFound.title')}
          </span>
        </div>
        <div id="notfound-body" className="flex items-start gap-3 px-3 py-4 text-w95">
          <PixelIcon name="exclamation-triangle" size={24} />
          <p className="flex-1">{t('notFound.message')}</p>
        </div>
        <div className="flex justify-center pb-3">
          <Button95 variant="primary" onClick={() => navigate('/')}>
            {t('common.ok')}
          </Button95>
        </div>
      </div>
    </div>
  )
}
