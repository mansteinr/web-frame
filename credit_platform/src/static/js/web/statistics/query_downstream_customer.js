$(function () {
  let FN = {
    UsageByName: function (op) {
      module.$http(API.downServicePlat.UsageByName, op, function () {
        let data = this.resData, nameArray = []
        if (!module.empty(data)) {
          module.noDataFunction("#chart1")
          module.noDataFunction("#chart2")
          return
        }
        module.hasDataFunction("#chart1")
        module.hasDataFunction("#chart2")
        data.forEach(v => {
          v.downCost = v.downCost.toFixed(4)
          nameArray.push(v.serviceNameZh)
        })
        let pieCount = {}, pieCharge = {}

        data.sort(function (a, b) {
          return -(a.downChargedCount - b.downChargedCount);
        })
        for (let i = 0; i < 10; i++) {
          if (data[i]) {
            pieCount[data[i].serviceNameZh] = data[i].downChargedCount
          }
        }
        data.sort(function (a, b) {
          return -(a.downCost - b.downCost);
        })
        for (let i = 0; i < 10; i++) {
          if (data[i]) {
            pieCharge[data[i].serviceNameZh] = data[i].downCost
          }
        }
        
        let columns1 = [{
          field: 'serviceName',
          title: '服务名称',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'serviceNameZh',
          title: '服务名称(中文)',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "-"
          },
        }, {
          field: 'downChargedCount',
          title: '计费调用条数',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'downChargedCount').join("+")) || '0'
          }
        }, {
          field: 'usedCount',
          title: '总调用条数',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'usedCount').join("+")) || '0'
          }
        }],
        columns2 = [{
          field: 'serviceName',
          title: '服务名称',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'serviceNameZh',
          title: '服务名称(中文)',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "-"
          },
        }, {
          field: 'downCost',
          title: '调用金额',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
          }
        }]
        module.renderChart("#chart1", module.setRadiiData('Top10各服务计费调用数量占比', '计费调用数量', pieCount));
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns1
        })
        module.renderChart("#chart2", module.setRadiiData('Top10各服务调用金额占比', '调用金额', pieCharge));
        module.renderTable({
          id: "#table2",
          data: data,
          columns: columns2
        })
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
    getCustomers() {
      /*获取行业名称*/
      module.getCustomers().then(res => {
        let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
        $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
      })
    },
    initFun() {
      /*初始化开始结束时间*/
      module.initTimeFun({
        range: '至'
      })
      FN.getBusinessTypes()
    }
  }
  FN.initFun()

  /*行业类型变化*/
  $('[name="businessType"]').off('change').on('change', function () {
    FN.getCustomers()
  })
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
        return
      }
      $(".tabs .button:first-child").trigger("click")
      FN.UsageByName(options);
    }
  }
})