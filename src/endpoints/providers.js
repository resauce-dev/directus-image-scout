const providers_folder = __dirname + '/providers';
const fs = require('fs');

let providers = []

fs.readdir(providers_folder, function(err, items) {
    items.forEach(provider_name => {
		const Provider = require(providers_folder + `/${provider_name}`)
		const newProvider = new Provider()
		if(newProvider.key === process.env.RIS_DEFAULT_PROVIDER) {
			providers.unshift(newProvider)
		} else {
			providers.push(newProvider)
		}
	})
});

module.exports = providers
