import ImageModel from '../classes/ImageModel.js'

import { pixabay_key } from '../apiKeys.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://pixabay.com/api/',
    }) 
    return { api_pixabay: api }
  },
  methods: {
    pixabayFetchPhotos(search_term, current_page) {
      console.info(`🎨🕒 Pixabay: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/?key=${pixabay_key}&per_page=${this.fetch_limit}&page=${current_page}&q=${search_term}`
      return this.api_pixabay.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ Pixabay: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          this.images = this.images = this.pixabayFormatResults(data.hits)
          this.countOfImages = data.totalHits
          this.countOfPages = Math.round(data.totalHits / this.fetch_limit)
        })
        .catch(err => console.warn(`🎨❌ Pixabay: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
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
        console.info('🎨 Pixabay: Fetching random images from the api_pixabay')
        const reqUrl = `/?key=${pixabay_key}&per_page=${this.fetch_limit}`
        return this.api_pixabay.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ Pixabay: Fetching random images from the api_pixabay', 'succeeded', data)
            this.images = this.pixabayFormatResults(data.hits)
            this.countOfImages = data.totalHits
            this.countOfPages = null
            sessionStorage.setItem('pixabay_random_images', JSON.stringify(results))
          })
          .catch(err => console.warn('🎨❌ Pixabay: Fetching random images from the api_pixabay', 'failed', err))
      }
    },
    pixabayFormatResults(data) {
      let results = []

      data.forEach(image => {

        const model = new ImageModel(
          image,
          `Photo by ${image.user}`, 
          image.alt_description, 
          image.webformatURL, 
          image.imageURL 
        )

        if(image.tags) { model.setTags(image.tags.split(',')) }
        model.setShareUrl(image.pageURL)
        model.setPreviewUrl(image.largeImageURL)

        results.push(model)
      })

      return results
    }
  }
}