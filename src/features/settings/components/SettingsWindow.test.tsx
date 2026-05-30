import { afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { SettingsWindow } from './SettingsWindow'

afterEach(() => localStorage.clear())

function renderSettings() {
  return render(
    <SettingsProvider>
      <SettingsWindow />
    </SettingsProvider>,
  )
}

describe('SettingsWindow', () => {
  it('applies a swatch color to the document root', async () => {
    const user = userEvent.setup()
    renderSettings()
    await user.click(screen.getByRole('button', { name: 'Purple' }))
    expect(document.documentElement.style.getPropertyValue('--w95-desktop')).toBe(
      '#800080',
    )
  })

  it('applies the text-size scale when a preset is chosen', async () => {
    const user = userEvent.setup()
    renderSettings()
    await user.click(screen.getByRole('radio', { name: 'Large' }))
    expect(document.documentElement.style.getPropertyValue('--w95-font-scale')).toBe(
      '1.2',
    )
  })

  it('persists the chosen settings', async () => {
    const user = userEvent.setup()
    renderSettings()
    await user.click(screen.getByRole('button', { name: 'Navy' }))
    expect(localStorage.getItem('winfolio:settings')).toContain('#000080')
  })
})
