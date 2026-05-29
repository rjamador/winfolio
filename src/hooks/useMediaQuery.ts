import { useCallback, useSyncExternalStore } from 'react'

/**
 * Returns true while the given media query matches, staying in sync as the
 * viewport crosses the breakpoint. Uses useSyncExternalStore so there is no
 * setState-in-effect and no tearing.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = () => window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot)
}
