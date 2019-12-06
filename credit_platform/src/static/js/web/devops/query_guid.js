$(function () {
  let FN = {
      getLogs: function (op) {
        module.$http(API.logsPlat.logDetail, op, function () {
          let data = this.resData;
          module.hasDataFunction("#chart1")
          if (!module.empty(data)) {
            data = {}
          }
          $('#guidResult').empty()
          $(".card-container .item:first-child").removeClass('active').siblings('.item').addClass("active")
          let jsonContainer = document.getElementById("guidResult"),
              editor = new JSONEditor(jsonContainer, {
                mode: 'view',
                timestampTag: true
              })
          editor.set(data)
          $('.jsoneditor-expand-all').click()
          $(document).find('.jsoneditor-navigation-bar').remove()
        })
      }
    }

  /*查詢*/
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {}
      $(params).each(function (k, v) {
        if (v.value) {
          options[v.name] = v.value.trim()
        }
      })
      if (!module.empty(options)) {
        module.alert("请输入guid")
        return
      }
      FN.getLogs(options)
    }
  }
  /*查看图片*/
  module.viewImage()
})
