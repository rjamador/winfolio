import { useCallback, useReducer } from 'react'
import {
  INITIAL_STATE,
  WindowManagerContext,
  windowManagerReducer,
  type WindowState,
} from './windowManager'

/** Holds the open windows and their stacking/focus state for the desktop. */
export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, INITIAL_STATE)

  const openWindow = useCallback(
    (w: Omit<WindowState, 'zIndex'>) => dispatch({ type: 'OPEN', payload: w }),
    [],
  )
  const closeWindow = useCallback((id: string) => dispatch({ type: 'CLOSE', id }), [])
  const focusWindow = useCallback((id: string) => dispatch({ type: 'FOCUS', id }), [])
  const minimizeWindow = useCallback((id: string) => dispatch({ type: 'MINIMIZE', id }), [])
  const restoreWindow = useCallback((id: string) => dispatch({ type: 'RESTORE', id }), [])
  const moveWindow = useCallback(
    (id: string, x: number, y: number) => dispatch({ type: 'MOVE', id, x, y }),
    [],
  )
  const resizeWindow = useCallback(
    (id: string, width: number, height: number, x: number, y: number) =>
      dispatch({ type: 'RESIZE', id, width, height, x, y }),
    [],
  )

  return (
    <WindowManagerContext.Provider
      value={{
        windows: state.windows,
        focusedId: state.focusedId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        restoreWindow,
        moveWindow,
        resizeWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  )
}
