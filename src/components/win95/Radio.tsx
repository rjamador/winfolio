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
        'inline-flex cursor-pointer items-center gap-1.5 text-[11px]',
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
        className="focus-ring h-3 w-3 cursor-pointer accent-w95-titlebar disabled:cursor-not-allowed"
      />
      {label}
    </label>
  )
}
