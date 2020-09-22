export default class ImageModel {
  /**
   * 
   * @param {Object} $source 
   * @param {String} url_thumb 
   * @param {String} url_download 
   */
  constructor($source, url_thumb, url_download) {
    // Requied
    this.$source = $source
    this.url_thumb = url_thumb
    this.url_download = url_download
    
    // Not Required
    this.title = ''
    this.description = ''
    this.tags = []
    this.location = ''
    this.url_share = ''
    this.url_author = ''
    this.url_preview = ''
  }
  /**
   * Add title (typeof:`array`)
   * 
   * @param {String} data 
   */
  setTitle(data) {
    this.title = data
    return this
  }
  /**
   * Add title (typeof:`array`)
   * 
   * @param {String} data 
   */
  setDescription(data) {
    this.description = data
    return this
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
  /**
   * Add URL of image to preview larger (typeof:`string`)
   * 
   * @param {String} data 
   */
  setPreviewUrl(data) {
    this.url_preview = data
    return this
  }
}