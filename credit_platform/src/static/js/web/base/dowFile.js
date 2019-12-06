$(function(){
  module.extend({
    downFile: function(url, options, method = 'post') {
      module.loading.show()
      
      let xhr = new XMLHttpRequest()

      xhr.open(method, url, true)
      xhr.responseType = "blob" //这里是关键，它指明返回的数据的类型是二进制  
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('mtk', module.localData.getData('usermtk') || API.loaclMtk)
      xhr.onreadystatechange = function () {
        module.loading.hide()
        if (this.readyState == 4 && this.status == 200) {
          let response = this.response,
              fileName = options && options.start ? options.start + '/' + options.end + "数据统计.xls" : this.getResponseHeader('content-disposition').split('=')[1]
              a = document.createElement('a')
          $(a).attr("download", fileName)
          a.href = window.URL.createObjectURL(response)
          $("body").append(a)
          a.click();
          $(a).remove()
        }
      }
      xhr.send(method.toUpperCase === 'GET' ? null : JSON.stringify(options))
    }
  })
})