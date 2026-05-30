import { createContext, useContext } from 'react'
import { z } from 'zod'

export const settingsSchema = z.object({
  /** Desktop background color (hex). */
  bgColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default('#000080'),
  /** Base text-size preset. */
  textSize: z.enum(['sm', 'md', 'lg']).default('md'),
})

export type TextSize = z.infer<typeof settingsSchema>['textSize']
export type Settings = z.infer<typeof settingsSchema>

export const DEFAULT_SETTINGS: Settings = settingsSchema.parse({})

/** Multiplier applied to the base text size (drives --w95-font-scale). */
export const TEXT_SCALE: Record<TextSize, number> = {
  sm: 1,
  md: 1.2,
  lg: 1.4,
}

/** Classic Win95 desktop colors offered as quick swatches. */
export const WIN95_SWATCHES: { name: string; value: string }[] = [
  { name: 'Teal', value: '#008080' },
  { name: 'Green', value: '#008000' },
  { name: 'Navy', value: '#000080' },
  { name: 'Purple', value: '#800080' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Olive', value: '#808000' },
  { name: 'Gray', value: '#808080' },
  { name: 'Black', value: '#000000' },
]

const STORAGE_KEY = 'winfolio:settings'

/** Reads persisted settings; falls back to defaults on missing/corrupt data. */
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = settingsSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore quota/availability errors — settings just won't persist.
  }
}

export type SettingsContextValue = {
  bgColor: string
  textSize: TextSize
  setBgColor: (color: string) => void
  setTextSize: (size: TextSize) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
