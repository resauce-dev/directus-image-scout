import { Provider, ProviderResult } from '../classes/Provider'
import { PexelsImageModel } from '../image-models/pexels'

type PexelsSearchResponse = {
  photos: any[]
  total_results: number
  page: number
  per_page: number
}

export class PexelsProvider extends Provider {
  constructor () {
    super('pexels', 'Pexels', 'https://www.pexels.com')
  }

  getFetchBaseUrl(): string {
    return 'https://api.pexels.com'
  }

  protected getFetchHeaders(): Record<string, string> {
    return { Authorization: this.getApiKey() ?? '' }
  }

  async getSearch(query: string, page: number): Promise<ProviderResult<PexelsImageModel>> {
    const data = await this.fetch<PexelsSearchResponse>(
      'GET',
      `/v1/search?per_page=${this.getFetchLimit()}&page=${page}&query=${query}`,
      this.getFetchHeaders()
    )

    return {
      images: await this.formatResults(data.photos),
      countOfImages: data.total_results,
      countOfPages: Math.round(data.total_results / this.getFetchLimit()),
    }
  }

  async getFeatured(): Promise<ProviderResult<PexelsImageModel>> {
    const data = await this.fetch<PexelsSearchResponse>(
      'GET',
      `/v1/curated?per_page=${this.getFetchLimit()}`,
      this.getFetchHeaders()
    )

    return {
      images: await this.formatResults(data.photos),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
