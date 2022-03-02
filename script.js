const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const input = document.querySelector('#file')
const form = document.querySelector('#form')

const cropRegion = document.querySelector('#crop-region')

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
    link.download = `${input.files[0].name.split('.').shift()}.png`
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

input.onchange = async e => {
  source = await createImageBitmap(input.files[0])

  document.querySelector('#width').textContent = source.width
  document.querySelector('#height').textContent = source.height

  updateCanvas()
}

form.onsubmit = e => {
  e.preventDefault()

  if (!source) {
    return
  }

  const data = new FormData(form)

  const top = data.get('top')
  const left = data.get('left')
  const width = data.get('width')
  const height = data.get('height')

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

  if (e.submitter.id === 'download') {
    download(left, top, width, height)
  } else {
    crop(left, top, width, height)
  }
}