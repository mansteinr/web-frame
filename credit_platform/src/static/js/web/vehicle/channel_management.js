$(function () {
  let columns = [{
    field: 'supplierChannelName',
    title: '通道名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'forbiddenFlag',
    title: '状态',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value, row, index) {
      return `<span class='${value / 1 ? "noColor" : "isColor"}' data-index=${index}  data-forbidden="${value}"> ${value / 1 ? '禁止中' : '使用中'}</span>`
    }
  }, {
    field: 'forbiddenFlag',
    title: '操作',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value, row, index) {
      return `<div  role="toolbar">
                <span  class="link" data-index=${index}  data-forbidden="${value}" data-click ="saveChannel"> ${value / 1 ? '开启' : '禁止'}</span>
          </div>`
    }
  }],
  paramObj = {},
  FN = {
    saveChannle: function(selector) {
      selector.each(function (k, v) {
        paramObj.supplierServiceInfos[k].supplierChannelName = $(v).find('td:first-child').text()
        paramObj.supplierServiceInfos[k].priority = k + ''
        paramObj.supplierServiceInfos[k].forbiddenFlag = $(v).find('td:last-child span').data('forbidden')
      })
      paramObj.forbiddenFlag = $('[name="forbiddenFlag"]').prop('checked')?'0':'1'
      module.$http(API.vehicle.alterAbilitySupplilerInfo, paramObj, function () {
        $('[name="serviceId"]').trigger('change')
        module.alert(this.resMsg[0].msgText)
      })
    }
  }

  // 切换服务时 重新拉去数据
  $('[name="serviceId"]').off('change').on('change', function() { 
    module.$http(API.vehicle.getAbilitySupplilerInfo, {serviceId: $(this).val()}, function() {
      let data = this.resData.supplierServiceInfos
      if (!module.empty(data)) {
        module.noDataFunction("#table1")
        $('.channel-save').hide()
        return
      }
      $('.channel-save').show()
      module.hasDataFunction("#table1")
      paramObj = JSON.parse(JSON.stringify(this.resData)) // 保存修改参数结构
      module.renderTable({
        id: "#table1",
        data: this.resData.supplierServiceInfos,
        columns: columns
      })
      $('#app').find('[type="checkbox"]').prop('checked', this.resData.forbiddenFlag === '0'? true:false)
    })
  })

  // 查询
  module.clickTree.queryFun = function() {
    paramObj.forbiddenFlag = $('[name="forbiddenFlag"]').prop('checked')?'0':'1'
    module.$http(API.vehicle.alterAbilitySupplilerInfo, paramObj, function () {
      $('[name="serviceId"]').trigger('change')
      module.alert(this.resMsg[0].msgText)
    })
  }

    //规则排序
  $('#table1').off('click').on('click', function (e) {
    let el = $(e)[0].target.closest('tr') // 判断是否更改顺序
    module.tableDnD(el)
  })

  // 保存
  module.clickTree.saveFun = function() {
    FN.saveChannle($('table').find('tbody tr'))
  }

  // 保存通道
  module.clickTree.saveChannel = function() {
    let forbiddenFlag = $(this).data('forbidden') + '', 
        index = $(this).data('index'), 
        title = forbiddenFlag / 1 ? '开启': '禁止'
    module.confirm({
      title: title,
      info: `确认${title}该通道？`,
      status: 0,
      callback: function () {
        paramObj.supplierServiceInfos[index].forbiddenFlag = forbiddenFlag === '0' ? '1' : '0'
        module.$http(API.vehicle.alterAbilitySupplilerInfo, paramObj, function () {
          $('[name="serviceId"]').trigger('change')
          module.alert(this.resMsg[0].msgText)
        })
      }
    })
  }
  module.getAllAbilityInfo('serviceId')
})