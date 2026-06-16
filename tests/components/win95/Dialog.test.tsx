import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from './Dialog'
import { Button95 } from './Button95'

describe('Dialog', () => {
  it('exposes dialog role and modal semantics labelled by its title', () => {
    render(
      <Dialog open title="Properties" onClose={vi.fn()}>
        Body
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Dialog open title="Properties" onClose={onClose}>
        Body
      </Dialog>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('traps focus: Tab from the last control wraps to the first', async () => {
    const user = userEvent.setup()
    render(
      <Dialog
        open
        title="Properties"
        onClose={vi.fn()}
        footer={
          <>
            <Button95>First</Button95>
            <Button95>Last</Button95>
          </>
        }
      >
        Body
      </Dialog>,
    )
    // Close (in TitleBar) is the first focusable; "Last" is the last.
    const close = screen.getByRole('button', { name: 'Close' })
    const last = screen.getByRole('button', { name: 'Last' })

    last.focus()
    expect(last).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('restores focus to the opener when closed', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Dialog open={open} title="Properties" onClose={() => setOpen(false)}>
            Body
          </Dialog>
        </>
      )
    }

    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open' })
    opener.focus()
    await user.click(opener)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })
})
