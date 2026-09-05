import { useMediaQuery } from './useMediaQuery'

/** True while the user has requested reduced motion (`prefers-reduced-motion: reduce`). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
