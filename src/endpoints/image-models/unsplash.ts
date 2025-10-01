import { ImageModel } from '../classes/ImageModel'

export interface UnsplashApiImage {
  id: string
  description?: string
  width: number
  height: number
  urls: {
    small: string
    regular: string
    full: string;
    [key: string]: string
  }
  links: {
    download: string;
    [key: string]: string
  }
  user: {
    name: string
    links: { html: string };
    [key: string]: any
  }
  tags?: { title: string }[]
  location?: { title: string }
  [key: string]: any // allow for extra API fields
}

export class UnsplashImageModel extends ImageModel {
  constructor (image: UnsplashApiImage) {
    super(image.id, image.urls.small, image.links.download)

    this.setAttribution(image.user.name, image.user.links.html)
    this.setPreviewUrl(image.urls.regular)

    this.setTitle(`Photo by ${image.user.name}`)
    this.setDescription(image.description ?? '')
    this.setSize(image.width, image.height)

    if (image.tags) {
      this.setTags(image.tags.map(tag => tag.title))
    }

    if (image.location) {
      this.setLocation(image.location.title)
    }

    const extMatch = image.urls.full.match(/&fm=([a-z]*)/)
    const fileExt = extMatch ? extMatch[1] : 'jpg'
    this.setFileName(`${image.id}.${fileExt}`)
  }
}
