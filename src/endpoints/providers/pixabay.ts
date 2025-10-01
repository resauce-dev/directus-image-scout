import { Provider, ProviderResult } from '../classes/Provider'
import { PixabayImageModel } from '../image-models/pixabay'

export interface PixabayImage {
  id: number
  pageURL: string
  type: string
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  favorites: number
  likes: number
  comments: number
  user_id: number
  user: string
  userImageURL: string
  [key: string]: any
}

export interface PixabaySearchResponse {
  total: number
  totalHits: number
  hits: PixabayImage[]
}

export class PixabayProvider extends Provider {
  constructor () {
    super('pixabay', 'Pixabay', 'https://pixabay.com')
  }

  getFetchBaseUrl(): string {
    return 'https://pixabay.com'
  }

  async getSearch(query: string, page: number): Promise<ProviderResult<PixabayImageModel>> {
    const data = await this.fetch<PixabaySearchResponse>(
      'GET',
      `/api?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}&page=${page}&q=${encodeURIComponent(
        query
      )}`
    )

    return {
      images: await this.formatResults(data.hits),
      countOfImages: data.totalHits,
      countOfPages: Math.round(data.totalHits / this.getFetchLimit()),
    }
  }

  async getFeatured(): Promise<ProviderResult<PixabayImageModel>> {
    const data = await this.fetch<PixabaySearchResponse>(
      'GET',
      `/api?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}`
    )

    return {
      images: await this.formatResults(data.hits),
      countOfImages: null,
      countOfPages: null,
    }
  }
}
