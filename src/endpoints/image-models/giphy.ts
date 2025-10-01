import { ImageModel } from '../classes/ImageModel'

export interface GiphyApiImage {
  id: string
  title: string
  url: string
  tags?: string[]
  images: {
    fixed_width: {
      url: string
      width: string | number
      height: string | number
    }
    original: {
      url: string
    }
  }
}

export class GiphyImageModel extends ImageModel {
  constructor (image: GiphyApiImage) {
    // Clean title: remove "GIF"
    const cleanedTitle = image.title.replace(/\s?GIF/g, '')

    super(image.id, image.images.fixed_width.url, image.images.original.url)

    this.setAttribution(cleanedTitle, image.url)
    this.setPreviewUrl(image.images.original.url)

    this.setTitle(cleanedTitle)
    this.setSize(Number(image.images.fixed_width.width), Number(image.images.fixed_width.height))

    if (image.tags) {
      this.setTags(image.tags)
    }

    this.setFileName(`${image.id}.gif`)
  }
}
