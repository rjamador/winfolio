import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../api/fetchProjects'
import { projectKeys } from '../api/keys'
import type { Project } from '../api/schemas'

/** All portfolio projects (validated). */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  })
}

/**
 * A single project by id, read from the same cached list query — no extra
 * network round-trip (the GitHub API is unauthenticated and rate-limited).
 * Disabled until an id is provided.
 */
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    enabled: Boolean(id),
    select: (projects: Project[]) => projects.find((p) => p.id === id) ?? null,
  })
}
