function App() {
  // TEMPORARY Phase 1 visual check: exercises the design tokens and Win95 chrome
  // (bevels, title-bar gradient, focus ring, scrollbars) on the teal desktop.
  // Replaced by the real DesktopShell in Phase 3.
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="bevel-raised bg-w95-bg w-80 p-1">
        <div className="titlebar px-1 py-0.5">
          <span className="font-bold">Win95 chrome check</span>
        </div>

        <div className="p-3">
          <p className="mb-2">Raised panel surface with a sunken well below.</p>

          <div className="bevel-sunken win95-scroll bg-w95-light h-24 overflow-auto p-2">
            <p>
              This well is recessed. It scrolls to show the chunky beveled
              scrollbar. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
              Vestibulum id ligula porta felis euismod semper.
            </p>
          </div>

          <button
            type="button"
            className="bevel-raised focus-ring bg-w95-bg mt-3 px-4 py-1"
          >
            Tab to me
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
