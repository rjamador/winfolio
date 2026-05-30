import { render, screen } from '@testing-library/react'
import { AboutWindow } from './AboutWindow'

describe('AboutWindow', () => {
  it('renders the intro heading and a tech list', () => {
    render(<AboutWindow />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
