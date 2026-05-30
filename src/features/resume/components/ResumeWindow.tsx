const FILE_ID = '1mJrdO_UcnYVtZuyoTzntinpK63TdIqqh'
const PREVIEW_URL = `https://drive.google.com/file/d/${FILE_ID}/preview`
const VIEW_URL = `https://drive.google.com/file/d/${FILE_ID}/view`

/**
 * Résumé section: embeds the public Google Drive PDF preview (no Google login
 * needed when the file is shared "anyone with the link") plus an external link.
 */
export function ResumeWindow() {
  return (
    <div className="flex h-full min-h-72 flex-col gap-2 text-w95">
      <iframe
        title="Résumé (PDF)"
        src={PREVIEW_URL}
        className="bevel-sunken min-h-64 w-full flex-1 bg-w95-light"
      />
      <a
        href={VIEW_URL}
        target="_blank"
        rel="noreferrer"
        className="focus-ring self-start text-w95-titlebar underline"
      >
        Open in Google Drive ↗
      </a>
    </div>
  )
}
