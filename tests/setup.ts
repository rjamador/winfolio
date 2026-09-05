// Registers jest-dom matchers (toBeInTheDocument, toHaveFocus, ...) on Vitest's
// expect. Loaded once via vite.config.ts `test.setupFiles`.
import '@testing-library/jest-dom/vitest'

// Registers the vitest-axe matcher (toHaveNoViolations). Its TypeScript types
// are declared in vitest-axe.d.ts (vitest-axe's own augmentation targets the
// legacy `Vi` namespace, which Vitest 4 no longer uses).
import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'
expect.extend(axeMatchers)

// Mock the network (GitHub API) for all tests via MSW.
import { server } from './msw/server'
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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

// jsdom has no IntersectionObserver (used by DesktopShell's mobile carousel to
// sync focus to the visible window). Tests here don't assert on intersection
// behavior, so a no-op stub is enough to keep it from being `undefined`.
if (!window.IntersectionObserver) {
  class NoOpIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly scrollMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver = NoOpIntersectionObserver;
}

// jsdom has the <dialog> element's `open` attribute reflection, but not the
// imperative showModal()/close() API or the native Escape-to-close/Tab-trap
// behavior a real browser gives a modal dialog for free. Win95's Dialog relies
// on all of it, so give tests a minimal but faithful stand-in.
if (!window.HTMLDialogElement.prototype.showModal) {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const openDialogs: HTMLDialogElement[] = []
  const previouslyFocused = new WeakMap<HTMLDialogElement, HTMLElement | null>()

  const topDialog = () => {
    while (openDialogs.length && !openDialogs[openDialogs.length - 1]!.isConnected) {
      openDialogs.pop()
    }
    return openDialogs[openDialogs.length - 1]
  }

  window.HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    previouslyFocused.set(this, document.activeElement as HTMLElement | null)
    this.setAttribute('open', '')
    openDialogs.push(this)
    ;(this.querySelector<HTMLElement>(FOCUSABLE) ?? this).focus()
  }

  window.HTMLDialogElement.prototype.close = function (
    this: HTMLDialogElement,
    returnValue?: string,
  ) {
    if (!this.hasAttribute('open')) return
    if (returnValue !== undefined) this.returnValue = returnValue
    this.removeAttribute('open')
    const index = openDialogs.indexOf(this)
    if (index !== -1) openDialogs.splice(index, 1)
    this.dispatchEvent(new window.Event('close'))
    previouslyFocused.get(this)?.focus()
  }

  document.addEventListener('keydown', (e) => {
    const dialog = topDialog()
    if (!dialog) return

    if (e.key === 'Escape') {
      const cancelEvent = new window.Event('cancel', { cancelable: true })
      dialog.dispatchEvent(cancelEvent)
      if (!cancelEvent.defaultPrevented) dialog.close()
      return
    }

    if (e.key === 'Tab') {
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]!
      const last = items[items.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })
}
