import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
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
import { useWindowManager, type WindowState } from './windowManager'

/**
 * A launchable section of the portfolio. The body is a placeholder for now;
 * Phase 7 features supply the real content.
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

const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 200
const CASCADE_STEP = 28

/** Parses a pathname into the section id and optional sub-id (e.g. project id). */
function parseRoute(pathname: string): { section: string | null; id: string | null } {
  const segments = pathname.split('/').filter(Boolean)
  return { section: segments[0] ?? null, id: segments[1] ?? null }
}

function buildPayload(app: AppDefinition, offset: number): Omit<WindowState, 'zIndex'> {
  return {
    id: app.id,
    title: app.title,
    icon: app.icon,
    x: 48 + offset,
    y: 32 + offset,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minimized: false,
  }
}

/** The faux Windows 95 desktop: wallpaper, icons, floating windows, taskbar. */
export function DesktopShell() {
  const wm = useWindowManager()
  const clock = useTaskbarClock()
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [startOpen, setStartOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)

  const currentRoute = parseRoute(location.pathname)

  // Stable open action + a ref to the latest windows, so the URL→window effect
  // depends only on the pathname (not on window-state changes, which would make
  // it fight user focus).
  const { openWindow } = wm
  const windowsRef = useRef(wm.windows)
  useEffect(() => {
    windowsRef.current = wm.windows
  }, [wm.windows])

  // URL → window: opening is idempotent (openWindow focuses if already open).
  useEffect(() => {
    const { section } = parseRoute(location.pathname)
    if (!section) return
    const app = APPS.find((a) => a.id === section)
    if (!app) return
    openWindow(buildPayload(app, windowsRef.current.length * CASCADE_STEP))
  }, [location.pathname, openWindow])

  /** Shareable path for a window; preserves the project id while on a project. */
  const pathFor = (id: string) =>
    id === 'projects' && currentRoute.section === 'projects' && currentRoute.id
      ? `/projects/${currentRoute.id}`
      : `/${id}`

  // window → URL (push). The effect above performs the actual open.
  const openApp = (app: AppDefinition) => {
    setStartOpen(false)
    navigate(pathFor(app.id))
  }

  const focusWindow = (id: string) => {
    wm.focusWindow(id)
    navigate(pathFor(id), { replace: true })
  }

  const closeWindow = (id: string) => {
    wm.closeWindow(id)
    if (currentRoute.section === id) navigate('/')
  }

  const minimizeWindow = (id: string) => {
    wm.minimizeWindow(id)
    if (currentRoute.section === id) navigate('/', { replace: true })
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
              onFocus={() => focusWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
              onClose={() => closeWindow(w.id)}
              onDragStop={(x, y) => wm.moveWindow(w.id, x, y)}
              onResizeStop={(width, height, x, y) =>
                wm.resizeWindow(w.id, width, height, x, y)
              }
            >
              {bodyFor(w.id)}
            </Window>
          ))}

        {/* Routed content (e.g. the themed 404) renders over the desktop. */}
        <Outlet />
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
                ? focusWindow(w.id)
                : minimizeWindow(w.id)
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
