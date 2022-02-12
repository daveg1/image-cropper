import Selection from './Selection.js'

let selection = null
let currentImage = null;

// TODO input form for cropping image

window.onload = e => {
  const fileUpload = document.getElementById('file-upload')
  const canvas = document.getElementById('image-space')
  const ctx = canvas.getContext('2d')

  document.getElementById('upload').onclick = e => {
    fileUpload.click()
  }

  // Selection events
  window.onmousedown = e => {
    if (e.target !== canvas) {
      return;
    }

    const x = e.clientX
    const y = e.clientY
  
    const existingSelection = document.querySelector('.selection')
  
    if (existingSelection) {
      existingSelection.remove()
    }
  
    selection = new Selection(x,y,canvas)
    selection.element.onclick = e => {
      cropImage()
      selection.destroy()
      selection = null
    }
  }
  
  window.onmousemove = e => {
    if (!selection?.isActive) {
      return
    }
  
    const x = e.clientX
    const y = e.clientY
  
    selection.update(x,y)
  }
  
  window.onmouseup = e => {
    if (selection) {
      selection.isActive = false
    }
  }

  function cropImage() {
    const bounds = canvas.getBoundingClientRect()
    const x = Math.abs(selection.boxX - bounds.left)
    const y = Math.abs(selection.boxY - bounds.top)

    const height = selection.height
    const width = selection.width

    const source = [x,y,width,height]
    const destination = [0,0,width,height]

    canvas.setAttribute('height', height)
    canvas.setAttribute('width', width)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(currentImage, ...source, ...destination)
  }

  function updateCavnas(image) {
    canvas.setAttribute('height', image.height)
    canvas.setAttribute('width', image.width)
    ctx.drawImage(image, 0, 0)
    currentImage = image
  }

  fileUpload.onchange = async e => {
    const file = fileUpload.files[0]
    const mime = file.type.split('/')[0]

    if (mime !== 'image') {
      return
    }

    createImageBitmap(file)
      .then(updateCavnas)
      .catch(console.warn)
  }

  document.getElementById('download').onclick = e => {
    canvas.toBlob(blob => {
      const link = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.download = 'cropped.jpg'
      a.href = link
      a.click()

      URL.revokeObjectURL(link)
    })
  }
}