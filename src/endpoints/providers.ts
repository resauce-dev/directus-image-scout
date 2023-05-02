import fs from 'fs'

const PROVIDERS_DIR = __dirname + '/providers'

let providerList: string[] = []

fs.readdir(PROVIDERS_DIR, function (err, items): void {
  items.forEach((provider_name: string) => {
    const Provider = require(PROVIDERS_DIR + `/${provider_name}`)
    const newProvider = new Provider()
    if (newProvider.key === process.env.RIS_DEFAULT_PROVIDER) {
      providerList.unshift(newProvider)
    } else {
      providerList.push(newProvider)
    }
  })
})

export default providerList
