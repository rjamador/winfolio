import { clsx } from 'clsx'

type TextAreaProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  id?: string
  className?: string
  'aria-label'?: string
}

/** Multi-line text area with a sunken bevel container. */
export function TextArea({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 4,
  id,
  className,
  'aria-label': ariaLabel,
}: TextAreaProps) {
  return (
    <div className={clsx('bevel-sunken bg-w95-light', className)}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'win95-scroll w-full resize-none bg-transparent px-1 py-0.5 text-[11px] text-w95-text outline-none',
          disabled && 'text-w95-shadow',
        )}
      />
    </div>
  )
}
