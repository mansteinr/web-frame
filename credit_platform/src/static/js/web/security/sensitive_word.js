$(function () {
  let columns = [{ // 定义列
    field: 'wordKey',
    title: '敏感词',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'wordDes',
    title: '描述信息',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'updateTime',
    title: '更新时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceParams',
    title: '关联服务及参数',
    sortable: true,
    height: 50,
    rowStyle: function (row, index) {
      return {
        css: {
          'max-height': '105px',
          'overflow': 'auto',
          'color': 'red'
        }
      }
    },
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      let paramsString = ''
      if (value && value.length) {
        paramsString = '<div style="max-height:105px;overflow: auto">'
        value.forEach((v, k) => {
          paramsString += `<span class="param-item" title="${v.serviceName}">${v.serviceName} : ${v.paramName} </span>`
        })
        paramsString += '</div>'
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
      return `<div role="toolbar" aria-label="" data-value= '${message}'  data-id='${row.wordId}'>
        <span class="link" data-click="delFun">删除</span>
        <span class="link ml" data-click="updateFun">更新</span>
        </div>`
    }
  }],
    repeatObj = {}, // 检测是否重复添加
    allServices = [],
    FN = {
      allWords: function (op) { // 查询所有的敏感词
        module.$http(API.safePlat.allWords, op, function () {
          module.hasDataFunction("#table1")
          let data = this.resData
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        })
      },
      deleteSensitive: function (op) {
        module.$http(API.safePlat.deleteSensitive, op, function () {
          if (this.resCode) {
            FN.allWords() // 重新拉取数据 并提示客户
          }
          module.alert(this.resMsg[0].msgText)
        })
      },
      allServices: function () {
        module.$http(API.commomApi.services, {}, function () {
          allServices = this.resData
        })
      },
      save: function (that, url, id) {
        let form = $(that.closest('form')),
          params = form.serializeArray(),
          flag = false, // 标识参数是否有空
          options = {},
          serviceParams = []
        // 组装参数
        $(params).each(function (k, v) {
          if (v.name === 'wordKey' || v.name === 'wordDes') {
            if (v.value) {
              options[v.name] = v.value.trim()
            } else {
              flag = true //  有空置为true 并提示客户 提出循环
              module.alert($('[name="' + v.name + '"]').closest('.form-item').find('.form-label').data('value') + '不能为空')
              return
            }
          }
        })
        // 检测关键词和描述信息是否为空
        if (flag) return
        form.find('.checkbox-group div').each((k, v) => { // 获取参数
          if ($(v).data('param').trim() && $(v).data('service').trim()) {
            serviceParams.push({
              'serviceName': $(v).data('service').trim(),
              'paramName': $(v).data('param').trim()
            })
          }
        })
        // 检测关联服务名和参数是否为空
        if (!serviceParams.length) {
          module.alert('请选择至少一个服务')
          return
        }
        if (id) {
          options.wordId = id
        }
        options.serviceParams = serviceParams
        module.$http(API.safePlat[url], options, function () {
          if (this.resCode) {
            FN.allWords() // 重新拉取数据 并提示客户
            repeatObj = {}
            form.find('[data-click="hidepopup"]').trigger('click')
          }
          module.alert(this.resMsg[0].msgText)
        })
      },
      serivceChange: function (e, that) {
        e.stopPropagation()
        let liActive = that.find('[name="serviceName"]').closest('.form-item').find('li.active'),op = {}

        op.serviceName = liActive.data('value').trim()
        op.serviceNameCh = liActive.text().trim()
        op.serviceId = liActive.data('serviceid')
        module.$http(API.operatorPlat.queryParamsByServiceName, op, function () {
          let lis = ''
          that.find('[name="params"]').closest('div').find('.text-warp.selected-value').text('') // 清空参数
          if (module.empty(this.resData.paramNameBeans)) {
            this.resData.paramNameBeans.forEach((v, k) => {
              lis += '<li class="dropdown-item  text-warp" title="' + v.paramNameCh + ' (' + v.paramName + ')' + '" data-value = "' + v.paramName + '" >' + v.paramNameCh + '</li>';
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
          that.find('.add-params-item').html(lis)
          let neteworkParms = ''
          that.find('[name="params"]').off('change').on('change', function (e) {
            e.stopPropagation()
            $(this).val('') //  情况参数
            let changeService = that.find('.serviceNameUl').find('li.active').data('value').trim()
            if (repeatObj[changeService]) {
              module.alert('已经添加过该服务')
              return
            }
            repeatObj[changeService] = changeService
            neteworkParms = `<div style="position:relative;" class="text-warp" title="${that.find('.serviceNameUl').find('li.active').text().trim()}: ${$(this).closest('div').find('li.active').text().trim()}" data-service="${changeService}" data-param="${$(this).closest('div').find('li.active').data('value').trim()}">
            ${changeService}:${$(this).closest('div').find('li.active').data('value')}
            <i class="iconfont icon-delete delete-item" data-click="delteItem"></i>
            </div>`
            // 渲染
            that.find('.pramas.checkbox-group').append(neteworkParms)
            // 将之前的参数清空
            neteworkParms = ''
          })
        })
      },
      initFun () {
        FN.allWords({})
        FN.allServices()
      }
    }
  // 删除敏感词
  module.clickTree.delFun = function () {
    let options = {
      wordId: $(this).closest('div').data('id')
    }
    module.confirm({
      title: '删除',
      info: '确定删除该敏感词',
      status: 0,
      callback: function () {
        FN.deleteSensitive(options)
        $(document).trigger(EVENT.INIT.DOTREE, this)
      }
    })
  }
  // 更新敏感词
  module.clickTree.updateFun = function () {
    let message = $(this).closest('div').data('value')
    module.popup.show({
      title: '更新',
      content: $("#popupAddHtmlAdd").html(),
      callback: function () {
        repeatObj = {}
        let that = $(this)
        that.find('[name="wordKey"]').attr("disabled", "disabled")
        that.find('form').attr('data-id', message.wordId)
        that.find('[data-click="updateFuns"]').show()
        that.find('[data-click="addFuns"]').hide()
        that.find('input').each(function (k, v) {
          $('[name="' + v.name + '"]').val(message[v.name])
        })
        // 调取所有的服务名称
        let lis = '',
          selector = $('[name="serviceName"]');
        if (module.empty(allServices)) {
          allServices.forEach(function (v, k) {
            lis += '<li class="dropdown-item  text-warp" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
          });
        } else {
          lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
        }
        selector.closest('.select-dropdown').find('.dropdown-menu').html(lis)
        /*初始化*/
        $(document).trigger(EVENT.INIT.DOTREE, this)
        let strig = ''
        message.serviceParams.forEach((v, k) => {
          strig += `<div style="position:relative;" class="text-warp" title="${v.serviceName}:${v.paramName}" data-service="${v.serviceName}" data-param="${v.paramName}">
          ${v.serviceName}: ${v.paramName}
          <i class="iconfont icon-delete delete-item" data-click="delteItem"></i>
          </div>`
          repeatObj[v.serviceName] = v.paramName
        })
        that.find('.pramas.checkbox-group').html(strig)
        setTimeout(() => {
          that.find('.serviceNameUl li.active').trigger('click')
        }, 20)
        that.find('[name="serviceName"]').on('change', function (e) {
          e.stopPropagation()
          FN.serivceChange(e, that)
        })
      }
    })
  }

  // 新增敏感词
  module.clickTree.add = function () {
    repeatObj = {}
    module.popup.show({
      title: '新增',
      content: $("#popupAddHtmlAdd").html(),
      callback: function () {
        let that = $(this)
        that.find('[data-click="updateFuns"]').hide()
        that.find('[data-click="addFuns"]').show()
        // 调取所有的服务名称
        let lis = '',
          selector = $('[name="serviceName"]');
        if (module.empty(allServices)) {
          allServices.forEach(function (v, k) {
            lis += '<li class="dropdown-item  text-warp" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
          });
        } else {
          lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
        }
        selector.closest('.select-dropdown').find('.dropdown-menu').html(lis);
        /*初始化*/
        $(document).trigger(EVENT.INIT.DOTREE, this)
        setTimeout(() => {
          that.find('.serviceNameUl li.active').trigger('click')
        }, 20)
        that.find('[name="serviceName"]').on('change', function (e) {
          e.stopPropagation()
          FN.serivceChange(e, that)
        })
      }
    });
  }

  // 保存新增的敏感词
  module.clickTree.addFuns = function () {
    FN.save(this, 'insertSensitive');
  }
  // 更新新增的敏感词
  module.clickTree.updateFuns = function () {
    let id = $(this).closest('form').data('id')
    FN.save(this, 'updateSensitive', id);
  }
  // 删除参数
  module.clickTree.delteItem = function () {
    delete repeatObj[$(this).closest('div').data('service')]
    $(this).closest('div').remove()
  }

  // 调用函数
  FN.initFun()
})