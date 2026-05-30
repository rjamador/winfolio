import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { WindowManagerProvider } from '@/components/layout/WindowManagerProvider'
import { DesktopShell } from '@/components/layout/DesktopShell'
import { BootScreen } from '@/components/layout/BootScreen'
import { queryClient } from '@/lib/queryClient'

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
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
