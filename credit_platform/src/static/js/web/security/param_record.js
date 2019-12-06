$(function () {
  let columns = [{
    field: 'loginName',
    title: '客户名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'regularName',
    title: '规则名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceName',
    title: '服务名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'expireTime',
    title: '时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class="param-item">拦截时间: ${row.insertTime}</span><span class="param-item">恢复时间: ${row.expireTime}</span>`
    }
  }, {
    field: 'guid',
    title: 'guid',
    formatter: function (value, row, index) {
      return "<a href='javascript:void(0)' onclick='module.queryByGuid(this.textContent)'>" + value + "</a>"
    }
  }, {
    field: 'param',
    title: '参数',
    formatter: function (value, row, index) {
      let html = '';
      for (let key in value) {
        let label = key
        switch (key) {
          case 'accountNo':
            label = '银行卡号'
            break;
          case 'idCard':
            label = '身份证号'
            break;
          case 'mobile':
            label = '手机号码'
            break;
          case 'name':
            label = '姓名'
            break;
          case 'plateNumber':
            label = '车牌号'
            break;
          case 'plateType':
            label = '号牌种类'
            break;
          default:
            break;
        }
        if (key == 'accountNo' || key == 'idCard' || key == 'mobile' || key == 'name' || key == 'plateNumber' || key == 'plateType') {
          html += '<span class="param-item" title="' + label + ': ' + value[key] + '">' + label + ': ' + value[key] + '</span>'
        }
      }
      return html
    }
  }, {
    field: 'callPeriod',
    title: '设置参数',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<span class="param-item">计数周期（s）: ${row.callPeriod}</span><span class="param-item">锁定时长（s）: ${row.lockTime}</span><span class="param-item">最大调用次数 ：${row.maxCount}</span>`
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
    field: 'combine',
    title: '组合服务',
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
      let flag = +new Date(row.expireTime) < +new Date() ? true : false
      return '<div  role="toolbar" class="' + (flag ? "no-link" : "link") + '" data-id ="' + (row.paramRecordId) + '" data-inserttime ="' + (row.insertTime) + '">' +
        '<span   data-click ="' + (flag ? "no-link" : "recoveryFun") + '">' + (flag ? "已恢复" : "恢复") + '</span>' +
        '</div>'
    }
  }],
    FN = {
      // 获取所有的拦截记录
      paramRecord(options) {
        module.renderTable({
          id: '#table1',
          columns,
          sidePagination: 'server'
        }, {
          url: API.safePlat.paramRecord,
          ajaxOptions: {
            headers: { "mtk": module.localData.getData('usermtk') || API.loaclMtk },
          },
          method: 'post',
          responseHandler: function (res) {
            module.hasDataFunction("#table1")
            return {
              total: res.resData.total,
              rows: res.resData.result
            }
          },
          queryParamsType: 'limit',
          queryParams: function (params) {
            return Object.assign({
              limitNum: params.limit,
              skipNum: (params.pageNumber - 1) * params.limit
            }, options)
          },
        })
      },
      getParams(op) {
        let divs = `<div class="search-item radio-group">
          <label  style="white-space: nowrap;overflow: hidden;" class="input-label">是否密文：</label>
          <div class="radio-item"><input type="radio" class="iconfont" value=false checked="checked" name="enParam">否</div>
          <div class="radio-item"><input type="radio" class="iconfont" value=true name="enParam">是</div>
        </div>`
        if (op.flag) {
          module.$http(API.safePlat.subService, { serviceId: op.id }, function () {
            if (module.empty(this.resData)) { // 组合服务
              let len = this.resData.length, obj = {}
              this.resData.forEach((v, k) => {
                let opt = {
                  serviceNameZh: v.serviceNameZh,
                  serviceName: v.serviceName,
                  serviceId: v.serviceId,
                }
                if (!opt.serviceName) {
                  $('.query-hide').html(divs)
                  return
                }
                module.$http(API.operatorPlat.queryParamsByServiceName, opt, function () { // 组合服务只需要获取数据 非组合服务需要渲染
                  if (!this.resData.paramNameBeans || !this.resData.paramNameBeans.length) return
                  this.resData.paramNameBeans.forEach((v1, k1) => {
                    if (!obj[v1.paramName]) { //如果能查找到，证明数组元素重复了
                      obj[v1.paramName] = 1
                      divs += `<div class="search-item">
                          <label style="white-space: nowrap;overflow: hidden;" title="${v1.paramNameCh}" class="input-label">${v1.paramNameCh}：</label>
                          <input type="text" name="${v1.paramName}" class="m-input form-input" placeholder="请输入${v1.paramNameCh}">
                        </div>`
                    }
                  })
                  if (k === len - 1) {
                    // 渲染查询参数
                    $('.query-hide').html(divs)
                  }
                })
              })
            }
          })
        } else {
          // 非组合服务
          let liActive = $('[name="serviceName1"]').closest('.search-item').find('li.active'),
            op = {}
          op.serviceName = liActive.data('value') ? liActive.data('value').trim() : ''
          op.serviceNameCh = liActive.text()
          op.serviceId = liActive.data('serviceid')
          if (!op.serviceName) {
            return
          }
          module.$http(API.operatorPlat.queryParamsByServiceName, op, function () {
            if (module.empty(this.resData.paramNameBeans)) {
              this.resData.paramNameBeans.forEach((v, k) => {
                divs += `<div class="search-item">
                          <label style="white-space: nowrap;overflow: hidden;" title="${v.paramNameCh}" class="input-label">${v.paramNameCh}：</label>
                          <input type="text" name="${v.paramName}" class="m-input form-input" placeholder="请输入${v.paramNameCh}">
                        </div>`
              })
            } else if (this.resMsg.length) {
              if (this.resMsg[0].msgCode === '-0003') { // 若该服务无参数 提示可客户
                module.alert(`该服务参数${this.resMsg[0].msgText}`)
              } else {
                module.alert(this.resMsg[0].msgText)
              }
            } else {
              module.alert('该服务参数无查询结果')
            }
            // 渲染查询参数
            $('.query-hide').html(divs)
          })
        }
      },
      getCustomers() {
        module.getCustomers().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis + res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
          FN.allService()
        })
      },
      allService() {
        module.allService().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
        })
      },
      initFun() {
        laydate.render({
          elem: '#beginTime',
          type: 'datetime',
          max: 'today',
          min: '2017-03-15',
          value: module.formaterTime(+new Date() - 60 * 60 * 1000, 'yyyy-mm-dd hh:ii:ss')
        })
        laydate.render({
          elem: '#endTime',
          type: 'datetime',
          max: 'today',
          min: '2017-03-15',
          value: module.formaterTime(+new Date(), 'yyyy-mm-dd hh:ii:ss')
        })
        FN.getCustomers() // 获取客户名称
      }
    }
  FN.initFun()
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.allService()
  })
  $('[name="serviceName"]').off('change').on('change', function () {
    let flag = $(this).closest('.select-dropdown').find('li.active').data('combine')
    let op = {
      flag,
      id: $(this).closest('.select-dropdown').find('li.active').data('id')
    }
    if (toggleFlag) {
      return
    }
    FN.getParams(op)
  })
  // 查询
  module.clickTree.queryFun = function () {
    let options = {}
    $('.show-query').find('input').each(function (k, v) { // 这是固定参数
      if (v.name && v.value) {
        if (v.name === 'serviceName') {
          options.serviceName = v.value.trim()
          options.combine = $(v).closest('div').find('li.active').data('combine')
        } else {
          options[v.name] = v.value.trim()
        }
      }
    })
    let param = {}
    if (!toggleFlag) { // 参数
      $('.query-hide').find('input').each(function (k, v) {
        if (v.name === 'enParam') {
          options.enParam = $('[name="enParam"]:checked').val()
        } else {
          if (v.name && v.value) {
            param[v.name] = v.value.trim()
          }
        }
      })
    }
    options.param = param // 没有的话 也要传个空
    if (!options.beginTime || !options.endTime) {
      module.alert('时间参数不对')
      return
    }
    if (options.beginTime.split('-')[1] !== options.endTime.split('-')[1]) {
      module.alert('不能跨月查询')
      return
    }
    if ($('[name="mobile"]').hasClass('input-error')) {
      $('[name="mobile"]').removeClass('input-error')
    }
    if (options.param.mobile) {
      if (!module.checkTel(options.param.mobile)) {
        $('[name="mobile"]').addClass('input-error');
        module.alert('输入的手机号码不正确');
        return
      }
    }
    FN.paramRecord(options)
  }
  let toggleFlag = true,
    thisText = ''
  module.clickTree.hideshow = function () {
    // 切换额外查询条件
    $(".query-hide").stop(true, true).slideToggle()
    toggleFlag ? thisText = '隐藏' : thisText = '更多'
    toggleFlag = !toggleFlag
    $(this).text(thisText)
    // 第一次手动触犯查询条件
    $('[name="serviceName"]').trigger('change')
  }
  module.clickTree.recoveryFun = function () {
    let options = {}
    options.paramRecordId = $(this).closest('div').data('id')
    options.insertTime = module.formaterTime($(this).closest('div').data('inserttime'), 'yyyymmdd hh:ii:ss')
    module.$http(API.safePlat.recoverUseful, options, function () {
      module.alert(this.resMsg[0].msgText)
      $('[data-click="queryFun"]').trigger('click')
    })
  }
})
