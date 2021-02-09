const Provider = require(__dirname + '/../classes/Provider')
const ImageModel = require(__dirname + '/../classes/Image')

module.exports = class Giphy extends Provider {
	/**
	 * Control and configuration of a provider
	 */
	constructor() { super('giphy', 'Giphy', 'https://giphy.com') }
	getAxiosBaseUrl() { return 'https://api.giphy.com/v1/' }
  async getSearch(query, page) {
    const { data } = await this.api.get(`/gifs/search?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}&offset=${this.getFetchLimit()*page}&q=${query}`)
		return {
			images: this.formatResults(data.data),
			countOfImages: data.pagination.total_count,
			countOfPages: Math.round(data.pagination.total_count / this.getFetchLimit()),
		}
	}
	async getFeatured() {
		const { data } = await this.api.get(`/gifs/trending?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}`)
		return {
			images: this.formatResults(data.data),
			countOfImages: null,
			countOfPages: null,
		}
	}
	formatResults(data) {
		let results = []
		data.forEach(image => {
		  const model = new ImageModel(image.id, image.images.fixed_width.url, image.images.original.url)

		  image.title = image.title.replace(/\s?GIF/g, '')

		  model.setAttribution(image.title, image.url)
		  model.setPreviewUrl(image.images.original.url)

		  model.setTitle(image.title)
		  model.setFileName(`${image.id}.gif`)
      if(image.tags) { model.setTags(image.tags) }
      model.setSize(image.images.fixed_width.width, image.images.fixed_width.height)

		  results.push(model)
		})
		return results
  }
}
