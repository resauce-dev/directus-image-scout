const copy = require('rollup-plugin-copy')
const ts = require('@rollup/plugin-typescript')

/**
 * If you'd like to dev changes built into to your local Directus instance,
 * set the 'extension_folder' below to your Directus extensions folder.
 *
 * EG: D:/directus-project/extensions
 */
const extension_folder = '../directus-resauce/extensions' //'dist'

console.log('XXXXX')

/**
 * Ensure endpoints are copied to the dist folder.
 */
module.exports = {
  plugins: [

    // ts({
    //   compilerOptions: {
    //     noImplicitAny: false, // Eventually make these true
    //     noUnusedParameters: false, // Eventually make these true
    //     outFile: `${extension_folder}/endpoints/resauce-image-scout/providers.js`,
    //   },
    //   "include": [
    //     "./src/endpoints/providers/**/*.ts"
    //   ]
    // })



    // copy({
    //   targets: [
    //     {
    //       src: 'src/endpoints/providers/*',
    //       dest: `${extension_folder}/endpoints/resauce-image-scout/providers`,
    //     },
    //     {
    //       src: 'src/endpoints/image-models/*',
    //       dest: `${extension_folder}/endpoints/resauce-image-scout/image-models`,
    //     }
    //   ]
    // })

  ],
}
