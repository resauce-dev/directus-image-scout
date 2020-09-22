import { giphy_key } from '../apiKeys.js'

import ImageModel from '../classes/ImageModel.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.giphy.com/v1/'
    })
    return { api_giphy: api }
  },
  methods: {
    giphyUrlSearch(search_term, current_page) {
      return `/gifs/search?api_key=${giphy_key}&limit=${this.fetch_limit}&offset=${this.fetch_limit*current_page}&q=${search_term}`
    },
    giphyUrlFeatured(){
      return `/gifs/trending?api_key=${giphy_key}&limit=${this.fetch_limit}`
    },
    giphyProcessSearchResponse(data) {
      this.images = this.giphyFormatResults(data.data)
      this.countOfImages = data.pagination.total_count
      this.countOfPages = Math.round(data.pagination.total_count / this.fetch_limit)
    },
    giphyProcessFeaturedResponse(data) {
      this.images = this.giphyFormatResults(data.data)
      this.countOfImages = null
      this.countOfPages = null
    },
    giphyFormatResults(data) {
      let results = []
      data.forEach(image => {
        const gifUrl = `https://media.giphy.com/media/${image.id}/giphy.gif`
        const model = new ImageModel(image, gifUrl, gifUrl)
        model.setTitle(image.title)
        model.setDescription(image.alt_description)
        model.setShareUrl(image.url)
        model.setPreviewUrl(gifUrl)
        if(image.tags) { model.setTags(image.tags) }
        results.push(model)
      })
      return results
    }
  }
}