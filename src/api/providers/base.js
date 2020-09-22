import providers from '../../providers.js';

import QueryCache from '../../classes/QueryCache.js'  

export default {
  data() {
    return { 
      providerList: providers,
      providerSelected: 'unsplash',
    }
  },
  computed: {
    queryCache() {
      return new QueryCache(this.providerSelected)
    }
  },
  methods: {
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
    getSearch(search_term, current_page) {
      const queryUrl = this[`${this.providerSelected}UrlSearch`](search_term, current_page)
      if(this.queryCache.exists(queryUrl)) { 
        console.info('🎨 getSearch from cache', search_term, current_page)
        return this.fetchFromCache(queryUrl)
          .then(data => {
            return this[`${this.providerSelected}ProcessSearchResponse`](data)
          })
      }
      console.info('🎨 getSearch from request', search_term, current_page)
      return this[`api_${this.providerSelected}`].get(queryUrl)
        .then(({data}) => {
          this[`${this.providerSelected}ProcessSearchResponse`](data)
          this.queryCache.save(queryUrl, data)
        })
    },
    getFeatured() {
      const queryUrl = this[`${this.providerSelected}UrlFeatured`]()
      if(this.queryCache.exists(queryUrl)) { 
        console.info('🎨 getFeatured from cache')
        return this.fetchFromCache(queryUrl)
          .then(data => {
            this[`${this.providerSelected}ProcessFeaturedResponse`](data)
          }) 
      }
      console.info('🎨 getFeatured from request')
      return this[`api_${this.providerSelected}`].get(queryUrl)
        .then(({data}) => {
          this[`${this.providerSelected}ProcessFeaturedResponse`](data)
          this.queryCache.save(queryUrl, data)
        })
    }
  }
}