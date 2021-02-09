const Provider = require(__dirname + '/../classes/Provider')
const ImageModel = require(__dirname + '/../classes/Image')

module.exports = class Pixabay extends Provider {
	/**
	 * Control and configuration of a provider
	 */
	constructor() { super('pixabay', 'Pixabay', 'https://pixabay.com') }
	getAxiosBaseUrl() { return 'https://pixabay.com/api/' }
  async getSearch(query, page) {
		const { data } = await this.api.get(`/?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}&page=${page}&q=${query}`)
		return {
			images: this.formatResults(data.hits),
			countOfImages: data.totalHits,
			countOfPages: Math.round(data.totalHits / this.getFetchLimit()),
		}
	}
	async getFeatured() {
		const { data } = await this.api.get(`/?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}`)
		return {
			images: this.formatResults(data.hits),
			countOfImages: null,
			countOfPages: null,
		}
	}
	formatResults(data) {
		let results = []
		data.forEach(image => {
		  const model = new ImageModel(image, image.id, image.webformatURL, image.imageURL)
		  model.setAttribution(image.user, `https://pixabay.com/users/${image.user}-${image.user_id}/`)
		  model.setPreviewUrl(image.largeImageURL)

		  model.setTitle(`Photo by ${image.user}`)
		  if(image.tags) { model.setTags(image.tags.split(', ')) }
      model.setSize(image.imageWidth, image.imageHeight)

		  results.push(model)
		})
		return results
  }
}
