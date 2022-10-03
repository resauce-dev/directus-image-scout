module.exports = class RequestDetails {
  constructor(req) {
    this.req = req
  }
  /**
   * Return data about the user making a request
   */
  getUserId() {
    return this.req.accountability.user
  }
  /**
   * Is there a user currently authenticated?
   */
  isAuthenticated() {
    // Does the endpoints require a user to be authenticated?
    const authRequired = "RIS_REQUIRED_AUTH" in process.env ? process.env.RIS_REQUIRED_AUTH : true
    if (authRequired === 'false') return true
    return this.getUserId() ? this.getUserId() : false
  }
  /**
   * Get the URL of the currently used Directus API
   */
  getApiUrl() {
    return this.req.protocol + '://' + this.req.get('host');
  }
  /**
   * Get the body of the request
   */
  getBody() {
    return this.req.body
  }
}
