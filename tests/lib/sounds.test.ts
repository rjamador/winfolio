import { afterEach } from 'vitest'
import {
  isSoundEnabled,
  playSound,
  setSoundEnabled,
  type SoundName,
} from '@/lib/sounds'

afterEach(() => localStorage.clear())

const ALL_CUES: SoundName[] = [
  'startup',
  'shutdown',
  'open',
  'close',
  'minimize',
  'restore',
  'menu',
  'ding',
  'click',
]

describe('sound preference', () => {
  it('defaults to enabled', () => {
    expect(isSoundEnabled()).toBe(true)
  })

  it('persists a disabled preference and back', () => {
    setSoundEnabled(false)
    expect(isSoundEnabled()).toBe(false)
    setSoundEnabled(true)
    expect(isSoundEnabled()).toBe(true)
  })
})

describe('playSound', () => {
  // jsdom has no Web Audio API, so this also covers the missing-AudioContext guard.
  it('is a no-op that never throws, for every cue', () => {
    for (const cue of ALL_CUES) {
      expect(() => playSound(cue)).not.toThrow()
    }
  })

  it('does not throw when sounds are disabled', () => {
    setSoundEnabled(false)
    expect(() => playSound('ding')).not.toThrow()
  })
})
