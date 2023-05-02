/**
 * Solution to allow querying of locally cached data rather than always
 * going to a provider to fetch fresh data.
 *
 * Data will persist for length of session.
 */
export default class QueryCache {

  public provider: string

  /**
   * The name of the provider in lower-case
   *
   * @param {String} providerName
   */
  constructor (providerName: string) {
    this.provider = providerName
  }
  /**
   * Passing in the query URL
   *
   * @param {String} query
   */
  exists(queryStr: string): boolean {
    return this.fetch(queryStr) ? true : false
  }
  /**
   * Passing in the query URL
   *
   * @param {String} query
   */
  fetch(queryStr: string): any {
    const data: string | null = sessionStorage.getItem(queryStr)
    return data ? JSON.parse(data) : null
  }
  /**
   * Passing in the query URL & data to save
   *
   * @param {String} query
   * @param {Any} data
   */
  save(queryStr: string, data: any): void {
    return sessionStorage.setItem(queryStr, JSON.stringify(data))
  }
}
