import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Boom(): React.ReactNode {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('renders its children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>safe content</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('shows the themed fallback when a child throws', () => {
    // Silence the expected React error log for this test.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('An error has occurred.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    spy.mockRestore()
  })

  it('renders a custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<p>custom fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('custom fallback')).toBeInTheDocument()
    spy.mockRestore()
  })
})
