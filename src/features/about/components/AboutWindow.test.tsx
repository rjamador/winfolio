import { render, screen } from '@testing-library/react'
import { AboutWindow } from './AboutWindow'

describe('AboutWindow', () => {
  it('renders the name heading and a skills list', () => {
    render(<AboutWindow />)
    expect(screen.getByRole('heading', { level: 2, name: 'Roberto Amador' })).toBeInTheDocument()
    expect(screen.getByText('UI/UX design')).toBeInTheDocument()
  })
})
