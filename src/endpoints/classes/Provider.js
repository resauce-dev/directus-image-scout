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
}
