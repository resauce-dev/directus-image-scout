import { pixabay_key } from '../../apiKeys.js'

import ImageModel from '../../classes/ImageModel.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://pixabay.com/api/',
    }) 
    return { api_pixabay: api }
  },
  methods: {
    pixabayUrlSearch(search_term, current_page) {
      return `/?key=${pixabay_key}&per_page=${this.fetch_limit}&page=${current_page}&q=${search_term}`
    },
    pixabayUrlFeatured(){
      return `/?key=${pixabay_key}&per_page=${this.fetch_limit}`
    },
    pixabayProcessSearchResponse(data) {
      this.images = this.images = this.pixabayFormatResults(data.hits)
      this.countOfImages = data.totalHits
      this.countOfPages = Math.round(data.totalHits / this.fetch_limit)
    },
    pixabayProcessFeaturedResponse(data) {
      this.images = this.pixabayFormatResults(data.hits)
      this.countOfImages = null
      this.countOfPages = null
    },
    pixabayFormatResults(data) {
      let results = []
      data.forEach(image => {
        const model = new ImageModel(image, image.webformatURL, image.imageURL)
        model.setAttribution(image.user, `https://pixabay.com/users/${image.user}-${image.user_id}/`)
        model.setPreviewUrl(image.largeImageURL)

        model.setTitle(`Photo by ${image.user}`)
        model.setDescription(image.alt_description)
        if(image.tags) { model.setTags(image.tags.split(', ')) }
        
        results.push(model)
      })
      return results
    }
  }
}