import React, { useCallback, useState } from 'react'

import useCanvas from '../hooks/useCanvas'

const CANVAS_SIZE = 2048

const Canvas = () => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const handleMouseMove = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      if (!isMouseDown) return

      ctx.lineTo(x, y)

      ctx.lineWidth = 10
      ctx.stroke()
    },
    [isMouseDown]
  )
  const { canvasRef, ctx } = useCanvas({
    scale: 0.25,
    backgroundColor: 'white',
    onMouseDown: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.moveTo(x, y)
      setIsMouseDown(true)
    },
    onMouseUp: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      setIsMouseDown(false)
    },
    onMouseMove: handleMouseMove,
  })

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
