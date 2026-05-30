import { z } from 'zod'
import { ApiError } from '@/lib/api/client'
import { GITHUB_USERNAME } from '@/lib/config'

/** Validated GitHub user profile (only the fields About uses). */
export const githubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.url(),
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
