import { pexels_key } from '../../apiKeys.js'

import ImageModel from '../../classes/ImageModel.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.pexels.com/v1',
      headers: {"Authorization" : `${pexels_key}`}
    })
    return { api_pexels: api }
  },
  methods: {
    pexelsUrlSearch(search_term, current_page) {
      return `/search?per_page=${this.fetch_limit}&page=${this.current_page}&query=${search_term}`
    },
    pexelsUrlFeatured(){
      return `/curated?per_page=${this.fetch_limit}`
    },
    pexelsProcessSearchResponse(data) {
      this.images = this.pexelsFormatResults(data.photos)
      this.countOfImages = data.total_results
      this.countOfPages = Math.round(data.total_results / this.fetch_limit)
    },
    pexelsProcessFeaturedResponse(data) {
      this.images = this.pexelsFormatResults(data.photos)
      this.countOfImages = null
      this.countOfPages = null
    },
    pexelsFormatResults(data) {
      let results = []
      data.forEach(image => {
        const model = new ImageModel(image, image.src.medium,  image.src.original)
        model.setAttribution(image.photographer, image.photographer_url)
        model.setPreviewUrl(image.src.large2x)

        model.setTitle(image.photographer)
        model.setDescription(image.alt_description)
        
        results.push(model)
      })
      return results
    }
  }
}