import { ExternalLink } from '@/components/win95'
import { RESUME_PREVIEW_URL, RESUME_VIEW_URL } from '@/lib/config'
import { useT } from '@/i18n'

/**
 * Résumé section: embeds the public Google Drive PDF preview (no Google login
 * needed when the file is shared "anyone with the link") plus an external link.
 */
export function ResumeWindow() {
  const { t } = useT()
  return (
    <div className="flex h-full min-h-72 flex-col gap-2 text-w95">
      <iframe
        title="Résumé (PDF)"
        src={RESUME_PREVIEW_URL}
        className="bevel-sunken min-h-64 w-full flex-1 bg-w95-light"
      />
      <ExternalLink href={RESUME_VIEW_URL} className="self-start">
        {t('resume.open')}
      </ExternalLink>
    </div>
  )
}
