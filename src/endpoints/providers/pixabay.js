const Provider = require(__dirname + '/../classes/Provider')

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
}
