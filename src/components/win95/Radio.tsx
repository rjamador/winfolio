import { clsx } from 'clsx'

type RadioProps = {
  checked: boolean
  onChange: (value: string) => void
  label: string
  name: string
  value: string
  disabled?: boolean
  id?: string
}

/** Radio button with a real `<input>` for native focus and keyboard support. */
export function Radio({ checked, onChange, label, name, value, disabled = false, id }: RadioProps) {
  return (
    <label
      className={clsx(
        'win95-radio-label inline-flex cursor-pointer items-center gap-1.5 text-w95',
        disabled && 'cursor-not-allowed text-w95-shadow',
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="win95-radio-input sr-only"
      />
      <span className="win95-radio" aria-hidden>
        {/*
          Drawn as crisp-edged SVG (no anti-aliasing) so the circle reads as a
          chunky Win95 bitmap, matching the pixel font/icons — a smooth CSS
          circle looks out of place. Two-tone sunken rim: dark top-left, light
          bottom-right. The center dot is toggled by the checked input via CSS.
        */}
        <svg width="12" height="12" viewBox="0 0 12 12" shapeRendering="crispEdges">
          <circle cx="6" cy="6" r="5" fill="var(--w95-light)" />
          <path d="M9.89 2.11 A5.5 5.5 0 0 0 2.11 9.89" fill="none" stroke="var(--w95-shadow)" />
          <path d="M9.18 2.82 A4.5 4.5 0 0 0 2.82 9.18" fill="none" stroke="var(--w95-darkshadow)" />
          <path d="M9.89 2.11 A5.5 5.5 0 0 1 2.11 9.89" fill="none" stroke="var(--w95-light)" />
          <path d="M9.18 2.82 A4.5 4.5 0 0 1 2.82 9.18" fill="none" stroke="var(--w95-bg)" />
          <circle className="win95-radio-dot" cx="6" cy="6" r="1.6" />
        </svg>
      </span>
      {label}
    </label>
  )
}
