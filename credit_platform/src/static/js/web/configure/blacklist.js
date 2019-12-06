$(function () {
  let columns = [{
    checkbox: true,
    align: 'center',
    valign: 'middle'
  }, {
    field: 'entry',
    title: 'ip',
    formatter: function (value, row, index) {
      return value.split('/32')[0]
    }
  }, {
    field: 'comment',
    title: '备注'
  }, {
    title: '操作',
    valign: 'middle',
    align: 'center',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<div role="toolbar" aria-label="" data-entry="${row.entry.split('/32')[0]}" data-comment="${row.comment}">
        <span class="link" data-click="delFun">删除</span>
        </div>`
    }
  }],
  FN = {
    getIP() {
      module.$http(API.operatorPlat.getIP, {}, function () {
        let data = this.resData
        // 渲染table
        module.renderTable({
          id: "#table1",
          data,
          columns
        })
      }, { type: 'GET' })
    },
    addIPBatch(options) {
      module.$http(API.operatorPlat.addIPBatch, options, function () {
        if (this.resCode && this.resMsg[0].msgCode === '0000') {
          module.alert('新增成功')
          FN.getIP()
        }
      })
    },
    delIPBatch(options) {
      module.$http(API.operatorPlat.delIPBatch, options, function () {
        if (this.resCode && this.resMsg[0].msgCode === '0000') {
          module.alert('删除成功')
          FN.getIP()
        }
      })
    }
  }

  FN.getIP()

  // 单个增加
  module.clickTree.addFun = function () {
    module.popup.show({
      title: '新增IP黑名单',
      content: $("#popupAddHtml").html(),
      callback: function () {
        module.clickTree.addDetermine = function () {
          let form = $(this).closest('form'), options = {}
          options.entry = form.find('[name="entry"]').val().trim()
          options.comment = form.find('[name="comment"]').val().trim()
          if (!options.entry) {
            module.alert('请输入IP')
            return
          }
          if (!module.isValidIP(options.entry)) {
            module.alert('请输入有效IP')
            return
          }
          form.find('[data-click="hidepopup"]').trigger('click')
          FN.addIPBatch([options])
        }
      }
    })
  }

  // 批量增加
  module.clickTree.mulpAddFun = function () {
    module.popup.show({
      title: '批量新增IP黑名单',
      content: $("#popupmulpAddFun").html(),
      callback: function () {

        module.clickTree.mulpAddDetermineFun = function () {
          let form = $(this).closest('form'),
            options = [],
            value = form.find('[name="comment"]').val().trim().replace(/，/ig, ','),
            flag = true
          if (!value) {
            module.alert('请输入IP')
            return
          }
          value.split(',').map(v => {
            let ip = v.split('|')[0]
            if (!module.isValidIP(ip)) {
              flag = false
            } else {
              options.push({
                entry: ip,
                comment: v.split('|')[1] ? v.split('|')[1] : ''
              })
            }
          })
          if (!flag) {
            module.alert('请输入IP')
            return
          }
          form.find('[data-click="hidepopup"]').trigger('click')
          FN.addIPBatch(options)
        }
      }
    })
  }
  // 单个删除
  module.clickTree.delFun = function () {
    let options = []
    options.push({
      entry: $(this).closest('div').data('entry'),
      comment: $(this).closest('div').data('comment')
    })
    module.confirm({
      title: '删除',
      info: '确定删除?',
      status: 0,
      callback: function () {
        FN.delIPBatch(options)
      }
    })
  }
  // 批量删除
  module.clickTree.mulpDeleteFun = function () {
    let tr = $('#table1').find('tbody tr'), options = [], flag = false
    $(tr).each(function (k, v) {
      if ($(v).find('td').eq(0).hasClass('active')) {
        flag = true
        options.push({
          entry: $(v).find('td:last-child div').data('entry'),
          comment: $(v).find('td:last-child div').data('comment')
        })
      }
    })
    if (!flag) {
      module.alert('请选择删除的条目')
      return
    }
    module.confirm({
      title: '删除',
      info: '确定删除?',
      status: 0,
      callback: function () {
        FN.delIPBatch(options)
      }
    })
  }
})