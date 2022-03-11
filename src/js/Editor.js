class Editor {
  #source = null
  #display = null

  #canvas = null
  #context = null
  #cropRegion = null

  get source() {
    return this.#source
  }

  set source(value) {
    this.#source = value
    this.#cropRegion.source = value

    document.getElementById('image-name').innerHTML = this.#source.name
    document.getElementById('image-type').innerHTML = this.#source.extension
  }

  get display() {
    return this.#display
  }

  set display(value) {
    this.#display = value
    this.#cropRegion.display = value
  }

  constructor(canvas, cropRegion) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d')
    this.#cropRegion = cropRegion
  }

  updateCanvas() {
    this.#canvas.setAttribute('width', this.#source.width)
    this.#canvas.setAttribute('height', this.#source.height)

    this.#context.drawImage(this.#source.data, 0, 0)

    // What the user sees
    this.display = {
      width: this.#canvas.offsetWidth,
      height: this.#canvas.offsetHeight
    }
  }

  crop(x,y,w,h) {
    // Invalid input
    if (!x || !y || !w || !x) {
      return;
    }

    // Clamp values to bounds
    x = Math.min(Math.max(x,0), this.#source.width)
    y = Math.min(Math.max(y,0), this.#source.height)
    w = Math.min(Math.max(w,0), this.#source.width)
    h = Math.min(Math.max(h,0), this.#source.height)

    // Prevent width and height from extending outside canvas
    if (x + w > this.#source.width) {
      w = this.#source.width - x
    }

    if (y + h > this.#source.height) {
      h = this.#source.height - y
    }

    return this.#cropRegion.crop(x,y,w,h)
  }

  downloadCrop() {
    const canvasTemp = document.createElement('canvas')
    const ctx = canvasTemp.getContext('2d')
    const { x, y, w, h } = this.#cropRegion.region

    canvasTemp.setAttribute('width', w)
    canvasTemp.setAttribute('height', h)

    const region = [x,y,w,h]
    const destination = [0,0,w,h]

    ctx.drawImage(this.#source.data, ...region, ...destination)

    let filename = document.querySelector('#image-name').textContent.replaceAll(/\n| +/g, '')

    if (!filename) {
      filename = `${this.#source.name}-crop.png`
    }

    canvasTemp.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    })
  }
}

export default Editor