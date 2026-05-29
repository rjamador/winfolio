import {
  INITIAL_STATE,
  windowManagerReducer,
  type WindowState,
} from './windowManager'

const baseWindow: Omit<WindowState, 'zIndex'> = {
  id: 'about',
  title: 'About',
  x: 0,
  y: 0,
  width: 320,
  height: 200,
  minimized: false,
}

describe('windowManagerReducer', () => {
  it('OPEN adds a window and focuses it', () => {
    const state = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    expect(state.windows).toHaveLength(1)
    expect(state.focusedId).toBe('about')
  })

  it('OPEN on an already-open window focuses it instead of duplicating', () => {
    const opened = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    const reopened = windowManagerReducer(opened, { type: 'OPEN', payload: baseWindow })
    expect(reopened.windows).toHaveLength(1)
  })

  it('FOCUS raises a window above the others', () => {
    let state = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    state = windowManagerReducer(state, {
      type: 'OPEN',
      payload: { ...baseWindow, id: 'projects', title: 'Projects' },
    })
    // "about" was opened first; focusing it should give it the highest zIndex.
    state = windowManagerReducer(state, { type: 'FOCUS', id: 'about' })
    const about = state.windows.find((w) => w.id === 'about')!
    const projects = state.windows.find((w) => w.id === 'projects')!
    expect(about.zIndex).toBeGreaterThan(projects.zIndex)
    expect(state.focusedId).toBe('about')
  })

  it('MINIMIZE flags the window and clears focus', () => {
    let state = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'about' })
    expect(state.windows[0]!.minimized).toBe(true)
    expect(state.focusedId).toBeNull()
  })

  it('RESTORE un-minimizes and focuses', () => {
    let state = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    state = windowManagerReducer(state, { type: 'MINIMIZE', id: 'about' })
    state = windowManagerReducer(state, { type: 'RESTORE', id: 'about' })
    expect(state.windows[0]!.minimized).toBe(false)
    expect(state.focusedId).toBe('about')
  })

  it('CLOSE removes the window', () => {
    let state = windowManagerReducer(INITIAL_STATE, { type: 'OPEN', payload: baseWindow })
    state = windowManagerReducer(state, { type: 'CLOSE', id: 'about' })
    expect(state.windows).toHaveLength(0)
    expect(state.focusedId).toBeNull()
  })
})
