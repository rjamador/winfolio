import { useState } from 'react'
import { Button95, MessageBox, Window } from '@/components/win95'

function App() {
  // TEMPORARY Phase 2a visual check: exercises the core primitives on the teal
  // desktop. Replaced by the real DesktopShell + window manager in Phase 3.
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <main className="flex min-h-screen items-start justify-center gap-6 p-8">
      <Window
        title="About — Winfolio"
        className="w-80"
        onMinimize={() => {}}
        onMaximize={() => {}}
        onClose={() => {}}
      >
        <p className="mb-3">
          A Windows 95–styled portfolio. These are the Phase 2a primitives:
          window chrome, buttons, and a modal message box.
        </p>
        <Button95 variant="primary" onClick={() => setDialogOpen(true)}>
          Show message
        </Button95>
      </Window>

      <MessageBox
        open={dialogOpen}
        title="Information"
        message="An error has occurred. Just kidding — everything works."
        onOk={() => setDialogOpen(false)}
        onClose={() => setDialogOpen(false)}
      />
    </main>
  )
}

export default App
