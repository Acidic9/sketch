import React, { useCallback, useEffect, useState } from 'react'

import mapVal from '../util/mapVal'
import useCanvas from '../hooks/useCanvas'

const CANVAS_SIZE = 2048

const Canvas = () => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const { canvasRef, ctx, canvasBoundingRect } = useCanvas({
    scale: 0.25,
    backgroundColor: 'white',
    onMouseDown: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.moveTo(x, y)
      setIsMouseDown(true)
    },
  })

  // Handle mouse movement
  useEffect(() => {
    const handleMouseOutsideCanvas = (ev: MouseEvent) => {
      if (!isMouseDown || !ctx) return

      const mouseX = ev.clientX
      const mouseY = ev.clientY

      let x = mapVal(
        mouseX,
        canvasBoundingRect.left,
        canvasBoundingRect.right,
        0,
        CANVAS_SIZE
      )
      let y = mapVal(
        mouseY,
        canvasBoundingRect.top,
        canvasBoundingRect.bottom,
        0,
        CANVAS_SIZE
      )

      ctx.lineTo(x, y)
      ctx.lineWidth = 10
      ctx.stroke()
    }

    document.addEventListener('mousemove', handleMouseOutsideCanvas)
    return () =>
      document.removeEventListener('mousemove', handleMouseOutsideCanvas)
  }, [canvasBoundingRect, ctx, isMouseDown])

  // Handle mouse up not only within canvas, but within entire page
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false)

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const clearDrawing = useCallback(() => {
    if (!canvasRef.current || !ctx) return

    canvasRef.current.width = CANVAS_SIZE
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  }, [canvasRef, ctx])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE}></canvas>
      <button
        className="absolute right-0 top-0 text-xs font-bold opacity-75 px-4 py-2 bg-gray-200 cursor-pointer hover:opacity-100"
        onClick={clearDrawing}
      >
        CLEAR
      </button>
    </div>
  )
}

export default Canvas
