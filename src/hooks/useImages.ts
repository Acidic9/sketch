export enum ImageActionType {
  New,
  Save,
  Delete,
}

interface ImageAction {
  type: ImageActionType
  payload: any
}

const imagesReducer = (canvasSize: number) => (
  images: Image[],
  { type, payload }: ImageAction
) => {
  switch (type) {
    case ImageActionType.New:
      return [
        ...images,
        {
          name: payload.name,
          data: new ImageData(canvasSize, canvasSize),
        },
      ]

    case ImageActionType.Save: {
      if (images.length === 0 || images[payload.index] == null) return images
      const newImages = images.slice()
      newImages[payload.index].data = payload.data
      return newImages
    }

    case ImageActionType.Delete: {
      const newImages: Image[] = []
      images
        .filter((_, index) => index !== payload.index)
        .forEach(image => newImages.push(image))
      return newImages
    }

    default:
      return images
  }
}

export default imagesReducer
