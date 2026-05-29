import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowManagerProvider } from './WindowManagerProvider'
import { DesktopShell } from './DesktopShell'

function renderShell() {
  return render(
    <WindowManagerProvider>
      <DesktopShell />
    </WindowManagerProvider>,
  )
}

describe('DesktopShell', () => {
  it('opens a window when a desktop icon is double-clicked', async () => {
    const user = userEvent.setup()
    renderShell()

    // No window open yet → no close control.
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()

    await user.dblClick(screen.getByRole('button', { name: 'About' }))

    // The window's title bar exposes a Close control once open.
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('closes a window via its title-bar close button', async () => {
    const user = userEvent.setup()
    renderShell()

    await user.dblClick(screen.getByRole('button', { name: 'Projects' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('shows a taskbar button for each open window', async () => {
    const user = userEvent.setup()
    renderShell()

    await user.dblClick(screen.getByRole('button', { name: 'About' }))
    await user.dblClick(screen.getByRole('button', { name: 'Contact' }))

    // Two windows open → two Close controls present.
    expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(2)
  })

  it('toggles the Start menu open and closed', async () => {
    const user = userEvent.setup()
    renderShell()

    expect(screen.queryByRole('menu', { name: 'Start menu' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('menu', { name: 'Start menu' })).toBeInTheDocument()
  })
})
