import { lazy, Suspense, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { SettingsProvider } from '@/providers/SettingsProvider'
import { WindowManagerProvider } from '@/providers/WindowManagerProvider'
import { DesktopShell } from '@/components/layout/DesktopShell'
import { BootScreen } from '@/components/layout/BootScreen'
import { queryClient } from '@/lib/queryClient'

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
    import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
  )
  : null

/** Desktop + first-visit boot splash. */
function Shell() {
  // Tests bypass the boot splash; real visits always show it.
  const [booting, setBooting] = useState(() => import.meta.env.MODE !== 'test')

  return (
    <WindowManagerProvider>
      <DesktopShell />
      {booting && <BootScreen onDone={() => setBooting(false)} />}
    </WindowManagerProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <Shell />
        </SettingsProvider>
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
