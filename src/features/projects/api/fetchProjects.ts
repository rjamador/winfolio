import { projectListSchema, type Project } from './schemas'
import { projects } from './projects.data'

/**
 * Returns the validated project list.
 *
 * Hybrid: serves local data now. Phase 10 replaces the source with
 * `apiGet('/projects')` from '@/lib/api/client' — the Zod parse stays here, so
 * the returned data is always typed and trusted regardless of source.
 */
export async function fetchProjects(): Promise<Project[]> {
  // Phase 10: const raw = await apiGet('/projects')
  const raw = projects
  return projectListSchema.parse(raw)
}

/** Returns a single project by id, or null if not found. */
export async function fetchProject(id: string): Promise<Project | null> {
  const all = await fetchProjects()
  return all.find((p) => p.id === id) ?? null
}
