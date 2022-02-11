class Selection {
  constructor(originX, originY, limitElement=null) {
    this.originX = originX
    this.originY = originY
    this.isActive = true

    this.#setLimits(limitElement)
    this.#createElement()
  }

  #setLimits(limitElement) {
    if (!limitElement) {
      this.minX = 0
      this.minY = 0
      // subtract two to account for border width
      this.maxX = window.innerWidth-2
      this.maxY = window.innerHeight-2
    } else {
      const bounds = limitElement.getBoundingClientRect()
      this.minX = Math.floor(bounds.left)
      this.minY = Math.floor(bounds.top)
      this.maxX = Math.floor(bounds.right-2)
      this.maxY = Math.floor(bounds.bottom-2)
    }
  }

  #createElement() {
    this.element = document.createElement('div')
    this.element.className = 'selection'
    this.element.style.cssText = `
      top: ${this.originY}px;
      left: ${this.originX}px;
      width: 0px;
      height: 0px;`
    document.body.appendChild(this.element)
  }

  update(leadX, leadY) {
    leadX = Math.min(Math.max(leadX, this.minX), this.maxX)
    leadY = Math.min(Math.max(leadY, this.minY), this.maxY)

    this.boxX = Math.min(this.originX, leadX)
    this.boxY = Math.min(this.originY, leadY)
    this.width = Math.abs(this.originX - leadX)
    this.height = Math.abs(this.originY - leadY)

    this.element.style.cssText = `
      top: ${this.boxY}px;
      left: ${this.boxX}px;
      width: ${this.width}px;
      height: ${this.height}px;`
  }

  destroy() {
    this.element.remove()
  }
}

export default Selection