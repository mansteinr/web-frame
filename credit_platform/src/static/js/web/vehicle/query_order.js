$(function () {
  let columns = [{ // 定义列
    field: 'loginname',
    title: '客户名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'orderId',
    title: '订单号',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'vin',
    title: 'vin码',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'datasourcename',
    title: '数据源',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'dataFrom',
    title: '报告状态',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return value / 1 ? '已生成报告' : '未生成报告'
    }
  }, {
    field: 'createTime',
    title: '创建时间',
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value) {
      return module.formaterTime(value, 'yyyymmdd hh:ii:ss')
    }
  }, {
    field: 'updateTime',
    title: '生成报告时间',
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value) {
      return module.formaterTime(value, 'yyyymmdd hh:ii:ss')
    }
  }, {
    field: 'status',
    title: '订单状态',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'upOrderid',
    title: '数据源订单',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'upStatus',
    title: '数据源订单状态',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'servicename',
    title: '服务名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    title: '车保报告',
    valign: 'middle',
    align: 'center',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<div  role="toolbar" aria-label="" data-orderid =${row.orderId}>
        <span  class="link" style="cursor: ${row.dataFrom / 1 ? 'pointer' : 'not-allowed'}"  data-click ="${row.dataFrom / 1 ? 'clickMinivison' : 'io'}">小视</span>
          <span  class="link ml" style="cursor: ${row.dataFrom / 1 ? 'pointer' : 'not-allowed'}" data-click ="${row.dataFrom / 1 ? 'clickSource' : 'io'}">原始</span>
            </div>`
    }
  }],
    FN = {
      /*通过vin码获取信息*/
      getOrderInfoByVin: function (op) {
        module.$http(API.vehicle.getOrderInfoByVin, op, function () {
          module.hasDataFunction("#table1")
          module.renderTable({
            id: "#table1",
            data: module.empty(this.resData) ? this.resData : [],
            columns: columns
          })
        })
      },
      getOrderInfoById: function (op) {  /*通过订单号码获取信息*/
        module.$http(API.vehicle.getOrderInfoById, op, function () {
          let data = []
          module.empty(this.resData) ? data.push(this.resData) : data
          module.hasDataFunction("#table1")
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        })
      },
      downLoadReport: function (op) { // 查看车保报告
        module.$http(API.vehicle.getDecryptData, op, function (e) {
          if (!module.empty(this.resData)) {
            module.alert("暂未查到数据");
            return;
          }
          let that = JSON.parse(this.resData)
          module.popup.show({
            title: '查询',
            content: $("#queryGuid").html(),
            bclose: true,
            style: 'position: absolute;width: 55%;min-width: 610px;top: 20px;left: 40%;margin-top:0;',
            callback: function () {
              let _this = $(this),
                jsonContainer = _this.find('#jsonView').get(0),
                editor = new JSONEditor(jsonContainer, {
                mode: 'view'
              })
              editor.set(that)
              $(document).find('.jsoneditor-expand-all').click()
              $(document).find('.jsoneditor-navigation-bar').remove()
            }
          })
        })
      },
      getCustomers() {
        module.getCustomers().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
        })
      },
      initFun() {
        laydate.render({
          elem: '#startTime',
          theme: '#00c2de',
          type: 'datetime',
          min: '2017-03-15',
          value: module.formaterTime(+new Date() - 60 * 60 * 1000, 'yyyy-mm-dd hh:ii:ss')
        })
        laydate.render({
          elem: '#endTime',
          theme: '#00c2de',
          type: 'datetime',
          min: '2017-03-15',
          value: module.formaterTime(+new Date(), 'yyyy-mm-dd hh:ii:ss')
        })
        // 获取所有的客户名称
        FN.getCustomers()
        module.viewImage()
        $('.' + $('.condition').find('li.active').data('value')).show()
        $('.' + $('.condition').find('li:not(.active)').data('value')).hide()
        $('.quick-search').on('change', function () { // 根据下拉改变参数显示
          $('[name="loginName"]').closest('.select-dropdown').removeClass('active')
          $('.' + $(this).siblings('ul').find('li.active').data('value')).show()
          $('.' + $(this).siblings('ul').find('li:not(.active)').data('value')).hide()
        })
      }
    }

  FN.initFun()

  module.clickTree.queryFun = function () {
    let form = $(this).closest('form'),
        slelctedValue = form.find('.condition li.active').data('value'),
        options = {}
    if (slelctedValue === 'orderId') { // 判断是通过订单号还是vin码请求，防止不必要的请求
      options.orderId = $('[name="orderId"]').val().trim() // 获取订单号 必输项
      if (!options.orderId) {
        module.alert('请输入订单号')
        return
      }
      FN.getOrderInfoById(options)
    } else {
      options.vin = $('[name="vin"]').val().trim()
      options.startTime = $('[name="startTime"]').val().trim()
      options.endTime = $('[name="endTime"]').val().trim()
      options.loginName = $('[name="loginName"]').val().trim()
      if (!options.vin) {
        module.alert('请输入vin码') // 获取vin码 必输项 其他为非必输项
        return
      }
      FN.getOrderInfoByVin(options)
    }
  };

  let options = {}
  options.orderCategory = '0' // 这个参数是固定不变的
  /* 下载小视报告 */
  module.clickTree.clickMinivison = function () {
    options.orderId = $(this).closest('div').data('orderid') // 获取订单号
    options.dataSource = '0' // o代表小视
    FN.downLoadReport(options)
  }
  /* 下载原数据报告 */
  module.clickTree.clickSource = function () {
    options.orderId = $(this).closest('div').data('orderid')// 获取订单号
    options.dataSource = '1' // o代表源数据
    FN.downLoadReport(options)
  }
})