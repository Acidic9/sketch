import React, { useCallback, useEffect, useState } from 'react'

import mapVal from '../util/mapVal'
import useCanvas from '../hooks/useCanvas'

interface Props {
  canvasSize: number
  imageData: ImageData
  onImageSave?: (data: ImageData) => void
  onImageDelete?: () => void
}

const Canvas = ({
  canvasSize,
  imageData,
  onImageSave,
  onImageDelete,
}: Props) => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const { canvasRef, ctx, canvasBoundingRect } = useCanvas({
    scale: 0.25,
    backgroundColor: 'white',
    onMouseDown: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.moveTo(x, y)
      setIsMouseDown(true)
    },
  })

  const clearDrawing = useCallback(() => {
    if (!canvasRef.current || !ctx) return

    canvasRef.current.width = canvasSize
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
  }, [canvasRef, ctx, canvasSize])

  // Handle image data update
  useEffect(() => {
    if (!ctx) return

    clearDrawing()
    ctx.putImageData(imageData, 0, 0)
  }, [ctx, imageData, clearDrawing])

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
        canvasSize
      )
      let y = mapVal(
        mouseY,
        canvasBoundingRect.top,
        canvasBoundingRect.bottom,
        0,
        canvasSize
      )

      ctx.lineTo(x, y)
      ctx.lineWidth = 10
      ctx.stroke()
    }

    document.addEventListener('mousemove', handleMouseOutsideCanvas)
    return () =>
      document.removeEventListener('mousemove', handleMouseOutsideCanvas)
  }, [canvasBoundingRect, ctx, canvasSize, isMouseDown])

  const saveDrawing = useCallback(() => {
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize)

    if (onImageSave) onImageSave(imageData)
  }, [ctx, canvasSize, onImageSave])

  // Handle mouse up not only within canvas, but within entire page
  useEffect(() => {
    const handleMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false)
        saveDrawing()
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [ctx, saveDrawing, onImageSave, isMouseDown])

  const deleteDrawing = useCallback(() => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this drawing?'
    )
    if (!confirmation) return

    if (onImageDelete) onImageDelete()
  }, [onImageDelete])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="bg-white"
        width={canvasSize}
        height={canvasSize}
      ></canvas>
      <div className="absolute top-0 right-0 flex">
        <button
          className="text-xs font-bold opacity-75 px-4 py-2 bg-gray-200 cursor-pointer hover:opacity-100"
          onClick={clearDrawing}
        >
          CLEAR
        </button>
        <button
          className="text-xs font-bold opacity-75 px-4 py-2 bg-gray-200 cursor-pointer hover:opacity-100"
          onClick={deleteDrawing}
        >
          X
        </button>
      </div>
    </div>
  )
}

export default Canvas
