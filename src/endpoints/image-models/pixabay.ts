import { ImageModel } from '../classes/ImageModel'

export interface PixabayApiImage {
  id: string
  user: string
  user_id: number | string
  webformatURL: string
  imageURL: string
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  tags?: string // e.g. "nature, landscape, tree"
  [key: string]: any // allow extra fields
}

export class PixabayImageModel extends ImageModel {
  constructor (image: PixabayApiImage) {
    super(image.id, image.webformatURL, image.imageURL)

    this.setAttribution(image.user, `https://pixabay.com/users/${image.user}-${image.user_id}/`)
    this.setPreviewUrl(image.largeImageURL)

    this.setTitle(`Photo by ${image.user}`)
    this.setSize(image.imageWidth, image.imageHeight)

    if (image.tags) {
      this.setTags(image.tags.split(', ').map(tag => tag.trim()))
    }
  }
}
