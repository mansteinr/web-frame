$(function () {
  let FN = {
    getOutServiceChargeInfoBySupplier: function (op) {
      module.$http(API.upServicePlat.getOutServiceChargeInfoBySupplier, op, function () {
        let data = this.resData
        if (module.empty(data.serviceCompany)) {
          module.hasDataFunction("#chart1")
          let xFiled = {}, finalArr = {}
          $.each(data.dayCompany, function (k, v) {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
            v.cost = v.cost.toFixed(4)

            let dayKey = v.dayTime, serviceKey = v.serviceName

            if (!finalArr[v.serviceName]) {//是以服务名为主线  查看服务名是否已经存储
              finalArr[v.serviceName] = {
                name: v.serviceNameZh ? v.serviceNameZh : v.serviceName,
                dataArr: []
              }
            }
            if (xFiled[dayKey]) {//如果日期存在  则将对应的服务名及对应的使用量生成key value
              xFiled[dayKey][serviceKey] = v.usedCount;
            } else {
              xFiled[dayKey] = {};//如果日期不存在  则生成一个空对象
            }
            xFiled[dayKey][serviceKey] = v.usedCount
          })

          $.each(data.serviceCompany, function (k, v) {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
            v.cost = v.cost.toFixed(4)
          })

          let nuqinexFild = []
          $.each(xFiled, function (k, v) {
            nuqinexFild.push(k)
            $.each(finalArr, function (k1, v1) {
              v[k1] ? v1.dataArr.push(v[k1]) : v1.dataArr.push(0)
            })
          })
          
          let lineData = []
          $.each(finalArr, function (key, v) {
            lineData.push({
              name: v.name,
              data: v.dataArr
            })
          }),
          columns1 = [{
            field: 'company',
            title: '供应商名称',
            sortable: true,
            footerFormatter: function () {
              return "总计"
            },
          }, {
            field: 'dayTime',
            title: '时间',
            sortable: true,
            footerFormatter: function () {
              return "-"
            },
          }, {
            field: 'serviceNameZh',
            title: '服务名称',
            sortable: true,
            footerFormatter: function () {
              return "-"
            },
          }, {
            field: 'usedCount',
            title: '调用总量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'usedCount').join("+")) || '0'
            }
          }, {
            field: 'chargeUsedCount',
            title: '计费调用量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'chargeUsedCount').join("+")) || '0'
            }
          }, {
            field: 'noChargeCount',
            title: '不计费调用量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'noChargeCount').join("+")) || '0'
            }
          }, {
            field: 'cost',
            title: '小视入账',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'cost').join("+")).toFixed(4)
            }
          },]
          module.renderChart("#chart1", module.setLineData('供应商服务分析', nuqinexFild, lineData))
          window.onresize = function () {
            module.renderChart("#chart1", module.setLineData('供应商服务分析', nuqinexFild, lineData)).resize()
          }
          module.renderTable({
            id: "#table1",
            data: data.dayCompany,
            columns: columns1
          })
        } else {
          module.noDataFunction("#chart1")
        };
        if (!module.empty(data.serviceCompany)) {
          $("#chart2").closest('.item').addClass('active').siblings('.item').removeClass('active').closest('.chartArea').addClass('active');
          return
        } else {
          $("#chart2").closest('.item').removeClass('active').siblings('.item').addClass('active').closest('.chartArea').removeClass('active');
          let columns = [{
            field: 'company',
            title: '供应商名称',
            sortable: true,
            footerFormatter: function () {
              return '总计';
            },
          }, {
            field: 'serviceNameZh',
            title: '服务名称',
            sortable: true,
            footerFormatter: function () {
              return '-';
            },
          }, {
            field: 'usedCount',
            title: '调用总量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'usedCount').join("+")) || '0'
            }
          }, {
            field: 'chargeUsedCount',
            title: '计费调用量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'chargeUsedCount').join("+")) || '0'
            }
          }, {
            field: 'noChargeCount',
            title: '不计费调用量（条）',
            sortable: true,
            footerFormatter: function (data) {
              return eval(module.pluck(data, 'noChargeCount').join("+")) || '0'
            }
          }]
          module.renderTable({
            id: "#table2",
            data: data.serviceCompany,
            columns: columns
          })
        }
      })
    },
    initFun() {
      // 初始化时间
      module.initTimeFun({
        range: '至'
      })
      /*调用供应商名称*/
      module.getSupplierCompanys().then(res => {
        $('[name="companyName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="companyName"]').closest('.search-item'))
      })
    }
  }

  FN.initFun()
  module.clickTree.queryFun = function () {
    let form = $(this).closest('form');
    if (module.checkForm(form)) {
      let params = form.serializeArray(),
        options = {};
      $(params).each(function (k, v) {
        options[v.name] = v.value.trim();
      });
      if (options.rangetime) {
        options.start = options.rangetime.split("至")[0].trim();
        options.end = options.rangetime.split("至")[1].trim();
        delete options.rangetime
      } else {
        module.alert("请选择时间区间");
        return;
      }
      $(".tabs .button:first-child").trigger("click");
      FN.getOutServiceChargeInfoBySupplier(options);
    }
  }
})