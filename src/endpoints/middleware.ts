import { RequestHandler } from 'express'
import { RequestDetails } from './classes/RequestDetails'
import providers from './providers'

/**
 * Auth middleware
 */
export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  const request = new RequestDetails(req)
  if (!request.isAuthenticated()) {
    return res.status(401).send({ data: 'You must be logged in to attempt this request.' })
  }
  return next()
}

/**
 * Provider middleware
 * Downstream handlers still see `provider?` on req.
 */
export const withProvider: RequestHandler = (req, res, next) => {
  const providerKey = (req.params?.provider || '').toUpperCase()

  if (!providerKey) {
    return res.status(404).send({ data: 'This provider does not exist' })
  }

  const provider = providers.find((p) => p.key === providerKey)

  if (!provider) {
    return res.status(404).send({ data: 'This provider does not exist' })
  }

  if (!provider.is_configured) {
    return res.status(500).send({ data: 'This provider has not been configured' })
  }

  // Attach provider to request
  (req as any).provider = provider

  return next()
}
