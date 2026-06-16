import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { ExperienceWindow } from '@/features/experience/components/ExperienceWindow'

function renderExperience() {
  return render(
    <SettingsProvider>
      <ExperienceWindow />
    </SettingsProvider>,
  )
}

describe('ExperienceWindow', () => {
  it('renders all roles with their orgs and tech', () => {
    renderExperience()
    expect(
      screen.getByRole('heading', { name: 'Full-Stack Developer' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Front-End Development Leader' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Front-End Developer' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Grupo Invercasa/)).toBeInTheDocument()
    expect(screen.getByText(/Fundación Movicáncer/)).toBeInTheDocument()
    expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    // ASP.NET now appears in two roles (Invercasa + UCA).
    expect(screen.getAllByText('ASP.NET').length).toBeGreaterThan(1)
  })
})
