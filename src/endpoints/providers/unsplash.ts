import axios from 'axios'
import Provider from '../classes/Provider'
import type { AxiosRequestHeaders } from 'axios'
import type { ScoutSearchResult } from '../types'

module.exports = class Unsplash extends Provider {
  /**
   * Control and configuration of a provider
   */
  constructor () { super('unsplash', 'Unsplash', 'https://unsplash.com') }
  getAxiosBaseUrl(): string { return 'https://api.unsplash.com' }
  getAxiosHeaders(): AxiosRequestHeaders { return { "Authorization": `Client-ID ${this.getApiKey()}` } }
  async getSearch(query: string, page: number): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/search/photos?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`)
    return {
      images: this.formatResults(data.results),
      countOfImages: data.total,
      countOfPages: data.total_pages,
    }
  }
  async getFeatured(): Promise<ScoutSearchResult> {
    const { data } = await this.api.get(`/photos/random?featured=true&count=${this.getFetchLimit()}`)
    return {
      images: this.formatResults(data),
      countOfImages: null,
      countOfPages: null,
    }
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
