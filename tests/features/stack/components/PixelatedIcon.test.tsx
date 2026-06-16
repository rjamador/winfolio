import { render } from '@testing-library/react'
import { PixelatedIcon } from '@/features/stack/components/PixelatedIcon'

function FakeIcon({ size }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" />
}

describe('PixelatedIcon', () => {
  it('renders a canvas without throwing (no canvas 2d in jsdom)', () => {
    const { container } = render(<PixelatedIcon Icon={FakeIcon} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
