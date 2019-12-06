$(function () {
  let serviceNameArr = ['IdNamePhoneCheck', 'MobileOnlineInterval', 'MobileStatus'], /** 只支持这三个服务 */
  FN = {
    mobileOperator: function (op) {
      module.$http(API.logsPlat.mobileOperator, op, function () {
        let data = this.resData
        if (!module.empty(data)) {
          module.noDataFunction("#table1")
          return
        }
        module.hasDataFunction("#table1")
        $.each(data, function (k, v) {
          if (k == 0) {
            $.each(v.dateUsages, function (k1, v1) {
              v1[v.isp] = v1.num
            })
          } else {
            $.each(v.dateUsages, function (k1, v1) {
              data[0].dateUsages[k1][v.isp] = v1.num
            })
          }
        })
        let columns = [{
          field: 'date',
          title: '日期',
          sortable: true,
          footerFormatter: function () {
            return "总计"
          }
        }, {
          field: '电信',
          title: '电信',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, '电信').join("+")) || '0'
          }
        }, {
          field: '移动',
          title: '移动',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, '移动').join("+")) || '0'
          }
        }, {
          field: '联通',
          title: '联通',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, '联通').join("+")) || '0'
          }
        }]
        module.renderTable({
          id: "#table1",
          data: data[0].dateUsages,
          columns: columns
        })
      })
    },
    getCustomers() {
      module.getCustomers().then(res => {
        $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
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
        range: '至'
      })
      FN.getCustomers()
    }
  };
 
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })

  module.clickTree.queryFun = function () {
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {}
      $(params).each(function (k, v) {
        options[v.name] = v.value.trim();
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      if (options.serviceName == '暂无数据') {
        module.alert("请选择接口类型")
        return
      }
      if(!serviceNameArr.includes(options.serviceName)) {
        module.alert("不支持该接口查询")
        return
      }
      if ((Date.parse(options.end) - Date.parse(options.start)) / (1000 * 24 * 3600) > 31) {
        module.alert("时间跨度不能大于一个月")
        return
      }
      $(".tabs .button:first-child").trigger("click")
      FN.mobileOperator(options)
    }
  }
  FN.initFun()
})