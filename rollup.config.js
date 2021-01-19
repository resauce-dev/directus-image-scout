import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import copy from 'rollup-plugin-copy'

// Make this your local Directus install if you'd like to build dev changes straight to there.
const extension_folder = 'dist'  // C:/Users/MyUser/workingcopy/directus/api/extensions
const extension_name = 'resauce-image-scout'

export default [
  {
    input: 'src/interface/index.js',
    output: {
      format: 'es',
      file: `${extension_folder}/interfaces/${extension_name}/index.js`,
    },
    plugins: [
      terser(),
      resolve(),
      commonjs(),
      vue()
    ]
  },
  {
    input: 'src/endpoints/index.js',
    output: {
      format: 'es',
      file: `${extension_folder}/endpoints/${extension_name}/index.js`,
    },
    plugins: [
      copy({
        targets: [
          { 
            src: 'src/endpoints/*', 
            dest: `${extension_folder}/endpoints/${extension_name}`,
          }
        ]
      })
    ]
  }
]