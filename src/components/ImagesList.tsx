import React from 'react'

interface Props {
  images: Image[]
  activeImage: number | null
  onImageSelect?: (index: number) => void
}

const ImagesList = ({ images, activeImage, onImageSelect }: Props) => {
  return (
    <div className="flex flex-col">
      {images.map((image, index) => (
        <button
          className={`py-3 text-xs ${
            index === activeImage
              ? 'bg-blue-700 text-white font-bold'
              : 'bg-white text-black'
          }`}
          key={image.name + index}
          onClick={() => onImageSelect && onImageSelect(index)}
        >
          {image.name}
        </button>
      ))}
    </div>
  )
}

export default ImagesList
