import { useCallback, useLayoutEffect, useState } from 'react'
import {
  loadSettings,
  saveSettings,
  SettingsContext,
  TEXT_SCALE,
  type TextSize,
} from './settings'

/**
 * Holds the user's theme prefs (desktop color + text size), persists them, and
 * applies them as CSS custom properties on the document root:
 *  - `--w95-desktop`    → background color
 *  - `--w95-font-scale` → multiplier for the scalable text tokens
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--w95-desktop', settings.bgColor)
    root.style.setProperty('--w95-font-scale', String(TEXT_SCALE[settings.textSize]))
    saveSettings(settings)
  }, [settings])

  const setBgColor = useCallback(
    (bgColor: string) => setSettings((s) => ({ ...s, bgColor })),
    [],
  )
  const setTextSize = useCallback(
    (textSize: TextSize) => setSettings((s) => ({ ...s, textSize })),
    [],
  )

  return (
    <SettingsContext.Provider
      value={{ bgColor: settings.bgColor, textSize: settings.textSize, setBgColor, setTextSize }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
