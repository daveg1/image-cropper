import { getElem } from './utils'
import { crop, download } from './canvas'

const selection = getElem('#selection')
const cropButton = getElem('#crop-button')
const downloadButton = getElem('#download-button')
const fileTitle = getElem('#file-title')

cropButton.addEventListener('click', e => {
  const { img, dims } = _app

  if (img) {
    // Assume rest of properties exist
    if (dims && 'x' in dims) {
      crop(img, dims)
      selection.removeAttribute('style')
    }
  }
})

downloadButton.addEventListener('click', e => {
  // If image exists, then canvas is loaded
  if (_app.img) {
    download(fileTitle.textContent.trim())
  }
})