import { afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/routes/router'

afterEach(() => localStorage.clear())

function renderApp(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}

describe('DesktopShell', () => {
  it('opens all four content windows on first load', async () => {
    renderApp()
    const closeButtons = await screen.findAllByRole('button', { name: 'Close' })
    expect(closeButtons).toHaveLength(4)
  })

  it('closes a window via its title-bar close button', async () => {
    const user = userEvent.setup()
    renderApp()
    const closeButtons = await screen.findAllByRole('button', { name: 'Close' })
    expect(closeButtons).toHaveLength(4)

    await user.click(closeButtons[0]!)
    expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(3)
  })

  it('toggles the Start menu open and closed', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findAllByRole('button', { name: 'Close' })

    expect(screen.queryByRole('menu', { name: 'Start menu' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('menu', { name: 'Start menu' })).toBeInTheDocument()
  })
})
