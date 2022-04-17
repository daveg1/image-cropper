import imgURL from './beerhead.jpg'
import './index.css'

window.onload = e => {
  const filename = document.querySelector('#filename')
  const area = document.querySelector('#area')
  const canvas = document.querySelector('#canvas')
  const cropButton = document.querySelector('#crop')
  const downloadButton = document.querySelector('#download')

  const c = canvas.getContext('2d')
  const drawArea = initDrawArea()
  let img = loadImage()

  const origin = {}
  let dims = null
  let isSelecting = false

  // Events
  area.addEventListener('pointerdown', handleCropStart)
  window.addEventListener('pointermove', handleCropMove)
  window.addEventListener('pointerup', handleCropEnd)
  cropButton.addEventListener('click', crop)
  downloadButton.addEventListener('click', download)

  function handleCropStart(e) {
    origin.x = e.clientX
    origin.y = e.clientY
    isSelecting = true
  }

  function handleCropMove(e) {
    if (!isSelecting) {
      return
    }

    const bounds = area.getBoundingClientRect()
    const lx = Math.floor(Math.min(Math.max(origin.x, e.clientX), bounds.right) - bounds.x)
    const ly = Math.floor(Math.min(Math.max(origin.y, e.clientY), bounds.bottom) - bounds.y)
    const ox = Math.floor(Math.max(Math.min(origin.x, e.clientX), bounds.left) - bounds.x)
    const oy = Math.floor(Math.max(Math.min(origin.y, e.clientY), bounds.top) - bounds.y)

    const w = lx - ox
    const h = ly - oy
    const bx = ox
    const by = oy

    // Scale
    const sx = Math.floor(bounds.width) / canvas.width
    const sy = Math.floor(bounds.height) / canvas.height

    dims = {
      x: bx / sx,
      y: by / sy,
      w: w / sx,
      h: h / sy,
    }

    drawArea.style.cssText = `
      transform: translate(${bx}px, ${by}px);
      width: ${w}px;
      height: ${h}px;
    `
  }

  function handleCropEnd(e) {
    isSelecting = false
  }

  function crop() {
    const { x, y, w, h } = dims

    canvas.width = w
    canvas.height = h

    const region = [x,y,w,h]
    const destination = [0,0,w,h]

    c.drawImage(img, ...region, ...destination)
    drawArea.removeAttribute('style')
  }

  function download() {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename.textContent.trim() ?? 'crop.jpg'
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  function initDrawArea() {
    const div = document.createElement('div')
    div.id = 'draw-area'
    area.append(div)
    return div
  }

  function loadImage() {
    const img = new Image()
    img.src = imgURL

    img.onload = (e) => {
      canvas.height = img.naturalHeight
      canvas.width = img.naturalWidth
      c.drawImage(img, 0, 0)
      filename.textContent = (img.src.split('/').pop())
      filename.contentEditable = 'true'
    }
    return img
  }
}