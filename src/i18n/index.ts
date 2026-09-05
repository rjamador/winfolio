import { useMemo } from 'react'
import { useSettings, type Locale } from '@/providers/settings'
import { messages, type MessageKey } from './messages'

export type { Locale }
export { detectLocale } from '@/providers/settings'

export const LOCALES: Locale[] = ['en', 'es']

/** Translates a key for an explicit locale. */
export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key
}

/** Hook returning the current locale + a bound `t()` translator. */
export function useT(): { locale: Locale; t: (key: MessageKey) => string } {
  const { locale } = useSettings()
  // Stable identity per locale so `t` is safe to pass to memoized children /
  // effect deps without re-triggering them every render.
  return useMemo(
    () => ({ locale, t: (key: MessageKey) => translate(locale, key) }),
    [locale],
  )
}
