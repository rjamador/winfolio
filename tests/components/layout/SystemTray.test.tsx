import { afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsProvider } from '@/providers/SettingsProvider'
import { SystemTray } from '@/components/layout/SystemTray'

afterEach(() => localStorage.clear())

function renderTray() {
  return render(
    <SettingsProvider>
      <SystemTray />
    </SettingsProvider>,
  )
}

describe('SystemTray', () => {
  it('renders the alarm glyph and the speaker toggle', () => {
    const { container } = renderTray()
    expect(container.querySelectorAll('svg')).toHaveLength(2)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('mutes and unmutes the desktop sounds, persisting the preference', async () => {
    const user = userEvent.setup()
    renderTray()

    // Sound is on by default: the button offers to mute.
    const toggle = screen.getByRole('button', { name: 'Mute desktop sounds' })

    await user.click(toggle)
    expect(localStorage.getItem('winfolio:sound-enabled')).toBe('false')
    expect(
      screen.getByRole('button', { name: 'Unmute desktop sounds' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Unmute desktop sounds' }))
    expect(localStorage.getItem('winfolio:sound-enabled')).toBe('true')
    expect(
      screen.getByRole('button', { name: 'Mute desktop sounds' }),
    ).toBeInTheDocument()
  })
})
