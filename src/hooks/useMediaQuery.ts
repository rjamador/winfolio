import { useCallback, useMemo, useSyncExternalStore } from 'react'

/**
 * Returns true while the given media query matches, staying in sync as the
 * viewport crosses the breakpoint. Uses useSyncExternalStore so there is no
 * setState-in-effect and no tearing.
 */
export function useMediaQuery(query: string): boolean {
  // One MediaQueryList per mount instead of a fresh `window.matchMedia(query)`
  // allocation on every render and every snapshot read.
  const mql = useMemo(() => window.matchMedia(query), [query])

  const subscribe = useCallback(
    (onChange: () => void) => {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [mql],
  )

  const getSnapshot = useCallback(() => mql.matches, [mql])

  return useSyncExternalStore(subscribe, getSnapshot)
}
