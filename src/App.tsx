import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { WindowManagerProvider } from '@/components/layout/WindowManagerProvider'
import { DesktopShell } from '@/components/layout/DesktopShell'
import { queryClient } from '@/lib/queryClient'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WindowManagerProvider>
          <DesktopShell />
        </WindowManagerProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
