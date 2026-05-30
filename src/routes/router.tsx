/* eslint-disable react-refresh/only-export-components --
   This is route configuration, not a component module; it intentionally exports
   the `routes` array (consumed by tests) and the `router` instance. Fast Refresh
   of components does not apply here. */
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Win95Loader } from '@/components/win95'
import App from '@/App'

const NotFound = lazy(() => import('./not-found.route'))

const withSuspense = (el: ReactNode) => (
  <Suspense
    fallback={
      <div className="absolute inset-0 z-[900] flex items-center justify-center">
        <Win95Loader />
      </div>
    }
  >
    {el}
  </Suspense>
)

/**
 * Route tree (library mode — declarative, no framework loaders).
 *
 * Section routes are leaf markers with no element: the windows themselves render
 * in the desktop layer, driven by the URL↔window-manager sync in DesktopShell.
 * Exported so tests can build a memory router from the same definitions.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: null },
      { path: 'about', element: null },
      { path: 'projects', element: null },
      { path: 'projects/:id', element: null },
      { path: 'stack', element: null },
      { path: 'experience', element: null },
      { path: 'resume', element: null },
      { path: 'settings', element: null },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
]

export const router = createBrowserRouter(routes)
