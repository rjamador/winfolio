import { render } from '@testing-library/react'
import { AnalogClock } from '@/components/win95/AnalogClock'

describe('AnalogClock', () => {
  it('renders an SVG labelled with the given time', () => {
    const date = new Date(2026, 5, 16, 9, 41, 30)
    const { getByRole } = render(<AnalogClock date={date} />)
    const svg = getByRole('img')
    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg).toHaveAttribute('aria-label', date.toLocaleTimeString())
  })
})
