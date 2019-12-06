$(function () {
  let allServices = [],
    FN = {
      // 获取所有的子服务
      directService (selector, arr) {
        module.$http(API.safePlat.directService, {}, function () {
          let divs = ''
          if (module.empty(this.resData)) {
            this.resData.forEach(v => {
              divs += '<li class="dropdown-item text-warp" data-id="' + v.serviceId + '" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
            })
          } else {
            divs = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          selector.find('[name="subService"]').closest('.select-dropdown').find('.dropdown-menu').html(divs)
          if (module.empty(arr)) {
            let serviceStr = ''
            arr.forEach(v => {
              serviceStr += v.serviceName + ','
            })
            selector.find('[name="subService"]').val(serviceStr.substr(0, serviceStr.length - 1)) // 选中默认的
          }
          $(document).trigger(EVENT.INIT.DOTREE, selector)
        })
      },
      // 删除 更新 插入这里总共6个接口
      deleteUpdateInsert (op, url, that) {
        module.$http(API.safePlat[url], op, function () {
          if (this.resCode) { // 返回码为1的时候才会刷新
            module.allService()
            module.allRegulars()
            that.find('[data-click="hidepopup"]').trigger('click')
            module.postMessage({ call: 'getInfo', data: '新增服务成功' })
          }
          module.alert(this.resMsg[0].msgText)
        })
      },
      // 获取所有的接口名称
      allInterface: function () {
        module.$http(API.commomApi.services, {}, function () {
          allServices = this.resData
        });
      },
      initFun: function () {
        module.allService()
        module.allRegulars()
        FN.allInterface()
      }
    }
  // 新增
  module.clickTree.add = function (e) {
    let message = $('.button-group.tabs').find('.active').text()
    module.popup.show({
      title: '新增' + message,
      style: 'margin-top:-250px !important;',
      content: $("#popupAddHtml").html(),
      callback: function () {
        let form = $(this).find('form')
        if (message === '服务') {
          form.find('.regular-item').hide()
          form.find('.service-item').show()
          // 调取所有的服务名称
          let lis = '', selector = $('[name="serviceName"]');
          if (module.empty(allServices)) {
            allServices.forEach(function (v, k) {
              lis += '<li class="dropdown-item text-warp" data-id = "' + v.serviceId + '" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
            })
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          selector.closest('.select-dropdown').find('.dropdown-menu').html(lis)
          /*初始化*/
          $(document).trigger(EVENT.INIT.DOTREE, this)
          // 手动触发一次 获取子服务
          form.find('[name="combine"]').on('change', function () {
            let showFlag = $(this).val()
            if (showFlag === 'true') {
              form.find('.noCombine').hide()
              form.find('.isCombine').show()
            } else {
              form.find('.noCombine').show()
              form.find('.isCombine').hide()
            }
          })
          form.find('[name="combine"]').trigger('change')
          FN.directService(form)
        } else {
          form.find('.service-item').hide()
          form.find('.regular-item').show()
        }
      }
    })
  }
  // 确定新增
  module.clickTree.addFuns = function () {
    let message = $('.button-group.tabs').find('.active').data('value'),
      form = $(this).closest('form'), options = {},
      that = $(this).closest('form'),
      flag = false // 判断参数是否为空
    if (message === 'insertService') { // 服务
      if (form.find('[name="combine"]:checked').val() === "true") { // 组合服务
        let idArr = []
        options.combine = true
        options.serviceName = form.find('.isCombine [name="serviceName"]').val().trim()
        options.serviceNameZh = form.find('.isCombine [name="serviceNameZh"]').val().trim()
        form.find('.isCombine li.active').each((k, v) => {
          idArr.push($(v).data('id'))
        })
        options.subService = idArr
      } else { // 非组合服务新增
        options.combine = false
        options.serviceName = form.find('.noCombine [name="serviceName"]').val().trim()
        options.serviceNameZh = form.find('.noCombine li.active').text().trim()
        options.serviceId = form.find('.noCombine li.active').data('id')
      }
      $.each(options, function (k, v) {
        if (!(v + '')) { // 后台要bool值 true和false 加个''转为字符串
          flag = true // 判断参数是佛为空
        }
      })
    } else { // 新增规则
      let keyRegular = {
        regularName: 'regularName',
        alarmCode: 'alarmCode',
        alarmMsg: 'alarmMsg'
      }
      $.each(keyRegular, function (k, v) { // 循环获取参数值
        if (form.find('[name="' + v + '"]').val().trim()) {
          options[k] = form.find('[name="' + v + '"]').val().trim()
        } else {
          flag = true
          form.find('[name="' + v + '"]').addClass('input-error')
          return
        }
      })
    }
    if (flag) {
      module.alert('缺少参数') // 提示客户参数不齐
      return
    }
    // 调用增加函数
    if (options.serviceId) { // 若果新增 非组合服务 先检验 该服务是否有参数 有参数可以添加  反之不可以添加
      let queryOp = {
        serviceName: options.serviceName,
        serviceNameCh: options.serviceNameZh,
        serviceId: options.serviceId
      }
      module.$http(API.operatorPlat.queryParamsByServiceName, queryOp, function () {
        if (module.empty(this.resData.paramNameBeans)) {
          FN.deleteUpdateInsert(options, message, that)
        } else {
          module.alert(options.serviceNameZh + '没有参数，请先添加参数')
        }
      })
    } else {
      FN.deleteUpdateInsert(options, message, that)
    }
  }
  // 删除
  module.clickTree.delFun = function () {
    let text = $('.button-group.tabs').find('.active').text(),
      message = $(this).closest('div').data('value'),
      param = $(this).data('param'),
      Func = $(this).data('value'),
      options = {
        [param]: message[param]
      }
    module.confirm({
      title: '删除',
      info: '确定删除该' + text,
      status: 0,
      callback: function () {
        let that = $(this)
        FN.deleteUpdateInsert(options, Func, that)
      }
    })
  }

  // 更新
  module.clickTree.updateFun = function () {
    let message = $('.button-group.tabs').find('.active').text()
    let row = $(this).closest('div').data('value')
    module.popup.show({
      title: '更新' + message,
      style: 'margin-top:-250px !important;',
      content: $("#popupUpdateHtml").html(),
      callback: function () {
        let form = $(this).find('form')
        form.attr('data-regularid', row.regularId)
        form.attr('data-serviceid', row.serviceId)
        if (message === '服务') { // 更新服务
          form.find('.regular-item').hide()
          form.find('.service-item').show()
          // 调取所有的服务名称
          let lis = '',
            selector = $('[name="serviceName"]');
          if (module.empty(allServices)) {
            allServices.forEach(function (v, k) {
              lis += '<li class="dropdown-item text-warp" data-id = "' + v.serviceId + '" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          selector.closest('.select-dropdown').find('.dropdown-menu').html(lis)
          /*初始化*/
          $(document).trigger(EVENT.INIT.DOTREE, this)
          form.find('[name="combine"]').trigger('change')
          module.$http(API.safePlat.subService, { serviceId: form.data('serviceid') }, function () {
            FN.directService(form, this.resData) // 获取子服务
          })
        } else {
          form.find('.service-item').hide()
          form.find('.regular-item').show()
        }
        for (let k in row) {
          if (k === 'combine') {
            $('[name="combine"][value="' + row[k] + '"]').trigger('click')
          } else {
            $('[name="' + k + '"]').val(row[k])
          }
        }
      }
    })
  }

  // 确定 更新
  module.clickTree.updateFuns = function () {
    let text = $('.button-group.tabs').find('.active').text(), message = ''
    if (text === '服务') {
      message = 'updateService'
    } else {
      message = 'updateRegular'
    }
    form = $(this).closest('form'), options = {},
      flag = false // 判断参数是否为空
    if (message === 'updateService') { // 服务
      options.serviceId = form.data('serviceid')
      if (form.find('[name="combine"]:checked').val() === "true") { // 组合服务修改 非组合服务不能修改
        let idArr = []
        options.combine = true
        options.serviceName = form.find('.isCombine [name="serviceName"]').val().trim()
        options.serviceNameZh = form.find('.isCombine [name="serviceNameZh"]').val().trim()
        form.find('.isCombine li.active').each((k, v) => {
          idArr.push($(v).data('id'))
        })
        options.subService = idArr
      }
      $.each(options, function (k, v) {
        if (!(v + '')) { // 后台要bool值 true和false 加个''转为字符串
          flag = true // 判断参数是佛为空
        }
      })
    } else { // 新增规则
      let keyRegular = {
        regularName: 'regularName',
        alarmCode: 'alarmCode',
        alarmMsg: 'alarmMsg'
      }
      options.regularId = form.data('regularid')
      $.each(keyRegular, function (k, v) { // 循环获取参数值
        if (form.find('[name="' + v + '"]').val().trim()) {
          options[k] = form.find('[name="' + v + '"]').val().trim()
        } else {
          flag = true
          form.find('[name="' + v + '"]').addClass('input-error')
          return
        }
      })
    }
    if (flag) {
      module.alert('缺少参数') // 提示客户参数不齐
      return
    }
    // 调用增加函数
    FN.deleteUpdateInsert(options, message, form)
  }
  // 预览子服务
  module.clickTree.lookSubService = function () {
    let serviceId = $(this).data('value')
    module.lookSubService(serviceId)
  }

  //规则排序
  $('#table2').off('click').on('click', function (e) {
    let el = $(e)[0].target.closest('tr'), ids = [], num = 0 // 判断是否更改顺序
    module.tableDnD(el, function() {
      $(el).closest('tbody').find('tr').each(function (k, v) {
        ids.push($(v).find('td:last-child div').data('value').regularId)
        if ($(v).data('index') === k) { // 如果没有改变 那么num就会和$(el).closest('tbody').find('tr').length相等 这样就可以判断是否更改
          num++
        }
      })
      if (num === $(el).closest('tbody').find('tr').length) {
        return
      }
      module.$http(API.safePlat.updateOrder, ids, function () {
        module.allRegulars()
        module.alert('更新成功')
      })
    })
  })
  // 初始化函数
  FN.initFun()
})