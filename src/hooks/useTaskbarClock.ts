import { useClock } from './useClock'

/**
 * Live HH:MM clock for the taskbar, in the visitor's local timezone.
 * (In the Claude preview the sandbox timezone is shown, not your machine's.)
 */
export function useTaskbarClock(): string {
  return useClock()
}
