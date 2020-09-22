export default {
  inject: ['system'],
  methods: {
    directusImportImage(image) {
      console.info('🐰🕒 Directus import', 'pending');
      return this.system.api.post('/files/import', {
        data: {
          tags: JSON.stringify(image.tags),
          location: image.location,
          description: image.description,
          title: image.title,
          // filename_download: 'image.jpg',
        },
        url: image.url_download,
      })
      .then(({ data }) => {
        console.info('🐰✅ Directus import', 'succeeded', data);
        return new Promise((resolve) => resolve(data))
      })
      .catch(err => console.warn('🐰❌ Directus import', 'failed', err))
    }
  }
}