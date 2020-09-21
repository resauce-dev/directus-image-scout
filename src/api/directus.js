export default {
  inject: ['system'],
  methods: {
    directusImportImage(download_url) {
      console.info('🐰🕒 Directus import selected image', 'pending');
      return this.system.api.post('/files/import', {
        data: {
          tags: JSON.stringify(['foo','bar']),
          location: 'location',
          description: 'example',
          // type: '',
          title: "COVID-19",
          filename_download: "corona-virus.jpg",
        },
        url: download_url,
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