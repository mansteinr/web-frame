$(function () {
  let FN = {
    byCustomer: function (op) {
      module.$http(API.downServicePlat.byCustomer, op, function () {
        let data = this.resData
        if (module.empty(data)) {
          module.hasDataFunction("#chart1")
          module.hasDataFunction("#chart2")
          for (let i = 0; i < data.length; i++) {
            data[i].downCost = data[i].downCost.toFixed(4)
            data[i].downChargedCount = data[i].downChargedCount.toFixed(4)
            data[i].Name ? data[i].Name : data[i].loginName
          }
          let type = $('[name=timesAndMoneyUsed]:checked').val() // 统计维度：business - 按行业；customer - 按客户
          FN.renderData(type, data);
        } else {
          module.noDataFunction("#chart1")
          module.noDataFunction("#chart2")
        }
      })
    },
    renderData: function (type, data) {
      if (type == 'business') {
        let businessObj = module.groupBy(data, function (item) {
          return item.customerTypeZh
        });
        let businessArray = []
        for (let name in businessObj) {
          let obj = {}, arr = businessObj[name]
          obj.Name = name;
          obj.downChargedCount = 0
          obj.downCost = 0
          obj.usedCount = 0
          for (let i = 0; i < arr.length; i++) {
            obj.downChargedCount += Number(arr[i].downChargedCount)
            obj.downCost += Number(arr[i].downCost)
            obj.usedCount += Number(arr[i].usedCount)
          }
          obj.downCost = obj.downCost.toFixed(4)
          businessArray.push(obj)
        }
        data = businessArray
      } else {
        let businessObj = module.groupBy(data, function (item) {
          return item.customerName || item.loginName
        }), businessArray = []
        for (let name in businessObj) {
          let obj = {}, arr = businessObj[name]
          obj.Name = name
          obj.downChargedCount = 0
          obj.downCost = 0
          obj.usedCount = 0
          for (let i = 0; i < arr.length; i++) {
            obj.downChargedCount += Number(arr[i].downChargedCount)
            obj.downCost += Number(arr[i].downCost)
            obj.usedCount += Number(arr[i].usedCount)
          }
          obj.downCost = obj.downCost.toFixed(4);
          businessArray.push(obj)
        }
        data = businessArray
      }
      let pieCount = {}, pieCharge = {}
      // 排序 展示前10名
      module.sort(data, 'downChargedCount', 'reverse')

      for (let i = 0; i < 10; i++) {
        if (data[i]) {
          pieCount[data[i].Name] = data[i].downChargedCount
        }
      }
      module.sort(data, 'downCost', 'reverse')
       // 排序 展示前10名
      for (let i = 0; i < 10; i++) {
        if (data[i]) {
          pieCharge[data[i].Name] = data[i].downCost
        }
      }
      let columns1 = [{
        field: 'Name',
        title: '客户名称',
        width: 200,
        sortable: true,
        footerFormatter: function () {
          return "总计"
        }
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
        field: 'Name',
        title: '客户名称',
        width: 200,
        sortable: true,
        footerFormatter: function () {
          return "总计"
        }
      }, {
        field: 'downCost',
        title: '调用金额',
        width: 200,
        sortable: true,
        fomatter(value) {
          return value.toFixed(4)
        },
        footerFormatter: function (data) {
          return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
        }
      }]
      module.renderChart("#chart1", module.setRadiiData('各客户计费调用数量占比', '计费调用数量', pieCount));
      module.renderTable({
        id: "#table1",
        data: data,
        columns: columns1
      })
      module.renderChart("#chart2", module.setRadiiData('各客户调用金额占比', '调用金额', pieCharge));
      module.renderTable({
        id: "#table2",
        data: data,
        columns: columns2
      })
    },
    initFun() {
      module.initTimeFun({
        range: '至'
      })
      module.getService().then(res => {
        $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
      })
    }
  }

  module.clickTree.queryFun = function () {
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {};
      $(params).each(function (k, v) {
        options[v.name] = v.value.trim()
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim();
        options.end = options.rangetime.split("至")[1].trim();
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      $(".tabs .button:first-child").trigger("click");
      FN.byCustomer(options)
    }
  }
  // 初始化
  FN.initFun()
})