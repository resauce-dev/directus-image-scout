import Provider from '../classes/Provider'
import type { AxiosRequestHeaders } from 'axios'
import type { ScoutSearchResult } from '../types'

module.exports = class Pexels extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor () { super('pexels', 'Pexels', 'https://www.pexels.com') }
  getAxiosBaseUrl(): string { return 'https://api.pexels.com/v1' }
  getAxiosHeaders(): AxiosRequestHeaders { return { "Authorization": `${this.getApiKey()}` } }
  async getSearch(query: string, page: number): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/search?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
    return {
      images: this.formatResults(data.photos),
      countOfImages: data.total_results,
      countOfPages: Math.round(data.total_results / this.getFetchLimit()),
    }
  }
  async getFeatured(): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/curated?per_page=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data.photos),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
