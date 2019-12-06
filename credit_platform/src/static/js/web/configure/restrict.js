$(function () {
  let url = 'http://172.16.5.4:30002',
    columns = [{
      field: 'loginName',
      title: '用户名',
      width: 200,
    }, {
      field: 'IdName',
      title: 'IdName',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return `<div role="toolbar" aria-label="">
          <input class="m-input" style="width:80%;" name="IdName" value="${value}"/>
        </div>`
      }
    }, {
      field: 'IdNameInfo',
      title: 'IdNameInfo',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return `<div role="toolbar" aria-label="">
          <input class="m-input" style="width:80%;" name="IdNameInfo" value="${value}"/>
        </div>`
      }
    }, {
      field: 'IdNamePhoto',
      title: 'IdNamePhoto',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return `<div role="toolbar" aria-label="">
          <input class="m-input" style="width:80%;" name="IdNamePhoto" value="${value}"/>
        </div>`
      }
    }, {
      title: '操作',
      valign: 'middle',
      align: 'center',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return `<div role="toolbar" aria-label="">
          <span class="link" data-click="delFun">删除</span>
          </div>`
      }
    }],
    columns2 = [{
      field: 'customer',
      title: '客户',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'service',
      title: '服务名称',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'limit',
      title: '限制总量',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'count',
      title: '使用量',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: '日期',
      title: 'date',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }],
    totalLimit = {}, // 限制总量
    FN = {
      getUpServerLimitCount() {
        module.$http(url + '/operator/limitOfCXZX/getUpServerLimitCount', {}, function () {
          // module.$http(url + API.restrictPlat.getUpServerLimitCount, {}, function () {
          let data = this.resData
          if (module.empty(data)) {
            totalLimit = data // 保存为全局变量
            $.each(data, function (k, v) {
              $(`[name=${k}]`).val(v)
            })
          }
        }, {
          type: 'get'
        })
      },
      setUpServerLimitCount(op) {
        module.$http(url + '/operator/limitOfCXZX/setUpServerLimitCount', op, function () {
          // module.$http(url + API.restrictPlat.getUpServerLimitCount, {}, function () {
          module.alert('修改成功')
        })
      },
      getCustomerLimitCount() {
        module.$http(url + '/operator/limitOfCXZX/getCustomerLimitCount', {}, function () {
          // module.$http(url + API.restrictPlat.getUpServerLimitCount, {}, function () {
          module.hasDataFunction("#table1")
          let data = []
          $.each(this.resData, function (k, v) {
            let opt = {}
            opt['loginName'] = k.replace(/"/, '')
            $.each(v, function (k1, v1) {
              opt[k1.replace(/"/, '')] = v1
            })
            data.push(opt)
          })
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        }, {
          type: 'get'
        })
      },
      setCustomerLimitCount(opt) {
        module.$http(url + '/operator/limitOfCXZX/setCustomerLimitCount', opt, function () {
          // module.$http(url + API.restrictPlat.getUpServerLimitCount, {}, function () {
          module.alert('修改成功')
        })
      },
      getLimitServiceCondition() {
        let opt = {}
        $(form).find('input').each(function (k, v) {
          if (v.name === 'rangetime') {
            opt['startDate'] = v.value.split('至')[0].trim()
            opt['endDate'] = v.value.split('至')[1].trim()
          } else {
            if (v.name) {
              opt[v.name] = v.value.split(',')
            }
          }
        })
        module.$http(url + '/operator/limitOfCXZX/getLimitServiceCondition', opt, function () {
          module.hasDataFunction("#table2")
          // module.$http(url + API.restrictPlat.getUpServerLimitCount, {}, function () {
          module.renderTable({
            id: "#table2",
            data: this.resData,
            columns: columns2
          })
        })
      },
      /*获取客户名称*/
      tableTranJSon() {
        let newJson = {}
        $('#table1 tbody tr').each(function (k, v) {
          let key = $(v).find('td:first-child').text().trim()
          newJson[key] = {}
          $(v).find('td input').each(function (k1, v1) {
            if (v1.value.trim()) {
              newJson[key][v1.name] = v1.value.trim()
            }
          })
        })
        return newJson
      },
      initFun() {
        FN.getUpServerLimitCount()
        FN.getCustomerLimitCount()
        /*初始化开始结束时间*/
        module.initTimeFun({
          range: '至'
        })
        module.getCustomers().then(res => {
          $('[name="customers"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="customers"]').closest('.search-item'))
          FN.getLimitServiceCondition()
        })
      }
    }

  FN.initFun()
  /** 设置总量 */
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form'), options = {}
    $(form).find('input').each(function (k, v) {
      if (v.value) {
        options[v.name] = v.value.trim()
      }
    })
    FN.setUpServerLimitCount(options)
  }
  /** 设置每个服务总量 */
  module.clickTree.customerFun = function () {
    let compareOpt = {}, sendOpt = FN.tableTranJSon()
    $.each(sendOpt, function (k, v) {
      $.each(v, function (k1, v1) {
        if (!compareOpt[k1]) {
          compareOpt[k1] = v1 / 0
        } else {
          compareOpt[k1] += v1 / 0
        }
      })
    })
    $.each(compareOpt, function (k, v) {
      if (v - totalLimit[k] > 0) {
        module.alert(`${k}设置错误`)
        return
      }
    })
    FN.setCustomerLimitCount(sendOpt)
  }
  /* 新增 */

  module.clickTree.addFun = function () {
    module.popup.show({
      title: '新增',
      style: 'top:10%;left:23%;width:90%;',
      content: $("#popupAddHtml").html(),
      callback: function () {
        let form = $(this).find('form'), popupDom = $(this).closest('.backdrop .popup')
        popupDom.get(0).style.left = '50%'
        popupDom.get(0).style.marginLeft = `-${popupDom.width() / 2}px`
        module.getCustomers().then(res => {
          form.find('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, form.find('[name="loginName"]').closest('.form-item'))
          form.find('[name="loginName"]').off('change').on('change', function () {
            let html = `<div class="param-box" style="display: flex;">
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">客户名称：</label>
                    <input type="text" class="m-input" readonly name="loginName" value="${this.value}" />
                  </div>
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">IdName</label>
                    <input type="text" class="m-input" name="IdName"/>
                  </div>
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">IdNameInfo</label>
                    <input type="text" class="m-input" name="IdNameInfo" />
                  </div>
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">IdNamePhoto：</label>
                    <input type="text" class="m-input" name="IdNamePhoto" />
                  </div>
                  <i style="border:none;position: absolute;line-height: 40px;right:10px;" title="删除" class="iconfont icon-delete" data-click="deleteParams"></i>
                </div>`, flag = false, inputs = form.find('.param-box:last-child input')
            if (inputs.length > 0) {
              inputs.each(function (k, v) {
                if (v.name !== 'loginName' && v.value.trim()) {
                  flag = true
                }
              })
              if (!flag) {
                module.alert('上一条参数全部为空')
                return
              }
            }
            form.find('.param-wrapper').append(html)
          })
        })
      }
    })
  }

  module.clickTree.determineFun = function () {
    let options = {}, form = $(this).closest('form')
    form.find('.param-box').each(function (k, v) {
      let key = $(v).find('input[name="loginName"]').value.trim()
      options[key] = {}
      $(v).find('input').each(function (k1, v1) {
        if (k1 !== 0) {
          options[key][v1.name] = v1.value.trim()
        }
      })
    })
    console.log(options)
    let sendOptions = Object.assign(options, FN.tableTranJSon())
    FN.setUpServerLimitCount(sendOptions)
  }

  module.clickTree.deleteParams = function () {
    $(this).closest('.param-box').remove()
  }

  module.clickTree.getLimitServiceConditioFun = function () {
    FN.getLimitServiceCondition()
  }

  module.clickTree.delFun = function () {
    module.confirm({
      title: '删除',
      info: '确定删除?',
      status: 0,
      callback: function () {
        $(this).closest('tr').remove()
        $('[data-click="customerFun"]').trigger('click')
      }
    })
  }
})