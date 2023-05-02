import axios from 'axios'
import type { AxiosInstance, AxiosRequestHeaders } from 'axios'
import type { DirectusImageProperties, ScoutSearchResult } from '../types'
import type ImageModel from '../classes/ImageModel'

export default class Provider {

  public key: string
  public name: string
  public url: string
  public is_configured: boolean

  public api: AxiosInstance

  /**
   * Control and configuration of a provider
   *
   * @param {String} key
   * @param {String} name
   * @param {String} url
   */
  constructor (key: string, name: string, url: string) {
    this.key = key.toUpperCase()
    this.name = name
    this.url = url
    this.is_configured = this.getApiKey() ? true : false

    this.api = axios.create({
      baseURL: this.getAxiosBaseUrl(),
      headers: this.getAxiosHeaders()
    })
  }
  /**
   * Return the API Key if it has been configured in the ENV file.
   */
  getApiKey(): string { return process.env[`API_KEY_${this.key}`] || `MISSING CONFIG: ${`API_KEY_${this.key}`}` }
  /**
   * Axios base URL: the website that will receive the network request.
   */
  getAxiosBaseUrl(): string { return '' }
  /**
   * Axios headers: Authorization key to send to the server.
   */
  getAxiosHeaders(): AxiosRequestHeaders { return {} }
  /**
   * How many items should be returned through the request
   */
  getFetchLimit(): number { return 25 }
  /**
   * Get Featured Images
   */
  async getFeatured(): Promise<ScoutSearchResult> {
    throw "Provider function getFeatured has not been implemented."
    return {}
  }
  /**
   * Get Search Images
   *
   * @param {String} query
   * @param {Number} page
   */
  async getSearch(query: string, page: number): Promise<ScoutSearchResult> {
    throw "Provider function getSearch has not been implemented."
    return {}
  }
  /**
   * Process the search results into our format
   *
   * @param {*} data
   */
  formatResults(data): ImageModel[] {
    const ImageModel = require(__dirname + `/../image-models/${this.key.toLowerCase()}`)
    return data.map(img => new ImageModel(img))
  }
  /**
   * Download an image URL to Directus
   *
   * @param {Object} req
   */
  async downloadImage(req) {
    const postUrl = `${req.getApiUrl()}/files/import?access_token=${req.getBody().access_token}`
    const postBody = {
      url: req.getBody().image.url_download,
      data: this.formatImageDataForImport(req.getBody().image)
    }
    const res = await axios.post(postUrl, postBody)
    return res.data
  }
  /**
   * Return the data needed to provide to Directus import
   *
   * @param {*} image
   */
  formatImageDataForImport(image: ImageModel): DirectusImageProperties {
    const data: DirectusImageProperties = {}

    // Conditionally add if set to avoid blank data going in
    if (image.title) data.title = image.title
    if (image.description) data.description = image.description
    if (image.location) data.location = image.location
    if (image.tags) data.tags = JSON.stringify(image.tags)
    if (image.filename_download) data.filename_download = image.filename_download

    return data
  }
}
