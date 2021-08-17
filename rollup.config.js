import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import styles from "rollup-plugin-styles"

import copy from 'rollup-plugin-copy'

/**
 * If you'd like to build dev changes straight to your local Directus instance,
 * set the 'extension_folder' to your Directus extensions folder suchas
 * D:/directus-project/extensions
 */
const extension_folder = 'dist'
const extension_name = 'resauce-image-scout'

export default [
  {
    input: 'src/interface/index.js',
    output: {
      format: 'es',
      file: `${extension_folder}/interfaces/${extension_name}/index.js`,
    },
    plugins: [
      nodeResolve(),
      terser(),
      vue(),
      commonjs(),
      styles(),
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
        targets: [{ 
          src: 'src/endpoints/*', 
          dest: `${extension_folder}/endpoints/${extension_name}`,
        }]
      })
    ]
  }
]