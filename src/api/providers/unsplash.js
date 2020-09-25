import { unsplash_key } from '../../apiKeys.js'

import ImageModel from '../../classes/ImageModel.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.unsplash.com',
      headers: {"Authorization" : `Client-ID ${unsplash_key}`}
    })
    return { api_unsplash: api }
  },
  methods: {
    unsplashUrlSearch(search_term, current_page) {
      return `/search/photos?per_page=${this.fetch_limit}&page=${current_page}&query=${search_term}`
    },
    unsplashUrlFeatured(){
      return `/photos/random?featured=true&count=${this.fetch_limit}`
    },
    unsplashProcessSearchResponse(data) {
      this.images = this.unsplashFormatResults(data.results)
      this.countOfImages = data.total
      this.countOfPages = data.total_pages
    },
    unsplashProcessFeaturedResponse(data) {
      this.images = this.unsplashFormatResults(data)
      this.countOfImages = null
      this.countOfPages = null
    },
    unsplashFormatResults(data) {
      let results = []
      data.forEach(image => {
        const fileName = image.id + '.' + image.urls.full.match(/&fm=([a-z]*)/)[1]
        const downloadUrl = `${image.links.download}?client_id=${unsplash_key}`
        const model = new ImageModel(image, image.urls.small, downloadUrl)
        model.setAttribution(image.user.name, image.user.links.html)
        model.setPreviewUrl(image.urls.regular)

        model.setTitle(`Photo by ${image.user.name}`)
        model.setDescription(image.alt_description)
        model.setFileName(fileName)
        if(image.tags) { model.setTags(image.tags.map(tag => tag['title'])) }
        if(image.location) { model.setLocation(image.location.title) }
        
        results.push(model)
      })
      return results
    }
  }
}