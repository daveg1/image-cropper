import { getElem } from './utils'
import { paintImage } from './canvas'

const fileButton = getElem('#file-button')
const fileInput = getElem('#file-input')
const fileTitle = getElem('#file-title')

const fileArea = getElem('#file-area')
const cropArea = getElem('#crop-area')

async function handleFile(file) {
  // Attach image to global object
  _app.img = await createImageBitmap(file)
  paintImage(_app.img)

  fileTitle.textContent = file.name
  fileTitle.contentEditable = 'true'

  fileArea.classList.add('hidden')
  cropArea.classList.remove('hidden')
}

// File upload form
fileButton.addEventListener('click', e => {
  fileInput.click()
})

fileInput.addEventListener('change', function(e) {
  if (this.files.length) {
    handleFile(this.files[0])
  }
})

// File drag'n'drop overlay
const fileDropOverlay = getElem('#file-drop-overlay')

function openOverlay() {
  fileDropOverlay.setAttribute('open', '')
}

function closeOverlay() {
  fileDropOverlay.removeAttribute('open')
}

window.addEventListener('dragenter', openOverlay)
window.addEventListener('dragover', e => e.preventDefault()) // Stop file opening in new tab
fileDropOverlay.addEventListener('dragleave', closeOverlay)

window.addEventListener('drop', e => {
  e.preventDefault()
  handleFile(e.dataTransfer.files[0])
  closeOverlay()
})