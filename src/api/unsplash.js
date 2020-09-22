import ImageModel from '../classes/ImageModel.js'

import { unsplash_key } from '../apiKeys.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.unsplash.com',
      headers: {"Authorization" : `Client-ID ${unsplash_key}`} // This should be removed eventually as it shouldn't be client-side
    })
    return { api_unsplash: api }
  },
  methods: {
    unsplashFetchPhotos(search_term, current_page) {
      console.info(`🎨🕒 Unsplash: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/search/photos?per_page=${this.fetch_limit}&page=${current_page}&query=${search_term}`
      return this.api_unsplash.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ Unsplash: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          this.images = this.unsplashFormatResults(data.results)
          this.countOfImages = data.total
          this.countOfPages = data.total_pages
        })
        .catch(err => console.warn(`🎨❌ Unsplash: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
    },
    unsplashFetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('unsplash_random_images')) {
        console.info('🎨🕒 Unsplash: Fetching random images from the sessionStorage', 'pending')
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
        .then(data => console.info('🎨✅ Unsplash: Fetching random images from the sessionStorage', 'succeeded', data))
        .catch(err => console.warn('🎨❌ Unsplash: Fetching random images from sessionStorage', 'failed', err))
      } else {
        console.info('🎨🕒 Unsplash: Fetching random images from the api_unsplash')
        const reqUrl = `/photos/random?featured=true&count=${this.fetch_limit}`
        return this.api_unsplash.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ Unsplash: Fetching random images from the api_unsplash', 'succeeded', data)
            this.images = this.unsplashFormatResults(data)
            this.countOfImages = data.length
            this.countOfPages = null
            sessionStorage.setItem('unsplash_random_images', JSON.stringify(this.images))
          })
          .catch(err => console.warn('🎨❌ Unsplash: Fetching random images from the api_unsplash', 'failed', err))
      }
    },
    unsplashFormatResults(data) {
      let results = []

      data.forEach(image => {

        const model = new ImageModel(
          image,
          image.urls.small, 
          `${image.links.download}?client_id=${unsplash_key}`
        )

        model.setTitle(`Photo by ${image.user.name}`)
        model.setDescription(image.alt_description)
        model.setShareUrl(image.links.html)
        model.setAuthorUrl(image.user.links.html)
        model.setPreviewUrl(image.urls.regular)
        if(image.tags) { model.setTags(image.tags.map(tag => tag['title'])) }
        if(image.location) { model.setLocation(image.location.title) }

        results.push(model)
      })

      return results
    }
  }
}