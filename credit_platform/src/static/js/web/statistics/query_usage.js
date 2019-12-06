$(function () {
  let FN = {
    UsageByDate: function (op) {
      module.$http(API.downServicePlat.UsageByDate, op, function () {
        let data = this.resData
        if (module.empty(data)) {
          module.hasDataFunction("#chart1")
          let lineCountTotal = [],
            lineCount = [],
            lineCharge = [],
            dateArray = module.pluck(data, "dayTime")
          for (let i = 0; i < data.length; i++) {
            if (!data[i].usedCount) {
              lineCountTotal.push(0)
            } else {
              lineCountTotal.push(data[i].usedCount)
            }
            lineCount.push(data[i].downChargedCount)
            lineCharge.push(data[i].downCost.toFixed(4))
          }
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
            field: 'dayTime',
            title: '使用日期',
            width: 200,
            sortable: true,
            footerFormatter: function () {
              return "总计"
            },
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
            title: '计费用量',
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
              return eval(module.pluck(data, 'downCost').join("+")).toFixed(4)
            }
          }]
          module.renderChart("#chart1", module.setLineData('按日期统计', dateArray, lineData))
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
          window.onresize = function () {
            module.renderChart("#chart1", module.setLineData('按日期统计', dateArray, lineData)).resize()
          }
        } else {
          module.noDataFunction("#chart1")
        }
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
    /*获取客户名称*/
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
    initFun() {
      module.initTimeFun({
        range: '至'
      })
      FN.getBusinessTypes()
    }
  }

  FN.initFun()

  $('[name="businessType"]').off('change').on('change', function () {
    FN.getCustomers()
  })
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })
  module.clickTree.queryFun = function () {
    $(".query-result").hide()
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {}
      $(params).each(function (k, v) {
        v.name == 'serviceNames' ? (options[v.name] = v.value.trim().split(',')) : (options[v.name] = v.value.trim())
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      $(".tabs .button:first-child").trigger("click")
      FN.UsageByDate(options)
    }
  }
})