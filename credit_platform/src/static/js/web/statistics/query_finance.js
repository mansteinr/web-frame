$(function () {
  /*获取客户名称*/
  let columns = [{
    field: 'dateTime',
    title: '时间',
    width: 200,
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'balance',
    title: '余额',
    width: 200,
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'diffValue',
    title: '差额',
    width: 200,
    sortable: true,
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }],
    columns2 = [{
      field: 'dateTime',
      title: '充值时间',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'curBalance',
      title: '当前余额',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'actualRechargeAmount',
      title: '实际充值金额',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'extRechargeAmount',
      title: '附加充值金额',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'packRechargeAmount',
      title: '包年包月充值金额',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'preBalance',
      title: '充值前金额',
      width: 200,
      sortable: true,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'operator',
      title: '经办人',
      width: 200,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }, {
      field: 'remark',
      title: '说明',
      width: 200,
      footerFormatter: function () {
        $('.fixed-table-footer').remove()
      }
    }],
    loginNameObj = {},
    FN = {
      /* 获取所有的客户名称  */
      getAllCustomers: function () {
        module.$http(API.commomApi.customers, {}, function () {
          if (this.resData.length) {
            this.resData.forEach(v => {
              loginNameObj[v.loginName] = v.customerName
            })
          }
        })
      },
      /* 余额快照  */
      getBalanceSnapshot: function (options) {
        module.$http(API.downServicePlat.getBalanceSnapshot, options, function () {
          $('#table1').closest('.chartArea').removeClass('active')
          let columnsCopy = [...columns], time = $('[name="rangetime"]').val()
          if (time.split('至')[0].trim() === time.split('至')[1].trim()) {

            columnsCopy.unshift({
              field: 'customerName',
              title: '客户名称(中文)',
              width: 200,
              sortable: true,
              formatter: function (value) {
                return loginNameObj[value]
              },
              footerFormatter: function () {
                $('.fixed-table-footer').remove()
              }
            })

            columnsCopy.unshift({
              field: 'customerName',
              title: '客户名称',
              width: 200,
              sortable: true,
              footerFormatter: function () {
                $('.fixed-table-footer').remove()
              }
            })
          }
          module.renderTable({
            id: "#table1",
            data: this.resData,
            columns: columnsCopy
          })
        })
      },
      // 充值记录
      chargeLog: function (options) {
        module.$http(API.downServicePlat.chargeLog + '/' + options, {}, function () {
          $('#table2').closest('.chartArea').removeClass('active')
          module.renderTable({
            id: "#table2",
            data: this.resData,
            columns: columns2
          })
        }, {
          type: 'get'
        })
      },
      /*获取客户名称*/
      getCustomers(selector = 'loginName') {
        module.getCustomers().then(res => {
          let lis = ''
          if (selector === 'loginNames') {
            lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>'
          }
          $('[name="' + selector + '"]').closest('.select-dropdown').find('.dropdown-menu').html(lis + res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="' + selector + '"]').closest('.search-item'))
          if (selector === 'loginNames') {
            lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>'
          }
          if (selector === 'loginNames') {
            // 多选单选逻辑关系
            module.selected('loginNames')
          }
        })
      },
      initFun() {
        FN.getCustomers()
        FN.getAllCustomers()
        $('.radio-loginName').show()
        $('.multiple-loginName').hide()
        $('.charge-log').show()
        $('[data-value="last-7"]').trigger('click')
      }
    }

  // 初始化时间
  module.initTimeFun({
    range: '至',
    done: (value, date, endDate) => {
      let timeStart = value.split("至")[0].trim(), timeEnd = value.split("至")[1].trim()
      if (timeStart === timeEnd) { // 同一天 可以选择多个客户
        $('.radio-loginName').hide()
        $('.multiple-loginName').show()
        $('.charge-log').hide()
        FN.getCustomers('loginNames')
      } else { // 时间段 只能选择一个客户 并显示充值记录
        $('.radio-loginName').show()
        $('.multiple-loginName').hide()
        $('.charge-log').show()
        FN.getCustomers()
      }
    }
  })
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form');
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {};
      $(params).each(function (k, v) {
        if (v.value) {
          options[v.name] = v.value.trim();
        }
      })
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim();
        options.end = options.rangetime.split("至")[1].trim();
        delete options.rangetime
      } else {
        module.alert("请选择时间区间")
        return
      }
      if (options.start === options.end) { // 同一天
        options.loginNames = $('[name="loginNames"]').val().trim()
        if (options.loginNames === '') { // 如果未空 则代表选择宣布 需要传个空数组
          options.loginNames = []
          $('.charge-log').hide()
        } else {
          options.loginNames = options.loginNames.split(',')
          if (options.loginNames.length === 1) {
            // 只有选中一个客户时  才允许请求充值记录 否则不能
            $('.charge-log').show()
            FN.chargeLog(options.loginNames[0])
          } else {
            $('.charge-log').hide()
          }
        }
      } else {
        // 多天的可以请求充值记录
        options.loginNames = []
        FN.chargeLog(options.loginName)
        options.loginNames.push(options.loginName)
      }
      delete options.loginName
      FN.getBalanceSnapshot(options)
    }
  }

  // 快速查询：最近7天，最近一个月等等
  $(document).off('change').on('change', '.quick-search1', function () {
    let day = $(this).val().split('-')[1]
    if (day == "all") {
      day = (Date.parse(new Date()) - Date.parse('2017-3-15')) / (24 * 3600 * 1000);
    };
    let timestamp_today_last = Date.parse(new Date()) - day * 24 * 3600 * 1000,
      start = module.formaterTime(timestamp_today_last),
      end = module.formaterTime(new Date());
    $('[name="rangetime1"]').val(start + ' 至 ' + end);
    $('.radio-loginName').show()
    $('.multiple-loginName').hide()
    $('.charge-log').show()
  })
  /** 初始化 */
  FN.initFun()
})