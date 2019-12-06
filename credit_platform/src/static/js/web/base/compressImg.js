$(function() {
  // 压缩图片
  function compressImg(img, Orientation, targetSize) {
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext('2d')
    let width = img.width
    let height = img.height
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = width * height / 3500000) > 1) {
      ratio = Math.sqrt(ratio)
      width /= ratio
      height /= ratio
    } else {
      ratio = 1
    }
    canvas.width = width;
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    // 循环压缩至100k左右
    let quality = 1.05, ndata = ''
    do {
      quality -= 0.05
      ndata = canvas.toDataURL('image/jpeg', quality)
    } while (module.getImgSize(ndata) > targetSize)
    return ndata
  }
  module.extend({
    // 生成base64图片
    base64: function(selector, targetSize = 100) {
      return new Promise(resolve => {
        let oFReader = new FileReader(),file = document.querySelector(selector).files[0],
            size = file.size / 1024, Orientation = null
        oFReader.readAsDataURL(file)
        oFReader.onloadend = function(oFRevent){
          if (size <= targetSize) {
            resolve(oFRevent.target.result)
          } else {
            let img = new Image()
            img.src = oFRevent.target.result
            if (img.complete) {
              callback()
            } else {
              img.onload = callback
            }
            function callback() {
              resolve(compressImg(img, Orientation, targetSize))
              img = null
            }
          }
        }
      })
    }
  })
})