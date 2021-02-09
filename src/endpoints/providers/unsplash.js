const axios = require('axios')
const Provider = require(__dirname + '/../classes/Provider')
const ImageModel = require(__dirname + '/../classes/Image')

module.exports = class Unsplash extends Provider {
	/**
	 * Control and configuration of a provider
	 */
	constructor() { super('unsplash', 'Unsplash', 'https://unsplash.com') }
	getAxiosBaseUrl() { return 'https://api.unsplash.com' }
	getAxiosHeaders() { return {"Authorization" : `Client-ID ${this.getApiKey()}`} }
    async getSearch(query, page) {
		const { data } = await this.api.get(`/search/photos?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
		return {
			images: this.formatResults(data.results),
			countOfImages: data.total,
			countOfPages: data.total_pages,
		}
	}
	async getFeatured() {
		const { data } = await this.api.get(`/photos/random?featured=true&count=${this.getFetchLimit()}`)
		return {
			images: this.formatResults(data),
			countOfImages: null,
			countOfPages: null,
		}
	}
	formatResults(data) {
		let results = []
		data.forEach(image => {
		  const fileName = image.id + '.' + image.urls.full.match(/&fm=([a-z]*)/)[1]
		  const model = new ImageModel(image, image.id, image.urls.small, image.links.download)
		  model.setAttribution(image.user.name, image.user.links.html)
		  model.setPreviewUrl(image.urls.regular)

		  model.setTitle(`Photo by ${image.user.name}`)
		  model.setDescription(image.description)
		  model.setFileName(fileName)
		  if(image.tags) { model.setTags(image.tags.map(tag => tag['title'])) }
      if(image.location) { model.setLocation(image.location.title) }
		  model.setSize(image.width, image.height)

		  results.push(model)
		})
		return results
  }
  async downloadImage(req) {
    const postUrl = `${req.getApiUrl()}/files/import?access_token=${req.getBody().access_token}`
    const { data } = await axios.post(postUrl, {
      url: `${req.getBody().image.url_download}?client_id=${this.getApiKey()}`, 
      data: this.formatImageDataForImport(req.getBody().image)
    })
    return data
  }
}
