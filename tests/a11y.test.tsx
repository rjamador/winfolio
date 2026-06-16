import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import type { ReactNode } from 'react'
import { Button95, Dialog } from '@/components/win95'
import { AboutWindow } from '@/features/about'
import { ProjectsWindow } from '@/features/projects'
import { StackWindow } from '@/features/stack'
import { ExperienceWindow } from '@/features/experience'
import { SettingsWindow } from '@/features/settings'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { routes } from '@/routes/router'

// Scope to real WCAG A/AA failures (not best-practice noise). color-contrast is
// verified manually — jsdom has no layout engine to compute it.
const AXE_OPTIONS = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: { 'color-contrast': { enabled: false } },
}

function withProviders(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <SettingsProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </SettingsProvider>
    </QueryClientProvider>
  )
}

describe('accessibility (axe, WCAG A/AA)', () => {
  it('Button95 has no violations', async () => {
    const { container } = render(<Button95>Click me</Button95>)
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('Dialog (open) has no violations', async () => {
    const { container } = render(
      <Dialog open title="Properties" onClose={() => {}}>
        Some dialog content.
      </Dialog>,
    )
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('AboutWindow has no violations', async () => {
    const { container } = render(withProviders(<AboutWindow />))
    await screen.findByRole('img', { name: 'Roberto Amador' })
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('StackWindow has no violations', async () => {
    const { container } = render(<StackWindow />)
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('ExperienceWindow has no violations', async () => {
    const { container } = render(
      <SettingsProvider>
        <ExperienceWindow />
      </SettingsProvider>,
    )
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('ProjectsWindow (list) has no violations', async () => {
    const { container } = render(withProviders(<ProjectsWindow />))
    await screen.findByText('GymCheck')
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('SettingsWindow has no violations', async () => {
    const { container } = render(
      <SettingsProvider>
        <SettingsWindow />
      </SettingsProvider>,
    )
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations()
  })

  it('DesktopShell with a window open has no violations', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/about'] })
    render(<RouterProvider router={router} />)
    await screen.findAllByRole('button', { name: 'Close' })
    expect(await axe(document.body, AXE_OPTIONS)).toHaveNoViolations()
  })
})
