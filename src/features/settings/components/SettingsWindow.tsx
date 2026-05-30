import { clsx } from 'clsx'
import { Fieldset, Radio } from '@/components/win95'
import {
  useSettings,
  WIN95_SWATCHES,
  type TextSize,
} from '@/components/layout/settings'

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Normal' },
  { value: 'lg', label: 'Large' },
]

/** Settings: change the desktop background color and the text size. */
export function SettingsWindow() {
  const { bgColor, textSize, setBgColor, setTextSize } = useSettings()

  return (
    <div className="flex flex-col gap-3 text-w95">
      <Fieldset legend="Background">
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
          <span>Custom:</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            aria-label="Custom background color"
            className="focus-ring bevel-sunken h-6 w-10 bg-w95-light p-0.5"
          />
          <span className="tabular-nums opacity-80">{bgColor}</span>
        </label>
      </Fieldset>

      <Fieldset legend="Text size">
        <div
          role="radiogroup"
          aria-label="Text size"
          className="flex flex-col gap-1"
        >
          {TEXT_SIZES.map((size) => (
            <Radio
              key={size.value}
              name="text-size"
              value={size.value}
              checked={textSize === size.value}
              onChange={() => setTextSize(size.value)}
              label={size.label}
            />
          ))}
        </div>
      </Fieldset>
    </div>
  )
}
