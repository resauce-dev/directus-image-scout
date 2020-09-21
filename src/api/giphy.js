import ImageModel from '../classes/ImageModel.js'

import { giphy_key } from '../apiKeys.js'

export default {
  inject: ['system'],
  data() {
    const api = this.system.axios.create({
      baseURL: 'https://api.giphy.com/v1/',
      timeout: 1000,
    });
    return {
      giphyApi: api,
      images: null,
      countOfPages: null,
      countOfImages: null,
      fetch_limit: 30,
      request_time: 0,
    }
  },
  created() {
    console.info('🎨✅ Giphy: Loaded!')
  },
  methods: {
    giphyFetchPhotos(search_term, current_page) {
      var timerStart = performance.now()
      console.info(`🎨🕒 Giphy: Fetching search for "${search_term}" on page ${current_page}`, 'pending')
      const reqUrl = `/gifs/search?api_key=${giphy_key}&limit=${this.fetch_limit}&offset=${this.fetch_limit*current_page}&q=${search_term}`
      return this.giphyApi.get(reqUrl)
        .then(({data}) => {
          console.info(`🎨✅ Giphy: Fetching search for "${search_term}" on page ${current_page}`, 'succeeded', data)
          let results = []
          data.data.forEach(res => {
            const image = new ImageModel(
              res,
              res.title, 
              res.alt_description, 
              `https://media.giphy.com/media/${res.id}/giphy.gif`, 
              `https://media.giphy.com/media/${res.id}/giphy.gif`, 
              res.url
            )
            if(res.tags) { image.setTags(res.tags) }
            results.push(image)
          })
          this.images = results
          this.countOfImages = data.pagination.total_count
          this.countOfPages = Math.round(data.pagination.total_count / this.fetch_limit)
        })
        .catch(err => console.warn(`🎨❌ Giphy: Fetched search for "${search_term}" on page ${current_page}`, 'failed', err))
        .then(() => {
          var timerEnd = performance.now()
          this.request_time = parseFloat(timerEnd-timerStart/1000).toFixed(12)
        })
    },
    giphyFetchRandomPhotos() {
      let random;
      if(random = sessionStorage.getItem('giphy_random_images')) {
        console.info('🎨🕒 Giphy: Fetching random images from the sessionStorage', 'pending')
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
        .then(data => console.info('🎨✅ Giphy: Fetching random images from the sessionStorage', 'succeeded', data))
        .catch(err => console.warn('🎨❌ Giphy: Fetching random images from sessionStorage', 'failed', err))
      } else {
        console.info('🎨 Giphy: Fetching random images from the GiphyAPI')
        const reqUrl = `/gifs/trending?api_key=${giphy_key}&limit=${this.fetch_limit}`
        return this.giphyApi.get(reqUrl)
          .then(({data}) => {
            console.info('🎨✅ Giphy: Fetching random images from the GiphyAPI', 'succeeded', data)
            let results = []
            data.data.forEach(res => {
              const image = new ImageModel(
                res,
                res.title, 
                res.alt_description, 
                `https://media.giphy.com/media/${res.id}/giphy.gif`, 
                `https://media.giphy.com/media/${res.id}/giphy.gif`, 
                res.url
              )
              if(res.tags) { image.setTags(res.tags) }
              results.push(image)
            })
            this.images = results
            this.countOfImages = data.pagination.total_count
            this.countOfPages = null
            sessionStorage.setItem('giphy_random_images', JSON.stringify(results))
          })
          .catch(err => console.warn('🎨❌ Giphy: Fetching random images from the GiphyAPI', 'failed', err))
      }
    }
  }
}