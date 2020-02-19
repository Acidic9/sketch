import ImagesList from './ImagesList'
import NewPageButton from './NewPageButton'
import React from 'react'

interface Props {
  images: Image[]
  activeImage: number | null
  onImageSelect?: (index: number) => void
  onNewPage?: () => void
}

const Sidebar = ({ images, activeImage, onImageSelect, onNewPage }: Props) => {
  return (
    <div className="flex flex-col w-56 h-full bg-white border-r border-gray-200">
      <NewPageButton onNewPage={onNewPage} />
      <ImagesList
        images={images}
        activeImage={activeImage}
        onImageSelect={onImageSelect}
      />
    </div>
  )
}

export default Sidebar
