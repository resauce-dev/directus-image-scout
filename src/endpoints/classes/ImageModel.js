module.exports = class ImageModel {
	/**
	 *
	 * @param {String} id
	 * @param {String} url_thumb
	 * @param {String} url_download
	 */
	constructor(id, url_thumb, url_download) {
	  // Required
	  // this.$source = $source
	  this.id = id
	  this.url_thumb = url_thumb
    this.url_download = url_download
    
    // Not Required
	  this.url_preview = null
	  this.attribution = null

    // Sizing
    this.width = null
    this.height = null

    // Import options
	  this.title = ''
	  this.description = ''
	  this.location = ''
    this.filename_download = null
	  this.tags = ['resauce-image-scout']
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
	/**
	 * Provide attribution information
	 *
	 * @param {String} name
	 * @param {String} url
	 */
	setAttribution(name, url) {
	  this.attribution = {
		name: name,
		url: url
	  }
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
    this.tags = this.tags.concat(data)
    return this
	}
	/**
	 * Add location (typeof:`string`)
	 *
	 * @param {String} data
	 */
	setLocation(data) {
	  this.location = data
	  return this
	}
	/**
	 * Add filename should have extension (typeof:`string`)
	 *
	 * @param {String} data
	 */
	setFileName(data) {
	  if(!data.includes('.')) { throw "Filename should be provided an extension"}
	  this.filename_download = data
	  return this
	}
	/**
	 * Set the size of the image
	 *
	 * @param {Number} width
	 * @param {Number} height
	 */
	setSize(width, height) {
	  this.width = width
	  this.height = height
	  return this
	}
}
