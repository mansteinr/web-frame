$(function () {
  let columns = [{ // 定义列
    field: 'customerNamezh',
    title: '客户名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<div style="max-height:105px;overflow: auto"><span class="param-item" title="${row.customerName}">${row.customerName}  (${row.customerNamezh}) </span></div>`
    }
  }, {
    field: 'authCode',
    title: '授权码',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'customerContact',
    title: '客户联系人',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'customerMobile',
    title: '客户联系方式',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'bussinessContact',
    title: '商务联系人',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'customerIp',
    title: '客户IP',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'customerPwd',
    title: '客户密码',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
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
      return `<div role="toolbar" aria-label="" data-value='${message}' data-id='${row.customerId}'>
        <span class="link" data-click="del">删除</span>
        <span class="link ml" data-click="update">更新</span>
        </div>`
    }
  }], FN = {
    wechatQuery: function (options, callback) {
      // 查询微信公招所有的客户
      module.$http(API.wechat.wechatQuery, options, function () {
        $('#table1').closest('.chartArea').removeClass('active')
        let data = this.resData
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
        if (callback) {
          callback(data)
        }
        module.popup.hide()
      })
    },
    // 新增微信公众号客户
    wechatAdd: function (options) {
      module.$http(API.wechat.wechatAdd, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatCustomer', data: '公众号客户' })
        }
      })
    },
    // 修改微信公众号客户
    wechatEdit: function (options) {
      module.$http(API.wechat.wechatEdit, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatCustomer', data: '公众号客户' })
        }
      })
    },
    // 删除微信公众号客户
    wechatDel: function (options) {
      module.$http(API.wechat.wechatDel, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resCode) {
          FN.initFun()
          module.popup.hide()
          module.postMessage({ call: 'wechatCustomer', data: '公众号客户' })
        }
      })
    },
    initFun: function () {
      // 查询所有的客户
      FN.wechatQuery({
        customerId: '',
        authCode: ''
      }, module.paintCustomer)
    }
  }
  FN.initFun()
  // 查询
  module.clickTree.queryFun = function () {
    let param = $(this).closest('form').serializeArray(), options = {}
    $(param).each(function (k, v) {
      // 防止出现空参数
      if (v.value.trim()) {
        if (v.name === 'loginName') {
          options.customerId = $('[name="loginName"]').closest('div').find('li[data-value="' + v.value.trim() + '"]').data('customerid')
        } else {
          options[v.name] = v.value
        }
      }
    })
    FN.wechatQuery(options)
  }
  // 新增
  module.clickTree.add = function () {
    module.popup.show({
      title: '新增客户',
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
            let params = form.serializeArray(), options = {}
            $(params).each(function (k, v) {
              if (v.value.trim()) {
                options[v.name] = v.value
              }
            })
            FN.wechatAdd(options)
          }
        }
      }
    })
  }

  // 修改
  module.clickTree.update = function () {
    let message = $(this).closest('div').data('value')
    console.log(message)
    module.popup.show({
      title: '修改客户信息',
      content: $("#popupEditHtmlEdit").html(),
      callback: function () {
        // 填充数据
        $(this).find('input').each(function (k, v) {
          $('input[name="' + v.name + '"]').val(message[v.name])
        })
        $('[name="remark"]').val(message.remark)
        // 确定修改
        module.clickTree.updateFuns = function () {
          let form = $(this).closest('form')
          if (module.checkForm(form)) {
            let params = form.serializeArray(), options = {}
            $(params).each(function (k, v) {
              if (v.name === 'customerName') return
              options[v.name] = v.value
            })
            options.customerId = message.customerId
            FN.wechatEdit(options)
          }
        }
      }
    })
  }
  //删除客户 客户信息一旦关联服务信息就不支持删除
  module.clickTree.del = function () {
    let id = $(this).closest('div').data('id'),
        options = {
          customerId: id
        }
    module.confirm({
      title: '删除',
      info: '确定删除该客户',
      status: 0,
      callback: function () {
        FN.wechatDel(options)
      }
    })
  }
})