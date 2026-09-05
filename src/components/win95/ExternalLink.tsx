import { clsx } from 'clsx'

type ExternalLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

/** An `<a>` styled as Win95 link text, opening in a new tab with `rel="noreferrer"` baked in. */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={clsx('focus-ring text-w95-titlebar underline', className)}
    >
      {children}
    </a>
  )
}
