import { clsx } from 'clsx'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  id?: string
}

/** Checkbox with a real `<input>` for native focus and keyboard support. */
export function Checkbox({ checked, onChange, label, disabled = false, id }: CheckboxProps) {
  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer items-center gap-1.5 text-[11px]',
        disabled && 'cursor-not-allowed text-w95-shadow',
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="focus-ring bevel-sunken h-3 w-3 cursor-pointer accent-w95-titlebar disabled:cursor-not-allowed"
      />
      {label}
    </label>
  )
}
