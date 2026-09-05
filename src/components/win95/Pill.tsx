import { clsx } from 'clsx'

type PillProps = {
  children: React.ReactNode
  className?: string
}

/** A raised-bevel tag for a list of tech/skills. Renders as `<li>` — use inside a `<ul>`. */
export function Pill({ children, className }: PillProps) {
  return <li className={clsx('bevel-raised bg-w95-bg px-2 py-0.5', className)}>{children}</li>
}
