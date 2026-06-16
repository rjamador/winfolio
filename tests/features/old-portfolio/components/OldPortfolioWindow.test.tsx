import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { OldPortfolioWindow } from './OldPortfolioWindow'

describe('OldPortfolioWindow', () => {
  it('embeds the old portfolio and links to it', () => {
    render(
      <SettingsProvider>
        <OldPortfolioWindow />
      </SettingsProvider>,
    )
    const frame = screen.getByTitle(/old portfolio/i)
    expect(frame.getAttribute('src')).toContain('ramador.vercel.app')
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('ramador.vercel.app')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
