import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TitleBar } from './TitleBar'

describe('TitleBar', () => {
  it('fires the matching handler for each control', async () => {
    const user = userEvent.setup()
    const onMinimize = vi.fn()
    const onMaximize = vi.fn()
    const onClose = vi.fn()
    render(
      <TitleBar
        title="My Window"
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Minimize' }))
    await user.click(screen.getByRole('button', { name: 'Maximize' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onMinimize).toHaveBeenCalledTimes(1)
    expect(onMaximize).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('omits controls when no handler is provided', () => {
    render(<TitleBar title="Bare" />)
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Minimize' })).not.toBeInTheDocument()
    expect(screen.getByText('Bare')).toBeInTheDocument()
  })
})
