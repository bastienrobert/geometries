import Context from '../gl/Context.js'
import Values from '../utils/Values.js'
import Emitter from '../utils/Emitter.js'
import { generateUUID } from '../utils/helpers.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    display: inline-block;
    max-width: 100%;
    padding: 1em;
    box-sizing: border-box;
  }
  .card {
    display: inline-block;
    width: 400px;
    max-width: 100%;
    padding: 1em;
    box-shadow: 1px 2px 4px 0px rgba(0,0,0,0.25);
    box-sizing: border-box;
  }
  .gl {
    width: 100%;
    padding-bottom: 100%;
    border: 1px solid #dcdcdc;
  }
  .informations {
    color: #888;
    font-family: sans-serif;
    font-size: large;
    width: 200px;
    margin-top: 0.5em;
  }
</style>
<div class="card">
  <div class="gl js-gl"></div>
  <div class="informations">
    <span class="js-name"></span>
  </div>
</div>`

export default class GeometryCard extends HTMLElement {
  constructor() {
    super()

    this.uuid = generateUUID()
    this._mouseIsDown = false
    this._mouseDown = [0, 0]

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))

    this._onResize = this._onResize.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)

    this.$name = this._shadowRoot.querySelector('.js-name')
    this.$gl = this._shadowRoot.querySelector('.js-gl')
  }

  connectedCallback() {
    const geometry = this.getAttribute('geometry')
    if (geometry) {
      Emitter.on('resize', this._onResize)
      this.$gl.addEventListener('mousedown', this._onMouseDown, { passive: true }) // prettier-ignore
      this.$gl.addEventListener('touchstart', this._onMouseDown, { passive: true }) // prettier-ignore
      Emitter.on('mousemove', this._onMouseMove)
      Emitter.on('mouseup', this._onMouseUp)

      const label = this.getAttribute('label')
      this._attachGeometry(geometry, label)
    }
  }

  _getScissor() {
    const bcr = this.$gl.getBoundingClientRect()
    const top = Values.viewport.height - bcr.height - bcr.y
    return {
      top,
      scroll: top,
      left: bcr.left,
      width: bcr.width,
      height: bcr.height
    }
  }

  _attachGeometry(geometry, label) {
    this.$name.innerHTML = label
    Context.push(this.uuid, geometry, this._getScissor())
  }

  _onResize() {
    Context.update(this.uuid, this._getScissor())
  }

  _onMouseDown(e) {
    e = e.touches ? e.touches[0] : e
    this._mouseIsDown = true
    this._mouseDown = [e.clientX, e.clientY]

    Context.orbit(this.uuid, true)
  }

  _onMouseMove(e) {
    if (!this._mouseIsDown) return
    e = e.touches ? e.touches[0] : e

    Context.orbit(this.uuid, [
      e.clientX - this._mouseDown[0],
      e.clientY - this._mouseDown[1]
    ])
  }

  _onMouseUp() {
    this._mouseIsDown = false
    Context.orbit(this.uuid, false)
  }
}
