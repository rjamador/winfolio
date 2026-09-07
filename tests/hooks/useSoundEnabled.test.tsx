import { afterEach } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSoundEnabled } from '@/hooks/useSoundEnabled'

afterEach(() => localStorage.clear())

describe('useSoundEnabled', () => {
  it('defaults to enabled and persists a toggle', () => {
    const { result } = renderHook(() => useSoundEnabled())
    expect(result.current[0]).toBe(true)

    act(() => result.current[1](false))
    expect(result.current[0]).toBe(false)
    expect(localStorage.getItem('winfolio:sound-enabled')).toBe('false')
  })

  it('keeps independent consumers in sync', async () => {
    const user = userEvent.setup()

    function Toggle({ testId }: { testId: string }) {
      const [on, setOn] = useSoundEnabled()
      return (
        <button type="button" data-testid={testId} onClick={() => setOn(!on)}>
          {on ? 'on' : 'off'}
        </button>
      )
    }

    render(
      <>
        <Toggle testId="a" />
        <Toggle testId="b" />
      </>,
    )

    expect(screen.getByTestId('a')).toHaveTextContent('on')
    expect(screen.getByTestId('b')).toHaveTextContent('on')

    // Flip it from the first consumer; the second reflects it immediately.
    await user.click(screen.getByTestId('a'))
    expect(screen.getByTestId('a')).toHaveTextContent('off')
    expect(screen.getByTestId('b')).toHaveTextContent('off')
  })
})
