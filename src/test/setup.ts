// Registers jest-dom matchers (toBeInTheDocument, toHaveFocus, ...) on Vitest's
// expect. Loaded once via vite.config.ts `test.setupFiles`.
import '@testing-library/jest-dom/vitest'

// jsdom has no window.matchMedia. Components using useMediaQuery (e.g. Window)
// need it. Default to "does not match" (mobile / full-bleed); tests that need the
// desktop branch override window.matchMedia themselves.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}
