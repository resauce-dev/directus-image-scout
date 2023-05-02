import ImageModel from '../classes/ImageModel'

interface ImportedImageModel {
  id: string
  title: string
  url: string
  images: {
    original: {
      url: string
    }
    fixed_width: {
      url: string
      width: number
      height: number
    }
  }
  tags: string[]
}

export default class GiphyImageModel extends ImageModel {
  constructor (image: ImportedImageModel) {
    image.title = image.title.replace(/\s?GIF/g, '')

    super(image.id, image.images.fixed_width.url, image.images.original.url)

    this.setAttribution(image.title, image.url)
    this.setPreviewUrl(image.images.original.url)

    this.setTitle(image.title)
    this.setSize(image.images.fixed_width.width, image.images.fixed_width.height)

    if (image.tags) { this.setTags(image.tags) }

    this.setFileName(`${image.id}.gif`)
  }
}
