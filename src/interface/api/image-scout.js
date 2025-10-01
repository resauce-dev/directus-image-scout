import QueryCache from '../classes/QueryCache.js'

export default {
  data() {
    return {
      apiPrefix: '/resauce-image-scout',
      providerList: [],
      providerSelected: null,
    }
  },
  computed: {
    queryCache() {
      return new QueryCache(this.providerSelected)
    }
  },
  methods: {
    getProviders() {
      return this.api.get(`${this.apiPrefix}/providers`)
        .then(({ data }) => {
          this.providerList = data.data.filter(i => i.is_configured)
          this.providerSelected = this.providerList[0].key
        })
        .catch(err => console.error('🎨❌ Fetching Providers Failed', err))
    },
    fetchFromCache(queryUrl) {
      return new Promise((resolve, reject) => {
        try {
          const data = this.queryCache.fetch(queryUrl)
          resolve(data)
        } catch (err) {
          reject(err)
        }
      })
    },
    getSearch(query, page) {
      const queryUrl = `${this.apiPrefix}/providers/${this.providerSelected}/search?query=${query}&page=${page}`
      if (this.queryCache.exists(queryUrl)) {
        console.info('🎨 Searching cache', query, page)
        return this.fetchFromCache(queryUrl)
          .then(data => data);
      }
      console.info('🎨 Searching provider', query, page)
      return this.api.get(queryUrl)
        .then(({ data }) => {
          this.queryCache.save(queryUrl, data)
          return data
        })
    },
    getFeatured() {
      const queryUrl = `${this.apiPrefix}/providers/${this.providerSelected}/featured`
      if (this.queryCache.exists(queryUrl)) {
        console.info('🎨 Loading featured from cache')
        return this.fetchFromCache(queryUrl)
          .then(data => data)
      }
      console.info('🎨 Loading featured from provider')
      return this.api.get(queryUrl)
        .then(({ data }) => {
          this.queryCache.save(queryUrl, data)
          return data
        })
    },
    triggerDownload(image) {
      const queryUrl = `${this.apiPrefix}/providers/${this.providerSelected}/download`
      return this.api.post(queryUrl, { image })
        .then(({ data }) => {
          if (data?.data?.errors) {
            console.error(data.data.errors)
            throw new Error('Error thrown')
          }
          return data
        })
    }
  }
}
