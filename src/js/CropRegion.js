class CropRegion extends HTMLElement {
  static htmlName = 'crop-region'

  #source = null
  #display = null
  #region = null

  get region() {
    return this.#region
  }

  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const styles = this.#createStyles()

    shadow.append(styles)
  }

  #createStyles() {
    const style = document.createElement('style')

    style.textContent = `
    :host {
      background-color: rgba(200,0,0,0.5);
      position: absolute;
    }
    `

    return style
  }

  set source(val) {
    this.#source = val
  }

  set display(val) {
    this.#display = val
  }

  crop(x,y,w,h) {
    // Scale points to proportion of source image.
    x = (x / this.#source.width)  * this.#display.width
    y = (y / this.#source.height) * this.#display.height
    w = (w / this.#source.width)  * this.#display.width
    h = (h / this.#source.height) * this.#display.height

    this.#region = { x, y, w, h }
  
    this.style.cssText = `
    width: ${w}px;
    height: ${h}px;
    transform: translate3d(${x}px, ${y}px, 0);
    `
  }
}

export default CropRegion