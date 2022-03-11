import Editor from './Editor'
import CropRegion from './CropRegion'
import SourceImage from './SourceImage'

// TODO move canvas to Editor
// TODO move update canvas to Editor
// TODO live updates from crop form

window.onload = e => {
  'use strict';

  customElements.define(CropRegion.htmlName, CropRegion)

  const uploadInput = document.getElementById('upload-input')
  const uploadButton = document.getElementById('upload-button')

  const downloadButton = document.getElementById('download-button')

  const cropForm = document.querySelector('#crop-form')

  const cropRegion = document.querySelector('#crop-region')
  const canvas = document.querySelector('canvas')

  const editor = new Editor(canvas, cropRegion)

  uploadButton.addEventListener('click', e => {
    uploadInput.click()
  })

  uploadInput.addEventListener('input', async function(e) {
    const file = this.files[0]

    if (!editor.source) {
      document.querySelector('#file-details').classList.remove('hidden')
    }

    editor.source = new SourceImage(file, await window.createImageBitmap(file))

    document.querySelector('#width').textContent = editor.source.width
    document.querySelector('#height').textContent = editor.source.height

    cropForm.reset()

    editor.updateCanvas()
  })

  downloadButton.addEventListener('click', e => {
    editor.downloadCrop()
  })

  // cropForm.addEventListener('submit', function(e) {
  cropForm.addEventListener('input', function(e) {
    e.preventDefault()
  
    if (!editor.source) {
      return
    }

    const data = new FormData(cropForm)

    const top = data.get('top')
    const left = data.get('left')
    const width = data.get('width')
    const height = data.get('height')

    editor.crop(left, top, width, height)
  })
}
