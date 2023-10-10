const Provider = require(__dirname + '/../classes/Provider.cjs')

module.exports = class Giphy extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor() { super('giphy', 'Giphy', 'https://giphy.com') }
  getFetchBaseUrl() { return 'https://api.giphy.com' }
  async getSearch(query, page) {
    const data = await this.fetch('GET', `/v1/gifs/search?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}&offset=${this.getFetchLimit() * page}&q=${query}`)
    return {
      images: this.formatResults(data.data),
      countOfImages: data.pagination.total_count,
      countOfPages: Math.round(data.pagination.total_count / this.getFetchLimit()),
    }
  }
  async getFeatured() {
    const data = await this.fetch('GET', `/v1/gifs/trending?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data.data),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
