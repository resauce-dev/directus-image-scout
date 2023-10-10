const Provider = require(__dirname + '/../classes/Provider.cjs')

module.exports = class Unsplash extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor() { super('unsplash', 'Unsplash', 'https://unsplash.com') }
  getFetchBaseUrl() { return 'https://api.unsplash.com' }
  getFetchHeaders() { return { "Authorization": `Client-ID ${this.getApiKey()}` } }
  async getSearch(query, page) {
    const data = await this.fetch('GET', `/search/photos?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
    return {
      images: this.formatResults(data.results),
      countOfImages: data.total,
      countOfPages: data.total_pages,
    }
  }
  async getFeatured() {
    const data = await this.fetch('GET', `/photos/random?featured=true&count=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data),
      countOfImages: null,
      countOfPages: null,
    }
  }
  async downloadImage(req) {
    const postUrl = `${req.getDirectusApiUrl()}/files/import?access_token=${req.getBody().access_token}`

    const data = {
      url: `${req.getBody().image.url_download}?client_id=${this.getApiKey()}`,
      data: this.formatImageDataForImport(req.getBody().image)
    }
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return response.json()
  }
}
