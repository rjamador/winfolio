import { z } from 'zod'
import { ApiError } from '@/lib/api/client'
import { GITHUB_USERNAME } from '@/lib/config'

/** Validated GitHub user profile (only the fields About uses). */
export const githubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  // GitHub's avatar CDN serves whatever size is requested via `s=`; the API
  // returns a 460px original, but the avatar only ever renders at 60px.
  avatar_url: z.url().transform((url) => {
    const sized = new URL(url)
    sized.searchParams.set('s', '120') // 2x for retina at the 60px display size
    return sized.toString()
  }),
})

export type GithubUser = z.infer<typeof githubUserSchema>

/** Fetches the configured user's public GitHub profile (for the avatar). */
export async function fetchGithubUser(): Promise<GithubUser> {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}`

  let response: Response
  try {
    response = await fetch(url)
  } catch (cause) {
    throw new ApiError(`Network request failed: ${String(cause)}`)
  }
  if (!response.ok) {
    throw new ApiError('Could not load the GitHub profile.', response.status)
  }

  return githubUserSchema.parse(await response.json())
}
