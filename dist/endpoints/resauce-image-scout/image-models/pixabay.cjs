const ImageModel = require(__dirname + '/../classes/ImageModel.cjs')

module.exports = class PixabayImageModel extends ImageModel {
  constructor(image) {
    super(image.id, image.webformatURL, image.imageURL)

    this.setAttribution(image.user, `https://pixabay.com/users/${image.user}-${image.user_id}/`)
    this.setPreviewUrl(image.largeImageURL)

    this.setTitle(`Photo by ${image.user}`)
    this.setSize(image.imageWidth, image.imageHeight)

    if (image.tags) { this.setTags(image.tags.split(', ')) }
  }
}
