import { ApiError } from '@/lib/api/client'
import { GITHUB_USERNAME } from '@/lib/config'
import {
  githubRepoListSchema,
  mapRepoToProject,
  type Project,
} from './schemas'

const FEATURED_COUNT = 3

/** Only these repos (by exact `name`) are surfaced in the Projects window. */
const PROJECT_ALLOWLIST = new Set([
  'Coinflow',
  'Starpay',
  'GymCheck',
  'Perfumeria',
  'GestorCitas',
  'portfolio',
  'Programatic',
  'ClinicaAsp',
])

/**
 * Fetches the user's public GitHub repos, validates them, and maps them to the
 * internal Project shape: forks/archived are dropped, the list is sorted by stars
 * (then most-recently-updated), and the top-starred few are flagged `featured`.
 */
export async function fetchProjects(): Promise<Project[]> {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`

  let response: Response
  try {
    response = await fetch(url)
  } catch (cause) {
    throw new ApiError(`Network request failed: ${String(cause)}`)
  }
  if (!response.ok) {
    throw new ApiError('Could not load repositories from GitHub.', response.status)
  }

  const repos = githubRepoListSchema.parse(await response.json())

  // The API already returns repos sorted by `updated` desc; a stable sort by
  // stars desc therefore keeps the most-recent order within equal star counts.
  const projects = repos
    .filter((repo) => !repo.fork && !repo.archived && PROJECT_ALLOWLIST.has(repo.name))
    .map(mapRepoToProject)
    .sort((a, b) => b.stars - a.stars)

  // Flag the top-starred projects (with at least one star) as featured.
  projects.forEach((project, index) => {
    project.featured = index < FEATURED_COUNT && project.stars > 0
  })

  return projects
}

/** Returns a single project by id (repo name), or null if not found. */
export async function fetchProject(id: string): Promise<Project | null> {
  const all = await fetchProjects()
  return all.find((p) => p.id === id) ?? null
}
