import { render, screen } from '@testing-library/react'
import { ExperienceWindow } from './ExperienceWindow'

describe('ExperienceWindow', () => {
  it('renders both roles with their orgs and tech', () => {
    render(<ExperienceWindow />)
    expect(
      screen.getByRole('heading', { name: 'Front-End Development Leader' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Front-End Developer' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Fundación Movicáncer/)).toBeInTheDocument()
    expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    expect(screen.getByText('ASP.NET')).toBeInTheDocument()
  })
})
