import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const external = ['gl-matrix']
const lintOptions = {
  throwOnError: true
}

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      eslint(lintOptions),
      typescript({ exclude: ['node_modules/**'] })
    ],
    external
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      name: '{{moduleName}}',
      format: 'umd',
      globals: { 'gl-matrix': 'glMatrix' }
    },
    plugins: [
      eslint(lintOptions),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: ['node_modules/**']
      }),
      resolve(),
      commonjs(),
      uglify()
    ],
    external
  }
]
