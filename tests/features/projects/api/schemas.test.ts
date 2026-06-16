import { githubRepoSchema, mapRepoToProject } from './schemas'

const rawRepo = {
  id: 1,
  name: 'winfolio',
  description: 'A retro portfolio.',
  language: 'TypeScript',
  topics: ['react', 'vite'],
  html_url: 'https://github.com/rjamador/winfolio',
  homepage: 'https://winfolio.example.com',
  stargazers_count: 42,
  forks_count: 5,
  fork: false,
  archived: false,
  updated_at: '2026-05-01T12:00:00Z',
}

describe('githubRepoSchema', () => {
  it('parses a valid repo', () => {
    expect(() => githubRepoSchema.parse(rawRepo)).not.toThrow()
  })

  it('accepts null description/language/homepage', () => {
    const parsed = githubRepoSchema.parse({
      ...rawRepo,
      description: null,
      language: null,
      homepage: null,
    })
    expect(parsed.description).toBeNull()
  })

  it('rejects a missing required field (name)', () => {
    const { name, ...withoutName } = rawRepo
    void name
    expect(() => githubRepoSchema.parse(withoutName)).toThrow()
  })

  it('rejects a malformed html_url', () => {
    expect(() => githubRepoSchema.parse({ ...rawRepo, html_url: 'nope' })).toThrow()
  })
})

describe('mapRepoToProject', () => {
  it('maps GitHub fields to the internal project shape', () => {
    const project = mapRepoToProject(githubRepoSchema.parse(rawRepo))
    expect(project).toMatchObject({
      id: 'winfolio',
      title: 'winfolio',
      description: 'A retro portfolio.',
      tech: ['TypeScript', 'react', 'vite'],
      url: 'https://winfolio.example.com',
      repoUrl: 'https://github.com/rjamador/winfolio',
      stars: 42,
      forks: 5,
      language: 'TypeScript',
      featured: false,
      year: 2026,
    })
  })

  it('drops an empty/invalid homepage', () => {
    const project = mapRepoToProject(
      githubRepoSchema.parse({ ...rawRepo, homepage: '' }),
    )
    expect(project.url).toBeUndefined()
  })

  it('falls back to an empty description and language-less tech', () => {
    const project = mapRepoToProject(
      githubRepoSchema.parse({
        ...rawRepo,
        description: null,
        language: null,
        topics: [],
      }),
    )
    expect(project.description).toBe('')
    expect(project.tech).toEqual([])
  })
})
