$(function () {
  let charts = [],
    FN = {
      /*获取某一用户的某一服务使用情况：按日期维度*/
      UsageByDate: function (op) {
        module.$http(API.downServicePlat.UsageByDate, op, function () {

          let data = this.resData;

          if (!module.empty(data)) {
            module.noDataFunction("#chart1")
            return
          };
          module.hasDataFunction("#chart1")

          let lineCountTotal = [], lineCount = [], lineCharge = []

          data.forEach(v => {
            lineCountTotal.push(v.usedCount)
            lineCount.push(v.downChargedCount)
            lineCharge.push(v.downCost.toFixed(4))
          })
          // 提取x轴
          let xFiled = module.pluck(data, "dayTime"),
            lineData = [{
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
              sortable: true,
              footerFormatter: function () {
                return "总计"
              },
            }, {
              field: 'usedCount',
              title: '共计使用量',
              sortable: true,
              footerFormatter: function (data) {
                return eval(module.pluck(data, 'usedCount').join("+")) || '0'
              }
            }, {
              field: 'downChargedCount',
              title: '计费使用量',
              sortable: true,
              footerFormatter: function (data) {
                return eval(module.pluck(data, 'downChargedCount').join("+")) || '0'
              }
            }, {
              field: 'downCost',
              title: '消费金额',
              sortable: true,
              formatter: function (value, row, index) {
                return value.toFixed(4)
              },
              footerFormatter: function (data) {
                return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
              }
            }]

          module.renderChart("#chart1", module.setLineData('总体情况 - 按日期统计', xFiled, lineData));
          charts.push(module.renderChart("#chart1", module.setLineData('总体情况 - 按日期统计', xFiled, lineData)))
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        })
      },
      byCustomer: function (op) {
        module.$http(API.downServicePlat.byCustomer, op, function () {
          let data = this.resData

          if (!module.empty(data)) {
            module.noDataFunction("#chart2")
            return
          }
          module.hasDataFunction("#chart2")

          let lineCountTotal = [], lineCount = [], lineCharge = []

          data.forEach(v => {
            lineCountTotal.push(v.usedCount)
            lineCount.push(v.downChargedCount)
            lineCharge.push(v.downCost.toFixed(4))
          })

        let xFiled = module.pluck(data, "customerName"),
            lineData = [{
              name: "共计使用量",
              data: lineCountTotal
            }, {
              name: "计费使用量",
              data: lineCount
            }, {
              name: "消费金额",
              data: lineCharge
            }],
            columns = [{
              field: 'customerName',
              title: '客户名称',
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

          module.renderTable({
            id: "#table2",
            data: data,
            columns: columns
          })
          module.renderChart("#chart2", module.setLineData('总体情况 - 按客户统计', xFiled, lineData));
          charts.push(module.renderChart("#chart2", module.setLineData('总体情况 - 按客户统计', xFiled, lineData)))
        })
      }
    }

  /*初始化开始结束时间*/
  module.initTimeFun({
    range: '至'
  })

  module.clickTree.queryFun = function () {
    $(".tabs .button:first-child").trigger("click")
    let form = $(this).closest('form')
    if (module.checkForm(form)) {

      let params = form.serializeArray(), options = {}
      
      $(params).each(function (k, v) {
        if (v.value) {
          options[v.name] = v.value.trim();
        }
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      // 发送请求
      FN.UsageByDate(options)
      FN.byCustomer(options)
    }
  }
  // 屏幕改变时 重新渲染 echats 适配
  window.onresize = function () {
    for (let i = 0; i < charts.length; i++) {
      charts[i].resize()
    }
  }
})