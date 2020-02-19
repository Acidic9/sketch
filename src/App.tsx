import React, { useCallback, useEffect, useReducer, useState } from 'react'
import imagesReducer, { ImageActionType } from './hooks/useImages'

import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'

const CANVAS_SIZE = 2048

const App = () => {
  const [activeImage, setActiveImage] = useState<number | null>(0)
  const [activeImageData, setActiveImageData] = useState<ImageData>(
    new ImageData(CANVAS_SIZE, CANVAS_SIZE)
  )
  const [images, dispatchImages] = useReducer(imagesReducer(CANVAS_SIZE), [
    {
      name: 'Untitled #1',
      data: new ImageData(CANVAS_SIZE, CANVAS_SIZE),
    },
  ])

  // Handle image saving
  const handleImageSave = useCallback(
    (data: ImageData) => {
      dispatchImages({
        type: ImageActionType.Save,
        payload: {
          index: activeImage,
          data,
        },
      })
    },
    [activeImage]
  )

  // Handle image change
  const handleImageSelect = useCallback(
    (index: number) => {
      setActiveImage(index)
      setActiveImageData(images[index].data)
    },
    [images]
  )

  // Handle creating new pages
  const handleNewPage = useCallback(
    (promptName = true) => {
      let name
      if (promptName) {
        name = prompt('New drawing name...', `Untitled #${images.length + 1}`)
        if (name == null) {
          return
        }
      }

      name = name || `Untitled #${images.length + 1}`

      dispatchImages({
        type: ImageActionType.New,
        payload: { name },
      })
      setActiveImage(images.length)
      setActiveImageData(new ImageData(CANVAS_SIZE, CANVAS_SIZE))
    },
    [images]
  )

  const handleImageDelete = useCallback(() => {
    dispatchImages({
      type: ImageActionType.Delete,
      payload: { index: activeImage },
    })

    const index = activeImage == null ? 0 : activeImage - 1
    const image = images[index]
    setActiveImage(index)
    setActiveImageData(
      image ? image.data : new ImageData(CANVAS_SIZE, CANVAS_SIZE)
    )
  }, [activeImage, handleNewPage, activeImage, images])

  useEffect(() => {
    if (images.length === 0) {
      handleNewPage(false)
    }
  }, [images, handleNewPage])

  return (
    <div className="flex justify-center items-center bg-gray-900 w-screen min-h-screen">
      <div className="flex bg-gray-200">
        <Sidebar
          images={images}
          activeImage={activeImage}
          onImageSelect={handleImageSelect}
          onNewPage={handleNewPage}
        />
        <Canvas
          canvasSize={CANVAS_SIZE}
          imageData={activeImageData}
          onImageSave={handleImageSave}
          onImageDelete={handleImageDelete}
        />
      </div>
    </div>
  )
}

export default App
