const ImageModel = require(__dirname + '/../classes/ImageModel')

module.exports = class PexelsImageModel extends ImageModel {
  constructor(image) {
    super(image.id, image.src.medium,  image.src.original)

    this.setAttribution(image.photographer, image.photographer_url)
    this.setPreviewUrl(image.src.large2x)

    this.setTitle(`Photo by ${image.photographer}`)
    this.setSize(image.width, image.height)
  }
}
