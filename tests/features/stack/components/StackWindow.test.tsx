import { render, screen } from '@testing-library/react'
import { StackWindow } from '@/features/stack/components/StackWindow'

describe('StackWindow', () => {
  it('renders the tech tiles with labels', () => {
    render(<StackWindow />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Flutter')).toBeInTheDocument()
    expect(screen.getByText('SQL Server')).toBeInTheDocument()
  })
})
