import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'

import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [typescript(), production && bundleSize()]
  },
  {
    input: 'src/index.ts',
    output: { file: pkg.browser, name: 'Geometries', format: 'umd' },
    plugins: [
      resolve({ extensions: ['.ts'] }),
      typescript(),
      commonjs(),
      terser(),
      production && bundleSize()
    ]
  }
]
