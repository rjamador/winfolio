import { useQuery } from '@tanstack/react-query'
import { env } from '@/lib/env'
import { fetchGithubUser } from '../api/githubUser'

/** The configured user's GitHub profile (used for the About avatar). */
export function useGithubUser() {
  return useQuery({
    queryKey: ['github-user', env.VITE_GITHUB_USERNAME],
    queryFn: fetchGithubUser,
  })
}
