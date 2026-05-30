import { clsx } from 'clsx'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  disabled?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

/** Native dropdown with a sunken bevel container. */
export function Select({
  value,
  onChange,
  options,
  disabled = false,
  id,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  return (
    <div className={clsx('bevel-sunken bg-w95-light', className)}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-1 py-0.5 text-w95 text-w95-text outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
