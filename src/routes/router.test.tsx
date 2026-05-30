import { afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'

afterEach(() => localStorage.clear())

function renderApp(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}

describe('routing', () => {
  it('deep-links to a section: /about opens the About window', async () => {
    renderApp(['/about'])
    // Content windows open on load; the title bars expose Close controls.
    expect((await screen.findAllByRole('button', { name: 'Close' })).length).toBeGreaterThan(0)
    // "About" appears in the desktop icon and the window title bar.
    expect(screen.getAllByText('About').length).toBeGreaterThan(1)
  })

  it('renders a themed 404 for an unknown path', async () => {
    renderApp(['/does-not-exist'])
    expect(await screen.findByText('This page cannot be found.')).toBeInTheDocument()
  })

  it('opens Settings (not auto-opened) when its desktop icon is double-clicked', async () => {
    const user = userEvent.setup()
    renderApp(['/'])
    await screen.findAllByRole('button', { name: 'Close' })

    // Settings is a utility window — not part of the open-all set.
    expect(screen.queryByRole('radiogroup', { name: 'Text size' })).not.toBeInTheDocument()
    await user.dblClick(screen.getByRole('button', { name: 'Settings' }))
    expect(
      await screen.findByRole('radiogroup', { name: 'Text size' }),
    ).toBeInTheDocument()
  })

  it('deep-link /projects/:id opens the Projects window on that project detail', async () => {
    renderApp(['/projects/portfolio'])
    // End-to-end URL → data: the selected repo's description renders.
    expect(
      await screen.findByText(/Windows 95 desktop portfolio built with React/i),
    ).toBeInTheDocument()
  })
})
