export interface Attribution {
  name: string
  url: string
}

export class ImageModel {
  // Required
  id: string
  url_thumb: string
  url_download: string

  // Optional
  url_preview: string | null = null
  attribution: Attribution | null = null

  // Sizing
  width: number | null = null
  height: number | null = null

  // Import options
  title: string | null = null
  description: string | null = null
  location: string | null = null
  filename_download: string | null = null
  tags: string[] = ['resauce-image-scout']

  constructor (id: string, url_thumb: string, url_download: string) {
    this.id = id
    this.url_thumb = url_thumb
    this.url_download = url_download
  }

  /**
   * Add URL of image to preview larger
   */
  setPreviewUrl(data: string): this {
    this.url_preview = data
    return this
  }

  /**
   * Provide attribution information
   */
  setAttribution(name: string, url: string): this {
    this.attribution = { name, url }
    return this
  }

  /**
   * Add title
   */
  setTitle(data: string): this {
    this.title = data
    return this
  }

  /**
   * Add description
   */
  setDescription(data: string): this {
    this.description = data
    return this
  }

  /**
   * Add tags
   */
  setTags(data: string[]): this {
    this.tags = this.tags.concat(data)
    return this
  }

  /**
   * Add location
   */
  setLocation(data: string): this {
    this.location = data
    return this
  }

  /**
   * Add filename (should include extension)
   */
  setFileName(data: string): this {
    if (!data.includes('.')) {
      throw new Error('Filename should be provided with an extension')
    }
    this.filename_download = data
    return this
  }

  /**
   * Set the size of the image
   */
  setSize(width: number, height: number): this {
    this.width = width
    this.height = height
    return this
  }
}
