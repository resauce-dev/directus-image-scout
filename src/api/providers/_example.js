import { myprovidername_key } from '../../apiKeys.js'

import ImageModel from '../../classes/ImageModel.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.myprovidername.com/v1',
      headers: {"Authorization" : `${myprovidername_key}`}
    })
    return { api_myprovidername: api }
  },
  methods: {
    myprovidernameUrlSearch(search_term, current_page) {
      return `/search?per_page=${this.fetch_limit}&page=${this.current_page}&query=${search_term}`
    },
    myprovidernameUrlFeatured(){
      return `/curated?per_page=${this.fetch_limit}`
    },
    myprovidernameProcessSearchResponse(data) {
      this.images = this.myprovidernameFormatResults(data.photos)
      this.countOfImages = data.total_results
      this.countOfPages = Math.round(data.pagination.total_count / this.fetch_limit)
    },
    myprovidernameProcessFeaturedResponse(data) {
      this.images = this.myprovidernameFormatResults(data.photos)
      this.countOfImages = null
      this.countOfPages = null
    },
    myprovidernameFormatResults(data) {
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