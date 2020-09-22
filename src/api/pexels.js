import ImageModel from '../classes/ImageModel.js'

import { pexels_key } from '../apiKeys.js'

export default {
  inject: ['system'],
  data() { 
    const api = this.system.axios.create({
      baseURL: 'https://api.pexels.com/v1',
      headers: {"Authorization" : `${pexels_key}`} // This should be removed eventually as it shouldn't be client-side
    })
    return { api_pexels: api }
  },
  methods: {
    pexelsFetchPhotos(search_term, current_page) {
      console.info(`🎨🕒 pexels: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/search?per_page=${this.fetch_limit}&page=${this.current_page}&query=${search_term}`
      return this.api_pexels.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ pexels: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          this.images = this.pexelsFormatResults(data.photos)
          this.countOfImages = data.total_results
          this.countOfPages = Math.round(data.pagination.total_count / this.fetch_limit)
        })
        .catch(err => console.warn(`🎨❌ pexels: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
    },
    pexelsFetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('pexels_random_images')) {
        console.info('🎨🕒 pexels: Fetching random images from the sessionStorage', 'pending')
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
        .then(data => console.info('🎨✅ pexels: Fetching random images from the sessionStorage', 'succeeded', data))
        .catch(err => console.warn('🎨❌ pexels: Fetching random images from sessionStorage', 'failed', err))
      } else {
        console.info('🎨🕒 pexels: Fetching random images from the api_pexels')
        const reqUrl = `/curated?per_page=${this.fetch_limit}`
        return this.api_pexels.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ pexels: Fetching random images from the api_pexels', 'succeeded', data)
            this.images = this.pexelsFormatResults(data.photos)
            this.countOfImages = data.total_results
            this.countOfPages = null
            sessionStorage.setItem('pexels_random_images', JSON.stringify(this.images))
          })
          .catch(err => console.warn('🎨❌ pexels: Fetching random images from the api_pexels', 'failed', err))
      }
    },
    pexelsFormatResults(data) {
      let results = []

      data.forEach(image => {

        const model = new ImageModel(image, image.src.medium,  image.src.original)

        model.setTitle(`Photo by ${image.photographer}`)
        model.setDescription(image.alt_description)
        model.setShareUrl(image.url)
        model.setPreviewUrl(image.src.large2x)

        results.push(model)
      })

      return results
    }
  }
}