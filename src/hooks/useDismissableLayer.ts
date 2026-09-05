import { useEffect, useRef } from 'react'

type UseDismissableLayerOptions = {
  onDismiss: () => void
  /** An element that should NOT count as "outside" (e.g. the toggle button that opens this layer). */
  ignoreRef?: React.RefObject<HTMLElement | null>
  /** Set to false to skip attaching listeners (e.g. while the layer is closed but still mounted). */
  enabled?: boolean
}

/**
 * Dismisses a floating layer (menu/panel) on Escape or on a pointerdown
 * outside its bounds. Returns a ref to attach to the layer's root element.
 */
export function useDismissableLayer<T extends HTMLElement>({
  onDismiss,
  ignoreRef,
  enabled = true,
}: UseDismissableLayerOptions) {
  const layerRef = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      const insideLayer = layerRef.current?.contains(target)
      const onIgnored = ignoreRef?.current?.contains(target)
      if (!insideLayer && !onIgnored) onDismiss()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [enabled, onDismiss, ignoreRef])

  return layerRef
}
