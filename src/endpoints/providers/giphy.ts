import { Provider, ProviderResult } from '../classes/Provider'
import { GiphyImageModel } from '../image-models/giphy'

interface GiphyApiResponse {
  data: any[]
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}

export class GiphyProvider extends Provider {
  constructor () {
    super('giphy', 'Giphy', 'https://giphy.com')
  }

  getFetchBaseUrl(): string {
    return 'https://api.giphy.com'
  }

  async getSearch(query: string, page: number): Promise<ProviderResult<GiphyImageModel>> {
    const data = await this.fetch<GiphyApiResponse>(
      'GET',
      `/v1/gifs/search?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}&offset=${this.getFetchLimit() * page}&q=${query}`
    )

    return {
      images: await this.formatResults(data.data),
      countOfImages: data.pagination.total_count,
      countOfPages: Math.round(data.pagination.total_count / this.getFetchLimit()),
    }
  }

  async getFeatured(): Promise<ProviderResult<GiphyImageModel>> {
    const data = await this.fetch<GiphyApiResponse>(
      'GET',
      `/v1/gifs/trending?api_key=${this.getApiKey()}&limit=${this.getFetchLimit()}`
    )

    return {
      images: await this.formatResults(data.data),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
