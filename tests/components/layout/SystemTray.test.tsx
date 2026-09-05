import { render } from '@testing-library/react'
import { SettingsProvider } from '@/providers/SettingsProvider'
import { SystemTray } from '@/components/layout/SystemTray'

describe('SystemTray', () => {
  it('renders decorative tray glyphs', () => {
    const { container } = render(
      <SettingsProvider>
        <SystemTray />
      </SettingsProvider>,
    )
    // Two static pixel glyphs (alarm + volume), purely decorative.
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })
})
