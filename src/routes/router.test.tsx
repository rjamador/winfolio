import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'

function renderApp(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}

describe('routing', () => {
  it('deep-links to a section: /about opens the About window', async () => {
    renderApp(['/about'])
    // The window's title bar exposes a Close control once open.
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
    // Two "About" matches: the desktop icon and the window title bar.
    expect(screen.getAllByText('About').length).toBeGreaterThan(1)
  })

  it('deep-links to /projects/:id and opens the Projects window', async () => {
    renderApp(['/projects/react'])
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(1)
  })

  it('renders a themed 404 for an unknown path', async () => {
    renderApp(['/does-not-exist'])
    expect(await screen.findByText('This page cannot be found.')).toBeInTheDocument()
  })

  it('opens a window (URL-driven) when a desktop icon is double-clicked', async () => {
    const user = userEvent.setup()
    renderApp(['/'])
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    await user.dblClick(screen.getByRole('button', { name: 'Contact' }))
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
