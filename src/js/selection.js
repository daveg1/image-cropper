import { getElem } from "./utils"
import { canvas } from "./canvas"

const cropArea = getElem('#crop-area')
const selection = getElem('#selection')
const origin = {}

// Selection start
cropArea.addEventListener('pointerdown', e => {
  origin.x = e.clientX
  origin.y = e.clientY
  selection.setAttribute('selecting', '')
})

// Selection move
window.addEventListener('pointermove', e => {
  if (!selection.hasAttribute('selecting')) {
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

  _app.dims = {
    x: bx / sx,
    y: by / sy,
    w: w / sx,
    h: h / sy,
  }

  selection.style.cssText = `
    transform: translate(${bx}px, ${by}px);
    width: ${w}px;
    height: ${h}px;
  `
})

// Selection end
window.addEventListener('pointerup', e => {
  selection.removeAttribute('selecting')
})