import { render, screen } from '@testing-library/react'
import { Window } from './Window'

function setViewport(isDesktop: boolean) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: isDesktop,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

describe('Window', () => {
  it('renders title and content', () => {
    setViewport(false)
    render(<Window title="About">Hello</Window>)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders full-bleed (no drag wrapper) on small screens', () => {
    setViewport(false)
    const { container } = render(
      <Window title="About" draggable x={10} y={10} width={300} height={200}>
        Body
      </Window>,
    )
    expect(container.querySelector('.win95-window-rnd')).not.toBeInTheDocument()
  })

  it('wraps in a react-rnd container on desktop when draggable', () => {
    setViewport(true)
    const { container } = render(
      <Window title="About" draggable x={10} y={10} width={300} height={200}>
        Body
      </Window>,
    )
    expect(container.querySelector('.win95-window-rnd')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('stays full-bleed on desktop when not draggable', () => {
    setViewport(true)
    const { container } = render(<Window title="Static">Body</Window>)
    expect(container.querySelector('.win95-window-rnd')).not.toBeInTheDocument()
  })
})
