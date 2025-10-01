import { Provider, ProviderResult } from '../classes/Provider'
import { UnsplashImageModel } from '../image-models/unsplash'
import { UnsplashImage, UnsplashSearchResponse } from '../types/unsplash'
import { RequestDetails } from '../classes/RequestDetails'

export interface UnsplashUser {
  id: string
  username: string
  name: string
  links: {
    html: string;
    [key: string]: any
  }
}

export interface UnsplashImage {
  id: string
  width: number
  height: number
  description?: string
  alt_description?: string
  urls: {
    small: string
    regular: string
    full: string;
    [key: string]: string
  }
  links: {
    download: string;
    [key: string]: string
  }
  user: UnsplashUser
  tags?: { title: string }[]
  location?: { title: string }
  [key: string]: any
}

export interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

export class UnsplashProvider extends Provider {
  constructor () {
    super('unsplash', 'Unsplash', 'https://unsplash.com')
  }

  getFetchBaseUrl(): string {
    return 'https://api.unsplash.com'
  }

  protected getFetchHeaders(): Record<string, string> {
    return { Authorization: `Client-ID ${this.getApiKey()}` }
  }

  async getSearch(query: string, page: number): Promise<ProviderResult<UnsplashImageModel>> {
    const data = await this.fetch<UnsplashSearchResponse>(
      'GET',
      `/search/photos?per_page=${this.getFetchLimit()}&page=${page}&query=${encodeURIComponent(query)}`,
      this.getFetchHeaders()
    )

    return {
      images: await this.formatResults(data.results),
      countOfImages: data.total,
      countOfPages: data.total_pages,
    }
  }

  async getFeatured(): Promise<ProviderResult<UnsplashImageModel>> {
    const data = await this.fetch<UnsplashImage[]>(
      'GET',
      `/photos/random?featured=true&count=${this.getFetchLimit()}`,
      this.getFetchHeaders()
    )

    return {
      images: await this.formatResults(data),
      countOfImages: null,
      countOfPages: null,
    }
  }

  async downloadImage(req: RequestDetails): Promise<any> {
    const postUrl = `${req.getDirectusApiUrl()}/files/import?access_token=${req.getBody().access_token}`

    const data = {
      url: `${req.getBody().image.url_download}?client_id=${this.getApiKey()}`,
      data: this.formatImageDataForImport(req.getBody().image),
    }

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    return response.json()
  }
}
