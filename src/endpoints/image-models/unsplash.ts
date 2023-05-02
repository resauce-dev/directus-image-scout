import ImageModel from '../classes/ImageModel'

interface ImportedImageModel {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  user: {
    name: string
    links: {
      html: string
    }
  }
  links: {
    download: string
  }
  description: string
  width: number
  height: number
  location: {
    title: string
  }
  tags: {
    title: string
  }[]
}

export default class UnsplashImageModel extends ImageModel {
  /**
   *
   * @param {*} image
   */
  constructor (image: ImportedImageModel) {
    super(image.id, image.urls.small, image.links.download)

    this.setAttribution(image.user.name, image.user.links.html)
    this.setPreviewUrl(image.urls.regular)

    this.setTitle(`Photo by ${image.user.name}`)
    this.setDescription(image.description)
    this.setSize(image.width, image.height)

    if (image.tags) { this.setTags(image.tags.map(tag => tag['title'])) }
    if (image.location) { this.setLocation(image.location.title) }

    const fileExt = image.urls.full.match(/&fm=([a-z]*)/)
    const fileName = fileExt ? image.id + '.' + fileExt[1] : image.id
    this.setFileName(fileName)
  }
}
