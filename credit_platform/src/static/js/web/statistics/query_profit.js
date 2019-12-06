$(function () {
  let columns3 = [{
    field: 'pipeName',
    title: '通道',
    width: 280,
    footerFormatter: function () {
      return "总计"
    }
  },{
    field: 'callNum',
    title: '调用总量',
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'callNum').join("+")) || '0'
    }
  },{
    field: 'chargeNum',
    title: '计费调用量',
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'chargeNum').join("+")) || '0'
    }
  },{
    field: 'timeoutNum',
    title: '超时调用量',
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'timeoutNum').join("+")) || '0'
    }
  },{
    field: 'cost',
    title: '消费金额',
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'cost').join("+")).toFixed(4) || '0'
    }
  }] ,
  columns = [{
    field: 'dayTime',
    title: '日期',
    width: 200,
    footerFormatter: function () {
      return "总计"
    }
  },  {
    field: 'serviceName',
    title: '服务名称',
    width: 200,
    footerFormatter: function () {
      return "-"
    }
  }, {
    field: 'serviceName',
    title: '服务名称(中文)',
    width: 200,
    formatter: function(value) {
      return dictionary[value]
    },
    footerFormatter: function () {
      return "-"
    }
  }, {
    field: 'callNum',
    title: '调用总量',
    width: 200,
    sortable: true,
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'callNum').join("+")) || '0'
    }
  }, {
    field: 'downChargeNum',
    title: '下游计费条数',
    width: 200,
    sortable: true,
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'downChargeNum').join("+")) || '0'
    }
  }, {
    field: 'downCost',
    title: '下游计费',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
    }
  }, {
    field: 'upCost',
    title: '上游计费',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'upCost').join("+")).toFixed(4) || '0'
    }
  },{
    field: 'margin',
    title: '利润',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'margin').join("+")).toFixed(4) || '0'
    }
  }, {
    field: '明细',
    title: '明细',
    width: 200,
    footerFormatter: function () {
      return "-"
    },
    formatter: function (value, row, index) {
      return `<span class="link" data-row=${JSON.stringify(row.upDetail)} data-click="detail">查看</span>`
    }
  }],
  columns2 = [{
    field: 'serviceName',
    title: '服务名称',
    width: 200,
    footerFormatter: function (data) {
      return "总计"
    },
  }, {
    field: 'serviceName',
    title: '服务名称(中文)',
    width: 200,
    formatter: function(value) {
      return dictionary[value]
    },
    footerFormatter: function () {
      return "-"
    }
  }, {
    field: 'callNum',
    title: '调用总量',
    width: 200,
    sortable: true,
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'callNum').join("+")) || '0'
    }
  }, {
    field: 'downChargeNum',
    title: '下游计费条数',
    width: 200,
    sortable: true,
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'downChargeNum').join("+")) || '0'
    }
  }, {
    field: 'downCost',
    title: '下游计费',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'downCost').join("+")).toFixed(4) || '0'
    }
  }, {
    field: 'upCost',
    title: '上游计费',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'upCost').join("+")).toFixed(4) || '0'
    }
  },  {
    field: 'margin',
    title: '利润',
    width: 200,
    sortable: true,
    formatter: function(value, row, index) {
      return value.toFixed(4)
    },
    footerFormatter: function (data) {
      return eval(module.pluck(data, 'margin').join("+")).toFixed(4) || '0'
    }
  }, {
    field: '明细',
    title: '明细',
    width: 200,
    formatter: function (value, row, index) {
      return `<span class="link" data-row=${JSON.stringify(row.upDetail)} data-click="detail">查看</span>`
    },
    footerFormatter: function (data) {
      return '-'
    }
  }],
  dictionary = {},
   FN = {
    getService: function () {
      module.$http(API.commomApi.services, {}, function () {
        this.resData.map( v => {
          dictionary[v.serviceName] = v.serviceNameZh
        })
      })
    },
    mergeTable: function() {
      module.mergeTable('dayTime', "#table1")
    },
    queryProfit: function (options) {
      module.$http(API.others.queryProfit, options, function () { /** 请求利润 */
        $('.chartArea').removeClass('active')
          // 每日详情
        let everyDay = [], total = []
        total = this.resData.collectInfos 
        for(let k in this.resData.dayInfos) {
          if (this.resData.dayInfos[k].length) {
            this.resData.dayInfos[k].forEach((v,k1) => {
              everyDay = [...everyDay, v]
            })
          }
        }
        if (everyDay.length) {
          everyDay.sort((a,b) => {
            return a.dayTime -b.dayTime
          })
        }
        $("#table1").html('')
        // 汇总
        let coloneColumns = [...columns], coloneColumns2 = [...columns2]
        if ($('[name="groupByCode"]:checked').val() === '1') {
          coloneColumns.splice(2, 0 , {
              field: 'result',
              title: 'result',
              width: 200,
              footerFormatter: function () {
                return "-"
              }
            },  {
              field: 'resultCode',
              title: 'resultCode',
              width: 200,
              footerFormatter: function () {
                return "-"
              }
            })
          coloneColumns2.splice(1, 0 , {
              field: 'result',
              title: 'result',
              width: 200,
              footerFormatter: function () {
                return "-"
              }
            },  {
              field: 'resultCode',
              title: 'resultCode',
              width: 200,
              footerFormatter: function () {
                return "-"
              }
            })
        }
        module.renderTable({
          id: "#table1",
          data: everyDay,
          columns: coloneColumns,
          pageNumber: 1,
          onSort: FN.mergeTable,
          onPageChange: FN.mergeTable
        })
        $("#table2").html('')
        module.renderTable({
          id: "#table2",
          data: total,
          columns: coloneColumns2,
          pageNumber: 1,
          onSort: FN.mergeTable,
          onPageChange: FN.mergeTable
        })
        module.mergeTable('dayTime', "#table1") /** 合并单元格 */
      })
    },
    /*获取客户名称*/
    getCustomers() {
      module.getCustomers().then(res => {
        $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
        FN.hasServices()
      })
    },
    hasServices() {
      module.hasServices().then(res => {
        let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
        $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
        module.selected()
      })
    },
    initFun: function() {
      /*获取客户名称*/
      module.initTimeFun({
        range: '至'
      })
      FN.getCustomers()
      FN.getService()
    }
  }
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })
  /*查询*/
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form')
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {};
      $(params).each(function (k, v) {
        if (v.name == 'serviceName') {
          options[v.name] = v.value.trim().split(',')
        } else {
          options[v.name] = v.value.trim();
        }
      });
      if (options.serviceName[0] === '') {
        options.serviceNames = []
      } else {
        options.serviceNames = options.serviceName
      }
      delete options.serviceName;
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime;
      } else {
        module.alert("请选择时间区间")
        return
      }
      if (+new Date(options.start) < +new Date('2019-03-01')) {
        module.alert("起始时间请从2019-03-01开始")
        return
      }
      FN.queryProfit(options)
    }
  }
  module.clickTree.detail = function() { // 查看上游明显
    let data = $(this).data('row')
    module.popup.show({
      title: '上游详情',
      bclose: true,
      content: $("#popupAddHtmlAdd").html(),
      style: 'width:80%;margin-left:-40%;',
      callback: function () {
        module.renderTable({
          id: $(this).find('#table3'),
          data: data,
          columns: columns3
        })
      }
    })
  }
  // 初始化函数
  FN.initFun()
})