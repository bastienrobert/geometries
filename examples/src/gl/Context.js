import Geometry from './Geometry.js'
import geometries from './geometries.js'

import Values from '../utils/Values.js'
import Emitter from '../utils/Emitter.js'

const ORBIT_FACTOR = 6

class Context {
  constructor() {
    this._canvas = document.getElementById('canvas')
    this._gl = this._canvas.getContext('webgl')

    this._geometries = {}

    this._render = this._render.bind(this)

    this._gl ? this._init() : console.log("WebGL isn't supported")
  }

  _init() {
    this._gl.enable(this._gl.DEPTH_TEST)
    this._gl.enable(this._gl.SCISSOR_TEST)

    this._render()
  }

  push(id, geometry, scissor) {
    const { vertices, indices, normals } = new geometries[geometry]()
    const attributes = {
      position: { size: 3, data: new Float32Array(vertices) },
      normal: { size: 3, data: new Float32Array(normals) },
      indices: { data: new Uint16Array(indices) }
    }
    this._geometries[id] = new Geometry(this._gl, scissor, attributes)
  }

  scroll(targetY) {
    for (let id in this._geometries) {
      const scroll = this._geometries[id].scissor.top - targetY
      this._geometries[id].scissor.scroll = scroll
    }
  }

  update(id, scissor) {
    this._geometries[id].scissor = scissor
  }

  orbit(id, arg) {
    if (arg === true) {
      Emitter.emit('virtualscroll:prevent', true)
      this._geometries[id].startOrbit()
      return
    }
    if (arg === false) {
      Emitter.emit('virtualscroll:prevent', false)
      this._geometries[id].stopOrbit()
      return
    }
    this._geometries[id].setOrbit(
      (arg[0] / Values.viewport.width) * ORBIT_FACTOR,
      (arg[1] / Values.viewport.height) * ORBIT_FACTOR
    )
  }

  onResize() {
    this._canvas.width = Values.viewport.width
    this._canvas.height = Values.viewport.height
  }

  _render() {
    window.requestAnimationFrame(this._render)

    for (let id in this._geometries) {
      this._geometries[id].draw()
    }
  }
}

export default new Context()
