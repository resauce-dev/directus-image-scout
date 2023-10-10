const Provider = require(__dirname + '/../classes/Provider.cjs')

module.exports = class Pexels extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor() { super('pexels', 'Pexels', 'https://www.pexels.com') }
  getFetchBaseUrl() { return 'https://api.pexels.com' }
  getFetchHeaders() { return { "Authorization": `${this.getApiKey()}` } }
  async getSearch(query, page) {
    const data = await await this.fetch('GET', `/v1/search?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
    return {
      images: this.formatResults(data.photos),
      countOfImages: data.total_results,
      countOfPages: Math.round(data.total_results / this.getFetchLimit()),
    }
  }
  async getFeatured() {
    const data = await await this.fetch('GET', `/v1/curated?per_page=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data.photos),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
