import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { ContactWindow } from './ContactWindow'

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('ContactWindow', () => {
  it('shows validation errors when submitting empty', async () => {
    const user = userEvent.setup()
    wrap(<ContactWindow />)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a message.')).toBeInTheDocument()
  })

  it('submits valid input and shows a success message', async () => {
    const user = userEvent.setup()
    wrap(<ContactWindow />)

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Message'), 'Hello there!')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Thanks! Your message has been sent.')).toBeInTheDocument()
  })
})
