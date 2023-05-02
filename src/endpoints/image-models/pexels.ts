import ImageModel from '../classes/ImageModel'

interface ImportedImageModel {
  id: string
  src: {
    medium: string
    large2x: string
    original: string
  }
  width: number
  height: number
  photographer: string
  photographer_url: string
}

export default class PexelsImageModel extends ImageModel {
  constructor (image: ImportedImageModel) {
    super(image.id, image.src.medium, image.src.original)

    this.setAttribution(image.photographer, image.photographer_url)
    this.setPreviewUrl(image.src.large2x)

    this.setTitle(`Photo by ${image.photographer}`)
    this.setSize(image.width, image.height)
  }
}
