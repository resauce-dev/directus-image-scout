const ImageModel = require(__dirname + '/../classes/ImageModel')

module.exports = class GiphyImageModel extends ImageModel {
  constructor(image) {
    super(image.id, image.images.fixed_width.url, image.images.original.url)

    image.title = image.title.replace(/\s?GIF/g, '')

    model.setAttribution(image.title, image.url)
    model.setPreviewUrl(image.images.original.url)

    model.setTitle(image.title)
    model.setFileName(`${image.id}.gif`)
    if(image.tags) { model.setTags(image.tags) }
    model.setSize(image.images.fixed_width.width, image.images.fixed_width.height)
  }
}
