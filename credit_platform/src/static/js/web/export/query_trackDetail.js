$(function () {
  let FN = {
    trackDetail: function (options) {
      module.downFile(API.logsPlat.trackDetail, options)
    },
    paramFun: function () {
      let tableHeaders = 0
      if ($('.param-item')) {
        tableHeaders = $('.param-item').length + 1
      }
      return `<div class="search-item param-item">
                <label class="input-label">表头${tableHeaders}:</label>
                <div>
                  <input class="m-input param-input param-zh form-input" type="text" placeholder="请输入名称"> &nbsp;:&nbsp; <input placeholder="对应文字"
                    class="m-input param-input form-input" type="text">
                </div>
              </div>`
    },
    getCustomers() {
      module.getCustomers().then(res => {
        $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
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
      // 不允许输入汉字
      $(document).keydown(function (event) {
        if (event.target.className.indexOf('param-zh') > 0) {
          module.keyup({
            selector: 'param-zh',
            reg: /[\u4E00-\u9FA5\uF900-\uFA2D]/g
          })
        }
      })
      module.initTimeFun({
        range: '至'
      })
      FN.getCustomers()
    }
  };
  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  });
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form');
    if (module.checkForm(form)) {
      let params = form.serializeArray(), opt = {}, options = {}
      $(params).each(function (k, v) {
        opt[v.name] = v.value.trim()
      });
      if (opt.rangetime) {
        opt.start = opt.rangetime.split("至")[0].trim()
        opt.end = opt.rangetime.split("至")[1].trim()
        delete opt.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      if (opt.serviceName == '暂无数据') {
        module.alert("请选择接口类型")
        return
      }
      $('.param-item').each(function (k, v) {
        let firstVal = $(v).find('input:first-child').val().trim()
        let lastVal = $(v).find('input:last-child').val().trim()
        if (firstVal || lastVal) {
          options[firstVal] = lastVal
        }
      })
      opt.options = options
      FN.trackDetail(opt)
    }
  }
  module.clickTree.addParam = function () {
    $('.search-space').before(FN.paramFun())
  }
  FN.initFun()
})