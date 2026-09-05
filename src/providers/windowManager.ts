import { createContext, useContext } from 'react'

export type WindowState = {
  id: string
  title: string
  icon?: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
}

export type WindowManagerState = {
  windows: WindowState[]
  focusedId: string | null
  nextZ: number
}

export type WindowManagerAction =
  | { type: 'OPEN'; payload: Omit<WindowState, 'zIndex'> }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'MOVE'; id: string; x: number; y: number }
  | { type: 'RESIZE'; id: string; width: number; height: number; x: number; y: number }

export const INITIAL_STATE: WindowManagerState = {
  windows: [],
  focusedId: null,
  nextZ: 10,
}

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const exists = state.windows.find((w) => w.id === action.payload.id)
      if (exists) {
        // Already open: bring to front and restore if minimized.
        return windowManagerReducer(state, { type: 'FOCUS', id: action.payload.id })
      }
      return {
        ...state,
        windows: [...state.windows, { ...action.payload, zIndex: state.nextZ }],
        focusedId: action.payload.id,
        nextZ: state.nextZ + 1,
      }
    }
    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
        focusedId: state.focusedId === action.id ? null : state.focusedId,
      }
    case 'FOCUS':
      return {
        ...state,
        focusedId: action.id,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: state.nextZ, minimized: false } : w,
        ),
      }
    case 'MINIMIZE':
      return {
        ...state,
        focusedId: state.focusedId === action.id ? null : state.focusedId,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      }
    case 'RESTORE':
      return windowManagerReducer(state, { type: 'FOCUS', id: action.id })
    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
        ),
      }
    case 'RESIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, width: action.width, height: action.height, x: action.x, y: action.y }
            : w,
        ),
      }
    default:
      return state
  }
}

export type WindowManagerContextValue = {
  windows: WindowState[]
  focusedId: string | null
  openWindow: (w: Omit<WindowState, 'zIndex'>) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, width: number, height: number, x: number, y: number) => void
}

export const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider')
  return ctx
}
