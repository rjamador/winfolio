import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useProject, useProjects } from '@/features/projects/hooks/useProjects'

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe('useProjects', () => {
  it('returns only allowlisted repos (forks/archived/non-allowlisted excluded)', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const ids = result.current.data!.map((p) => p.id)
    // random-side-project (not allowlisted), forked-lib (fork) and
    // Perfumeria (archived) are dropped; everything else survives.
    expect(ids).toEqual(
      expect.arrayContaining([
        'GymCheck',
        'old-portfolio',
        'oceanic-ui',
        'Coinflow',
        'winfolio',
        'Starpay',
      ]),
    )
    expect(ids).not.toEqual(
      expect.arrayContaining(['random-side-project', 'forked-lib', 'Perfumeria']),
    )
  })

  it('puts the curated picks first, in order, ahead of everyone else by stars', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const projects = result.current.data!
    // winfolio/oceanic-ui/Starpay/old-portfolio are curated (in that order),
    // regardless of stars; GymCheck(7) then Coinflow(1) follow by star count.
    expect(projects.map((p) => p.id)).toEqual([
      'winfolio',
      'oceanic-ui',
      'Starpay',
      'old-portfolio',
      'GymCheck',
      'Coinflow',
    ])
    expect(projects.filter((p) => p.featured).map((p) => p.id)).toEqual([
      'winfolio',
      'oceanic-ui',
      'Starpay',
      'old-portfolio',
    ])
    expect(projects.find((p) => p.id === 'GymCheck')!.featured).toBe(false)
  })

  it('merges curated extras (logo, npm, tech) onto the matching project', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const oceanic = result.current.data!.find((p) => p.id === 'oceanic-ui')!
    expect(oceanic.image).toMatch(/logo\.png$/)
    expect(oceanic.npmUrl).toBe('https://www.npmjs.com/package/oceanic-ui')
    // Language + repo topics + curated tech, de-duped.
    expect(oceanic.tech).toEqual(
      expect.arrayContaining(['TypeScript', 'react', 'component-library', 'React']),
    )
  })
})

describe('useProject', () => {
  it('returns the matching project for a known id', async () => {
    const { result } = renderHook(() => useProject('old-portfolio'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('old-portfolio')
  })

  it('returns null for an unknown id', async () => {
    const { result } = renderHook(() => useProject('does-not-exist'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeNull()
  })

  it('stays disabled when no id is given', () => {
    const { result } = renderHook(() => useProject(undefined), {
      wrapper: makeWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
