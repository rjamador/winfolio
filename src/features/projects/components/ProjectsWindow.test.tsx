import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ProjectsWindow } from './ProjectsWindow'

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProjectsWindow', () => {
  it('lists repos after load (forks/archived excluded)', async () => {
    wrap(<ProjectsWindow />)
    expect(await screen.findByText('winfolio')).toBeInTheDocument()
    expect(screen.getByText('pixel-paint')).toBeInTheDocument()
    // Filtered out:
    expect(screen.queryByText('forked-lib')).not.toBeInTheDocument()
    expect(screen.queryByText('old-archived')).not.toBeInTheDocument()
  })

  it('shows a project detail when selectedId is set', async () => {
    wrap(<ProjectsWindow selectedId="winfolio" />)
    expect(
      await screen.findByText(/Windows 95 desktop portfolio built with React/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument()
    // Meta row shows stars/forks.
    expect(screen.getByText(/42 stars/)).toBeInTheDocument()
  })

  it('shows a not-found note for an unknown project id', async () => {
    wrap(<ProjectsWindow selectedId="nope" />)
    expect(await screen.findByText(/does not exist/i)).toBeInTheDocument()
  })
})
