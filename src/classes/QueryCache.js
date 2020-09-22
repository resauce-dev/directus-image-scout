export default class QueryCache {
    /**
     * The name of the provider in lower-case
     * 
     * @param {String} providerName 
     */
    constructor(providerName) {
        this.provider = providerName
    }
    /**
     * Passing in the query URL
     * 
     * @param {String} query 
     */
    exists(query) {
        return this.fetch(query) ? true : false
    }
    /**
     * Passing in the query URL
     * 
     * @param {String} query 
     */
    fetch(query) {
        return JSON.parse(sessionStorage.getItem(`${this.provider}__${query}`))
    }
    /**
     * Passing in the query URL & data to save
     * 
     * @param {String} query 
     * @param {Object|Array} data 
     */
    save(query, data) {
        return sessionStorage.setItem(`${this.provider}__${query}`, JSON.stringify(data))
    }
}