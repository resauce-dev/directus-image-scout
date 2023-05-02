import Provider from '../classes/Provider'
import type { ScoutSearchResult } from '../types'

module.exports = class Pixabay extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor () { super('pixabay', 'Pixabay', 'https://pixabay.com') }
  getAxiosBaseUrl(): string { return 'https://pixabay.com/api/' }
  async getSearch(query: string, page: number): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}&page=${page}&q=${query}`)
    return {
      images: this.formatResults(data.hits),
      countOfImages: data.totalHits,
      countOfPages: Math.round(data.totalHits / this.getFetchLimit()),
    }
  }
  async getFeatured(): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data.hits),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
