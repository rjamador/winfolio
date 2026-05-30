import { useSettings, type Locale } from '@/components/layout/settings'
import { messages, type MessageKey } from './messages'

export type { Locale }
export { detectLocale } from '@/components/layout/settings'

export const LOCALES: Locale[] = ['en', 'es']

/** Translates a key for an explicit locale. */
export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key
}

/** Hook returning the current locale + a bound `t()` translator. */
export function useT(): { locale: Locale; t: (key: MessageKey) => string } {
  const { locale } = useSettings()
  return { locale, t: (key) => translate(locale, key) }
}
