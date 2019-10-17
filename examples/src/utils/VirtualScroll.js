/**
 * inspired by Ayamflow'VirtualScroll
 * https://github.com/ayamflow/virtual-scroll
 */
import Emitter from './Emitter.js'

const KEYSTEP = 120

export default class VirtualScroll {
  static getSupport() {
    return {
      hasWheelEvent: 'onwheel' in document,
      hasMouseWheelEvent: 'onmousewheel' in document,
      hasTouch: 'ontouchstart' in document,
      hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
      hasKeyDown: 'onkeydown' in document,
      isFirefox: navigator.userAgent.indexOf('Firefox') > -1
    }
  }

  constructor() {
    this._event = {
      y: 0,
      x: 0,
      deltaX: 0,
      deltaY: 0
    }
    this._mouseDown = [0, 0]

    this._listeners = []
    this._bind()
    this.listen()
  }

  _bind() {
    this._onWheel = this._onWheel.bind(this)
    this._onMouseWheel = this._onMouseWheel.bind(this)
    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
  }

  listen() {
    const support = VirtualScroll.getSupport()
    if (support.hasWheelEvent) this._addEventListener('wheel', this._onWheel) // prettier-ignore
    if (support.hasMouseWheelEvent) this._addEventListener('mousewheel', this._onMouseWheel) // prettier-ignore

    if (support.hasTouch) {
      this._addEventListener('touchstart', this._onTouchStart)
      this._addEventListener('touchmove', this._onTouchMove)
    }

    if (support.hasKeyDown) {
      this._addEventListener('keydown', this._onKeyDown, { target: document }) // prettier-ignore
    }
  }

  _addEventListener(event, fn, options = {}) {
    if (!options.target) options.target = window
    this._listeners.push({ event, fn, options })
    options.target.addEventListener(event, fn)
  }

  unlisten() {
    this._listeners.forEach(({ event, fn, options }) => {
      if (!options.target) options.target = window
      options.target.removeEventListener(event, fn)
    })
  }

  _emit(e) {
    Emitter.emit('scroll', e)
  }

  _onWheel(e) {
    const evt = this._event

    evt.deltaX = e.wheelDeltaX || e.deltaX * -1
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1

    this._emit(evt)
  }

  _onMouseWheel(e) {
    const evt = this._event

    evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0
    evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta

    this._emit(evt)
  }

  _onTouchStart(e) {
    const t = e.targetTouches ? e.targetTouches[0] : e
    this._mouseDown = [t.pageX, t.pageY]
  }

  _onTouchMove(e) {
    const evt = this._event
    const t = e.targetTouches ? e.targetTouches[0] : e

    evt.deltaX = t.pageX - this._mouseDown[0]
    evt.deltaY = t.pageY - this._mouseDown[1]

    this._mouseDown = [t.pageX, t.pageY]

    this._emit(e)
  }

  // TODO: add cmd+top and cmd+bottom to get up/down
  _onKeyDown(e) {
    const evt = this._event
    evt.deltaX = evt.deltaY = 0

    switch (e.key) {
      case 'left':
      case 'up':
        evt.deltaY = KEYSTEP
        break
      case 'right':
      case 'down':
        evt.deltaY = -KEYSTEP
        break
      default:
        return
    }

    this._emit(e)
  }
}
