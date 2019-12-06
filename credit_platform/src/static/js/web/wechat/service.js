$(function () {
  let columns = [{ // 定义列
    field: 'serviceNamezh',
    title: '服务名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceType',
    title: '服务类型',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return value === '1' ? '服务平台服务组合演示' : '服务平台服务'
    }
  }, {
    field: 'forbidFlag',
    title: '是否禁用',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class='${value === '0' ? "isColor" : "noColor"}'>${value === '0' ? '不禁用' : '禁用'}</span>`
    }
  }, {
    field: 'createTime',
    title: '创建时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return module.formaterTime(value, 'yyyy-mm-dd hh:ii:ss')
    }
  }, {
    field: 'updateTime',
    title: '更新时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return module.formaterTime(value, 'yyyy-mm-dd hh:ii:ss')
    }
  }, {
    field: 'remark',
    title: '备注',
    class: 'wechat-remark',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    title: '操作',
    valign: 'middle',
    align: 'center',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      let message = JSON.stringify(row)
      return `<div role="toolbar" aria-label="" data-value= '${message}'  data-id='${row.serviceId}'>
        <span class="link" data-click="del">删除</span>
        <span class="link ml" data-click="update">更新</span>
        </div>`
    }
  }], FN = {
    wechatServiceQuery: function (options, callback) {
      // 查询服务信息
      module.$http(API.wechat.wechatServiceQuery, options, function () {
        $('#table1').closest('.chartArea').removeClass('active')
        let data = this.resData
        if (callback) {
          callback(data)
        }
        if (data.length) {
          data.sort((a, b) => {
            return -(a.updateTime - b.updateTime)
          })
        }
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns
        })
        module.popup.hide()
      })
    },
    // 服务信息添加
    wechatServiceAdd: function (options) {
      module.$http(API.wechat.wechatServiceAdd, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatService', data: '公众号服务' })
        }
      })
    },
    // 服务信息修改
    wechatServiceEdit: function (options) {
      module.$http(API.wechat.wechatServiceEdit, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatService', data: '公众号服务' })
        }
      })
    },
    // 服务信息删除
    wechatServiceDel: function (options) {
      module.$http(API.wechat.wechatServiceDel, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatService', data: '公众号服务' })
        }
      })
    },
    initFun() {
      FN.wechatServiceQuery({
        serviceId: ''
      }, module.paintService)
    }
  }
  // 初始化
  FN.initFun()
  // 查询
  module.clickTree.queryFun = function () {
    let param = $(this).closest('form').serializeArray(), options = {}
    $(param).each(function (k, v) {
      options[v.name] = v.value
    })
    FN.wechatServiceQuery(options)
  }
  // 新增
  module.clickTree.add = function () {
    module.popup.show({
      title: '新增服务',
      style: 'width: 540px;margin-left:-270px',
      content: $("#popupAddHtmlAdd").html(),
      callback: function () {
        // 只能输入汉字
        $(document).on('keyup', function () {
          module.keyup({
            selector: 'ischinses',
            reg: /[\u4E00-\u9FA5\uF900-\uFA2D]/g
          })
        })
        // 确定新增
        module.clickTree.addFuns = function () {
          let form = $(this).closest('form')
          if (module.checkForm(form)) {
            let options = {}
            options.serviceName = form.find('[name="serviceName"]').val().trim()
            options.serviceNamezh = form.find('[name="serviceNamezh"]').val().trim()
            options.remark = form.find('[name="remark"]').val().trim()
            options.serviceType = form.find('[name="serviceType"]:checked').val().trim()
            options.forbidFlag = form.find('[name="forbidFlag"]:checked').val().trim()
            FN.wechatServiceAdd(options)
          }
        }
      }
    })
  }
  // 修改
  module.clickTree.update = function () {
    let message = $(this).closest('div').data('value')
    module.popup.show({
      title: '修改服务信息',
      style: 'width: 540px;margin-left:-270px',
      content: $("#popupEditHtmlEdit").html(),
      callback: function () {
        // 填充数据
        console.log(message)
        let _this = $(this).find('form')
        _this.find('[name="remark"]').val(message['remark'])
        _this.find('[name="serviceName"]').val(message['serviceName'])
        _this.find('[name="serviceNamezh"]').val(message['serviceNamezh'])
        _this.find('[name="serviceType"][value="' + message['serviceType'] + '"]').trigger('click')
        _this.find('[name="forbidFlag"][value="' + message['forbidFlag'] + '"]').trigger('click')

        // 确定修改
        module.clickTree.updateFuns = function () {
          let form = $(this).closest('form'), options = {}
          if (module.checkForm(form)) {
            options.serviceName = form.find('[name="serviceName"]').val().trim()
            options.serviceNamezh = form.find('[name="serviceNamezh"]').val().trim()
            options.serviceId = message['serviceId']
            options.remark = form.find('[name="remark"]').val().trim()
            options.serviceType = form.find('[name="serviceType"]:checked').val().trim()
            options.forbidFlag = form.find('[name="forbidFlag"]:checked').val().trim()
            FN.wechatServiceEdit(options)
          }
        }
      }
    })
  }
  //删除客户 客户信息一旦关联服务信息就不支持删除
  module.clickTree.del = function () {
    let id = $(this).closest('div').data('id'),
        options = {
          serviceId: id
        }
    module.confirm({
      title: '删除',
      info: '确定删除该服务？',
      status: 0,
      callback: function () {
        FN.wechatServiceDel(options)
      }
    })
  }
})