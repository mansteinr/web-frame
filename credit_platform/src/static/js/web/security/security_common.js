$(function () {
  let columns1 = [{ // 定义列
    field: 'serviceName',
    title: '服务名',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceNameZh',
    title: '服务名（中）',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return row.combine ? '<span class="link" data-value="' + row.serviceId + '" data-click="lookSubService">' + value + '</span>' : value
    }
  }, {
    field: 'insertTime',
    title: '创建时间',
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'updateTime',
    title: '更新时间',
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'combine',
    title: '组合服务',
    sortable: true,
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
      let flag = row.combine ? 'link' : 'no-link'
      return `<div role="toolbar" aria-label="" data-value= '${message}'  data-id='${row.wordId}'>
        <span class="link" data-value="deleteService" data-param="serviceId" data-click="delFun">删除</span>
        <span class="${flag} ml" data-value="updateService" data-click=${row.combine ? 'updateFun' : ''}>更新</span>
        </div>`
    }
  }],
    columns2 = [{ // 定义列
      field: 'regularName',
      title: '规则名称',
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'regularCode',
      title: '规则代码',
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'alarmMsg',
      title: '告警描述',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'alarmCode',
      title: '告警码',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'insertTime',
      title: '生成时间',
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'updateTime',
      title: '更新时间',
      sortable: true,
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
        return `<div role="toolbar" aria-label="" data-value= '${message}'>
          <span class="link" data-click="delFun" data-param="regularId" data-value="deleteRegular">删除</span>
          <span class="link ml" data-click="updateFun" data-value="updateRegular">更新</span>
          </div>`
      }
    }]
  module.extend({
    // 获取所有的规则
    allRegulars: function () {
      module.$http(API.safePlat.allRegulars, {}, function () {
        module.hasDataFunction('#table2')
        module.renderTable({
          id: "#table2",
          data: this.resData,
          columns: columns2
        })
      })
    },
    // 获取所有的服务
    allService: function () {
      module.$http(API.safePlat.allService, {}, function () {
        module.hasDataFunction("#table1")
        module.renderTable({
          id: "#table1",
          data: this.resData,
          columns: columns1
        })
      })
    },
    lookSubService (serviceId) {
      module.$http(API.safePlat.subService, { serviceId: serviceId }, function () {
        let that = this
        if (module.empty(that.resData)) {
          module.popup.show({
            title: '预览子服务',
            style: 'margin-top:-250px !important;',
            content: $("#popupAddHtmlLook").html(),
            callback: function () {
              let form = $(this).find('form'),
                paramString = ''
              that.resData.forEach((v, k) => {
                paramString += `<span class="form-input text-warp" title="${v.serviceNameZh}:${v.serviceName}" data-value=${v.serviceName}>${v.serviceNameZh} : ${v.serviceName}</span>`
              })
              // 渲染参数
              form.find('.pramas').html(paramString)
              $(document).trigger(EVENT.INIT.DOTREE, this);
            }
          })
        } else {
          module.alert('未查询到结构')
        }
      })
    }
  })
})