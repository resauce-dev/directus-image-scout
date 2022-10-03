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
	getApiKey() { return process.env[`API_KEY_${this.key}`]	}
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
	 * Process the search results into our format
	 *
	 * @param {*} data
	 */
	formatResults(data) {
		const ImageModel = require(__dirname + `/../image-models/${this.key.toLowerCase()}`)
		return data.map(img => new ImageModel(img))
	}
	/**
	 * Download an image URL to Directus
	 * 
	 * @param {Object} req
	 */
	async downloadImage(req) {
		const postUrl = `${req.getApiUrl()}/files/import?access_token=${req.getBody().access_token}`
		const postBody = {
			url: req.getBody().image.url_download, 
			data: this.formatImageDataForImport(req.getBody().image)
		}
		const res = await axios.post(postUrl, postBody)
		return res.data
	}
	/**
	 * Return the data needed to provide to Directus import
	 * 
	 * @param {*} image
	 */
	formatImageDataForImport(image) {
		const data = {}

		// Conditionally add if set to avoid blank data going in
		if(image.title) data.title = image.title
		if(image.description) data.description = image.description
		if(image.location) data.location = image.location
		if(image.tags) data.tags = JSON.stringify(image.tags)
		if(image.filename_download) data.filename_download = image.filename_download

		return data
	}
}
