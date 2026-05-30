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
  it('resolves to the validated project list', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data!.length).toBeGreaterThan(0)
    // Data is typed/validated: every item has a string id.
    expect(result.current.data!.every((p) => typeof p.id === 'string')).toBe(true)
  })
})

describe('useProject', () => {
  it('returns the matching project for a known id', async () => {
    const { result } = renderHook(() => useProject('winfolio'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('winfolio')
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
