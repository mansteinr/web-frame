$(function () {
  let columns = [{
    field: 'regular.regularName',
    title: '规则名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'service.serviceNameZh',
    title: '服务名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return row.service.combine ? '<span class="link" data-value="' + row.service.serviceId + '" data-click="lookSubService">' + value + '</span>' : value
    }
  }, {
    field: 'params',
    title: '服务参数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      let paramsString = ''
      if (value && value.length) {
        paramsString = '<div style="max-height:105px;overflow: auto">'
        value.forEach((v, k) => {
          paramsString += `<span class="param-item" title="${v}">${v} </span>`
        })
        paramsString += '</div>'
      }
      return paramsString
    }
  }, {
    field: 'callPeriod',
    title: '设置参数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class="param-item">计数周期（s）: ${row.callPeriod}</span><span class="param-item">锁定时长（s）: ${row.lockTime}</span><span class="param-item">最大调用次数 : ${row.maxCount}</span>`
    }
  }, {
    field: 'use',
    title: '使用实例',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class='${value ? "isColor" : "noColor"}'>${value ? '是' : '否'}</span>`
    }
  }, {
    field: 'alarm',
    title: '告警',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class='${value ? "isColor" : "noColor"}'>${value ? '是' : '否'}</span>`
    }
  }, {
    field: 'useLoginName',
    title: '区分用户',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class='${value ? "isColor" : "noColor"}'>${value ? '是' : '否'}</span>`
    }
  }, {
    field: 'useService',
    title: '区分服务',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class='${value ? "isColor" : "noColor"}'>${value ? '是' : '否'}</span>`
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
      return `<div role="toolbar" aria-label="" data-value= '${message}'  data-id='${row.wordId}'>
        <span class="link" data-click="delFun">删除</span>
        <span class="link ml" data-value="updateRegIns" data-click="updateFun">更新</span>
        </div>`
    }
  }],
    allServiceArr = [],
    allRegularArr = [],
    Func = '',
    FN = {
      // 获取所有的规则实例
      allRegIns() {
        module.$http(API.safePlat.allRegIns, {}, function () {
          module.hasDataFunction("#table1")
          let data = this.resData
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        })
      },
      allRegulars() {
        module.$http(API.safePlat.allRegulars, {}, function () {
          if (module.empty(this.resData)) {
            allRegularArr = this.resData
          }
        })
      },
      // 获取所有的服务
      allService: function () {
        module.$http(API.safePlat.allService, {}, function () {
          if (module.empty(this.resData)) {
            allServiceArr = this.resData
          }
        })
      },
      // 新增-更新
      insertRegIns(that) {
        let form = that.closest('form'),
          options = {},
          flag = false,
          params = form.serializeArray()
        options.regInsId = form.data('reginsid')
        params.forEach(v => {
          if (v.value.trim()) {
            if (v.name === 'params') {
              options.params = v.value.trim().split(',')
            } else if (v.name === 'serviceId') {
              options[v.name] = $('[name="serviceId"]').closest('.select-dropdown').find('li.active').data('id')
            } else if (v.name === 'regularId') {
              options[v.name] = $('[name="regularId"]').closest('.select-dropdown').find('li.active').data('id')
            } else {
              options[v.name] = v.value.trim()
            }
          } else {
            // 当参数为空时 提示客户
            let text = form.find('[name="' + v.name + '"]').closest('.form-item').find('label').data('value')
            module.alert(`${text}不能为空`)
            flag = true
          }
        })
        let keys = { // 下面三个参数参数不能小于0
          callPeriod: 'callPeriod',
          lockTime: 'lockTime',
          maxCount: 'maxCount'
        }
        $.each(keys, function (k, v) {
          if (options[v] / 1 < 0) {
            module.alert(form.find('[name="' + k + '"]').closest('div').find('label').data('value') + '不能小于0') // 提示客户小于0
            flag = true
          }
        })
        if (flag) return
        module.$http(API.safePlat[Func], options, function () {
          if (this.resCode) {
            FN.allRegIns()
            form.find('[data-click="hidepopup"]').trigger('click')
          }
          module.alert(this.resMsg[0].msgText)
        })
      },
      getParams(serviceId, that, paramStr) { // 获取参数
        module.$http(API.safePlat.subService, { serviceId: serviceId }, function () {
          // 查询组合服务下面的服务 接口为subService，subservice是获取所有的子服务注意两者区别
          if (module.empty(this.resData)) {
            let parms = '', isFirst = true, intersect = [], len = this.resData.length
            this.resData.forEach((v, k) => {
              let op = {
                serviceNameZh: v.serviceNameZh,
                serviceName: v.serviceName,
                serviceId: v.serviceId
              }
              // 组合服务参数 是先查询所有的子服务，在查询子服务的参数，在取这些参数并集 在去重
              module.$http(API.operatorPlat.queryParamsByServiceName, op, function () { // 组合服务只需要获取数据 非组合服务需要渲染
                if (!this.resData.paramNameBeans || !this.resData.paramNameBeans.length) {
                  // module.alert(v.serviceNameZh + '没有公共参数，请重新配置服务')
                  return
                }
                // 若为空 直接返回
                let subServiceArr = []
                this.resData.paramNameBeans.forEach((v1, k1) => {
                  if (isFirst) { // 判断是否是第一次 若是第一次
                    v1[v1.paramName] = v1.paramNameCh
                    intersect.push(v1.paramName)
                  } else {
                    subServiceArr.push(v1.paramName)
                    v1[v1.paramName] = v1.paramNameCh
                  }
                })
                if (!isFirst) { // 判断是否是第一次 不需要操作，反之需要找出参数的交集
                  intersect = new Set([...subServiceArr].filter(x => new Set(intersect).has(x)))
                }
                isFirst = false // 第一次之后将 标识符置为false
                if (k === len - 1) { // 判断是否是最后一个请求 因为请求是异步 所以利用该方法
                  let lastArr = []
                  lastArr = [...intersect] // 将Set对象解构为数组
                  if (!lastArr.length) { // 判断数组是否为空 为空提示客户重新配置服务
                    module.alert('改组合服务没有公共参数，请重新配置服务')
                    return
                  }
                  lastArr.forEach((v2, k2) => {
                    this.resData.paramNameBeans.forEach((v3, k3) => {
                      if (v3[v2]) {
                        parms += '<li class="dropdown-item text-warp"  title="' + v3.paramName + ' (' + v3.paramName + ')' + '" data-value = "' + v3.paramName + '" >' + v3.paramNameCh + '</li>'
                      }
                    })
                  })
                  that.find('.multiple').html(parms) // 渲染参数
                  if (paramStr) {
                    that.find('[name="params"]').val(paramStr) // 这是修改 组合服务第一次渲染参数
                  }
                  $(document).trigger(EVENT.INIT.DOTREE, that.find('.multiple').closest('.form-item'))
                }
              })
            })
          }
        })
      },
      initFun() {
        FN.allRegIns()
        FN.allService()
        FN.allRegulars()
      },
      template(that) {
        let form = $(that), lis = ''
        if (module.empty(allRegularArr)) {
          allRegularArr.forEach(function (v, k) {
            lis += '<li class="dropdown-item  text-warp"  data-id="' + v.regularId + '" title="' + v.regularName + '"  data-value = "' + v.regularName + '" >' + v.regularName + '</li>';
          });
        } else {
          lis = '<li class="dropdown-item  text-warp" data-value = "">暂无数据</li>'
        }
        form.find('.regularId').html(lis);
        let divs = ''
        if (module.empty(allServiceArr)) {
          allServiceArr.forEach(function (v, k) {
            divs += '<li class="dropdown-item  text-warp" data-combine="' + v.combine + '"  data-id="' + v.serviceId + '" title="' + v.serviceNameZh + '"  data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
          });
        } else {
          divs = '<li class="dropdown-item  text-warp" data-value = "">暂无数据</li>'
        }
        form.find('.serviceId').html(divs);
        $(document).trigger(EVENT.INIT.DOTREE, that)
      },
      renderService(selector, that, flag, paramStr) {
        let liActive = selector.closest('form').find('.serviceId .active')
        if (flag) { // 若不是第一次加载参数名 则置为空
          paramStr = ''
        }
        that.find('[name="params"]').val('') // 情况上次的显示
        if (liActive.data('combine')) { // 组合服务
          FN.getParams(liActive.data('id'), that, paramStr)
          that.find('[name="useService"]').removeAttr('disabled')
          that.find('[name="useService"]').closest('.radio-group').removeClass('gray-radio')
        } else {
          module.queryParamsByServiceName($(that)).then(res => {
            $(that).find('.multiple').html(res)
            if (paramStr) { // 安全中心 查询参数
              $(that).find('[name="params"]').val(paramStr)
            }
            $(that).trigger(EVENT.INIT.DOTREE, $(that).find('.multiple').closest('.form-item'))
          })
          that.find('[name="useService"][value="false"]').trigger('click')
          that.find('[name="useService"]').attr('disabled', 'disabled')
          that.find('[name="useService"]').closest('.radio-group').addClass('gray-radio')
        }
      }
    }
  // 新增
  module.clickTree.add = function () {
    Func = $(this).data('value')
    module.popup.show({
      title: '新增实例',
      content: $("#popupAddHtml").html(),
      callback: function () {
        FN.template(this)
        let that = $(this).find('form')
        /*初始化*/
        $(this).find('[name="serviceId"]').on('change', function () {
          FN.renderService($(this), that)
        })
        $(this).find('[name="serviceId"]').trigger('change')
      }
    });
  }
  // 确定新增
  module.clickTree.addFuns = function () {
    FN.insertRegIns($(this))
  }
  // 删除实例
  module.clickTree.delFun = function () {
    let regInsId = $(this).closest('div').data('value').regInsId
    module.confirm({
      title: '删除',
      info: '确定删除该实例',
      status: 0,
      callback: function () {
        let that = this
        module.$http(API.safePlat.deleteRegIns, { regInsId: regInsId }, function () {
          if (this.resCode) {
            FN.allRegIns()
            $(that).find('[data-click="hidepopup"]').trigger('click') // 只有成功之后 关闭弹框
          }
          module.alert(this.resMsg[0].msgText) // 提示客户
        })
      }
    });
  }
  // 更新实例
  module.clickTree.updateFun = function () {
    let message = $(this).closest('div').data('value')
    Func = $(this).data('value')
    let flag = false // 判断是否是点击弹出弹窗后 第一次加载参数
    module.popup.show({
      title: '更新实例',
      content: $("#popupAddHtml").html(),
      callback: function () {
        $(this).find('form').data('reginsid', message.regInsId) // 将实例id存储在表单中
        let that = $(this), paramStr = ''
        FN.template(this)
        let keys = { // 定义key 因为message中的key 有些不一样
          alarm: 'alarm',
          service: 'service',
          callPeriod: 'callPeriod',
          lockTime: 'lockTime',
          maxCount: 'maxCount',
          params: 'params',
          regular: 'regular',
          use: 'use',
          useLoginName: 'useLoginName',
          useService: 'useService'
        }
        $.each(keys, function (k, v) { // 展示参数
          if (k === 'params') {
            paramStr = message[k].join(',') // 因为服务名联动参数 所以只有先渲染服务吗 在渲染参数
          } else if (k === 'regular') { // 规则和服务返回的是对象 故需要特殊处理
            that.find('[name="regularId"]').val(message[k].regularName)
          } else if (k === 'service') {
            that.find('[name="serviceId"]').val(message[k].serviceName)
          } else if (k === 'callPeriod' || k === 'maxCount' || k === 'lockTime') {
            that.find('[name="' + k + '"]').val(message[k]) //  callPeriod  lockTime maxCount可直接渲染
          } else { // 单选框渲染参数
            that.find('[name="' + k + '"][value="' + message[k] + '"]').attr("checked", true)
          }
        })
        $(this).find('form').trigger(EVENT.INIT.DOTREE, this)
        $(this).find('[name="serviceId"]').on('change', function () {
          FN.renderService($(this), that, flag, paramStr)
          flag = true
        })
        $(this).find('[name="serviceId"]').trigger('change')
      }
    })
  }

  /** 函数初始化 */
  FN.initFun()

  // 预览子服务
  module.clickTree.lookSubService = function () {
    let serviceId = $(this).data('value')
    module.lookSubService(serviceId)
  }
  module.messageCallBack.getInfo = function () {
    self.location.reload()
  }
})