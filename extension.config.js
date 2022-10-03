const copy = require('rollup-plugin-copy')

/**
 * If you'd like to dev changes built into to your local Directus instance,
 * set the 'extension_folder' below to your Directus extensions folder.
 * 
 * EG: D:/directus-project/extensions
 */
const extension_folder = 'dist'

/**
 * Ensure endpoints are copied to the dist folder.
 */
module.exports = {
    plugins: [
        copy({
            targets: [{ 
                src: 'src/endpoints/*', 
                dest: `${extension_folder}/endpoints/resauce-image-scout`,
            }]
        })
    ],
}