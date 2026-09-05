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
  it('renders every role with its org, location and tech', () => {
    renderExperience()

    // Two roles carry the same "Full-Stack Developer" title (Invercasa + UCA).
    expect(
      screen.getAllByRole('heading', { name: 'Full-Stack Developer' }),
    ).toHaveLength(2)
    expect(
      screen.getByRole('heading', { name: 'Front-End Developer' }),
    ).toBeInTheDocument()

    expect(screen.getByText(/Grupo Invercasa - Casavisión/)).toBeInTheDocument()
    expect(screen.getByText(/Fundación Movicáncer/)).toBeInTheDocument()
    expect(screen.getByText(/Universidad Centroamericana/)).toBeInTheDocument()
    expect(screen.getAllByText(/Managua, Nicaragua/).length).toBeGreaterThan(1)

    expect(screen.getByText('Fiber')).toBeInTheDocument()
    expect(screen.getByText('JasperReport')).toBeInTheDocument()
  })

  it('mentions the Casavisión design system work', () => {
    renderExperience()
    expect(screen.getByText(/design system/i)).toBeInTheDocument()
  })
})
