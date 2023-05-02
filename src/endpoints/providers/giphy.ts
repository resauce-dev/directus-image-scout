import Provider from '../classes/Provider'
import type { ScoutSearchResult } from '../types'

module.exports = class Giphy extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor () { super('giphy', 'Giphy', 'https://giphy.com') }
  getAxiosBaseUrl(): string { return 'https://api.giphy.com/v1/' }
  async getSearch(query: string, page: number): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/gifs/search?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}&offset=${this.getFetchLimit() * page}&q=${query}`)
    return {
      images: this.formatResults(data.data),
      countOfImages: data.pagination.total_count,
      countOfPages: Math.round(data.pagination.total_count / this.getFetchLimit()),
    }
  }
  async getFeatured(): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/gifs/trending?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data.data),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
