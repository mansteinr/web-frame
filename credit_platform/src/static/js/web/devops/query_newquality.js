$(function () {
  let limitTime = '2018-07-24', // 只能查该日期之后
  FN = {
    getResults: function (op) {
      module.$http(API.downServicePlat.UsageByResultNew, op, function () {
        let data = this.resData
        if (!module.empty(data)) {
          module.noDataFunction("#chart1")
          return
        }
        module.hasDataFunction("#chart1")

        let lineCountTotal = [], lineCount = [], lineCharge = [], dateArray = []

        for (let i = 0; i < data.length; i++) {
          data[i].downCost = Math.floor(data[i].downCost * 10000) / 10000;
          lineCountTotal.push(data[i].usedCount)
          lineCount.push(data[i].downChargedCount)
          lineCharge.push(data[i].downCost.toFixed(4))
        }
        data.forEach(function (v, k) {
          if (v.resultCode) {
            dateArray.push(v.result + ':' + v.resultCode)
          } else {
            dateArray.push(v.result)
          }
        })
        let lineData = [{
          name: '共计使用量',
          data: lineCountTotal
        }, {
          name: '计费使用量',
          data: lineCount
        }, {
          name: '消费金额',
          data: lineCharge
        }],
        columns = [{
          field: 'serviceName',
          title: '服务名',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "总计"
          }
        }, {
          field: 'serviceNameZh',
          title: '服务名称',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "-"
          }
        }, {
          field: 'result',
          title: 'RESULT',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "-"
          }
        }, {
          field: 'resultCode',
          title: 'resultCode',
          width: 200,
          sortable: true,
        }, {
          field: 'usedCount',
          title: '共计使用量',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'usedCount').join("+")) || '0'
          }
        }, {
          field: 'downChargedCount',
          title: '计费使用量',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'downChargedCount').join("+")) || '0'
          }
        }, {
          field: 'downCost',
          title: '消费金额',
          width: 200,
          sortable: true,
          formatter: function (value, row, index) {
            return value.toFixed(4)
          },
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
          }
        }]
        module.renderChart("#chart1", module.setLineData('按RESULT统计', dateArray, lineData));
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns
        })
      })
    },
    getBusinessTypes() {
      /*获取行业类型*/
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
    init() {
      module.initTimeFun({
        range: '至'
      })
      /*查看图片*/
      module.viewImage()
      FN.getBusinessTypes()
    }
  }

  FN.init()

  $('[name="businessType"]').off('change').on('change', function () {
    FN.getCustomers()
  })
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })
  module.clickTree.queryFun = function () {
    $('.button-group.tabs .button.margin-r5').trigger("click")
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {}
      $(params).each(function (k, v) {
        options[v.name] = v.value.trim()
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        if (+new Date(options.start) < +new Date(limitTime)) {
          options.start = limitTime
        }
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      FN.getResults(options)
    }
  }
})