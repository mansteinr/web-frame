$(function(){
  module.extend({
    downFile: function(url, options, method = 'post') {
      module.loading.show()
      
      let xhr = new XMLHttpRequest()

      xhr.open(method, url, true)
      xhr.responseType = "blob" //这里是关键，它指明返回的数据的类型是二进制  
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('mtk', module.localData.getData('usermtk') || API.localMtk)
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let response = this.response,
              fileName = options && options.start ? options.start + '/' + options.end + "数据统计.xls" : this.getResponseHeader('content-disposition').split('=')[1]
              a = document.createElement('a')
              console.log('文件大小为 ' + (response.size / (1024 * 1024)) + ' M')
          $(a).attr("download", fileName)
          a.href = window.URL.createObjectURL(response)
          $("body").append(a)
          a.click();
          $(a).remove()
          module.loading.hide()
        }
      }
      xhr.send(method.toUpperCase === 'GET' ? null : JSON.stringify(options))

      xhr.addEventListener('error', (error) => {
        // console.log(error.message)
        module.alert('下载失败')
        module.loading.hide()
      })
    }
  })
})