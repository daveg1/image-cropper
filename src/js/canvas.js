const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

export { canvas, ctx }

export function paintImage(img) {
  canvas.height = img.height
  canvas.width = img.width
  ctx.drawImage(img, 0, 0)
}

export function crop(img, dims) {
  const { x, y, w, h } = dims

  canvas.width = w
  canvas.height = h

  const region = [x,y,w,h]
  const destination = [0,0,w,h]

  ctx.drawImage(img, ...region, ...destination)
}

export function download(filename='crop.jpg') {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  })
}