import { z } from 'zod'

/**
 * Raw GitHub repository, validated down to the fields we use. Zod strips the
 * many other fields the API returns.
 */
export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable(),
  language: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  html_url: z.url(),
  homepage: z.string().nullable().default(null),
  stargazers_count: z.number().int(),
  forks_count: z.number().int(),
  fork: z.boolean(),
  archived: z.boolean(),
  updated_at: z.string(),
})

export type GithubRepo = z.infer<typeof githubRepoSchema>

export const githubRepoListSchema = z.array(githubRepoSchema)

/** Internal, view-friendly project shape (the `id` is the repo name). */
export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  tech: z.array(z.string()),
  url: z.url().optional(),
  repoUrl: z.url(),
  stars: z.number().int(),
  forks: z.number().int(),
  language: z.string().nullable(),
  featured: z.boolean().default(false),
  year: z.number().int(),
})

export type Project = z.infer<typeof projectSchema>

/** Maps a validated GitHub repo to the internal Project shape (no `featured`). */
export function mapRepoToProject(repo: GithubRepo): Project {
  // Dedupe language + topics into a single tech list.
  const tech = [...new Set([repo.language, ...repo.topics].filter((t): t is string => Boolean(t)))]

  // homepage may be empty or not a URL; only keep a valid one.
  const homepage = repo.homepage?.trim()
  const url = homepage && z.url().safeParse(homepage).success ? homepage : undefined

  return {
    id: repo.name,
    title: repo.name,
    description: repo.description ?? '',
    tech,
    url,
    repoUrl: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    featured: false,
    year: new Date(repo.updated_at).getFullYear(),
  }
}
