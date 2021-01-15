import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/interface/index.js',
    output: {
      format: 'es',
      file: 'dist/interfaces/resauce-image-scout/index.js'
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
      file: 'dist/endpoints/resauce-image-scout/index.js',
    },
    plugins: [
      copy({
        targets: [
          { 
            src: 'src/endpoints/*', 
            dest: 'dist/endpoints/resauce-image-scout'
          }
        ]
      })
    ]
  }
]