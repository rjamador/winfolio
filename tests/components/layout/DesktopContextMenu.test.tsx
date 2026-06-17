import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { DesktopContextMenu } from '@/components/layout/DesktopContextMenu'

describe('DesktopContextMenu', () => {
  it('runs its actions and closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onMinimizeAll = vi.fn()
    const onRefresh = vi.fn()
    const onProperties = vi.fn()
    render(
      <SettingsProvider>
        <DesktopContextMenu
          x={10}
          y={10}
          onClose={onClose}
          onMinimizeAll={onMinimizeAll}
          onRefresh={onRefresh}
          onProperties={onProperties}
        />
      </SettingsProvider>,
    )

    expect(screen.getByRole('menu', { name: /desktop/i })).toBeInTheDocument()

    await user.click(screen.getByRole('menuitem', { name: /refresh/i }))
    expect(onRefresh).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()

    onClose.mockClear()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
