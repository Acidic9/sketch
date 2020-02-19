import { useEffect, useRef, useState } from 'react'

interface CanvasOptions {
  scale?: number
  backgroundColor?: string
  onMouseDown?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void
  onMouseUp?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void
  onMouseMove?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void
}

const useCanvas = ({
  scale,
  backgroundColor,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: CanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [canvasBoundingRect, setCanvasBoundingRect] = useState<DOMRect>(
    new DOMRect()
  )

  // Set canvas size to scale
  useEffect(() => {
    if (!canvasRef.current || scale == null || scale == 1) return

    canvasRef.current.style.width = `${canvasRef.current.width * scale}px`
    canvasRef.current.style.height = `${canvasRef.current.height * scale}px`
  }, [canvasRef, scale])

  // Update CTX
  useEffect(() => {
    if (!canvasRef.current) {
      setCtx(null)
      return
    }

    setCtx(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  // Update canvas offset for relative mouse position
  useEffect(() => {
    const updateCanvasOffset = () => {
      if (!canvasRef.current) return
      const boundingRect = canvasRef.current.getBoundingClientRect()
      setCanvasBoundingRect(boundingRect)
    }

    updateCanvasOffset()
    window.addEventListener('resize', updateCanvasOffset)

    return () => window.removeEventListener('resize', updateCanvasOffset)
  }, [canvasRef])

  // Set background color
  useEffect(() => {
    if (!ctx || !canvasRef.current || !backgroundColor) return

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }, [canvasRef, ctx, backgroundColor])

  // Handle mouse events
  useEffect(() => {
    if (!canvasRef.current || !ctx) return

    const handleMouseEvent = (
      ev: MouseEvent,
      fn?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void
    ) => {
      if (!fn) return

      const x = (ev.clientX - canvasBoundingRect.left) * (1 / (scale || 1))
      const y = (ev.clientY - canvasBoundingRect.top) * (1 / (scale || 1))

      return fn(ctx, x, y)
    }

    const handleMouseDown = (ev: MouseEvent) =>
      handleMouseEvent(ev, onMouseDown)

    const handleMouseUp = (ev: MouseEvent) => handleMouseEvent(ev, onMouseUp)

    const handleMouseMove = (ev: MouseEvent) =>
      handleMouseEvent(ev, onMouseMove)

    canvasRef.current.addEventListener('mousedown', handleMouseDown)
    canvasRef.current.addEventListener('mouseup', handleMouseUp)
    canvasRef.current.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (!canvasRef.current) return

      canvasRef.current.removeEventListener('mousedown', handleMouseDown)
      canvasRef.current.removeEventListener('mouseup', handleMouseUp)
      canvasRef.current.removeEventListener('mousemove', handleMouseMove)
    }
  }, [canvasRef, ctx, canvasBoundingRect, onMouseDown, onMouseUp, onMouseMove])

  return {
    canvasRef,
    ctx,
    canvasBoundingRect,
  }
}

export default useCanvas
