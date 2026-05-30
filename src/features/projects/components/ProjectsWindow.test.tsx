import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { ProjectsWindow } from './ProjectsWindow'

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <SettingsProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </SettingsProvider>
    </QueryClientProvider>,
  )
}

describe('ProjectsWindow', () => {
  it('lists only allowlisted repos after load', async () => {
    wrap(<ProjectsWindow />)
    expect(await screen.findByText('GymCheck')).toBeInTheDocument()
    expect(screen.getByText('portfolio')).toBeInTheDocument()
    expect(screen.getByText('Coinflow')).toBeInTheDocument()
    // Filtered out:
    expect(screen.queryByText('random-side-project')).not.toBeInTheDocument()
    expect(screen.queryByText('forked-lib')).not.toBeInTheDocument()
  })

  it('shows a project detail when selectedId is set', async () => {
    wrap(<ProjectsWindow selectedId="portfolio" />)
    expect(
      await screen.findByText(/Windows 95 desktop portfolio built with React/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument()
    // Meta row shows stars/forks.
    expect(screen.getByText(/4 stars/)).toBeInTheDocument()
  })

  it('shows a not-found note for an unknown project id', async () => {
    wrap(<ProjectsWindow selectedId="nope" />)
    expect(await screen.findByText(/does not exist/i)).toBeInTheDocument()
  })
})
