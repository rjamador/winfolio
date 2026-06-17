import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { RecycleBinWindow } from '@/features/recycle-bin'

describe('RecycleBinWindow', () => {
  it('shows the empty bin message', () => {
    render(
      <SettingsProvider>
        <RecycleBinWindow />
      </SettingsProvider>,
    )
    expect(screen.getByText(/recycle bin is empty/i)).toBeInTheDocument()
  })
})
