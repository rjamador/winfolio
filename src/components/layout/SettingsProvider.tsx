import { useCallback, useLayoutEffect, useState } from 'react'
import {
  loadSettings,
  saveSettings,
  SettingsContext,
  TEXT_SCALE,
  type Locale,
  type TextSize,
} from './settings'

/**
 * Holds the user's prefs (desktop color, text size, language), persists them,
 * and applies them to the document root:
 *  - `--w95-desktop`    → background color
 *  - `--w95-font-scale` → multiplier for the scalable text tokens
 *  - `lang` attribute   → current locale
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--w95-desktop', settings.bgColor)
    root.style.setProperty('--w95-font-scale', String(TEXT_SCALE[settings.textSize]))
    root.lang = settings.locale
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
  const setLocale = useCallback(
    (locale: Locale) => setSettings((s) => ({ ...s, locale })),
    [],
  )

  return (
    <SettingsContext.Provider
      value={{
        bgColor: settings.bgColor,
        textSize: settings.textSize,
        locale: settings.locale,
        setBgColor,
        setTextSize,
        setLocale,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
