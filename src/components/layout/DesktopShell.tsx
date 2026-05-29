import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import {
  Window,
  Taskbar,
  StartMenu,
  Button95,
  DesktopIcon,
} from '@/components/win95'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTaskbarClock } from '@/hooks/useTaskbarClock'
import { useWindowManager } from './windowManager'

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
  const isDesktop = useMediaQuery('(min-width: 1024px)')
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
      {/*
        Desktop: icons + windows. On desktop, windows float (react-rnd, absolute)
        over a column of icons. On mobile, icons collapse to a launcher row and
        windows stack full-bleed in a scrollable column.
      */}
      <div
        className={clsx(
          'relative flex-1',
          isDesktop ? 'overflow-hidden' : 'flex flex-col gap-2 overflow-auto p-2',
        )}
      >
        <div
          className={clsx(
            'gap-3',
            isDesktop ? 'flex flex-col flex-wrap p-2' : 'flex flex-row flex-wrap',
          )}
        >
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
            <Window
              key={w.id}
              draggable
              title={w.title}
              icon={w.icon ? <span aria-hidden>{w.icon}</span> : undefined}
              active={wm.focusedId === w.id}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              zIndex={w.zIndex}
              onFocus={() => wm.focusWindow(w.id)}
              onMinimize={() => wm.minimizeWindow(w.id)}
              onClose={() => wm.closeWindow(w.id)}
              onDragStop={(x, y) => wm.moveWindow(w.id, x, y)}
              onResizeStop={(width, height, x, y) =>
                wm.resizeWindow(w.id, width, height, x, y)
              }
            >
              {bodyFor(w.id)}
            </Window>
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
