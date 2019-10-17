import Emitter from './Emitter.js'
import VirtualScroll from './VirtualScroll.js'

class Values {
  constructor() {
    this._onResize = this._onResize.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
    this._onResize()

    this.listen()
  }

  listen() {
    this.virtualScroll = new VirtualScroll()
    window.addEventListener('resize', this._onResize)

    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('touchmove', this._onMouseMove)
    window.addEventListener('mouseup', this._onMouseUp)
    window.addEventListener('touchend', this._onMouseUp)
    window.addEventListener('touchleave', this._onMouseUp)
    window.addEventListener('touchcancel', this._onMouseUp)
  }

  unlisten() {
    this.virtualScroll.unlisten()
    window.removeEventListener('resize', this._onResize)
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    Emitter.emit('resize')
  }

  _onMouseMove(e) {
    Emitter.emit('mousemove', e)
  }

  _onMouseUp() {
    Emitter.emit('mouseup')
  }
}

export default new Values()
