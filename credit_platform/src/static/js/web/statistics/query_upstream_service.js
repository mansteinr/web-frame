$(function () {
  let charts = [],
    FN = {
      getOutServiceChargeInfo: function (options) {
        module.$http(API.upServicePlat.getOutServiceChargeInfo, options, function () {
          let json = this.resData
          if (!module.empty(json.companyList)) {
            module.noDataFunction("#chart1")
            module.noDataFunction("#chart2")
            return
          }
          module.hasDataFunction("#chart1")
          module.hasDataFunction("#chart2")
          let companyList = json.companyList
          if (!companyList || (companyList.length == 0)) return;
          let usedCounts = module.pluck(companyList, "usedCount"),
            chargeUsedCouts = module.pluck(companyList, "chargeUsedCount"),
            companys = module.pluck(companyList, "company"),
            companyCosts = module.pluck(companyList, "cost"),
            formatterCompanyCosts = []

          companyCosts.forEach(function (v, k) {
            formatterCompanyCosts.push(v.toFixed(4))
          })

          let customerList = json.customerList, customers = module.pluck(customerList, "loginName"),
            customerCosts = module.pluck(customerList, "cost"),
            formatterCustomerCosts = []

          customerCosts.forEach(function (v, k) {
            formatterCustomerCosts.push(v.toFixed(4))
          })

          let customerCounts = module.pluck(customerList, "usedCount"), customerchargeUsedCouts = module.pluck(customerList, "chargeUsedCount"),
          series1 = [{
            name: '金额',
            type: 'bar',
            data: formatterCompanyCosts
          }, {
            name: '上游调用条数',
            type: 'bar',
            data: usedCounts
          }, {
            name: '上游计费条数',
            type: 'bar',
            data: chargeUsedCouts
          }], 
          title = {
            title: '上游服务调用占比'
          }, 
          series2 = [{
            name: '金额',
            type: 'bar',
            data: formatterCustomerCosts
          }, {
            name: '下游调用条数',
            type: 'bar',
            data: customerCounts
          }, {
            name: '计费条数',
            type: 'bar',
            data: customerchargeUsedCouts
          }]
          , title1 = {
            title: '下游客户调用占比'
          }
          module.renderChart("#chart1", module.setColumnData(title, companys, series1))
          module.renderChart("#chart2", module.setColumnData(title1, customers, series2))

          charts.push(module.renderChart("#chart2", module.setColumnData(title1, customers, series2)))
          charts.push(module.renderChart("#chart1", module.setColumnData(title, companys, series1)))

          let columns1 = [{
            field: 'company',
            title: '上游公司名称',
            width: 200,
            sortable: true,
            footerFormatter: function () {
              return "总计"
            }
          }, {
            field: 'usedCount',
            title: '总调用条数',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'usedCount').join("+")) || '0'
              }
            }
          }, {
            field: 'chargeUsedCount',
            title: '计费条数',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'chargeUsedCount').join("+")) || '0'
              }
            }
          }, {
            field: 'cost',
            title: '小视入账',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'cost').join("+")).toFixed(4) || '0'
              }
            }
          }],
          columns2 = [{
            field: 'customerName',
            title: '下游客户名称（中文）',
            width: 200,
            sortable: true,
            footerFormatter: function () {
              return "总计"
            }
          }, {
            field: 'loginName',
            title: '下游客户名称',
            width: 200,
            sortable: true,
            footerFormatter: function () {
              return "总计"
            }
          }, {
            field: 'usedCount',
            title: '总调用次数',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'usedCount').join("+")) || '0'
              }
            }
          }, {
            field: 'chargeUsedCount',
            title: '计费条数',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'chargeUsedCount').join("+")) || '0'
              }
            }
          }, {
            field: 'cost',
            title: '下游计费',
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                return eval(module.pluck(data, 'cost').join("+")).toFixed(4) || '0'
              }
            }
          }]
          module.renderTable({
            id: "#table1",
            data: companyList,
            columns: columns1
          })
          module.renderTable({
            id: "#table2",
            data: customerList,
            columns: columns2
          })
        })
      },
      initFun() {
        module.initTimeFun({
          range: '至'
        })
        module.getService().then(res => {
          let li = '<li class="dropdown-item  text-warp" data-value = "">全部</li>'
          $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(li + res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
          module.selected()
        })
      }
    }

  FN.initFun()
  /* 查询获取客户名称 */
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {}
      $(params).each(function (k, v) {
        if (v.name == 'serviceName') {
          options[v.name] = v.value.trim().split(',')
        } else {
          options[v.name] = v.value.trim()
        }
      });
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        options.serviceNames = options.serviceName
        if (!options.serviceNames[0]) {
          options.serviceNames = []
        }
        delete options.rangetime
        delete options.serviceName
      } else {
        module.alert("请选择时间区间")
        return
      }
      $(".tabs .button:first-child").trigger("click")
      FN.getOutServiceChargeInfo(options)
    }
  }
  window.onresize = function () {
    for (let i = 0; i < charts.length; i++) {
      charts[i].resize()
    }
  }
})