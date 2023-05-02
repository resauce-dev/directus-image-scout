/**
 * Properties that can be used for importing images into Directus
 *
 * All properties should be optional and not required.
 */
export interface DirectusImageProperties {
  title?: string
  description?: string
  location?: string
  tags?: string
  filename_download?: string
}

/**
 * The expected results for the Search or Featured requests.
 * countOf can either be a number, or null if there's no pages.
 *
 * All properties should be optional and not required.
 */
export interface ScoutSearchResult {
  images?: any[], // TODO: Should define image type
  countOfImages?: number | null
  countOfPages?: number | null
}

/**
 * The interface for adding attribution to an image
 *
 * All properties should always be required.
 */
export interface ImageAttribution {
  name: string
  url: string
}
