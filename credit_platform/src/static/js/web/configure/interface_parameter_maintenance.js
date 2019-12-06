$(function () {
  let trIndex = '',
    paramsArr = [],
    // 设置全局变量 判断是否重复添加参数
    globelString = '',
    paramLen = 4,
    columns = [{
      field: 'serviceName',
      title: '服务名',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        let message = JSON.stringify(row)
        // 大于四条影藏  通过点击展示全部
        return `<div role="toolbar" aria-label="" data-message=${message}><span class=${row.params.length > paramLen ? "link" : ""} data-click="look">${value}</span></div>`
      }
    }, {
      field: 'serviceNameCh',
      title: '服务名(中文)',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'params',
      title: '参数',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        let paramsString = ''
        if (row.params && row.params.length) {
          row.params.forEach((v, k) => {
            if (k > (paramLen - 1)) return
            paramsString += `<span class="param-item" title="${v.paramName}">${v.paramNameCh} : ${v.paramName} </span>`
          })
        }
        return paramsString
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
        return '<div role="toolbar" aria-label="" data-message=' + message + '>' +
          '<span class="link" data-click="delFun">删除</span>' +
          '</div>'
      }
    }]
  let FN = {
    paramStringFun: function (paramNameCh, paramName) {
      // 防止重复添加参数
      if (globelString.indexOf(paramNameCh) > -1) {
        module.alert('你已经添加过该参数')
        return
      }
      globelString += paramNameCh
      return `<div class="params-item button-group" title="${paramNameCh} : ${paramName}"  data-paramname=${paramName} data-paramnamech=${paramNameCh}>
                  ${paramNameCh} : ${paramName}
                    <i style="border:none" class="iconfont icon-delete" data-click="deleteParams"></i>
                </div>`
    },
    // 从boss获取所有的参数名称
    getParam: function () {
      module.$http(API.operatorPlat.getParam, {}, function () {
        paramsArr = this.resData.paramInfos
      }, {
        type: 'get'
      })
    },
    // 获取所有的参数和接口名称
    getInterfaceParamter: function (op) {
      module.$http(API.operatorPlat.serviceNameParams, {}, function () {
        let newData = []
        if (module.empty(this.resData)) {
          let data = this.resData
          data.forEach((v, k) => {
            newData.push({
              serviceName: v.serviceName,
              serviceNameCh: v.serviceNameCh,
              params: v.paramNameBeans
            })
          })
        }
        // 渲染table
        module.renderTable({
          id: "#table1",
          data: newData,
          columns
        })
      })
    },
    getService() {
      module.getService().then(res => {
        $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
      })
    },
    initFun() {
      // 调用函数
      FN.getInterfaceParamter()
      FN.getParam()
      FN.getService()
    }
  }
  // 预览  只有参数 大于四条的时候 有该功能 切服务名为蓝色
  module.clickTree.look = function () {
    let messageObj = $(this).closest('div').data('message')
    module.popup.show({
      title: '预览',
      content: $("#popupAddHtmlLook").html(),
      style: 'margin-top: -350px;width:520px;',
      callback: function () {
        let form = $(this).find('form');
        form.find('span.serviceName').html(messageObj.serviceName);
        let paramString = ''
        messageObj.params.forEach((v, k) => {
          paramString += `<span class="form-input"  data-paramname=${v.paramName} data-paramnamech=${v.paramNameCh}>${v.paramNameCh} : ${v.paramName}</span></br>`
        })
        // 渲染参数
        form.find('.pramas').html(paramString)
        $(document).trigger(EVENT.INIT.DOTREE, this);
      }
    });
  }
  /*删除*/
  module.clickTree.delFun = function () {
    let messageObj = $(this).closest('div').data('message')
    // 获取到删除所在行的索引
    trIndex = $(this).closest('tr').data('index')
    module.popup.show({
      title: '删除',
      content: $("#popupAddHtmlDel").html(),
      style: 'margin-top: -350px',
      callback: function () {
        let form = $(this).find('form');
        form.find('span.serviceName').html(messageObj.serviceName);
        let paramString = ''
        messageObj.params.forEach((v, k) => {
          paramString += `<div class="checkbox-item"  data-paramname=${v.paramName} data-paramnamech=${v.paramNameCh}><input type="checkbox" checked class="iconfont">${v.paramNameCh} : ${v.paramName}</div></br>`
        })
        form.find('.pramas.checkbox-group').html(paramString)
        $(document).trigger(EVENT.INIT.DOTREE, this);
      }
    });
  };
  // 确定删除
  module.clickTree.editorFun = function () {
    let _this = $(this),
      options = {},
      paramNameBeans = [],
      form = _this.closest('form');
    $(form).find('.checkbox-item').each(function (k, v) {
      if ($(v).find('input').is(':checked')) { // 只有选中的参数 才可以删除
        paramNameBeans.push({
          paramName: $(v).data('paramname'),
          paramNameCh: $(v).data('paramnamech')
        })
      }
    })
    // 如果参数都为空 则禁止删除  
    if (!paramNameBeans.length) {
      module.alert('请选择参数')
      return
    }
    options.serviceName = form.find('.serviceName').text().trim()  //获取服务名
    options.paramNameBeans = paramNameBeans
    module.confirm({
      title: '删除',
      info: '确定删除该信息',
      status: 0,
      callback: function () {
        // 删除请求
        module.$http(API.operatorPlat.deleteByServiceNameAndParamName, options, function () {
          // 现将删除所在的行 移除 不发请求
          $('#table1').find('tr[data-index="' + trIndex + '"]').remove()
          module.popup.hide();
          // 提示删除成功
          module.alert('删除成功')
        })
        $(document).trigger(EVENT.INIT.DOTREE, this);
      }
    });
  }
  /*新增参数*/
  module.clickTree.add = function () {
    module.popup.show({
      title: '新增',
      style: 'margin-top: -350px;width:520px;',
      content: $("#popupAddHtmlAdd").html(),
      callback: function () {
        // 渲染所有的参数 paramsArr为全局变量  参数请求在页面渲染完成的时候已经发送 这样做好处有两，1、减少请求次数，提高客户体验度，2、防止一些不必要的bug比如在弹框里发请求 下拉框不起作用
        if (module.empty(paramsArr)) {
          let lis = '',
            selector = $('[name="params"]');
          if (module.empty(paramsArr)) {
            paramsArr.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp" title="' + v.paramNameCn + ' (' + v.paramNameEn + ')' + '" data-value = "' + v.paramNameEn + '" >' + v.paramNameCn + '</li>';
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          // 渲染参数
          selector.closest('.select-dropdown').find('.dropdown-menu').html(lis);
          // 每次点击新增按钮的时候 先将上次的参数情况 并将判断是否重复添加的参数标识符清空
          $(document).find('.pramas-item-box').empty()
          globelString = ''
          selector.closest('form').find('.add-params-item li').on('click', function () {
            // 点击参数的之后，将已经选中的参数 显示在页面上
            selector.closest('form').find('.pramas-item-box').append(FN.paramStringFun($(this).text().trim(), $(this).data('value').trim()))
          })
        }
        $(document).trigger(EVENT.INIT.DOTREE, this)
      }
    })
  }
  // 确定新增参数
  module.clickTree.addFuns = function () {
    let form = $(this).closest('form'),
      options = {},
      paramNameBeans = []
    // 判断参数是否为空 防止循环的时候 
    if (form.find('.params-item').length) {
      // 循环页面展示的参数 获取参数名及其对应的中文名
      form.find('.params-item').each(function (k, v) {
        paramNameBeans.push({
          paramNameCh: $(v).data('paramnamech').trim(),
          paramName: $(v).data('paramname').trim()
        })
      })
    }
    if (!paramNameBeans.length) {
      module.alert('参数为空')
      return
    }
    options.serviceName = form.find('.serviceNameUl li.active').data('value').trim() // 获取服务名
    options.serviceNameCh = form.find('.serviceNameUl li.active').text().trim() // 获取对应服务名的中文名
    // 判断服务名和对应的中文名是否为空
    if (!options.serviceName || !options.serviceNameCh) {
      module.alert('服务名为空')
      return
    }
    options.paramNameBeans = paramNameBeans
    module.$http(API.operatorPlat.addServiceNameAndParams, options, function () {
      module.popup.hide();
      FN.getInterfaceParamter()
      module.alert('新增成功')
    })
  }
  // 删除将要增加的参数
  module.clickTree.deleteParams = function () {
    $(this).closest('div').remove();
    globelString = globelString.replace($(this).closest('div').data('paramnamech').trim(), '')
  }
  FN.initFun()
})