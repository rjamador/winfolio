import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button95 } from '@/components/win95/Button95'

describe('Button95', () => {
  it('renders its children', () => {
    render(<Button95>Click me</Button95>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('fires onClick on click and on keyboard activation', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button95 onClick={onClick}>Go</Button95>)
    const button = screen.getByRole('button', { name: 'Go' })

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)

    button.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('does not fire when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button95 onClick={onClick} disabled>
        Nope
      </Button95>,
    )
    await user.click(screen.getByRole('button', { name: 'Nope' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
