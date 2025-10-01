import { ImageModel } from '../classes/ImageModel'

export interface PexelsApiImage {
  id: string
  width: number
  height: number
  photographer: string
  photographer_url: string
  src: {
    medium: string
    original: string
    large2x: string
  }
  [key: string]: any // fallback for unused properties
}

export class PexelsImageModel extends ImageModel {
  constructor (image: PexelsApiImage) {
    super(image.id.toString(), image.src.medium, image.src.original)

    this.setAttribution(image.photographer, image.photographer_url)
    this.setPreviewUrl(image.src.large2x)

    this.setTitle(`Photo by ${image.photographer}`)
    this.setSize(image.width, image.height)
  }
}
