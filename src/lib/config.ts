export const GITHUB_USERNAME = 'rjamador'

const RESUME_FILE_ID = '1mJrdO_UcnYVtZuyoTzntinpK63TdIqqh'
export const RESUME_PREVIEW_URL = `https://drive.google.com/file/d/${RESUME_FILE_ID}/preview`
export const RESUME_VIEW_URL = `https://drive.google.com/file/d/${RESUME_FILE_ID}/view`
/** Google Drive responds with Content-Disposition: attachment, so this triggers a download rather than opening the viewer. */
export const RESUME_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${RESUME_FILE_ID}`
