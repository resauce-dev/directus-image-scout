export default {
  inject: ['system'],
  methods: {
    directusImportImage(image) {
      console.info('🐰🕒 Directus Import Pending...');
      return this.system.api.post('/files/import', {
        data: image.getImportData(),
        url: image.url_download,
      })
      .then(({ data }) => {
        console.info('🐰✅ Directus Import Succeeded...', data);
        return new Promise((resolve) => resolve(data))
      })
      .catch(err => console.warn('🐰❌ Directus Import Failed...', err))
    }
  }
}