import { access_key } from '../unsplashKeys.js'

// OTHER META DATA I WANT TO PASS TO IMPORT ENDPOINT

// tags: [...image.tags.map(item => item['title']), image.city, image.country, image.id],
// description: image.description ? image.description : image.alt_description,
// location: image.location?.name,
// metadata: image.exif,

export default {
  inject: ['system'],
  data() {
    return {
      apiDirectus: this.system.api,
    }
  },
  created() {
    console.log('🐰✅ Directus mixin loaded!')
  },
  methods: {
    directusImportImage(url) {
      console.info('🐰🕒 Directus import selected image', 'pending');
      return this.apiDirectus.post('/files/import', {
        url: `${url}?client_id=${access_key}`,
      })
      .then(({ data }) => {
        console.info('🐰✅ Directus import selected image', 'succeeded', data);
        return new Promise((resolve) => resolve(data))
      })
      .catch(err => {
        console.info('🐰❌ Directus import selected image', 'failed', err);
      })
    }
  }
}