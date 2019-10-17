import './components/index.js'
import Context from './gl/Context.js'
import Emitter from './utils/Emitter.js'
import Values from './utils/Values.js'

class App {
  constructor() {
    this.scrollZone = document.getElementById('scroll-zone')
    this.scrollHeight = 0

    this.targetY = 0
    this._onScroll = this._onScroll.bind(this)
    this._onResize = this._onResize.bind(this)

    if (this.scrollZone) {
      this._onResize()
      Emitter.on('resize', this._onResize)
      Emitter.on('scroll', this._onScroll)
    }
  }

  _onScroll(e) {
    this.targetY += e.deltaY
    this.targetY = Math.max((this.scrollHeight - Values.viewport.height) * -1, this.targetY) // prettier-ignore
    this.targetY = Math.min(0, this.targetY)

    this._scrollTo(this.targetY)
  }

  _scrollTo(target) {
    Context.scroll(target)
    const s = this.scrollZone.style
    const t = 'translateY(' + target + 'px) translateZ(0)'
    s['transform'] = t
    s['webkitTransform'] = t
    s['mozTransform'] = t
    s['msTransform'] = t
  }

  _onResize() {
    this._scrollTo(0)
    const bcr = this.scrollZone.getBoundingClientRect()
    this.scrollHeight = bcr.height
    Context.onResize()
  }
}

new App()
