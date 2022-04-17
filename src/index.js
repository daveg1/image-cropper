import imgURL from './beerhead.jpg'
import './index.css'

window.onload = e => {
  const filename = document.querySelector('#filename')
  const fileArea = document.querySelector('#file-area')
  const cropArea = document.querySelector('#crop-area')
  const dropAreaOverlay = document.querySelector('#file-drop-overlay')
  const canvas = document.querySelector('#canvas')
  const cropButton = document.querySelector('#crop')
  const downloadButton = document.querySelector('#download')
  const fileButton = document.querySelector('#file-button')
  const fileInput = document.querySelector('#file')

  const c = canvas.getContext('2d')
  const drawArea = initDrawArea()
  const origin = {}

  let img
  let dims = null
  let isSelecting = false

  // Events
  window.addEventListener('pointermove', handleCropMove)
  window.addEventListener('pointerup', handleCropEnd)
  window.addEventListener('dragenter', e => {
    dropAreaOverlay.classList.replace('hidden', 'grid')
  })
  dropAreaOverlay.addEventListener('dragleave', e => {
    dropAreaOverlay.classList.replace('grid', 'hidden')
  })
  window.addEventListener('dragover', e => e.preventDefault())
  window.addEventListener('drop', e => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])

  })
  cropArea.addEventListener('pointerdown', handleCropStart)
  cropButton.addEventListener('click', crop)
  downloadButton.addEventListener('click', download)
  fileButton.addEventListener('click', e => {
    fileInput.click()
  })
  fileInput.addEventListener('change', e => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0])
    }
  })

  async function handleFile(file) {
    img = await createImageBitmap(file)
    loadImage(img)
    filename.textContent = file.name
    filename.contentEditable = 'true'

    fileArea.remove()
    cropArea.classList.remove('hidden')
  }

  function handleCropStart(e) {
    origin.x = e.clientX
    origin.y = e.clientY
    isSelecting = true
  }

  function handleCropMove(e) {
    if (!isSelecting) {
      return
    }

    const bounds = cropArea.getBoundingClientRect()
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
    cropArea.append(div)
    return div
  }

  function loadImage(img) {
    canvas.height = img.height
    canvas.width = img.width
    c.drawImage(img, 0, 0)
  }
}