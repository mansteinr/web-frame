$(function () {
  let columns = [{
    field: 'loginName',
    title: '客户名称',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'serviceName',
    title: '服务名称',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'guid',
    title: 'guid',
    width: 200,
    sortable: true,
    formatter: function (value, row, index) {
      return "<a href='javascript:void(0)' onclick='module.queryByGuid(this.textContent)'>" + value + "</a>"
    },
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    }
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
  }], FN = {
      getMvTrackId: function (op) {
        module.renderTable({
          id: '#table1',
          columns,
          sidePagination: 'server'
        }, {
          url: API.logsPlat.logByMvTrackId,
          ajaxOptions: {
            headers: { "mtk": module.localData.getData('usermtk') || API.localMtk },
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
            if(params.pageNumber > 100) {
              params.pageNumber = 100
            }
            return Object.assign({
              limitNum: params.limit,
              skipNum: (params.pageNumber - 1) * params.limit
            }, op)
          },
        })
      },
      /*获取客户名称*/
      getCustomers() {
        module.getCustomers().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
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
        options = {}
    $(params).each(function (k, v) {
      if (v.name === 'date') {
        options[v.name] = v.value.trim().split('-').join('')
      } else {
        options[v.name] = v.value.trim()
      }
    })
    if (!options.mvTrackId) {
      module.alert("请输入mvTrackId")
      return
    }
    FN.getMvTrackId(options)
  }
  // 初始化
  FN.init()
})