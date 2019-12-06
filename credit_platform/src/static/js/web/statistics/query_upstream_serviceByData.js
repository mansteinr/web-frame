$(function () {
  let FN = {
    getOutServiceChargeInfoByDay: function (options) {
      module.$http(API.upServicePlat.getOutServiceChargeInfoByDay, options, function () {
        let data = this.resData.serviceList;
        if (!module.empty(data)) {
          module.noDataFunction("#table1")
          return
        }
        module.hasDataFunction("#table1")
        //获取所有的KEY值          去重1
        let arrData = [], arrTableHeader = [], arrTable = [], arrTem = [], lastTemLast = []
        //改造数组结构
        data.forEach(function (v, k) {
          v.dateList.forEach(function (v1, k1) {
            let obj = {};
            obj.dateTime = v1.dateTime;
            obj.chargeUsedCouts = v1.chargeUsedCount;
            obj.outServiceName = v.outServiceName;
            v1.companyList.forEach(function (v2, k2) {
              obj[v2.company] = v2.chargeUsedCount
            });
            arrData.push(obj)
          })
        });
        data = arrData

        data.forEach(function (v, k) {
          for (m in v) {
            arrTableHeader.push(m)
          }
        })
        for (let i = 0; i < arrTableHeader.length; i++) {
          if (arrTable.indexOf(arrTableHeader[i]) == -1) {
            arrTable.push(arrTableHeader[i])
          }
        }
        arrTable.forEach(function (v, k) {
          if (v == 'dateTime' || v == 'outServiceName' || v == 'chargeUsedCouts') {
            console.log(1)
          } else {
            arrTem.push(v)
          }
        })
        lastTemLast.push({
          field: 'dateTime',
          title: '日期',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'chargeUsedCouts',
          title: '计费调用总量',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            if (data.length != 0) {
              return eval(module.pluck(data, 'chargeUsedCouts').join("+")) || '0'
            }
          }
        })
        arrTem.forEach(function (v, k) {
          lastTemLast.push({
            field: v,
            title: v,
            width: 200,
            sortable: true,
            footerFormatter: function (data) {
              if (data.length != 0) {
                let countTemp = [], loopArr = []
                data.forEach(item => {
                  if (v) {
                    if (item[v]) {
                      loopArr.push(eval(item[v]))
                    }
                  }
                })
                $(loopArr).each(function (index, el) {
                  if (typeof (el) != 'undefined' || el == 0) {
                    countTemp.push(el)
                  }
                });
                return eval(countTemp.join("+")) || '0'
              }
            }
          })
        })
        let columns1 = lastTemLast
        module.renderTable({
          id: "#table1",
          data: data,
          columns: columns1
        })
      })
    },
    /*获取服务对应上游信息的每天详细统计信息(导出excel表格)*/
    // 该接口不需要传服务名
    getAllOutServiceChargeInfo: function (options) {
      let start = options.start.replace(/-/g, ''), end = options.end.replace(/-/g, '');
      if ((Date.parse(options.end) - Date.parse(options.start)) / (1000 * 24 * 3600) > 31) {
        module.alert("时间跨度不能大于一个月");
        return
      }
      let url = API.upServicePlat.getAllOutServiceChargeInfo + "?start=" + options.start + "&serviceNames='null'&end=" + options.end + "&loginName=" + options.loginName;
      module.downFile(url, {
        start,
        end
      }, 'get')
    },
    getCustomers() {
      /*获取行业类型  没有全部选项*/
      module.getCustomers().then(res => {
        $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
        this.hasServices()
      })
    },
    hasServices() {
      module.hasServices().then(res => {
        let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
        $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
        module.selected('serviceName')
      })
    },
    initFun() {
      module.initTimeFun({
        range: '至'
      })
      FN.getCustomers()
    }
  };
  FN.initFun()
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
      options.serviceNames = options.serviceName;
      delete options.serviceName;
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim()
        options.end = options.rangetime.split("至")[1].trim()
        delete options.rangetime;
      } else {
        module.alert("请选择时间区间");
        return;
      }
      if (options.serviceNames[0] == '') {
        module.confirm({
          title: '下载',
          info: '确定下载全部服务信息？',
          status: 0,
          callback: function () {
            /*loginName serviceNmae 为空时下载excel*/
            FN.getAllOutServiceChargeInfo(options);
          }
        });
      } else {
        $(".tabs .button:first-child").trigger("click");
        FN.getOutServiceChargeInfoByDay(options);
      }
    }
  };
})