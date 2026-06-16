import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressBar } from '@/components/win95/ProgressBar'
import { DesktopIcon } from '@/components/win95/DesktopIcon'

// --- ProgressBar ------------------------------------------------------------

describe('ProgressBar', () => {
  it('has role progressbar with correct aria values', () => {
    render(<ProgressBar value={60} label="Loading" />)
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).toHaveAttribute('aria-valuenow', '60')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps value above 100', () => {
    render(<ProgressBar value={150} label="Clamped" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps value below 0', () => {
    render(<ProgressBar value={-10} label="Clamped" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})

// --- DesktopIcon ------------------------------------------------------------

describe('DesktopIcon', () => {
  it('fires onClick on click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<DesktopIcon label="My Computer" icon="💻" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'My Computer' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('fires onDoubleClick on double click', async () => {
    const user = userEvent.setup()
    const onDoubleClick = vi.fn()
    render(
      <DesktopIcon label="Recycle Bin" icon="🗑" onDoubleClick={onDoubleClick} />,
    )
    await user.dblClick(screen.getByRole('button', { name: 'Recycle Bin' }))
    expect(onDoubleClick).toHaveBeenCalledTimes(1)
  })

  it('has an accessible label', () => {
    render(<DesktopIcon label="Projects" icon="📁" />)
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument()
  })
})
