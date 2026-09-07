/**
 * Tiny synthesized desktop sounds — no audio files, generated on the fly with
 * the Web Audio API. Each one evokes a classic Windows 95 system event
 * (startup chime, window whoosh, the error "ding", …) without shipping a
 * single sample.
 */
export type SoundName =
  | 'startup'
  | 'shutdown'
  | 'open'
  | 'close'
  | 'minimize'
  | 'restore'
  | 'menu'
  | 'ding'
  | 'click'

const STORAGE_KEY = 'winfolio:sound-enabled'

type AudioContextCtor = typeof AudioContext

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext ??
    null
  )
}

let context: AudioContext | null = null

function getContext(): AudioContext | null {
  const Ctor = getAudioContextCtor()
  if (!Ctor) return null
  if (!context) context = new Ctor()
  // Browsers start the context suspended until a user gesture; nudge it awake
  // so the next cue can play (a gesture-less cue like `startup` stays silent
  // until the visitor first interacts — the browser's autoplay policy, not ours).
  if (context.state === 'suspended') void context.resume()
  return context
}

/** Notified whenever the preference is toggled in this tab. */
const enabledListeners = new Set<() => void>()

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  } catch {
    // storage unavailable — preference just won't persist
  }
  enabledListeners.forEach((listener) => listener())
}

/**
 * Subscribes to on/off changes — same-tab (the Settings + taskbar toggles) and
 * cross-tab (the `storage` event) — so every surface showing the state stays in
 * sync. Pairs with `isSoundEnabled` as a `useSyncExternalStore` snapshot.
 */
export function subscribeSoundEnabled(listener: () => void): () => void {
  enabledListeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    enabledListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

type Note = { freq: number; start: number; duration: number; type?: OscillatorType; gain?: number }

const RECIPES: Record<SoundName, Note[]> = {
  // Power-on chime — a warm major arpeggio settling on the octave.
  startup: [
    { freq: 262, start: 0, duration: 0.5, gain: 0.6 },
    { freq: 330, start: 0.11, duration: 0.5, gain: 0.6 },
    { freq: 392, start: 0.22, duration: 0.5, gain: 0.6 },
    { freq: 523, start: 0.33, duration: 0.7, gain: 0.7 },
  ],
  // Power-off — the same notes, descending and shorter.
  shutdown: [
    { freq: 523, start: 0, duration: 0.28, gain: 0.6 },
    { freq: 392, start: 0.14, duration: 0.3, gain: 0.6 },
    { freq: 262, start: 0.28, duration: 0.5, gain: 0.6 },
  ],
  // Window opening — a quick upward whoosh.
  open: [
    { freq: 440, start: 0, duration: 0.07 },
    { freq: 660, start: 0.06, duration: 0.1 },
  ],
  // Window closing — the same, reversed.
  close: [
    { freq: 620, start: 0, duration: 0.07 },
    { freq: 415, start: 0.06, duration: 0.1 },
  ],
  // Minimize — a short descending swoosh.
  minimize: [
    { freq: 780, start: 0, duration: 0.05, type: 'triangle' },
    { freq: 560, start: 0.045, duration: 0.05, type: 'triangle' },
    { freq: 420, start: 0.09, duration: 0.07, type: 'triangle' },
  ],
  // Restore — the swoosh, ascending.
  restore: [
    { freq: 420, start: 0, duration: 0.05, type: 'triangle' },
    { freq: 560, start: 0.045, duration: 0.05, type: 'triangle' },
    { freq: 780, start: 0.09, duration: 0.07, type: 'triangle' },
  ],
  // Menu popup — a barely-there tick.
  menu: [{ freq: 1200, start: 0, duration: 0.03, type: 'triangle', gain: 0.35 }],
  // The classic error/alert "ding" — a soft two-tone bell.
  ding: [
    { freq: 1047, start: 0, duration: 0.16, gain: 0.8 },
    { freq: 831, start: 0.11, duration: 0.32, gain: 0.7 },
  ],
  // Mouse click — a dry, quiet tick under every push button.
  click: [{ freq: 190, start: 0, duration: 0.02, type: 'square', gain: 0.25 }],
}

export function playSound(name: SoundName): void {
  if (!isSoundEnabled()) return
  const ctx = getContext()
  if (!ctx) return

  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.value = 0.15
  master.connect(ctx.destination)

  for (const note of RECIPES[name]) {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = note.type ?? 'sine'
    osc.frequency.value = note.freq

    const start = now + note.start
    const end = start + note.duration
    const peak = note.gain ?? 1
    env.gain.setValueAtTime(0.0001, start)
    env.gain.exponentialRampToValueAtTime(peak, start + 0.01)
    env.gain.exponentialRampToValueAtTime(0.0001, end)

    osc.connect(env)
    env.connect(master)
    osc.start(start)
    osc.stop(end + 0.02)
  }
}
