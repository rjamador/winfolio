import { useCallback, useSyncExternalStore } from 'react'
import { isSoundEnabled, setSoundEnabled, subscribeSoundEnabled } from '@/lib/sounds'

/**
 * Reactive view of the "desktop sounds" on/off preference, shared by every
 * surface that can flip it (the Settings window, the taskbar tray). Backed by
 * localStorage and kept in sync across tabs. `useSyncExternalStore` so there's
 * no setState-in-effect and no tearing.
 */
export function useSoundEnabled(): readonly [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(subscribeSoundEnabled, isSoundEnabled)
  const setEnabled = useCallback((next: boolean) => setSoundEnabled(next), [])
  return [enabled, setEnabled]
}
