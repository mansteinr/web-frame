$(function () {
  let FN = {
    getCustomerChargeInfo: function (op) {
      module.$http(API.upServicePlat.getCustomerChargeInfo, op, function () {
        let data = this.resData
        if (!module.empty(data.outServiceList)) {
          module.noDataFunction("#chart1")
          return
        }
        module.hasDataFunction("#chart1")
        let myList = data.outServiceList
        if (!myList || (myList.length == 0)) return
        let outServiceNames = module.pluck(myList, "outServiceName")
        for (let j = 0; j < myList.length; j++) {
          myList[j].downCost = myList[j].downCost.toFixed(4)
        }
        let downCosts = module.pluck(myList, "downCost"),
            usedCounts = module.pluck(myList, "usedCount"),
            chargeUsedCounts = module.pluck(myList, "chargeUsedCount"),
            series = [{
              name: '下游计费',
              type: 'bar',
              data: downCosts
            }, {
              name: '下游总调用次数',
              type: 'bar',
              data: usedCounts

            }, {
              name: '计费条数',
              type: 'bar',
              data: chargeUsedCounts
            }],
        title = {
          title: '下游客户调用次数和费用'
        },
        chart1 = module.renderChart("#chart1", module.setColumnData(title, outServiceNames, series)),
        columns1 = [{
          field: 'outServiceName',
          title: '服务名称',
          footerFormatter: function () {
            return "总计"
          }
        }, {
          field: 'serviceNameZh',
          title: '服务名称(中文)',
          footerFormatter: function () {
            return "-"
          }
        }, {
          field: 'usedCount',
          title: '总调用条数',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'usedCount').join("+")) || '0'
          }
        }, {
          field: 'chargeUsedCount',
          title: '计费条数',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'chargeUsedCount').join("+")) || '0'
          }
        }, {
          field: 'downCost',
          title: '下游计费',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
          }
        }]
        module.renderTable({
          id: "#table1",
          data: myList,
          columns: columns1
        })
        let chart2 = null,
            columns2 = [{
          field: 'company',
          title: '上游公司名称',
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'usedCount',
          title: '上游总调用条数',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            if (data.length != 0) {
              return eval(module.pluck(data, 'usedCount').join("+")) || '0'
            } else {
              $('.fixed-table-footer').remove()
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
            } else {
              $('.fixed-table-footer').remove();
            }
          }
        }, {
          field: 'cost',
          title: '上游计费',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            if (data.length != 0) {
              return eval(module.pluck(data, 'cost').join("+")).toFixed(4) || '0'
            } else {
              $('.fixed-table-footer').remove();
            }
          }
        }];
        chart1.on('click', function (params) {
          $(".my-card").addClass("active").find('.tabs .button:first-child').trigger('click');
          module.hasDataFunction("#chart2")
          if (params.seriesName === '下游计费') {
            let index = params.dataIndex, sname = myList[index].outServiceName, myList2 = myList[index].companyList, costs = []
            for (let i = 0; i < myList2.length; i++) {
              let obj = {}
              for (let j in myList2[i]) {
                if (j === 'cost') obj.value = myList2[i][j].toFixed(4)
                if (j === 'company') obj.name = myList2[i][j]
              }
              costs.push(obj)
            };
            let obj = {
              legend: module.pluck(myList2, 'company'),
              name: "上游计费",
              data: costs
            };
            chart2 = module.renderChart("#chart2", module.setPieData(sname + '上游调用费用详细信息', obj));
            module.renderTable({
              id: "#table2",
              data: myList2,
              columns: columns2
            })
          } else if (params.seriesName === '下游总调用次数') {
            let index = params.dataIndex, sname = myList[index].outServiceName, myList2 = myList[index].companyList, costs = []
            for (let i = 0; i < myList2.length; i++) {
              let obj = {}
              for (let j in myList2[i]) {
                if (j === 'usedCount') {
                  obj.value = myList2[i][j].toFixed(4)
                }
                if (j === 'company') obj.name = myList2[i][j]
              }
              costs.push(obj)
            }
            let obj = {
              legend: module.pluck(myList2, 'company'),
              name: "总调用条数",
              data: costs
            };
            chart2 = module.renderChart("#chart2", module.setPieData(sname + '上游调用次数占比', obj))
            module.renderTable({
              id: "#table2",
              data: myList2,
              columns: columns2
            })
          } else if (params.seriesName === '计费条数') {
            let index = params.dataIndex, sname = myList[index].outServiceName, myList2 = myList[index].companyList, costs = []
            for (let i = 0; i < myList2.length; i++) {
              let obj = {}

              for (let j in myList2[i]) {
                if (j === 'chargeUsedCount') {
                  obj.value = myList2[i][j].toFixed(4);
                }
                if (j === 'company') obj.name = myList2[i][j]
              }
              costs.push(obj)
            }
            let obj = {
              legend: module.pluck(myList2, 'company'),
              name: "计费条数",
              data: costs
            };
            chart2 = module.renderChart("#chart2", module.setPieData(sname + '下游调用次数占比', obj));
            module.renderTable({
              id: "#table2",
              data: myList2,
              columns: columns2
            })
          }
        })
        window.onresize = function () {
          if (chart2) {
            chart2.resize()
          }
          chart1.resize()
        }
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
    getBusinessTypes() {
      /*获取行业类型*/
      module.getBusinessTypes().then(res => {
        let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
        $('[name="businessType"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="businessType"]').closest('.search-item'))
        this.getCustomers()
      })
    },
    initFun() {
      /* 初始化开始结束时间 */
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

  /*行业类型变化*/
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form');
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {};
      $(params).each(function (k, v) {
        options[v.name] = v.value.trim()
      });
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return;
      }
      $(".tabs .button:first-child").trigger("click")
      FN.getCustomerChargeInfo(options)
    }
  }
})