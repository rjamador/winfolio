import { useQuery } from '@tanstack/react-query'
import { GITHUB_USERNAME } from '@/lib/config'
import { fetchGithubUser } from '../api/githubUser'

/** The configured user's GitHub profile (used for the About avatar). */
export function useGithubUser() {
  return useQuery({
    queryKey: ['github-user', GITHUB_USERNAME],
    queryFn: fetchGithubUser,
  })
}
