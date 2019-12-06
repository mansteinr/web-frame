$(function () {
  // 定义表格
  let columns = [{
    field: 'loginName',
    title: '用户名',
    width: 200,
  }, {
    field: 'guid',
    title: 'guid',
    formatter: function (value, row, index) {
      return "<a href='javascript:void(0)' onclick='module.queryByGuid(this.textContent)'>" + value + "</a>"
    }
  }, {
    field: 'beginTime',
    title: '请求时间',
    sortable: true,
    formatter: function (value, row, index) {
      return module.formaterTime(value, 'yyyymmdd hh:ii:ss')
    }
  }, {
    field: 'param',
    title: '请求参数',
    formatter: function (value, row, index) {
      let html = ''
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
            label = key
            break;
        }
        // 只展示下面几个参数 其他不需要展示
        if (key == 'accountNo' || key == 'idCard' || key == 'mobile' || key == 'name' || key == 'plateNumber' || key == 'plateType') {
          html += '<span class="param-item" title="' + label + ': ' + value[key] + '">' + label + ': ' + value[key] + '</span>'
        }
      }
      return html
    }
  }, {
    field: 'costTime_all',
    title: '耗时(ms)',
    sortable: true,
    width: 200,
  }, {
    field: 'rsp.RESULT',
    title: 'RESULT',
    width: 200,
    sortable: true
  }, {
    field: 'rsp',
    title: 'resultCode',
    width: 200,
    sortable: true,
    formatter: function (data) {
      return data.detail ? data.detail.resultCode : ''
    }
  }, {
    field: 'ip',
    title: 'IP地址'
  }, {
    field: "srcQueryReturnList",
    title: "渠道",
    width: 200,
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      let htmlSpan = '';
      if (value && value.length > 0) {
        value.forEach(function (v, k) {
          if (v && v.className) {
            v.cn = v.className.split(".")[2]
            htmlSpan += '<span class="param-item" title="渠道名称:' + v.cn + ' ' + v["invokeCostTime"] + '">渠道名称: ' + v.cn + '  ' + v['invokeCostTime'] + '</span>'
          }
        })
      }
      return htmlSpan
    }
  }];
  let logsData = null, /* 保存全局数据 用于检索result */
    FN = {
      getLogs: function (op) {
        module.$http(API.logsPlat.logs, op, function () {
          module.hasDataFunction("#table1")
          logsData = this.resData
          // 将产寻到的数据存储起来 以便做resutl搜索
          $(".searchResultBox").show()
          // 渲染table
          module.renderTable({
            id: "#table1",
            data: module.empty(this.resData) ? this.resData : [],
            columns: columns
          })
        })
      },
      getBusinessTypes() {
        /*获取客户名称*/
        module.getBusinessTypes().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="businessType"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="businessType"]').closest('.search-item'))
          FN.getCustomers()
        })
      },
      getCustomers() {
        module.getCustomers().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
          FN.hasServices()
        })
      },
      hasServices() {
        module.hasServices().then(res => {
          $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
        })
      },
      initFun() {
        module.initTimeFun({
          range: false,
          elem: '#day',
        }, {
          elem: '#start',
          type: 'time',
          range: false
        })
        $(document).on('keydown', function () {
          /*验证数字*/
          module.keyup({
            reg: /[^\d+|^\d+.]/g
          })
        })
        /*查看图片*/
        module.viewImage()
        
        FN.getBusinessTypes()
      }
    }
  FN.initFun()
  /*客户变化 其对应的服务也发生变化*/
  $('[name="businessType"]').off('change').on('change', function () {
    FN.getCustomers()
  })
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })
  /*获取焦点时 取出input-error类名*/
  $('.query-hide').find('input[type="text"]').on("focus", function () {
    if ($(this).hasClass("input-error")) {
      $(this).removeClass('input-error')
    }
  });
  // 查询函数
  module.clickTree.queryFun = function () {
    $(".searchResultBox").hide();
    let form = $(this).closest('form'),
      myFlag = false;
    if (module.checkForm(form)) {
      let param = form.serializeArray(),
        options = {},
        params = {}
      $(param).each(function (k, v) {
        // 防止出现空参数
        if (v.value) {
          options[v.name] = v.value.trim()
        }
      })
      $('.query-hide').find('input').each(function (k, v) {
        if (v.value) {
          // 耗时时间不能放在params里面 否则查询不到数据
          if (v.name !== 'lowerCostTime' && v.name !== 'upperCostTime') {
            params[v.name] = v.value.trim()
          }
        }
      })
      options.params = params
      if (options.upperCostTime && options.lowerCostTime) {
        if (options.lowerCostTime / 1 > options.upperCostTime / 1) {
          module.alert("输入时间有误");
          myFlag = true;
        }
      };
      options.start = options.date + " " + options.start1
      options.end = options.date + " " + options.end1
      debugger
      if (options.start1 && options.end1) {
        let NumberStart = Date.parse(options.start),
          Numberend = Date.parse(options.end)
        if (NumberStart > Numberend) {
          module.alert("开始时间大于结束时间")
          myFlag = true
        }
      }
      delete options.time
      delete options.start1
      delete options.end1
      if (options.mobile) {
        if (!module.checkTel(options.mobile)) {
          $('[name="mobile"]').addClass('input-error')
          module.alert('输入的手机号码不正确')
          myFlag = true
        }
      }
      if (options.idCard) {
        // 将身份证中x转为X options.idCard.toUpperCase()也可 
        if (options.idCard.indexOf('x') > -1) {
          options.idCard = options.idCard.replace(/x/g, 'X')
        }
        if(!/^[\d]{15}$|^[\d]{18}$/.test(options.idCard)) {
          $('[name="idCard"]').addClass('input-error')
          module.alert("输入的身份证号码不正确")
          myFlag = true
        }
      }
      if (myFlag) {
        return
      }
      FN.getLogs(options)
    }
  };
  let toggleFlag = true, thisText = ''
  module.clickTree.hideshow = function () {
    // 切换额外查询条件
    $(".query-hide").stop(true, true).slideToggle()
    toggleFlag ? thisText = '隐藏' : thisText = '更多'
    toggleFlag = !toggleFlag
    $(this).text(thisText)
    // 第一次手动触犯查询条件
    $('[name="serviceName"]').trigger('change')
  }
  /*按result搜索*/
  $('.query-result').off('keyup').on("keyup", function (e) {
    let queryParameter = $(this).val().trim(), queryParameterArr = [], resultData = logsData
    if (!module.empty(logsData)) return
    $('#table1').empty()
    if (queryParameter) {
      resultData.forEach(function (v, k) {
        if (v.rsp.RESULT === queryParameter) {
          queryParameterArr.push(v)
        }
      })
      module.renderTable({
        id: "#table1",
        data: queryParameterArr,
        columns: columns
      })
    } else {
      module.renderTable({
        id: "#table1",
        data: resultData,
        columns: columns
      })
    }
  })
  // 根据服务名动态生成参数
  $('[name="serviceName"]').on('change', function () {
    // 如果按钮为‘隐藏’ 禁止发请求 反之可以发请求
    if (toggleFlag) {
      return
    }
    let liActive = $('[name="serviceName"]').closest('.search-item').find('li.active'), op = {}
    op.serviceId = liActive.data('serviceid')
    op.serviceName = liActive.data('value').trim()
    op.serviceNameCh = liActive.text().trim()
    module.renderParams(op, '.query-hide', true)
  })
})
