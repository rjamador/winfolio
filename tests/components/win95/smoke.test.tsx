import { render, screen } from '@testing-library/react'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { Win95Loader } from './Win95Loader'
import { MessageBox } from './MessageBox'

// Light smoke renders for the purely presentational primitives.
describe('presentational primitives render without throwing', () => {
  it('Window shows its title and content', () => {
    render(<Window title="About">Hello</Window>)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('Taskbar shows the Start button and clock', () => {
    render(<Taskbar clock="12:00 PM">item</Taskbar>)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByText('12:00 PM')).toBeInTheDocument()
  })

  it('Win95Loader shows its label as a status region', () => {
    render(<Win95Loader label="Loading projects…" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects…')
  })

  it('MessageBox shows message and OK button when open', () => {
    render(
      <MessageBox open title="Error" message="An error has occurred." onOk={() => {}} />,
    )
    expect(screen.getByText('An error has occurred.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })
})
