import ImageModel from '../classes/ImageModel'

interface ImportedImageModel {
  id: string
  webformatURL: string
  imageURL: string
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  user: string
  user_id: string
  tags: string
}

export default class PixabayImageModel extends ImageModel {
  constructor (image: ImportedImageModel) {
    super(image.id, image.webformatURL, image.imageURL)

    this.setAttribution(image.user, `https://pixabay.com/users/${image.user}-${image.user_id}/`)
    this.setPreviewUrl(image.largeImageURL)

    this.setTitle(`Photo by ${image.user}`)
    this.setSize(image.imageWidth, image.imageHeight)

    if (image.tags) { this.setTags(image.tags.split(', ')) }
  }
}
