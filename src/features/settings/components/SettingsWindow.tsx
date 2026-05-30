import { clsx } from 'clsx'
import { Fieldset, Radio } from '@/components/win95'
import {
  useSettings,
  WIN95_SWATCHES,
  type Locale,
  type TextSize,
} from '@/components/layout/settings'
import { useT } from '@/i18n'
import type { MessageKey } from '@/i18n/messages'

const TEXT_SIZES: { value: TextSize; labelKey: MessageKey }[] = [
  { value: 'sm', labelKey: 'settings.small' },
  { value: 'md', labelKey: 'settings.normal' },
  { value: 'lg', labelKey: 'settings.large' },
]

const LANGUAGES: { value: Locale; labelKey: MessageKey }[] = [
  { value: 'en', labelKey: 'settings.english' },
  { value: 'es', labelKey: 'settings.spanish' },
]

/** Settings: desktop background color, text size, and language. */
export function SettingsWindow() {
  const { bgColor, textSize, locale, setBgColor, setTextSize, setLocale } = useSettings()
  const { t } = useT()

  return (
    <div className="flex flex-col gap-3 text-w95">
      <Fieldset legend={t('settings.background')}>
        <ul className="mb-2 flex flex-wrap gap-1">
          {WIN95_SWATCHES.map((swatch) => (
            <li key={swatch.value}>
              <button
                type="button"
                aria-label={swatch.name}
                aria-pressed={bgColor.toLowerCase() === swatch.value.toLowerCase()}
                onClick={() => setBgColor(swatch.value)}
                style={{ backgroundColor: swatch.value }}
                className={clsx(
                  'focus-ring h-6 w-6',
                  bgColor.toLowerCase() === swatch.value.toLowerCase()
                    ? 'bevel-sunken'
                    : 'bevel-raised',
                )}
              />
            </li>
          ))}
        </ul>
        <label className="flex items-center gap-2">
          <span>{t('settings.custom')}</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            aria-label={t('settings.custom')}
            className="focus-ring bevel-sunken h-6 w-10 bg-w95-light p-0.5"
          />
          <span className="tabular-nums opacity-80">{bgColor}</span>
        </label>
      </Fieldset>

      <Fieldset legend={t('settings.textSize')}>
        <div role="radiogroup" aria-label={t('settings.textSize')} className="flex flex-col gap-1">
          {TEXT_SIZES.map((size) => (
            <Radio
              key={size.value}
              name="text-size"
              value={size.value}
              checked={textSize === size.value}
              onChange={() => setTextSize(size.value)}
              label={t(size.labelKey)}
            />
          ))}
        </div>
      </Fieldset>

      <Fieldset legend={t('settings.language')}>
        <div role="radiogroup" aria-label={t('settings.language')} className="flex flex-col gap-1">
          {LANGUAGES.map((lang) => (
            <Radio
              key={lang.value}
              name="language"
              value={lang.value}
              checked={locale === lang.value}
              onChange={() => setLocale(lang.value)}
              label={t(lang.labelKey)}
            />
          ))}
        </div>
      </Fieldset>
    </div>
  )
}
