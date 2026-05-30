import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Window,
  Taskbar,
  StartMenu,
  Button95,
  DesktopIcon,
  PixelIcon,
  Win95Loader,
} from '@/components/win95'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTaskbarClock } from '@/hooks/useTaskbarClock'
import { useT } from '@/i18n'
import type { MessageKey } from '@/i18n/messages'
import { useWindowManager, type WindowState } from './windowManager'

// Feature window bodies are lazy-loaded so each ships as its own chunk.
const AboutWindow = lazy(() =>
  import('@/features/about').then((m) => ({ default: m.AboutWindow })),
)
const ProjectsWindow = lazy(() =>
  import('@/features/projects').then((m) => ({ default: m.ProjectsWindow })),
)
const StackWindow = lazy(() =>
  import('@/features/stack').then((m) => ({ default: m.StackWindow })),
)
const ExperienceWindow = lazy(() =>
  import('@/features/experience').then((m) => ({ default: m.ExperienceWindow })),
)
const SettingsWindow = lazy(() =>
  import('@/features/settings').then((m) => ({ default: m.SettingsWindow })),
)
const ResumeWindow = lazy(() =>
  import('@/features/resume').then((m) => ({ default: m.ResumeWindow })),
)

/** A launchable section of the portfolio (window metadata). */
type AppDefinition = {
  id: string
  title: string
  icon: string
  width: number
  height: number
  /** Whether this window opens automatically on first load (content sections). */
  autoOpen: boolean
}

// `icon` is a PixelIcon semantic name (see PixelIcon's registry).
const APPS: AppDefinition[] = [
  { id: 'about', title: 'About', icon: 'user', width: 440, height: 360, autoOpen: true },
  { id: 'projects', title: 'Projects', icon: 'folder', width: 380, height: 300, autoOpen: true },
  { id: 'stack', title: 'Stack', icon: 'laptop-code', width: 380, height: 320, autoOpen: true },
  { id: 'experience', title: 'Experience', icon: 'briefcase', width: 420, height: 380, autoOpen: true },
  { id: 'resume', title: 'Resume', icon: 'clipboard', width: 480, height: 600, autoOpen: false },
  { id: 'settings', title: 'Settings', icon: 'cog', width: 380, height: 440, autoOpen: true },
]

/** Section title message key for an app id. */
function titleKey(id: string): MessageKey {
  return `section.${id}` as MessageKey
}

const CASCADE_STEP = 28

// Initial layout: a 2-column grid with a small per-window jitter so the desktop
const GRID_COLS = 2
const GRID_BASE_X = 120
const GRID_BASE_Y = 24
const GRID_COL_GAP = 440
const GRID_ROW_GAP = 290
const GRID_JITTER: { dx: number; dy: number }[] = [
  { dx: 0, dy: 0 },
  { dx: 22, dy: -14 },
  { dx: -16, dy: 18 },
  { dx: 10, dy: 8 },
]

function gridPosition(index: number): { x: number; y: number } {
  const col = index % GRID_COLS
  const row = Math.floor(index / GRID_COLS)
  const jitter = GRID_JITTER[index % GRID_JITTER.length]!
  return {
    x: GRID_BASE_X + col * GRID_COL_GAP + jitter.dx,
    y: GRID_BASE_Y + row * GRID_ROW_GAP + jitter.dy,
  }
}

/** Parses a pathname into the section id and optional sub-id (e.g. project id). */
function parseRoute(pathname: string): { section: string | null; id: string | null } {
  const segments = pathname.split('/').filter(Boolean)
  return { section: segments[0] ?? null, id: segments[1] ?? null }
}

function buildPayload(app: AppDefinition, x: number, y: number): Omit<WindowState, 'zIndex'> {
  return {
    id: app.id,
    title: app.title,
    icon: app.icon,
    x,
    y,
    width: app.width,
    height: app.height,
    minimized: false,
  }
}

/** Renders a feature window body, isolated by an error boundary + lazy Suspense. */
function WindowBody({ id, selectedId }: { id: string; selectedId: string | null }) {
  const { t } = useT()
  let body: React.ReactNode = null
  if (id === 'about') body = <AboutWindow />
  else if (id === 'projects') body = <ProjectsWindow selectedId={selectedId} />
  else if (id === 'stack') body = <StackWindow />
  else if (id === 'experience') body = <ExperienceWindow />
  else if (id === 'settings') body = <SettingsWindow />
  else if (id === 'resume') body = <ResumeWindow />

  return (
    <ErrorBoundary>
      <Suspense fallback={<Win95Loader label={t('loader.pleaseWait')} />}>{body}</Suspense>
    </ErrorBoundary>
  )
}

/** The faux Windows 95 desktop: wallpaper, icons, floating windows, taskbar. */
export function DesktopShell() {
  const wm = useWindowManager()
  const clock = useTaskbarClock()
  const { t } = useT()
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
  const desktopRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    windowsRef.current = wm.windows
  }, [wm.windows])

  // On first load, open the content windows in a jittered grid, then Settings
  // last — right-anchored on desktop (clear of the info windows) and last in the
  // mobile stack. Runs once; idempotent regardless.
  const openedAllRef = useRef(false)
  useEffect(() => {
    if (openedAllRef.current) return
    openedAllRef.current = true

    APPS.filter((app) => app.autoOpen && app.id !== 'settings').forEach((app, index) => {
      const { x, y } = gridPosition(index)
      openWindow(buildPayload(app, x, y))
    })

    const settings = APPS.find((app) => app.id === 'settings')
    if (settings) {
      const desktopWidth = desktopRef.current?.clientWidth || window.innerWidth
      const x = Math.max(GRID_BASE_X, desktopWidth - settings.width - 24)
      openWindow(buildPayload(settings, x, GRID_BASE_Y))
    }
  }, [openWindow])

  // URL → window: opening is idempotent (openWindow focuses if already open).
  // On-demand opens (e.g. Resume/Settings) cascade off the current window count.
  useEffect(() => {
    const { section } = parseRoute(location.pathname)
    if (!section) return
    const app = APPS.find((a) => a.id === section)
    if (!app) return
    // Cascade on-demand opens off the icon column too, so they don't cover it.
    const offset = windowsRef.current.length * CASCADE_STEP
    openWindow(buildPayload(app, GRID_BASE_X + offset, GRID_BASE_Y + offset))
  }, [location.pathname, openWindow])

  /** Shareable path for a window; preserves the project id while on a project. */
  const pathFor = (id: string) =>
    id === 'projects' && currentRoute.section === 'projects' && currentRoute.id
      ? `/projects/${currentRoute.id}`
      : `/${id}`

  // window → URL. Uses `replace` so window open/focus/close don't pile up history
  // entries (pressing Back would otherwise replay them and re-open windows).
  const openApp = (app: AppDefinition) => {
    setStartOpen(false)
    navigate(pathFor(app.id), { replace: true })
  }

  const focusWindow = (id: string) => {
    wm.focusWindow(id)
    navigate(pathFor(id), { replace: true })
  }

  const closeWindow = (id: string) => {
    wm.closeWindow(id)
    if (currentRoute.section === id) navigate('/', { replace: true })
  }

  const minimizeWindow = (id: string) => {
    wm.minimizeWindow(id)
    if (currentRoute.section === id) navigate('/', { replace: true })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-w95-desktop">
      {/*
        Desktop: icons + windows. On desktop, windows float (react-rnd, absolute)
        over a column of icons. On mobile, icons collapse to a launcher row and
        windows stack full-bleed in a scrollable column.
      */}
      <div
        ref={desktopRef}
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
              label={t(titleKey(app.id))}
              icon={<PixelIcon name={app.icon} size={32} />}
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
              title={t(titleKey(w.id))}
              icon={w.icon ? <PixelIcon name={w.icon} /> : undefined}
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
              <WindowBody id={w.id} selectedId={currentRoute.id} />
            </Window>
          ))}

        {/* Routed content (e.g. the themed 404) renders over the desktop. */}
        <Outlet />
      </div>

      {/* Start menu: compact anchored panel on desktop, full-width on mobile. */}
      {startOpen && (
        <div
          className={clsx(
            'absolute bottom-[var(--taskbar-height)] left-0 z-[1000]',
            !isDesktop && 'right-0',
          )}
        >
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
                  <PixelIcon name={app.icon} />
                  {t(titleKey(app.id))}
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
        startLabel={t('taskbar.start')}
        startIcon={<PixelIcon name="grid" />}
        clock={clock}
      >
        {wm.windows.map((w) => (
          <Button95
            key={w.id}
            pressable={false}
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
              {w.icon && <PixelIcon name={w.icon} />}
              {t(titleKey(w.id))}
            </span>
          </Button95>
        ))}
      </Taskbar>
    </div>
  )
}
