import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import {
  Window,
  Taskbar,
  StartMenu,
  Button95,
  DesktopIcon,
} from '@/components/win95'
import { useTaskbarClock } from '@/hooks/useTaskbarClock'
import { useWindowManager, type WindowState } from './windowManager'

/**
 * A launchable section of the portfolio. The body is a placeholder in Phase 3;
 * Phase 5 routing + Phase 7 features supply the real content.
 */
type AppDefinition = {
  id: string
  title: string
  icon: string
  body: React.ReactNode
}

const APPS: AppDefinition[] = [
  {
    id: 'about',
    title: 'About',
    icon: '👤',
    body: <p>About window — content arrives in Phase 7.</p>,
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    body: <p>Projects window — content arrives in Phase 7.</p>,
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '✉️',
    body: <p>Contact window — content arrives in Phase 7.</p>,
  },
]

const DEFAULT_SIZE = { width: 320, height: 200 }
const CASCADE_STEP = 28

/** The faux Windows 95 desktop: wallpaper, icons, floating windows, taskbar. */
export function DesktopShell() {
  const wm = useWindowManager()
  const clock = useTaskbarClock()
  const [startOpen, setStartOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)

  const openApp = (app: AppDefinition) => {
    const offset = wm.windows.length * CASCADE_STEP
    wm.openWindow({
      id: app.id,
      title: app.title,
      icon: app.icon,
      x: 48 + offset,
      y: 32 + offset,
      width: DEFAULT_SIZE.width,
      height: DEFAULT_SIZE.height,
      minimized: false,
    })
    setStartOpen(false)
  }

  const bodyFor = (id: string) => APPS.find((a) => a.id === id)?.body

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-w95-desktop">
      {/* Desktop: icons + floating windows */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex flex-col flex-wrap gap-4 p-2">
          {APPS.map((app) => (
            <DesktopIcon
              key={app.id}
              label={app.title}
              icon={app.icon}
              selected={selectedIcon === app.id}
              onClick={() => setSelectedIcon(app.id)}
              onDoubleClick={() => openApp(app)}
            />
          ))}
        </div>

        {wm.windows
          .filter((w) => !w.minimized)
          .map((w) => (
            <FloatingWindow key={w.id} window={w} body={bodyFor(w.id)} />
          ))}
      </div>

      {/* Start menu, anchored above the Start button */}
      {startOpen && (
        <div className="absolute bottom-[var(--taskbar-height)] left-0 z-[1000]">
          <StartMenu
            open
            onClose={() => setStartOpen(false)}
            triggerRef={startButtonRef}
          >
            {APPS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => openApp(app)}
                  className="focus-ring flex w-full items-center gap-2 px-3 py-1 text-left hover:bg-w95-titlebar hover:text-w95-titlebar-text"
                >
                  <span aria-hidden>{app.icon}</span>
                  {app.title}
                </button>
              </li>
            ))}
          </StartMenu>
        </div>
      )}

      <Taskbar
        onStartClick={() => setStartOpen((v) => !v)}
        startActive={startOpen}
        startButtonRef={startButtonRef}
        clock={clock}
      >
        {wm.windows.map((w) => (
          <Button95
            key={w.id}
            className={clsx(
              'max-w-40 truncate',
              wm.focusedId === w.id && !w.minimized && 'bevel-sunken',
            )}
            onClick={() =>
              w.minimized || wm.focusedId !== w.id
                ? wm.restoreWindow(w.id)
                : wm.minimizeWindow(w.id)
            }
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>{w.icon}</span>
              {w.title}
            </span>
          </Button95>
        ))}
      </Taskbar>
    </div>
  )
}

type FloatingWindowProps = {
  window: WindowState
  body: React.ReactNode
}

/**
 * Positions a Window absolutely on the desktop using window-manager state.
 * Phase 4 replaces this wrapper with react-rnd for drag/resize.
 */
function FloatingWindow({ window: w, body }: FloatingWindowProps) {
  const wm = useWindowManager()
  const active = wm.focusedId === w.id

  return (
    <div
      className="absolute"
      style={{ left: w.x, top: w.y, width: w.width, zIndex: w.zIndex }}
      onMouseDown={() => wm.focusWindow(w.id)}
    >
      <Window
        title={w.title}
        icon={w.icon ? <span aria-hidden>{w.icon}</span> : undefined}
        active={active}
        onMinimize={() => wm.minimizeWindow(w.id)}
        onClose={() => wm.closeWindow(w.id)}
      >
        {body}
      </Window>
    </div>
  )
}
