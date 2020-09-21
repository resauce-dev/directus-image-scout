import { access_key } from '../unsplashKeys.js'

export default {
  inject: ['system'],
  data() {
    return {
      apiUnsplash: this.system.axios,
      apiUrl: 'https://api.unsplash.com',
      images: null,
      total_pages: null,
      total_images: null,
      fetch_limit: 30
    }
  },
  created() {
    console.info('🎨✅ Unsplash: Loaded!')
  },
  methods: {
    unsplashFetchPhotos(search_term, current_page) {
      console.info(`🎨🕒 Unsplash: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `${this.apiUrl}/search/photos?client_id=${access_key}&per_page=${this.fetch_limit}&page=${current_page}&query=${search_term}`
      return this.apiUnsplash.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ Unsplash: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          this.images = data.results
          this.total_images = data.total
          this.total_pages = data.total_pages
        })
        .catch(err => console.warn(`🎨❌ Unsplash: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
    },
    unsplashFetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('unsplash_random')) {
        console.info('🎨🕒 Unsplash: Fetching random images from the sessionStorage', 'pending')
        return new Promise( (resolve, reject) => {
          let data = JSON.parse(random)
          try {
            this.images = data
            this.total_images = data.length
            this.total_pages = null
          } catch (error) { 
            reject(error) 
          }
          resolve(data)
        })
        .then(data => console.info('🎨✅ Unsplash: Fetching random images from the sessionStorage', 'succeeded', data))
        .catch(err => console.warn('🎨❌ Unsplash: Fetching random images from sessionStorage', 'failed', err))
      } else {
        console.info('🎨 Unsplash: Fetching random images from the UnsplashAPI')
        const reqUrl = `${this.apiUrl}/photos/random?client_id=${access_key}&featured=true&count=${this.fetch_limit}`
        return this.apiUnsplash.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ Unsplash: Fetching random images from the UnsplashAPI', 'succeeded', data)
            
            this.images = data
            this.total_images = data.length
            this.total_pages = null
            sessionStorage.setItem('unsplash_random', JSON.stringify(data))
          })
          .catch(err => console.warn('🎨❌ Unsplash: Fetching random images from the UnsplashAPI', 'failed', err))
      }
    }
  }
}