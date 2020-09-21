import ImageModel from '../classes/ImageModel.js'

import { pixabay_key } from '../apiKeys.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://pixabay.com/api/',
      timeout: 1000,
    });
    return {
      imageApi: api,
      images: null,
      total_pages: null,
      total_images: null,
      fetch_limit: 30,
      request_time: 0,
    }
  },
  created() {
    console.info('🎨✅ Pixabay: Loaded!')
  },
  methods: {
    fetchPhotos(search_term, current_page) {
      var timerStart = performance.now()
      console.info(`🎨🕒 Pixabay: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/?key=${pixabay_key}&per_page=${this.fetch_limit}&page=${current_page}&q=${search_term}`
      return this.imageApi.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ Pixabay: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          let results = []
          data.hits.forEach(res => {
            const image = new ImageModel(
              res,
              `Photo by ${res.user}`, 
              res.alt_description, 
              res.previewURL, 
              res.imageURL, 
            )
            if(res.tags) { image.setTags(res.tags.split(',')) }
            results.push(image)
          })
          this.images = results
          this.total_images = data.totalHits
          this.total_pages = Math.round(data.totalHits / this.fetch_limit)
        })
        .catch(err => console.warn(`🎨❌ Pixabay: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
        .then(() => {
          var timerEnd = performance.now()
          this.request_time = timerEnd-timerStart
        })
    },
    fetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('random_images')) {
        console.info('🎨🕒 Pixabay: Fetching random images from the sessionStorage', 'pending')
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
        .then(data => console.info('🎨✅ Pixabay: Fetching random images from the sessionStorage', 'succeeded', data))
        .catch(err => console.warn('🎨❌ Pixabay: Fetching random images from sessionStorage', 'failed', err))
      } else {
        console.info('🎨 Pixabay: Fetching random images from the PixabayAPI')
        const reqUrl = `/?key=${pixabay_key}&per_page=${this.fetch_limit}`
        return this.imageApi.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ Pixabay: Fetching random images from the PixabayAPI', 'succeeded', data)
            let results = []
            data.hits.forEach(res => {
              const image = new ImageModel(
                res,
                `Photo by ${res.user}`, 
                res.alt_description, 
                res.previewURL, 
                res.imageURL, 
              )
              if(res.tags) { image.setTags(res.tags.split(',')) }
              results.push(image)
            })
            this.images = results
            this.total_images = data.totalHits
            this.total_pages = null
            sessionStorage.setItem('random_images', JSON.stringify(results))
          })
          .catch(err => console.warn('🎨❌ Pixabay: Fetching random images from the PixabayAPI', 'failed', err))
      }
    }
  }
}