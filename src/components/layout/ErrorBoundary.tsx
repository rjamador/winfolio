import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button95 } from '@/components/win95'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Custom fallback. Defaults to the themed Win95 error screen. */
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * Catches render errors in its subtree and shows a themed Win95 error screen
 * instead of a blank page. Reusable to wrap individual windows/features.
 *
 * This is a class component on purpose: React provides no functional API for
 * error boundaries, so this is the codebase's single, deliberate exception to
 * the function-components-only rule.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, info.componentStack)
    }
  }

  override render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="flex h-full min-h-40 items-center justify-center p-4">
        <div
          role="alertdialog"
          aria-labelledby="errorboundary-title"
          className="bevel-raised w-80 max-w-full bg-w95-bg p-0.5"
        >
          <div className="titlebar h-[18px] select-none px-1">
            <span id="errorboundary-title" className="text-[11px] font-bold">
              Winfolio
            </span>
          </div>
          <div className="flex items-start gap-3 px-3 py-4 text-[11px]">
            <span aria-hidden className="text-2xl leading-none">
              ✖
            </span>
            <p className="flex-1">An error has occurred.</p>
          </div>
          <div className="flex justify-center pb-3">
            <Button95 variant="primary" onClick={() => window.location.reload()}>
              OK
            </Button95>
          </div>
        </div>
      </div>
    )
  }
}
