import { useEffect } from 'react'
import { playSound } from '@/lib/sounds'

/** Controls that get the generic "I pressed something" tick on pointer-down. */
const INTERACTIVE_SELECTOR =
  'button, a[href], [role="menuitem"], input[type="checkbox"], input[type="radio"]'

/**
 * Plays the subtle desktop "click" tick whenever the visitor presses an
 * interactive control, anywhere in the app. Semantic cues (a window opening,
 * a menu, an error) are fired by their own call sites — this only covers the
 * generic press feedback the OS gave every mouse-down.
 *
 * Attached once, near the desktop root. `pointerdown` (not `click`) so the tick
 * lands with the press, and so the first interaction also wakes the audio
 * context for every later cue.
 */
export function useDesktopClickSound(): void {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest(INTERACTIVE_SELECTOR)) playSound('click')
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])
}
