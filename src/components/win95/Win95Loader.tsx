type Win95LoaderProps = {
  label?: string
}

/**
 * "Please wait" loading state for Suspense fallbacks and pending queries.
 * Announces politely to screen readers via a `role="status"` live region.
 */
export function Win95Loader({ label = 'Please wait…' }: Win95LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bevel-raised flex items-center gap-2 bg-w95-bg px-4 py-3 text-w95"
    >
      <span aria-hidden className="text-base">
        ⏳
      </span>
      <span>{label}</span>
    </div>
  )
}
