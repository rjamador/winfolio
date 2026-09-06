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

  it('renders a real link, not a button, when given an href', () => {
    render(
      <Button95 href="https://example.com/cv.pdf" target="_blank" rel="noreferrer">
        Download CV
      </Button95>,
    )
    const link = screen.getByRole('link', { name: 'Download CV' })
    expect(link).toHaveAttribute('href', 'https://example.com/cv.pdf')
    expect(link).toHaveAttribute('target', '_blank')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('drops href on a disabled link, like a disabled button is inert', () => {
    render(
      <Button95 href="https://example.com/cv.pdf" disabled>
        Download CV
      </Button95>,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
