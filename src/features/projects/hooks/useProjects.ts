import { useQuery } from '@tanstack/react-query'
import { fetchProject, fetchProjects } from '../api/fetchProjects'
import { projectKeys } from '../api/keys'

/** All portfolio projects (validated). */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  })
}

/** A single project by id. Disabled until an id is provided. */
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => fetchProject(id!),
    enabled: Boolean(id),
  })
}
