const ImageModel = require(__dirname + '/../classes/ImageModel')

module.exports = class GiphyImageModel extends ImageModel {
  constructor(image) {
    super(image.id, image.images.fixed_width.url, image.images.original.url)

    image.title = image.title.replace(/\s?GIF/g, '')

    this.setAttribution(image.title, image.url)
    this.setPreviewUrl(image.images.original.url)

    this.setTitle(image.title)
    this.setFileName(`${image.id}.gif`)
    if(image.tags) { this.setTags(image.tags) }
    this.setSize(image.images.fixed_width.width, image.images.fixed_width.height)
  }
}
