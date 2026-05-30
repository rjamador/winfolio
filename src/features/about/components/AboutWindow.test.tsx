import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AboutWindow } from './AboutWindow'

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('AboutWindow', () => {
  it('renders the name heading and a skills list', () => {
    wrap(<AboutWindow />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Roberto Amador' }),
    ).toBeInTheDocument()
    expect(screen.getByText('UI/UX design')).toBeInTheDocument()
  })

  it('renders the GitHub avatar once loaded', async () => {
    wrap(<AboutWindow />)
    expect(await screen.findByRole('img', { name: 'Roberto Amador' })).toBeInTheDocument()
  })
})
