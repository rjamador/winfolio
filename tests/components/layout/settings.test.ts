import { afterEach } from 'vitest'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  settingsSchema,
} from './settings'

afterEach(() => localStorage.clear())

describe('settingsSchema', () => {
  it('accepts valid settings', () => {
    expect(() =>
      settingsSchema.parse({ bgColor: '#123abc', textSize: 'lg' }),
    ).not.toThrow()
  })

  it('rejects a non-hex color', () => {
    expect(() => settingsSchema.parse({ bgColor: 'teal', textSize: 'md' })).toThrow()
  })

  it('rejects an unknown text size', () => {
    expect(() =>
      settingsSchema.parse({ bgColor: '#008080', textSize: 'huge' }),
    ).toThrow()
  })
})

describe('loadSettings / saveSettings', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('round-trips saved settings', () => {
    saveSettings({ bgColor: '#800080', textSize: 'lg', locale: 'es' })
    expect(loadSettings()).toEqual({ bgColor: '#800080', textSize: 'lg', locale: 'es' })
  })

  it('falls back to defaults on corrupt data', () => {
    localStorage.setItem('winfolio:settings', '{ not json')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('falls back to defaults on invalid (schema) data', () => {
    localStorage.setItem('winfolio:settings', JSON.stringify({ bgColor: 'nope' }))
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
