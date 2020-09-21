export default class ImageModel {
  constructor(original_data, title, description, url_thumb, url_download, url_share = null, url_author = null, tags = []) {
    this.original_data = original_data
    this.title = title
    this.description = description
    this.url_thumb = url_thumb
    this.url_download = url_download
    this.url_share = url_share
    this.url_author = url_author
    this.tags = tags
  }
  setTags(tags) {
    return this.tags = tags
  }
}