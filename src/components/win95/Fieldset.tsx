import { clsx } from 'clsx'

type FieldsetProps = {
  legend: string
  children: React.ReactNode
  className?: string
}

/** Win95 group box: a `<fieldset>` with a sunken-label legend on the border. */
export function Fieldset({ legend, children, className }: FieldsetProps) {
  return (
    <fieldset
      className={clsx(
        'bevel-sunken border-w95-shadow px-3 pb-3 pt-1 text-[11px]',
        className,
      )}
    >
      <legend className="bg-w95-bg px-1">{legend}</legend>
      {children}
    </fieldset>
  )
}
