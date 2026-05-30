import { render, screen, waitFor } from '@testing-library/react'
import { SettingsProvider } from './SettingsProvider'
import { BootScreen } from './BootScreen'

describe('BootScreen', () => {
  it('shows a progress bar and calls onDone after loading', async () => {
    const onDone = vi.fn()
    render(
      <SettingsProvider>
        <BootScreen onDone={onDone} durationMs={100} />
      </SettingsProvider>,
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    await waitFor(() => expect(onDone).toHaveBeenCalled())
  })
})
