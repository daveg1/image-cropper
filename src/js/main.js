
// TODO image class to hold image bitmap data and metadata
window.onload = e => {
  'use strict';

  const uploadInput = document.getElementById('upload-input')
  const uploadButton = document.getElementById('upload-button')

  const downloadButton = document.getElementById('download-button')

  const cropForm = document.querySelector('#crop-form')
  const cropRegion = document.querySelector('#crop-region')

  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')

  let source = null
  let display = null

  function updateCanvas() {
    canvas.setAttribute('width', source.width)
    canvas.setAttribute('height', source.height)
  
    context.drawImage(source, 0, 0)
  
    // What the user sees
    display = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    }
  }

  uploadButton.addEventListener('click', e => {
    uploadInput.click()
  })

  uploadInput.addEventListener('input', async function(e) {
    source = await createImageBitmap(this.files[0])
  
    document.querySelector('#width').textContent = source.width
    document.querySelector('#height').textContent = source.height
  
    updateCanvas()
  })

  function download(x, y, w, h) {
    const canvasTemp = document.createElement('canvas')
    const ctx = canvasTemp.getContext('2d')
  
    canvasTemp.setAttribute('width', w)
    canvasTemp.setAttribute('height', h)
  
    const region = [x, y, w, h]
    ctx.drawImage(source, ...region, 0, 0, w, h)
  
    canvasTemp.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${uploadInput.files[0].name.split('.').shift()}-crop.png`
      link.click()
      URL.revokeObjectURL(url)
    })
  }
  
  function crop(x, y, w, h) {
    x = (x / source.width) * display.width
    y = (y / source.height) * display.height
    w = (w / source.width) * display.width
    h = (h / source.height) * display.height
  
    cropRegion.style.cssText = `
    width: ${w}px;
    height: ${h}px;
    transform: translate(${x}px, ${y}px)
    `
  }

  function getCropDimensions() {
    const data = new FormData(cropForm)

    const top = data.get('top')
    const left = data.get('left')
    const width = data.get('width')
    const height = data.get('height')

    return { top, left, width, height }
  }

  downloadButton.addEventListener('click', e => {
    const { left, top, width, height } = getCropDimensions()

    download(left, top, width, height)
  })

  cropForm.addEventListener('submit', function(e) {
    e.preventDefault()
  
    if (!source) {
      return
    }
  
    const { left, top, width, height } = getCropDimensions()
  
    // Invalid width
    if (width > source.width || width <= 0) {
      return
    }
  
    // Invalid height
    if (height > source.height || height <= 0) {
      return
    }
  
    // Out of bounds
    if (left < 0 || top < 0) {
      return
    }
  
    if (e.submitter.id === 'download-button') {
      download(left, top, width, height)
    } else {
      crop(left, top, width, height)
    }
  })
}
