import { Request } from 'express'

interface Accountability {
  user?: string | number
  [key: string]: any
}

export interface DirectusRequest extends Request {
  accountability?: Accountability
}

export class RequestDetails {
  private req: DirectusRequest

  constructor (req: DirectusRequest) {
    this.req = req
  }

  /**
   * Return data about the user making a request
   */
  getUserId(): string | number | undefined {
    return this.req.accountability?.user
  }

  /**
   * Is there a user currently authenticated?
   */
  isAuthenticated(): boolean {
    const isAuthRequired =
      'RIS_REQUIRED_AUTH' in process.env
        ? process.env.RIS_REQUIRED_AUTH
        : 'true'

    if (isAuthRequired === 'false') return true

    return Boolean(this.getUserId())
  }

  /**
   * Get the URL of the currently used Directus API
   */
  getDirectusApiUrl(): string {
    return `${this.req.protocol}://${this.req.get('host')}`
  }

  /**
   * Get the body of the request
   */
  getBody<T = any>(): T {
    return this.req.body as T
  }
}
