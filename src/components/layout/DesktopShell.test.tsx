import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/routes/router'

function renderApp(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}

describe('DesktopShell', () => {
  it('opens a window when a desktop icon is double-clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    await user.dblClick(screen.getByRole('button', { name: 'About' }))
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('closes a window via its title-bar close button', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.dblClick(screen.getByRole('button', { name: 'Projects' }))
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('toggles the Start menu open and closed', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.queryByRole('menu', { name: 'Start menu' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('menu', { name: 'Start menu' })).toBeInTheDocument()
  })
})
