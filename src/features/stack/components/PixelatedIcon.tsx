import { useEffect, useRef, type ComponentType } from 'react'

type PixelatedIconProps = {
  /** A devicons-react component (renders an inline SVG). */
  Icon: ComponentType<{ size?: number }>
  /** Displayed size in px. */
  size?: number
  /** Low raster resolution (px) — smaller = chunkier pixels. */
  resolution?: number
}

/**
 * Renders a (smooth) SVG logo as pixel art: rasterizes it onto a low-resolution
 * canvas, then upscales with nearest-neighbor (`image-rendering: pixelated`),
 * keeping the brand colors. The source SVG is rendered hidden just to read its
 * markup.
 */
export function PixelatedIcon({ Icon, size = 36, resolution = 18 }: PixelatedIconProps) {
  const sourceRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const svg = sourceRef.current?.querySelector('svg')
    const canvas = canvasRef.current
    if (!svg || !canvas) return

    let ctx: CanvasRenderingContext2D | null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      return // e.g. jsdom without canvas support
    }
    if (!ctx) return
    const context = ctx

    const markup = new XMLSerializer().serializeToString(svg)
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, resolution, resolution)
      context.drawImage(img, 0, 0, resolution, resolution)
    }
    img.src = url
    return () => {
      img.onload = null
    }
  }, [Icon, resolution])

  return (
    <>
      <span ref={sourceRef} aria-hidden className="hidden">
        <Icon size={resolution} />
      </span>
      <canvas
        ref={canvasRef}
        width={resolution}
        height={resolution}
        aria-hidden
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
      />
    </>
  )
}
