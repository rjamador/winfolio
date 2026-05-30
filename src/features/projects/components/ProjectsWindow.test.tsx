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
  it('lists projects after load', async () => {
    wrap(<ProjectsWindow />)
    expect(await screen.findByText('Winfolio')).toBeInTheDocument()
    expect(screen.getByText('Pixel Paint')).toBeInTheDocument()
  })

  it('shows a project detail when selectedId is set', async () => {
    wrap(<ProjectsWindow selectedId="winfolio" />)
    // Detail shows the description + a Back action.
    expect(
      await screen.findByText(/Windows 95 desktop built with React/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument()
  })

  it('shows a not-found note for an unknown project id', async () => {
    wrap(<ProjectsWindow selectedId="nope" />)
    expect(await screen.findByText(/does not exist/i)).toBeInTheDocument()
  })
})
