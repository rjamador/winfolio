// Registers jest-dom matchers (toBeInTheDocument, toHaveFocus, ...) on Vitest's
// expect. Loaded once via vite.config.ts `test.setupFiles`.
import '@testing-library/jest-dom/vitest'

// Registers the vitest-axe matcher (toHaveNoViolations). Its TypeScript types
// are declared in vitest-axe.d.ts (vitest-axe's own augmentation targets the
// legacy `Vi` namespace, which Vitest 4 no longer uses).
import { expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'
expect.extend(axeMatchers)

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
