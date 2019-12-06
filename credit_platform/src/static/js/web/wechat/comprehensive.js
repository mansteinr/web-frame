$(function(){
  let columns = [{
    field: 'authCode',
    title: '授权码',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'customerNamezh',
    title: '客户',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceNamezh',
    title: '服务',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'authTotal',
    title: '授权次数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'authUsed',
    title: '已使用次数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'totalUsed',
    title: '总调用次数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'needCharge',
    title: '是否计费',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value) {
      return `<span class='${value === '0' ? "isColor" : "noColor"}'>${ value === '0' ? '不计费' : '计费'}</span>`
    }
  }, {
    field: 'forbidFlag',
    title: '是否禁用',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value) {
      return `<span class='${value === '0' ? "isColor" : "noColor"}'>${ value === '0' ? '不禁用' : '禁用'}</span>`
    }
  }, {
    field: 'createTime',
    title: '创建时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value, row, index) {
      return module.formaterTime(value, 'yyyy-mm-dd hh:ii:ss')
    }
  }, {
    field: 'updateTime',
    title: '更新时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value, row, index) {
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
      return `<div role="toolbar" aria-label="" data-value= '${message}'  data-id='${row.customerServiceId}'>
        <span class="link" data-click="editAuthor">授权</span>
        <span class="link ml" data-click="update">更新</span>
        </div>`
    }
  }], customerArr = [],serviceArr = [], instanceObj = {}, FN = {
    wechatQuery: function(options) {
      // 查询微信公招所有的客户
      module.$http(API.wechat.wechatQuery, options, function () {
        module.paintCustomer(this.resData) 
        customerArr = []
        customerArr = this.resData
      })
    },
    wechatServiceQuery: function(options) {
      // 查询服务信息
      module.$http(API.wechat.wechatServiceQuery, options, function () {
        module.paintService(this.resData, FN.wechatAssociationQuery)
        serviceArr = []
        serviceArr = this.resData
        
      })
    },
    mergeTable() {
      module.mergeTable('authCode', "#table1")
    },
    wechatAssociationQuery: function(options) {
      // 查询微信公招所有的客户
      module.$http(API.wechat.wechatAssociationQuery, options, function () {
        $('#table1').closest('.chartArea').removeClass('active')
        instanceObj = {}
        let data = this.resData
        if (data.length) {
          data.sort((a, b) => {
            return -(a.authCode.charCodeAt(a[0]) - b.authCode.charCodeAt(a[0]))
          })
        }
        if (data.length) {
          data.forEach(v => {
            if (instanceObj[v.customerId]) {
              instanceObj[v.customerId].push(v.serviceId)
            } else {
              instanceObj[v.customerId] = [v.serviceId]
            }
          })
        }
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns,
          pageNumber: 1,
          onPageChange: FN.mergeTable,
          onSort: FN.mergeTable
        })
        module.mergeTable('authCode', "#table1") /** 合并单元格 */
      })
    },
    // 新增微信公众号客户
    wechatAssociationAdd: function(options) {
      module.$http(API.wechat.wechatAssociationAdd, options, function () {
        module.alert(this.resMsg[0].msgText)
        if (this.resData) {
          module.popup.hide()
          $('[data-click="queryFun"]').trigger('click')
        }
      })
    },
    // 修改微信公众号客户
    wechatAssociationEdit: function(options) {
      module.$http(API.wechat.wechatAssociationEdit, options, function () {
        module.alert(this.resMsg[0].msgText) 
        if (this.resData) {
          module.popup.hide()
          $('[data-click="queryFun"]').trigger('click')
        }
      })
    },
    initFun () {
      FN.wechatQuery({})
      FN.wechatServiceQuery({})
      FN.wechatAssociationQuery({})
    },
    paintCustomerFun (selector) {
      let lis = '<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li>'
      if (customerArr.length) {
        customerArr.forEach((v, k) => {
          lis += '<li class="dropdown-item  text-warp"  title ="' + v.customerNamezh + '" data-value = "' + v.customerId + '" >' + v.customerNamezh + " (" + v.customerName + ")"+ '</li>'
        })
      } else {
        lis = '<li class="dropdown-item  text-warp" data-value = "" >暂无数据</li>'
      }
      selector.closest('.select-dropdown').find('.dropdown-menu').html(lis)
      $(document).trigger(EVENT.INIT.DOTREE,selector.closest('.form-item'))
      selector.closest('.select-dropdown').find('ul li.text-warp').eq(0).trigger('click')
    },
    paintServiceFun (selector) {
      let lis = '<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li>'
      if (serviceArr.length) {
        serviceArr.forEach((v, k) => {
          lis += '<li class="dropdown-item  text-warp"  title ="' + v.serviceNamezh + '" data-value = "' + v.serviceId + '" >' + v.serviceNamezh + " (" + v.serviceName + ")"+ '</li>'
        })
      } else {
        lis = '<li class="dropdown-item  text-warp" data-value = "" >暂无数据</li>'
      }
      selector.closest('.select-dropdown').find('.dropdown-menu').html(lis)
      $(document).trigger(EVENT.INIT.DOTREE, selector.closest('.form-item'))
      selector.closest('.select-dropdown').find('ul li.text-warp').eq(0).trigger('click')
    }
  }
// 查询
  module.clickTree.queryFun = function () {
    let param = $(this).closest('form').serializeArray(), options = {}
    $(param).each(function (k, v) {
      // 防止出现空参数
      if (v.name === 'loginName') {
        options.customerId = $('[name="loginName"]').closest('div').find('li[data-value="'+ v.value.trim() +'"]').data('customerid')
      } else {
        options[v.name] = v.value
      }
    })
    FN.wechatAssociationQuery(options)
  }
  // 新增
  module.clickTree.add = function () {
    module.popup.show({
      title: '新增实例',
      content: $("#popupAddHtmlAdd").html(),
      callback: function() {
        FN.paintCustomerFun($(this).find('[name="customerId"]'))
        FN.paintServiceFun($(this).find('[name="serviceId"]'))
      }
    })
  }
  // 确定新增
  module.clickTree.addFuns = function () {
    let form =  $(this).closest('form')
    if(module.checkForm(form)) {
      let params = form.serializeArray(), options = {}
      $(params).each(function(k, v) {
        if (v.value.trim()) {
          if (v.name === 'needCharge' || v.name === 'forbidFlag') {
            options[v.name] = form.find('input[name="'+ v.name +'"]:checked').val()
          } else {
            options[v.name] = v.value
          }
        }
      })
      if (options.authTotal < 0) {
        module.alert('授权次数应该大于0')
        return
      }
      if (instanceObj[options.customerId] && instanceObj[options.customerId].includes(options.serviceId)) {
        module.popup.hide()
        module.alert('该服务和客户已经绑定啦')
        return
      }
      FN.wechatAssociationAdd(options)
    }
  }
  // 修改
  module.clickTree.update = function () {
    let message = $(this).closest('div').data('value')
    module.popup.show({
      title: '修改实例信息',
      content: $("#popupEditHtmlEdit").html(),
      callback: function() {
        FN.paintCustomerFun($(this).find('[name="customerId"]'))
        FN.paintServiceFun($(this).find('[name="serviceId"]'))
        // 填充数据
        $(this).find('input').each(function(k, v) {
          if (v.name === 'needCharge' || v.name === 'forbidFlag') {
            $('[name="'+ v.name +'"][value="'+ message[v.name] +'"]').trigger('click')
          } else {
            $(v).val(message[v.name])
          }
        })
        $('[name="remark"]').val(message.remark)
        // 确定修改
        module.clickTree.updateFuns= function () {
          let form =  $(this).closest('form'), options = {}
          if(module.checkForm(form)) {
            options.customerServiceId = message.customerServiceId
            options.remark = form.find('[name="remark"]').val().trim()
            options.needCharge = form.find('[name="needCharge"]:checked').val()
            options.forbidFlag = form.find('[name="forbidFlag"]:checked').val()
            FN.wechatAssociationEdit(options)
          }
        }
      }
    })
  }
  module.clickTree.editAuthor = function () {
    let message = $(this).closest('div').data('value')
    module.popup.show({
      title: '授权次数',
      style: 'width:540px;',
      content: $("#popupEditAuth").html(),
      callback: function () {
        $(document).trigger(EVENT.INIT.DOTREE, $(this))
        $(this).find('[name="authTotal"]').val(message['authTotal'])
        let _this = $(this)
     
        module.clickTree.updateAuth = function () {     
          let options = {}
          options.customerServiceId = message.customerServiceId
          options.authType = _this.find('[name="authType"]').val()
          options.authValue = _this.find('[name="authValue"]').val().trim() / 1
          if (!options.authValue || options.authValue < 0) {
            module.alert('变化量不能为空，且要大于0') 
            return
          }
          module.$http(API.wechat.alterAuthTotal, options, function () {
            if (this.resData) {
              module.popup.hide()
              $('[data-click="queryFun"]').trigger('click')
            }
            module.alert(this.resMsg[0].msgText) 
          })
        }

      }
    })
  }
  FN.initFun()
  module.messageCallBack.wechatCustomer = function () {
    self.location.reload()
  }
  module.messageCallBack.wechatService = function () {
    self.location.reload()
  }
})
