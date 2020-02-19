import React from 'react'

interface Props {
  onNewPage?: () => void
}

const NewPageButton = ({ onNewPage }: Props) => {
  return (
    <button
      className="uppercase text-xs font-bold tracking-widest py-2 border-b border-gray-200 hover:bg-gray-100"
      onClick={() => onNewPage && onNewPage()}
    >
      New Page
    </button>
  )
}

export default NewPageButton
