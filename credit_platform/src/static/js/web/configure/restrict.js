$(function () {
  let max = 1, // 单位， 防止变更，以1000或者10000为单位
    globlePrimaryKey = 'IdName', // 这个对应的当前服务
    renderArr = [], // 保存新增时 已经渲染的客户名称
    columns = [{ //  定义表格
      field: 'loginName',
      title: '客户',
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return value / max
      }
    }, {
      field: 'limit',
      title: '限量',
      sortable: true,
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      },
      formatter: function (value, row, index) {
        return value / max
      }
    }],
    columns2 = [{
      field: 'date',
      title: '日期',
      sortable: true,
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }, {
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
      field: 'count',
      title: '使用量',
      sortable: true,
      footerFormatter: function (data) {
        $('.fixed-table-footer').remove()
      }
    }],
    totalLimit = 0, // 保存限制总量
    FN = {
      getUpServerLimitCount() { // 获取总的限制量
        module.$http(`${API.restrictPlat.getUpServerLimitCount}/${globlePrimaryKey}`, {}, function () {
          let data = this.resData
          if (module.empty(data)) {
            totalLimit = data // 保存变量 数据对比使用
            $('#overDataForm').find(`[name=${globlePrimaryKey}]`).val(data / max) // 填充数据
          }
        }, {
          type: 'get'
        })
      },
      getUpServerLimitFlag() { // 获取总的限制量
        let dom = $('#overDataForm').find('[type="checkbox"]'), flag = dom.prop('checked')
        module.$http(`${API.restrictPlat.getUpServerLimitFlag}/${globlePrimaryKey}`, {}, function () {
          // 设置是否开启 成功时更具后台来设置  失败设置为之前的状态
          if (this.resCode) {
            dom.prop('checked', this.resData === '0' ? false : true)
          } else {
            module.alert('操作失败')
            dom.prop('checked', flag)
          }
        }, {
          type: 'get'
        })
      },
      setUpServerLimitFlag() { // 获取总的限制量 
        let dom = $('#overDataForm').find('[type="checkbox"]'),
          flag = dom.prop('checked'),
          options = {
            service: globlePrimaryKey,
            flag: dom.prop('checked') ? '1' : '0'
          }
        module.$http(API.restrictPlat.setUpServerLimitFlag, options, function () { // 设置是否开启 成功时更具后台来设置  失败设置为之前的状态
          if (this.resCode) {
            FN.getUpServerLimitFlag()
          } else {
            module.alert('操作失败')
            dom.prop('checked', flag)
          }
        })
      },
      setUpServerLimitCount(form, options) { // 设置总的限制量
        let val = form.find('[name="' + globlePrimaryKey + '"]').val(), opt = {}
        if (val < 0) {
          module.alert('请检查参数')
          return
        }
        opt = {
          service: globlePrimaryKey,
          limit: val
        }
        module.$http(API.restrictPlat.setUpServerLimitCount, opt, function () {
          if (this.resCode) {
            module.alert('操作成功')
            FN.getUpServerLimitCount()
            FN.setCustomerLimitCount(options)
          } else {
            module.alert('操作失败')
          }
        })
      },
      getCustomerLimitCount() { // 获取各客户限量详情
        module.$http(API.restrictPlat.getCustomerLimitCount, {}, function () {
          let data = [],
            cloneColumns = JSON.parse(JSON.stringify(columns)) // 复制表单
          keysObj = this.resData
          compareObj = {} // 将各个服务除了other的分配量保存在该对象中
          $.each(keysObj[globlePrimaryKey], function (k, v) {
            data.push({
              loginName: k,
              limit: v / max
            })
            renderArr.push(k) // 将已经渲染的客户保存起来
          })

          cloneColumns.push({ // 将操作栏添加至表单变量中
            title: '操作',
            valign: 'middle',
            align: 'center',
            footerFormatter: function (data) {
              $('.fixed-table-footer').remove()
            },
            formatter: function (value, row, index) {
              return `<div role="toolbar" aria-label="" data-value= ${JSON.stringify(row)}>
              <span class="${row.loginName === 'other' ? 'no-link' : 'link'}" data-click="${row.loginName === 'other' ? '' : 'delFun'}">删除</span>
              <span class="${row.loginName === 'other' ? 'no-link' : 'link'} ml" data-click="${row.loginName === 'other' ? '' : 'editorFun'}">修改</span>
              </div>`
            }
          })

          module.hasDataFunction("#table1")
          module.renderTable({
            id: "#table1",
            data,
            columns: cloneColumns
          })
        }, {
          type: 'get'
        })
      },
      setCustomerLimitCount(opt) {
        module.$http(API.restrictPlat.setCustomerLimitCount, opt, function () {
          if (this.resCode) {
            module.alert('操作成功')
            if ($('.backdrop').length) {
              $('.backdrop').find('[data-click="hidepopup"]').trigger('click')
            }
            FN.getCustomerLimitCount()
          } else {
            module.alert('操作失败')
          }
        })
      },
      mergeTable() {
        module.mergeTable('date', "#table2")
      },
      getLimitServiceCondition() {
        let opt = {}
        opt['startDate'] = $('#form').find('[name="rangetime"]').val().trim().split('至')[0].trim()
        opt['endDate'] = $('#form').find('[name="rangetime"]').val().trim().split('至')[1].trim()
        opt['customers'] = $('#form').find('[name="customers"]').val().trim() ? $('#form').find('[name="customers"]').val().trim().split(',') : []
        opt['service'] = $('#form').find('[name="service"]').val().trim()

        module.$http(API.restrictPlat.getLimitServiceCondition, opt, function () {
          module.hasDataFunction("#table2")
          module.renderTable({
            id: "#table2",
            data: this.resData,
            columns: columns2,
            onPageChange: FN.mergeTable,
            onSort: FN.mergeTable
          })
          module.mergeTable('date', "#table2") /** 合并单元格 */
        })
      },
      getTableJSON() { // 获取表单数据
        let newJson = {}
        $('#table1 tbody tr').each(function (k, v) {
          newJson[$(v).find('td:first-child').text()] = $(v).find('td:nth-child(2)').text() * max
        })
        return JSON.stringify(newJson)
      },
      initFun() {
        /*初始化开始结束时间*/
        module.initTimeFun({
          range: '至'
        })
        module.getCustomers().then(res => {
          let html = '<li class="dropdown-item  text-warp data-value="" data-pym="QuanBu">全部</li><li class="dropdown-item  text-warp hover" title="other" data-value="other" data-loginname="other" data-pym="other">other</li>' + res
          $('[name="customers"]').closest('.select-dropdown').find('.dropdown-menu').html(html)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="customers"]').closest('.search-item'))
          module.selected('customers')
          setTimeout(() => {
            // 模拟异步 防止报错 有时候时间框格式慢 导致该请求获取步到时间 容易报错
            FN.getLimitServiceCondition()
          }, 200)
        })

        FN.getUpServerLimitFlag()
        FN.getUpServerLimitCount()
        FN.getCustomerLimitCount()
        // 只能输入数字
        module.keyup({
          selector: $(document).find('.numbers')
        })
      }
    }

  FN.initFun()
  /** 设置总量 */
  module.clickTree.queryFun = function () {
    module.popup.show({
      title: '修改',
      content: $("#totalPopueHtml").html(),
      callback: function () {
        let form = $(this).find('form')
        $(form).find('input[name="' + globlePrimaryKey + '"]').val(totalLimit / max)
        module.keyup({
          selector: form.find('.numbers')
        })
      }
    })
  }
  /* 新增 */
  module.clickTree.addFun = function () {
    module.popup.show({
      title: '新增',
      content: $("#popupAddHtml").html(),
      callback: function () {
        let form = $(this).find('form')

        module.getCustomers(true).then(res => {
          let lis = ''
          res.forEach(v => { // 过滤已经添加的客户
            if (!renderArr.includes(v.loginName)) {
              lis += '<li class="dropdown-item  text-warp" data-customerid = "' + v.customerId + '" title = "' + v.customerName + '" data-value = "' + v.loginName + '" data-businessid="' + v.businessId + '" data-loginname="' + v.loginName + '"  data-businessname="' + v.businessName + '">' + v.customerName + '</li>'
            }
          })
          if (!lis) {
            form.find('[data-click="hidepopup"]').trigger('click')
            module.alert('没有客户可选')
            return
          }
          form.find('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
          $(document).trigger(EVENT.INIT.DOTREE, form.find('[name="loginName"]').closest('.form-item'))
          form.find('[name="loginName"]').off('change').on('change', function () {

            if(renderArr.includes(this.value)) return
            renderArr.push(this.value)

            let html = `<div class="param-box" style="display: flex;">
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">客户名称：</label>
                    <input type="text" class="m-input" readonly name="loginName" value="${this.value}" />
                  </div>
                  <div class="form-item" style="margin-right: 10px;">
                    <label class="form-label">${globlePrimaryKey}：</label>
                    <input type="text" class="m-input numbers" name="${globlePrimaryKey}" />
                  </div>
                  <i style="border:none;position: absolute;line-height: 40px;right:10px;" title="删除" class="iconfont icon-delete" data-click="deleteParams"></i>
                </div>`, flag = false, inputs = form.find('.param-box:last-child input')

            /** 检测是否为空 */
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
          module.keyup({
            selector: form.find('.numbers')
          })
        })
      }
    })
  }

  module.clickTree.determineFun = function () {
    let options = {},
      form = $(this).closest('form'),
      compareNum = 0, // 对比数据
      isEmpty = false
    options[globlePrimaryKey] = {}

    form.find('.param-box').each(function (k, v) {
      let val = $(v).find('input').eq(1).val() * max, inputName = $(v).find('input').eq(0).val()
      if (!val) {
        isEmpty = true
        module.alert(`${inputName}不能为空，且不能为0`)
        return
      }
      if(val < 0) {
        isEmpty = true
        module.alert(`${inputName}不能为空，且不能为0`)
        return
      }
      options[globlePrimaryKey][inputName] = val * max
      compareNum += val * max
    })
 
    if (isEmpty) {
      return
    }

    let param = JSON.parse(FN.getTableJSON())
    $.each(param, function (k, v) {
      if (k === 'other') return
      compareNum += v * max
      options[globlePrimaryKey][k] = v * max
    })

    let otherValue = totalLimit - compareNum
    if (otherValue < 0) {
      module.alert(`other客户${globlePrimaryKey}的值为负数`)
      return
    }
    options[globlePrimaryKey]['other'] = otherValue
    FN.setCustomerLimitCount(options)
  }

  module.clickTree.deleteParams = function () {
    let dom =  $(this).closest('.param-box')
    dom.remove()
    let deleteName = dom.find('input').eq(0).val()
    renderArr.splice(renderArr.indexOf(deleteName),1)
  }

  module.clickTree.getLimitServiceConditioFun = function () {
    FN.getLimitServiceCondition()
  }

  module.clickTree.delFun = function () {
    /**
     * 删除某个客户的某个服务时，将该服务过滤掉，并将删除的量，累加给other对应的服务
     */
    let value = $(this).closest('div').data('value'),
      customer = value.loginName,
      param = JSON.parse(FN.getTableJSON()),
      compareNum = 0,
      options = {}
    options[globlePrimaryKey] = {}
    renderArr = [] // 重新保存 已经渲染的客户
    $.each(param, function (k, v) {
      if (k !== customer && k !== 'other') {
        renderArr.push(k)
        compareNum += v
        options[globlePrimaryKey][k] = v
      }
    })

    let otherValue = totalLimit - compareNum
    if (otherValue < 0) {
      module.alert('数值设置不合理，为负数')
      return
    }

    options[globlePrimaryKey]['other'] = otherValue
    module.confirm({
      title: '删除',
      info: `other客户的${globlePrimaryKey}服务将变为${otherValue / max}条`,
      status: 0,
      callback: function () {
        FN.setCustomerLimitCount(options)
      }
    })
  }

  module.clickTree.editorFun = function () {
    let row = $(this).closest('div').data('value')
    module.popup.show({
      title: '修改',
      content: $("#popupEditorHtml").html(),
      callback: function () {
        let form = $(this).find('form')
        form.data('limit', row.limit / max)
        form.data('loginname', row.loginName)
        $(form).find('input').val(row.limit / max)
        module.keyup({
          selector: form.find('.numbers')
        })
      }
    })
  }

  module.clickTree.determineEditorFun = function () {
    let form = $(this).closest('form'),
      preValue = form.data('limit'),
      loginName = form.data('loginname')
      nextValue = form.find('input').val() / max,
      compareNum = 0,
      options = {}
    param = JSON.parse(FN.getTableJSON())
    param[loginName] = nextValue
    options[globlePrimaryKey] = {}

    if (preValue === nextValue) {
      module.alert('数据好像未修改')
      return
    }
    if (nextValue <= 0) {
      module.alert('数据必须大于0')
      return
    }
    $.each(param, function (k, v) {
      if (k === 'other') return
      compareNum += v / max
      options[globlePrimaryKey][k] = v
    })

    let otherValue = totalLimit - compareNum
    if (otherValue < 0) {
      module.alert(`other客户的${globlePrimaryKey}值为负数`)
      return
    }
    options[globlePrimaryKey]['other'] = otherValue
    FN.setCustomerLimitCount(options)
  }

  module.clickTree.totalPopueHtmlFun = function () {
    let options = {},
      form = $(this).closest('form'),
      compareNumber = 0,
      param = JSON.parse(FN.getTableJSON())

    options[globlePrimaryKey] = {}
    $.each(param, function (k, v) {
      if (k !== 'other') {
        compareNumber += v
        options[globlePrimaryKey][k] = v
      }
    })

    let nextValue = form.find('input[name="' + globlePrimaryKey + '"]').val() * max,
      otherValue = nextValue - compareNumber,
      varNum = nextValue - totalLimit * max
    options[globlePrimaryKey]['other'] = otherValue
    if (varNum === 0) {
      module.alert('设置量没有变化')
      return
    }
    if (otherValue < 0) {
      module.alert(`other的${globlePrimaryKey}设置量不合理，为负数`)
      return
    }
    module.confirm({
      title: '提示',
      info: `other客户的${globlePrimaryKey}服务将变为${otherValue}条`,
      status: 1,
      callback: function () {
        FN.setUpServerLimitCount(form, options)
      }
    })
  }

  $('[name="setUpServerLimitFlag"]').off('change').on('change', function () {
    let dom = $('#overDataForm').find('[type="checkbox"]'), flag = dom.prop('checked')
    module.confirm({
      title: '提示',
      status: 3,
      info: `确定${flag ? '开启' : '禁止'}？`,
      callback: function () {
        FN.setUpServerLimitFlag()
      },
      cancelCb: function () {
        FN.getUpServerLimitFlag()
      }
    })
  })
  $('[name="serviceName"]').off('change').on('change', function () {
    globlePrimaryKey = $(this).val()

    FN.initFun()
  })
})
