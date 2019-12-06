$(function () {
  let FN = {
      getMvTrackId: function (op) {
        module.$http(API.logsPlat.logByMvTrackId, op, function () {
          if (!module.empty(this.resData)) {
            module.noDataFunction("#table1")
            return
          }
          module.hasDataFunction("#table1")
          let data = []
          data.push(this.resData)
          if (!module.empty(data)) return
          let columns = [{
            field: 'guid',
            title: 'guid',
            width: 200,
            sortable: true,
            formatter: function (value, row, index) {
              return "<a href='javascript:void(0)' onclick='module.queryByGuid(this.textContent)'>" + value + "</a>"
            },
            footerFormatter: function (data) {
              $('.fixed-table-footer').remove()
            },
          }, {
            field: 'status',
            title: '状态',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              $('.fixed-table-footer').remove()
            },
            formatter: function (data) {
              return data / 1 > 0 ? '成功' : '失败'
            }
          }, {
            field: 'result',
            title: 'result',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              $('.fixed-table-footer').remove()
            },
          }, {
            field: 'message',
            title: '信息',
            width: 200,
            sortable: true,
          }, {
            field: 'resultCode',
            title: 'resultCode',
            width: 200,
            sortable: true,
          }, {
            field: 'resultMsg',
            title: '详细信息',
            width: 200,
            sortable: true,
          }]
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        })
      },
      /*获取客户名称*/
      getCustomers() {
        module.getCustomers().then(res => {
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
        })
      },
      init() {
        /*查看图片*/
        module.viewImage()
        module.initTimeFun({
          elem: '#day',
          range: false
        })
        FN.getCustomers()
      }
    }
  /*查詢*/
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form'), isNull = false,
        params = form.serializeArray(),
        options = {};
    $(params).each(function (k, v) {
      if (v.value) {
        if (v.name === 'date') {
          options[v.name] = v.value.trim().split('-').join('')
        } else {
          options[v.name] = v.value.trim()
        }
      } else {
        isNull = true
      }
    });
    if (isNull) {
      module.alert("参数不齐")
      return;
    }
    FN.getMvTrackId(options)
  }
  // 初始化
  FN.init()
})