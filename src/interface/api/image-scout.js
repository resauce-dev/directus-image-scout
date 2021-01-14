import QueryCache from '../classes/QueryCache.js'  

export default {
  data() {
    return { 
      apiImageScout: this.system.axios.create({ baseURL: '/custom/resauce-image-scout' }),
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
      return this.apiImageScout.get('/providers')
        .then(({data}) => {
          this.providerList = data.data.filter(i => i.is_configured)
          this.providerSelected = this.providerList[0].key
        })
        .catch(err => console.error('🎨❌ Fetching Providers Failed', err))
    },
    fetchFromCache(queryUrl) {
      return new Promise( (resolve, reject) => {
        try {
          const data = this.queryCache.fetch(queryUrl)
          resolve(data)
        } catch (err) { 
          reject(err) 
        }
      })
    },
    getSearch(query, page) {
      const queryUrl = `/providers/${this.providerSelected}/search?query=${query}&page=${page}`
      if(this.queryCache.exists(queryUrl)) { 
        console.info('🎨 Searching cache', query, page)
        return this.fetchFromCache(queryUrl)
          .then(data => data);
      }
      console.info('🎨 Searching provider', query, page)
      return this.apiImageScout.get(queryUrl)
        .then(({data}) => {
          this.queryCache.save(queryUrl, data)
          return data
        })
    },
    getFeatured() {
      const queryUrl = `/providers/${this.providerSelected}/featured`
      if(this.queryCache.exists(queryUrl)) { 
        console.info('🎨 Loading featured from cache')
        return this.fetchFromCache(queryUrl)
          .then(data => data)
      }
      console.info('🎨 Loading featured from provider')
      return this.apiImageScout.get(queryUrl)
        .then(({data}) => {
          this.queryCache.save(queryUrl, data)
          return data
        })
    }
  }
}