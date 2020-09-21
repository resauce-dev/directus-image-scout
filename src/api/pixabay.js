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
      pixabayApi: api,
      images: null,
      countOfPages: null,
      countOfImages: null,
      fetch_limit: 30,
      request_time: 0,
    }
  },
  created() {
    console.info('🎨✅ Pixabay: Loaded!')
  },
  methods: {
    pixabayFetchPhotos(search_term, current_page) {
      var timerStart = performance.now()
      console.info(`🎨🕒 Pixabay: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/?key=${pixabay_key}&per_page=${this.fetch_limit}&page=${current_page}&q=${search_term}`
      return this.pixabayApi.get(reqUrl)
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
          this.countOfImages = data.totalHits
          this.countOfPages = Math.round(data.totalHits / this.fetch_limit)
        })
        .catch(err => console.warn(`🎨❌ Pixabay: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
        .then(() => {
          var timerEnd = performance.now()
          this.request_time = parseFloat(timerEnd-timerStart/1000).toFixed(12)
        })
    },
    pixabayFetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('pixabay_random_images')) {
        console.info('🎨🕒 Pixabay: Fetching random images from the sessionStorage', 'pending')
        return new Promise( (resolve, reject) => {
          let data = JSON.parse(random)
          try {
            this.images = data
            this.countOfImages = data.length
            this.countOfPages = null
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
        return this.pixabayApi.get(reqUrl)
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
            this.countOfImages = data.totalHits
            this.countOfPages = null
            sessionStorage.setItem('pixabay_random_images', JSON.stringify(results))
          })
          .catch(err => console.warn('🎨❌ Pixabay: Fetching random images from the PixabayAPI', 'failed', err))
      }
    }
  }
}