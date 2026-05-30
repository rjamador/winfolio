import { clsx } from 'clsx'

type TextInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  id?: string
  className?: string
  'aria-label'?: string
}

/** Single-line text input with a sunken bevel container. */
export function TextInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  id,
  className,
  'aria-label': ariaLabel,
}: TextInputProps) {
  return (
    <div className={clsx('bevel-sunken bg-w95-light', className)}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full bg-transparent px-1 py-0.5 text-w95 text-w95-text outline-none',
          disabled && 'text-w95-shadow',
        )}
      />
    </div>
  )
}
