const axios = require('axios');

module.exports = class Provider {
	/**
	 * Control and configuration of a provider
	 *
	 * @param {String} key
	 * @param {String} name
	 * @param {String} url
	 */
	constructor(key, name, url) {
		this.key = key.toUpperCase()
		this.name = name
		this.url = url
		this.is_configured = this.getApiKey() ? true : false

		this.api = axios.create({
			baseURL: this.getAxiosBaseUrl(),
			headers: this.getAxiosHeaders()
		})
	}
	/**
	 * Return the API Key if it has been configured in the ENV file.
	 */
	getApiKey() {
		return process.env[`API_KEY_${this.key}`]
	}
	/**
	 * Axios base URL: the website that will receive the network request.
	 */
	getAxiosBaseUrl() { return '' }
	/**
	 * Axios headers: Authorization key to send to the server.
	 */
	getAxiosHeaders() { return {} }
	/**
	 * How many items should be returned through the request
	 */
	getFetchLimit() { return 25	}
	/**
	 * Get Featured Images
	 */
	getFeatured() { return null }
	/**
	 * Get Search Images
	 *
	 * @param {String} query
	 * @param {Number} page
	 */
	getSearch(query, page) { return null }
	/**
	 * Process the search results
	 *
	 * @param {*} data
	 */
  formatResults(data) { return null }
  /**
   * Download an image URL to Directus
   * 
   * @param {String} image
   */
  downloadImage(image) { return null }
	/**
	 * Return the data needed to provide to Directus import
   * 
   * @param {*} image
	 */
	formatImageDataForImport(image) {
	  let data = {}
	  if(image.file_title) { data.title = image.file_title }
	  if(image.file_description) { data.description = image.file_description }
	  if(image.file_location) { data.location = image.file_location }
	  if(image.file_name) { data.filename_download = image.file_name }
	  // Always add this tag so we know it came from our system.
	  const tags = image.file_tags.concat([`extension:resauce-image-scout|provider:${this.key}|id:${image.id}`])
	  if(image.file_tags) { data.tags = JSON.stringify(tags) }
	  return data
	}
}
