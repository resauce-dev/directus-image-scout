const ImageModel = require(__dirname + '/../classes/ImageModel.cjs')

module.exports = class UnsplashImageModel extends ImageModel {
  /**
   *
   * @param {*} image
   */
  constructor(image) {
    super(image.id, image.urls.small, image.links.download)

    this.setAttribution(image.user.name, image.user.links.html)
    this.setPreviewUrl(image.urls.regular)

    this.setTitle(`Photo by ${image.user.name}`)
    this.setDescription(image.description)
    this.setSize(image.width, image.height)

    if (image.tags) { this.setTags(image.tags.map(tag => tag['title'])) }
    if (image.location) { this.setLocation(image.location.title) }

    const fileName = image.id + '.' + image.urls.full.match(/&fm=([a-z]*)/)[1]
    this.setFileName(fileName)
  }
}
