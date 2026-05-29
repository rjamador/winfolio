import { useRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StartMenu } from './StartMenu'

describe('StartMenu', () => {
  it('renders nothing when closed', () => {
    render(
      <StartMenu open={false} onClose={vi.fn()}>
        <li>About</li>
      </StartMenu>,
    )
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <StartMenu open onClose={onClose}>
        <li>About</li>
      </StartMenu>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on outside click but not on inside click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <div>
        <button type="button">outside</button>
        <StartMenu open onClose={onClose}>
          <li>
            <button type="button">About</button>
          </li>
        </StartMenu>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'About' }))
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'outside' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not treat a click on the trigger as an outside click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    function Harness() {
      const triggerRef = useRef<HTMLButtonElement>(null)
      return (
        <div>
          <button type="button" ref={triggerRef}>
            Start
          </button>
          <StartMenu open onClose={onClose} triggerRef={triggerRef}>
            <li>About</li>
          </StartMenu>
        </div>
      )
    }

    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(onClose).not.toHaveBeenCalled()
  })
})
