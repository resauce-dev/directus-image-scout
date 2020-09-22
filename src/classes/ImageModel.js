export default class ImageModel {
  /**
   * 
   * @param {Object} $source 
   * @param {String} title 
   * @param {String} description 
   * @param {String} url_thumb 
   * @param {String} url_download 
   */
  constructor($source, title, description, url_thumb, url_download) {
    // Requied
    this.$source = $source
    this.title = title
    this.description = description
    this.url_thumb = url_thumb
    this.url_download = url_download

    // Not Required
    this.tags = []
    this.location = ''
    this.url_share = ''
    this.url_author = ''
  }
  /**
   * Add tags (typeof:`array`)
   * 
   * @param {Array} data 
   */
  setTags(data) {
    this.tags = data
    return this
  }
  /**
   * Add location (typeof:`string`)
   * 
   * @param {String} data 
   */
  setLocation(data) {
    this.url_share = data
    return this
  }
  /**
   * Add URL to image source page (typeof:`string`)
   * 
   * @param {String} data 
   */
  setShareUrl(data) {
    this.url_share = data
    return this
  }
  /**
   * Add URL to image author page (typeof:`string`)
   * 
   * @param {String} data 
   */
  setAuthorUrl(data) {
    this.url_author = data
    return this
  }
}