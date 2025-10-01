import { defineEndpoint } from '@directus/extensions-sdk'
import { Request, Response, Router } from 'express'
import { ensureAuthenticated, withProvider } from './middleware'
import { RequestDetails } from './classes/RequestDetails'
import { Provider } from './classes/Provider'
import providers from './providers'

export default defineEndpoint((router: Router) => {
  /**
   * Apply middleware to all routes
   */
  router.use(ensureAuthenticated)

  /**
   * List the available endpoints for this extension.
   */
  router.get('/', (_req: Request, res: Response) => {
    res.send({
      '/': 'List the available endpoints for this extension. (You are here)',
      '/providers': 'Get the information of all the providers',
      '/providers/[provider]': 'Get the information about a single provider',
      '/providers/[provider]/featured': 'Fetch the featured images the provider provides',
      '/providers/[provider]/search?query=Dog&page=2': 'Search for provider images based on the users query',
      '/providers/[provider]/download': 'Post request of a URL to download an image from the provider allowing a hidden prefix of api_key',
    })
  })

  /**
   * Get the information of all the providers
   */
  router.get('/providers', (_req, res) => {
    res.send({ data: providers })
  })

  /**
   * Get the information about a single provider
   */
  router.get('/providers/:provider', withProvider, (req: Request<{ provider: string }>, res) => {
    const provider = (req as any).provider as Provider
    res.send({ data: { provider: provider } })
  })

  /**
   * Fetch the featured images the provider provides
   */
  router.get('/providers/:provider/featured', withProvider, async (req: Request<{ provider: string }>, res) => {
    const provider = (req as any).provider as Provider
    try {
      const data = await provider.getFeatured()
      res.send({ data })
    } catch (e) {
      console.error('🎨 Error during Feature Fetch', e)
      res.status(500).send({ data: 'Failed to get featured results' })
    }
  })

  /**
   * Search for provider images based on the users query
   */
  router.get('/providers/:provider/search', withProvider, async (req: Request<{ provider: string }>, res) => {
    const provider = (req as any).provider as Provider
    try {
      const { query, page } = req.query
      const data = await provider.getSearch(String(query), Number(page))
      res.send({ data })
    } catch (e) {
      console.error('🎨 Error during Search Fetch', e)
      res.status(500).send({ data: 'Failed to get search results' })
    }
  })

  /**
   * Download an image using the URL provided in the post data.
   */
  router.post('/providers/:provider/download', withProvider, async (req: Request<{ provider: string }>, res) => {
    const provider = (req as any).provider as Provider
    try {
      const requestDetails = new RequestDetails(req)
      const data = await provider.downloadImage(requestDetails)
      res.send({ data })
    } catch (e) {
      console.error('🎨 Error during Download', e)
      res.status(500).send({ data: 'Failed to import image. Ensure URL is the same as your HOST.' })
    }
  })
})
