import { env } from '@/lib/env'

/** Normalized API error so callers/UI can show a consistent themed message. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Minimal GET wrapper for a real API/CMS. Not used by the hybrid local-data path
 * yet — it is the seam Phase 10 plugs into once `VITE_API_BASE_URL` is set.
 */
export async function apiGet<T>(path: string): Promise<T> {
  const baseUrl = env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new ApiError('No API base URL configured (VITE_API_BASE_URL).')
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`)
  } catch (cause) {
    throw new ApiError(`Network request failed for ${path}: ${String(cause)}`)
  }

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed.`, response.status)
  }

  return (await response.json()) as T
}
