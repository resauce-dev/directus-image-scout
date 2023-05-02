import type { ImageAttribution } from '../types'

export default class ImageModel {

  public id: string
  public url_thumb: string
  public url_download: string

  public url_preview: string | null
  public attribution: ImageAttribution | null

  public width: number | null
  public height: number | null

  public title: string | null
  public description: string | null
  public location: string | null
  public filename_download: string | null
  public tags: string[]

  /**
   *
   * @param {String} id
   * @param {String} url_thumb
   * @param {String} url_download
   */
  constructor (id: string, url_thumb: string, url_download: string) {
    // Required
    this.id = id
    this.url_thumb = url_thumb
    this.url_download = url_download

    // Not Required
    this.url_preview = null
    this.attribution = null

    // Sizing
    this.width = null
    this.height = null

    // Import options
    this.title = null
    this.description = null
    this.location = null
    this.filename_download = null
    this.tags = ['resauce-image-scout']
  }
  /**
   * Add URL of image to preview larger
   *
   * @param {String} data
   */
  setPreviewUrl(data): this {
    this.url_preview = data
    return this
  }
  /**
   * Provide attribution information
   *
   * @param {String} name
   * @param {String} url
   */
  setAttribution(name: string, url: string): this {
    this.attribution = { name, url }
    return this
  }
  /**
   * Add title
   *
   * @param {String} data
   */
  setTitle(data: string): this {
    this.title = data
    return this
  }
  /**
   * Add description
   *
   * @param {String} data
   */
  setDescription(data: string): this {
    this.description = data
    return this
  }
  /**
   * Add tags
   *
   * @param {Array} data
   */
  setTags(data: string[]): this {
    this.tags = this.tags.concat(data)
    return this
  }
  /**
   * Add location
   *
   * @param {String} data
   */
  setLocation(data: string): this {
    this.location = data
    return this
  }
  /**
   * Add filename should have extension
   *
   * @param {String} data
   */
  setFileName(data: string): this {
    if (!data.includes('.')) { throw "Filename should be provided an extension" }
    this.filename_download = data
    return this
  }
  /**
   * Set the size of the image
   *
   * @param {Number} width
   * @param {Number} height
   */
  setSize(width: number, height: number): this {
    this.width = width
    this.height = height
    return this
  }
}
