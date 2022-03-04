class SourceImage {
  #file = null
  #bitmap = null

  get filename() {
    return this.#file.name
  }

  get type() {
    return this.#file.type
  }

  get name() {
    const split = this.filename.split('.')
    split.pop()
    return split.join('.')
  }

  get extension() {
    return '.' + this.filename.split('.').pop()
  }

  get data() {
    return this.#bitmap
  }
  
  get width() {
    return this.#bitmap.width
  }
  
  get height() {
    return this.#bitmap.height
  }

  constructor(file, bitmap) {
    this.#file = file
    this.#bitmap = bitmap
  }

  get valueOf() {
    return this.#bitmap
  }
}

export default SourceImage