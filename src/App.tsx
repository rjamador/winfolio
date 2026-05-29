import { WindowManagerProvider } from '@/components/layout/WindowManagerProvider'
import { DesktopShell } from '@/components/layout/DesktopShell'

function App() {
  return (
    <WindowManagerProvider>
      <DesktopShell />
    </WindowManagerProvider>
  )
}

export default App
