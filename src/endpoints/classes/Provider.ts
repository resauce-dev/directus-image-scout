import { ImageModel } from './ImageModel'
import { RequestDetails } from './RequestDetails'

import { GiphyImageModel } from '../image-models/giphy.js'
import { PexelsImageModel } from '../image-models/pexels.js'
import { PixabayImageModel } from '../image-models/pixabay.js'
import { UnsplashImageModel } from '../image-models/unsplash.js'

const IMAGE_MODELS: Record<string, any> = {
  giphy: GiphyImageModel,
  pexels: PexelsImageModel,
  pixabay: PixabayImageModel,
  unsplash: UnsplashImageModel,
}

export type ProviderResult<T = ImageModel> = {
  images: T[]
  countOfImages: number | null
  countOfPages: number | null
}

export abstract class Provider {
  public key: string
  public name: string
  public url: string
  public is_configured: boolean

  constructor (key: string, name: string, url: string) {
    this.key = key.toUpperCase()
    this.name = name
    this.url = url
    this.is_configured = Boolean(this.getApiKey())
  }

  /**
   * Fetch utility
   */
  protected async fetch<T = any>(
    method: 'GET' | 'POST',
    urlPath: string,
    data?: any
  ): Promise<T> {
    const res = await fetch(
      new URL(urlPath, this.getFetchBaseUrl()),
      {
        method,
        headers: this.getFetchHeaders(),
        body: method === 'GET' ? undefined : JSON.stringify(data),
      }
    )
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }
    return res.json() as Promise<T>
  }

  /**
   * Return the API Key if it has been configured in the ENV file.
   */
  protected getApiKey(): string | undefined {
    return process.env[`API_KEY_${this.key}`]
  }

  /**
   * Full base URL: the API that will receive the network request.
   */
  abstract getFetchBaseUrl(): string

  /**
   * All required headers (including authorization key for the platform)
   */
  protected getFetchHeaders(): Record<string, string> {
    return {}
  }

  /**
   * How many items should be returned through the request
   */
  getFetchLimit(): number {
    return 25
  }

  /**
   * Get Featured Images
   */
  abstract getFeatured(): Promise<ProviderResult> | null

  /**
   * Get Search Images
   */
  abstract getSearch(query: string, page: number): Promise<ProviderResult> | null

  /**
   * Process the search results into our format
   */
  formatResults(data: any[]) {
    const ImageModel = IMAGE_MODELS[this.key.toLowerCase()]
    if (!ImageModel) throw new Error(`No ImageModel found for provider ${this.key}`)
    return data.map((img) => new ImageModel(img))
  }

  /**
   * Download an image URL to Directus
   */
  async importImage(filesService: any, req: RequestDetails): Promise<any> {
    const assetKey = await filesService.importOne(
      req.getBody().image.url_download,
      this.formatImageDataForImport(req.getBody().image)
    )

    return await filesService.readOne(assetKey)
  }

  /**
   * Return the data needed to provide to Directus import
   */
  protected formatImageDataForImport(image: any): Record<string, any> {
    const data: Record<string, any> = {}

    // Conditionally add if set to avoid blank data going in
    if (image.title) data.title = image.title
    if (image.description) data.description = image.description
    if (image.location) data.location = image.location
    if (image.tags) data.tags = JSON.stringify(image.tags)
    if (image.filename_download) data.filename_download = image.filename_download

    return data
  }
}
