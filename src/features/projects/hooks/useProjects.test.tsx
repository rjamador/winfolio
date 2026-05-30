import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useProject, useProjects } from './useProjects'

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe('useProjects', () => {
  it('returns mapped repos with forks/archived excluded, sorted by stars', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const projects = result.current.data!
    // 3 of the 5 fixture repos remain (forked-lib + old-archived filtered out).
    expect(projects.map((p) => p.id)).toEqual(['winfolio', 'pixel-paint', 'task-tray'])
    // Sorted by stars desc.
    expect(projects[0]!.stars).toBe(42)
    // Top-starred is featured.
    expect(projects[0]!.featured).toBe(true)
  })
})

describe('useProject', () => {
  it('returns the matching project for a known id', async () => {
    const { result } = renderHook(() => useProject('winfolio'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('winfolio')
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
