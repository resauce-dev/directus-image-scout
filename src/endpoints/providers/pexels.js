const axios = require('axios');
const Provider = require(__dirname + '/../classes/Provider')
const ImageModel = require(__dirname + '/../classes/Image')

module.exports = class Pexels extends Provider {
	/**
	 * Control and configuration of a provider
	 */
	constructor() { super('pexels', 'Pexels', 'https://www.pexels.com') }
	getAxiosBaseUrl() { return 'https://api.pexels.com/v1' }
	getAxiosHeaders() { return {"Authorization" : `${this.getApiKey()}`} }
    async getSearch(query, page) {
		const { data } = await this.api.get(`/search?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
		return {
			images: this.formatResults(data.photos),
			countOfImages: data.total_results,
			countOfPages: Math.round(data.total_results / this.getFetchLimit()),
		}
	}
	async getFeatured() {
		const { data } = await this.api.get(`/curated?per_page=${this.getFetchLimit()}`)
		return {
			images: this.formatResults(data.photos),
			countOfImages: null,
			countOfPages: null,
		}
	}
	formatResults(data) {
		let results = []
		data.forEach(image => {
		  const model = new ImageModel(image, image.id, image.src.medium,  image.src.original)
		  model.setAttribution(image.photographer, image.photographer_url)
		  model.setPreviewUrl(image.src.large2x)

		  model.setTitle(`Photo by ${image.photographer}`)
      model.setSize(image.width, image.height)
      
		  results.push(model)
		})
		return results
  }
}
