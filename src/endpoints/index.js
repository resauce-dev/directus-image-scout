let providers = require(__dirname + '/providers');

function getProvider(providerName) {
	const provider_key = providerName.toUpperCase()
	return providers.find(p => p.key === provider_key)
}

module.exports = function registerEndpoint(router) {

	/**
	 * List the available endpoints for this extension.
	 */
	router.get('/', (req, res) => res.send({
		'/': 'List the available endpoints for this extension. (You are here)',
		'/providers': 'Get the information of all the providers',
		'/providers/[provider]': 'Get the information about a single provider',
		'/providers/[provider]/featured': 'Fetch the featured images the provider provides',
		'/providers/[provider]/search?query=Dog&page=2': 'Search for provider images based on the users query',
		'/providers/[provider]/download': 'Post request of a URL to download an image from the provider allowing a hidden prefix of api_key',
	}))

	/**
	 * Get the information of all the providers
	 */
	router.get('/providers', (req, res) => res.send({data:providers}))

	/**
	 * Get the information about a single provider
	 */
	router.get('/providers/:provider', (req, res) => {
		const provider = getProvider(req.params.provider)
		if(!provider) { 
      res.status(500)
      res.send({data: 'This provider does not exist'}) 
    }
		if(!provider.is_configured) { 
      res.status(500) 
      res.send({data: 'This provider has not been configured'}) 
    }
		res.send({data: {provider}})
	})

	/**
	 * Fetch the featured images the provider provides
	 */
	router.get('/providers/:provider/featured', async (req, res) => {
		try {
			const provider = getProvider(req.params.provider)
			const data = await provider.getFeatured()
			res.send({data})
		} catch (e) {
      res.status(500)
			res.send({data: 'Failed to get featured results'})
		}
	})

	/**
	 * Search for provider images based on the users query
	 */
	router.get('/providers/:provider/search', async (req, res) => {
		try {
			const provider = getProvider(req.params.provider)
			const data = await provider.getSearch(req.query.query, req.query.page)
			res.send({data})
		} catch (e) {
      res.status(500)
			res.send({data: 'Failed to get search results'})
		}
	})

	/**
	 * Download an image using the URL provided in the post data.
	 */
	router.post('/providers/:provider/download', async (req, res) => {
		try {
      const provider = getProvider(req.params.provider)
			const data = await provider.downloadImage(req.body.image)
			res.send({data})
		} catch (e) {
      res.status(500)
			res.send({data: 'Failed to save image'})
		}
	})

}
