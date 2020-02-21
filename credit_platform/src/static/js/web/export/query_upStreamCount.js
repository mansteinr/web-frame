$(function () {
  /** 服务不能全选 后台循环太多 扛不住 
   *  明细不支持跨天查询
  */
  let FN = {
    upStreamCount: function (options) {
      delete options.loginName
      module.$http(API.logsPlat.upStreamCount, options, function () {
        let data = this.resData.dateUsages
        if (!module.empty(data)) {
          module.noDataFunction("#table1")
          return
        }
        module.hasDataFunction("#table1")
        let columns = [{
          field: 'date',
          title: '时间',
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'num',
          title: '单日调用量',
          sortable: true,
          footerFormatter: function (data) {
            return eval(module.pluck(data, 'num').join("+")) || '0'
          }
        }]
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns
        })
      })
    },
    downFile(options) {
      if (options.start !== options.end) {
        module.alert('不支持跨天查询')
        return
      }
      module.downFile(API.logsPlat.upStreamDetail, options, 'post')
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
        module.selected()
      })
    },
    initFun() {
      module.initTimeFun({
        range: '至'
      })
      FN.getCustomers()
    }
  }
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
          options[v.name] = v.value.trim()
        }
      });
      options.serviceNames = options.serviceName
      if (!options.serviceNames[0]) {
        options.serviceNames = []
      }
      delete options.serviceName
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      if (options.serviceNames[0] == '暂无数据') {
        module.alert("接口类型不能为空")
        return
      }
      $(".tabs .button:first-child").trigger("click")
      if (!options.upStream) {
        module.alert('请输入上游通道名称')
        return
      }
      delete options.dimension
      if ($('[name="dimension"]:checked').val() === '0') {
        FN.downFile(options)
      } else {
        FN.upStreamCount(options)
      }
    }
  }
  // 初始化
  FN.initFun()
})