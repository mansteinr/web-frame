$(function () {
  let customerAll = '', optionsObj = {}, reCharts1 = null, reCharts2 = null, reCharts3 = null, originData = null, keys = {
    item0: '0-0.05s',
    item1: '0.05-0.1s',
    item2: '0.1-0.2s',
    item3: '0.2-0.3s',
    item4: '0.3-0.5s',
    item5: '0.5-0.8s',
    item6: '0.8-1s',
    item7: '1-1.5s',
    item8: '1.5-2s',
    item9: '2-2.5s',
    item10: '2.5-3s',
    item11: '3-4s',
    item12: '4-5s',
    item13: '5-8s',
    item14: '8-10s',
    item15: '10-15s',
    item16: '15-20s',
    item17: '20s以上'
  },
  columns = [{ /* 定义table */
    field: 'dateTime',
    title: '调用时间',
    width: 200,
    sortable: true,
    footerFormatter: function () {
      return "总计"
    },
  }, {
    field: 'callSum',
    title: '调用总量',
    width: 200,
    sortable: true,
    footerFormatter: function (data) {
      let count = 0;
      for (let i in data) {
        count += data[i].callSum / 1 || 0; /* 兼容数据可能不存在的情况 防止报错 */
      }
      optionsObj.total = count;
      return count || '0' /* 兼容所有数据为空时 赋值一个字符串0 number0 不显示 */
    }
  }],

    FN = {
      customerRealTime() {
        let op = FN.getParams();
        if (op.serviceNames.length === 0) {
          module.alert('服务名称为空')
          module.noDataFunction('#chart1')
          return
        }
        module.$http(API.qualityAnalyze.customerRealTime, op, function () {
          originData = this.resData
          detailData()
          let dataArr = Object.keys(this.resData.avgCallTime); /* 因为返回是个对象 所以提取对象的key并组成一个数组 */
          if (dataArr && dataArr.length > 0) {
            module.hasDataFunction("#chart1")

            let data = this.resData.avgCallTime, //实时响应时间
              dataCall = this.resData.callNum,//调用量
              dataNeed = this.resData.needChargeCallNum,  //计费调用量
              xFiled = [], /* x轴数据 */
              yFiled = [], /* 实时响应y轴数据 */
              yCallFiled = [], /* 实时条用量y轴数据 */
              yNeedFiled = [], /* 实时计费调用量y轴数据 */
              handleObj = {};

            module.mockminutes().forEach((v, k) => {
              if (data[v]) { /* 检测某个点是否存在 则不动 反之 补一个空  这样写的好处 就是不会改变时间点的顺序 */
                handleObj[v] = data[v]
              } else {
                handleObj[v] = ''
              }
            })

            $.each(handleObj, function (k, v) {
              xFiled.push(module.substrTime(k)) /* x轴 */
              yFiled.push(v) /* y轴 */
              if (dataCall[k]) {
                yCallFiled.push(dataCall[k])
              } else {
                yCallFiled.push('')
              }
              if (dataNeed[k]) {
                yNeedFiled.push(dataNeed[k])
              } else {
                yNeedFiled.push('')
              }
            })
             
            let lineData = [{
              name: '实时响应分析(ms)',
              yAxisIndex: 0,
              data: yFiled
            }, {
              name: '实时调用量(条)',
              yAxisIndex: 1,
              data: yCallFiled
            }, {
              name: '实时计费调用量（条）',
              yAxisIndex: 1,
              data: yNeedFiled
            }],
            yAxis = [{
              name: '实时响应分析(ms)',
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ececec'
                }
              },
              axisLine: { //坐标轴轴线相关设置。就是数学上的y轴
                show: false,
                lineStyle: {
                  color: 'rgba(170,172,178,0.53)'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#6f7479'
                }
              }
            }, {
              name: '实时调用量(条)',
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ececec'
                }
              },
              axisLine: { //坐标轴轴线相关设置。就是数学上的y轴
                show: false,
                lineStyle: {
                  color: 'rgba(170,172,178,0.53)'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#6f7479'
                }
              }
            }]
            module.hasDataFunction('#chart1')
            reCharts1 = module.renderChart("#chart1", module.setLineData('', xFiled, lineData, yAxis))
          } else {
            module.noDataFunction('#chart1')
          }
        })
      },
      /*获取所有的接口类型*/
      getCustomersByWebServiceNames: function () {
        let serviceNames = [], params = $('[name="serviceName"]').val().trim();
        if (params) {
          serviceNames.push(params);
        } else {
          module.alert('服务名为空');
          return
        }
        module.$http(API.commomApi.getCustomersByWebServiceNames, { serviceNames: serviceNames }, function () {
          let data = this.resData, lis = '',
            selector = $('[name="loginName"]');
          if (module.empty(data)) {
            customerAll = data;
            lis += '<li class="dropdown-item  text-warp" data-value = "" >全部</li>'
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp" title="' + v.customerName + ' (' + v.loginName + ')' + '" data-value = "' + v.loginName + '" >' + v.customerName + '</li>';
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          selector.closest('.select-dropdown').find('.dropdown-menu').html(lis);
          /*初始化*/
          $(document).trigger(EVENT.INIT.DOTREE, selector.closest('.search-item'));
          $('[data-click="queryFun"]').trigger('click');
          module.selected('loginName');
        });
      },
      detailData(value) {
        let dataArr = Object.keys(originData.avgCallTime);
        if (!dataArr.length) {
          module.noDataFunction('#chart3')
          return
        }
        let dateTime = value ? value : $('#time').val(),
          // 将2019-02-02 14:12:25转为20190202141225形式 去除秒 并转为Number类型
          startDayTime = dateTime.split('至')[0].trim().match(/\d+/g).join('').substring(0, 12) / 1,
          endDayTime = dateTime.split('至')[1].trim().match(/\d+/g).join('').substring(0, 12) / 1,
          data = {}, dataCall = {}, dataNeed = {}

        $.each(originData.avgCallTime, function (k, v) {
          if ((k / 1) >= startDayTime && (k / 1) <= endDayTime) {
            data[k] = v
            dataCall[k] = originData.callNum[k] || 0
            dataNeed[k] = originData.needChargeCallNum[k] || 0
          }
        })
        if (!Object.keys(data).length) {
          module.noDataFunction('#chart3')
          return
        }

        module.hasDataFunction("#chart3")
        // 提取x轴坐标
        let columns1 = [{ /* 定义table */
          field: 'callTime',
          title: '耗时',
          width: 200,
          sortable: true,
          footerFormatter: function () {
            return "总计"
          },
        }, {
          field: 'callNum',
          title: '调用总量',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            let count = 0;
            for (let i in data) {
              count += data[i].callNum / 1 || 0; /* 兼容数据可能不存在的情况 防止报错 */
            }
            return count || '0' /* 兼容所有数据为空时 赋值一个字符串0 number0 不显示 */
          }
        }, {
          field: 'needChargeCallNum',
          title: '计费调用量',
          width: 200,
          sortable: true,
          footerFormatter: function (data) {
            let count = 0;
            for (let i in data) {
              count += data[i].needChargeCallNum / 1 || 0; /* 兼容数据可能不存在的情况 防止报错 */
            }
            return count || '0' /* 兼容所有数据为空时 赋值一个字符串0 number0 不显示 */
          }
        }], xBarFiled = [], yOptionsCall = {}, yOptionsNeed = {}
        $.each(data, function (k, v) {
          switch (true) {
            case v <= 50:
              if (yOptionsCall.item0) {
                yOptionsCall.item0 += dataCall[k] || 0
                yOptionsNeed.item0 += dataNeed[k] || 0
              } else {
                yOptionsCall.item0 = dataCall[k] || 0
                yOptionsNeed.item0 = dataNeed[k] || 0
              }
              break;
            case v <= 100:
              if (yOptionsCall.item1) {
                yOptionsCall.item1 += dataCall[k] || 0
                yOptionsNeed.item1 += dataNeed[k] || 0
              } else {
                yOptionsCall.item1 = dataCall[k] || 0
                yOptionsNeed.item1 = dataNeed[k] || 0
              }
              break;
            case v <= 200:
              if (yOptionsCall.item2) {
                yOptionsCall.item2 += dataCall[k] || 0
                yOptionsNeed.item2 += dataNeed[k] || 0
              } else {
                yOptionsCall.item2 = dataCall[k] || 0
                yOptionsNeed.item2 = dataNeed[k] || 0
              }
              break;
            case v <= 300:
              if (yOptionsCall.item3) {
                yOptionsCall.item3 += dataCall[k] || 0
                yOptionsNeed.item3 += dataNeed[k] || 0
              } else {
                yOptionsCall.item3 = dataCall[k] || 0
                yOptionsNeed.item3 = dataNeed[k] || 0
              }
              break;
            case v <= 500:
              if (yOptionsCall.item4) {
                yOptionsCall.item4 += dataCall[k] || 0
                yOptionsNeed.item4 += dataNeed[k] || 0
              } else {
                yOptionsCall.item4 = dataCall[k] || 0
                yOptionsNeed.item4 = dataNeed[k] || 0
              }
              break;
            case v <= 800:
              if (yOptionsCall.item5) {
                yOptionsCall.item5 += dataCall[k] || 0
                yOptionsNeed.item5 += dataNeed[k] || 0
              } else {
                yOptionsCall.item5 = dataCall[k] || 0
                yOptionsNeed.item5 = dataNeed[k] || 0
              }
              break;
            case v <= 1000:
              if (yOptionsCall.item6) {
                yOptionsCall.item6 += dataCall[k] || 0
                yOptionsNeed.item6 += dataNeed[k] || 0
              } else {
                yOptionsCall.item6 = dataCall[k] || 0
                yOptionsNeed.item6 = dataNeed[k] || 0
              }
              break;
            case v <= 1500:
              if (yOptionsCall.item7) {
                yOptionsCall.item7 += dataCall[k] || 0
                yOptionsNeed.item7 += dataNeed[k] || 0
              } else {
                yOptionsCall.item7 = dataCall[k] || 0
                yOptionsNeed.item7 = dataNeed[k] || 0
              }
              break;
            case v <= 2000:
              if (yOptionsCall.item8) {
                yOptionsCall.item8 += dataCall[k] || 0
                yOptionsNeed.item8 += dataNeed[k] || 0
              } else {
                yOptionsCall.item8 = dataCall[k] || 0
                yOptionsNeed.item8 = dataNeed[k] || 0
              }
              break;
            case v <= 2500:
              if (yOptionsCall.item9) {
                yOptionsCall.item9 += dataCall[k] || 0
                yOptionsNeed.item9 += dataNeed[k] || 0
              } else {
                yOptionsCall.item9 = dataCall[k] || 0
                yOptionsNeed.item9 = dataNeed[k] || 0
              }
              break;
            case v <= 3000:
              if (yOptionsCall.item10) {
                yOptionsCall.item10 += dataCall[k] || 0
                yOptionsNeed.item10 += dataNeed[k] || 0
              } else {
                yOptionsCall.item10 = dataCall[k] || 0
                yOptionsNeed.item10 = dataNeed[k] || 0
              }
              break;
            case v <= 4000:
              if (yOptionsCall.item11) {
                yOptionsCall.item11 += dataCall[k] || 0
                yOptionsNeed.item11 += dataNeed[k] || 0
              } else {
                yOptionsCall.item11 = dataCall[k] || 0
                yOptionsNeed.item11 = dataNeed[k] || 0
              }
              break;
            case v <= 5000:
              if (yOptionsCall.item12) {
                yOptionsCall.item12 += dataCall[k] || 0
                yOptionsNeed.item12 += dataNeed[k] || 0
              } else {
                yOptionsCall.item12 = dataCall[k] || 0
                yOptionsNeed.item12 = dataNeed[k] || 0
              }
              break;
            case v <= 8000:
              if (yOptionsCall.item13) {
                yOptionsCall.item13 += dataCall[k] || 0
                yOptionsNeed.item13 += dataNeed[k] || 0
              } else {
                yOptionsCall.item13 = dataCall[k] || 0
                yOptionsNeed.item13 = dataNeed[k] || 0
              }
              break;
            case v <= 10000:
              if (yOptionsCall.item14) {
                yOptionsCall.item14 += dataCall[k] || 0
                yOptionsNeed.item14 += dataNeed[k] || 0
              } else {
                yOptionsCall.item14 = dataCall[k] || 0
                yOptionsNeed.item14 = dataNeed[k] || 0
              }
              break;
            case v <= 15000:
              if (yOptionsCall.item15) {
                yOptionsCall.item15 += dataCall[k] || 0
                yOptionsNeed.item15 += dataNeed[k] || 0
              } else {
                yOptionsCall.item15 = dataCall[k] || 0
                yOptionsNeed.item15 = dataNeed[k] || 0
              }
              break;
            case v <= 20000:
              if (yOptionsCall.item16) {
                yOptionsCall.item16 += dataCall[k] || 0
                yOptionsNeed.item16 += dataNeed[k] || 0
              } else {
                yOptionsCall.item16 = dataCall[k] || 0
                yOptionsNeed.item16 = dataNeed[k] || 0
              }
              break;
            case v > 20000:
              if (yOptionsCall.item17) {
                yOptionsCall.item17 += dataCall[k] || 0
                yOptionsNeed.item17 += dataNeed[k] || 0
              } else {
                yOptionsCall.item17 = dataCall[k] || 0
                yOptionsNeed.item17 = dataNeed[k] || 0
              }
              break;
            default:
              break;
          }
        })

        let yOptionsCallArr = [], yOptionsNeedArr = [], columnsData = []
        
        $.each(keys, function (k, v) {
          xBarFiled.push(v)
          if (!yOptionsCall[k]) { // 判断是否含有不存在的项 不存在则补个0
            yOptionsCall[k] = 0
          }
          if (!yOptionsNeed[k]) {
            yOptionsNeed[k] = 0
          }
          yOptionsCallArr.push(yOptionsCall[k])
          yOptionsNeedArr.push(yOptionsNeed[k])
          columnsData.push({
            callTime: v,
            callNum: yOptionsCall[k],
            needChargeCallNum: yOptionsNeed[k]
          })
        })

        let series1 = [{
          name: '调用总量',
          type: 'bar',
          data: yOptionsCallArr
        }, {

          name: '计费调用量',
          type: 'bar',
          data: yOptionsNeedArr
        }]

        reCharts3 = module.renderChart("#chart3", module.setColumnData('', xBarFiled, series1))
        module.renderTable({
          id: "#table3",
          data: columnsData,
          columns: columns1
        })
      },
      customerHistory() {
        $('.big-table .bootstrap-table').hide()
        let options = FN.getParams()
        if (options.serviceNames.length === 0) {
          module.alert('服务名称为空');
          module.noDataFunction('#chart2');
          return
        }
        options.startTime = $('#dayTime').val().split('至')[0].trim() + ' 00:00:00';
        options.endTime = $('#dayTime').val().split('至')[1].trim() + ' 23:59:59';
        module.$http(API.qualityAnalyze.customerHistory, options, function () {
          module.hasDataFunction("#chart2")
          let data = this.resData;
          if (data && data.length > 0) {
            let columns2 = [...columns]
            optionsObj.data = [];
            let series = [], seriesObj = {}, xFiled = [], flagTime = true/* flag取总量和时间 */
            $.each(keys, function (k, v) {
              columns2.push({ /* 构建table */
                field: k,
                title: v,
                width: 200,
                sortable: true,
                footerFormatter: function (data) {
                  let charge = module.pluck(data, k)
                  if (k === 'item0' || k === 'item1' || k === 'item2' || k === 'item3' || k === 'item4' || k === 'item5' || k === 'item6' || k === 'item7' || k === 'item8' || k === 'item9' || k === 'item10') {
                    optionsObj.data.push(eval(charge.join("+")) || '0')
                  }
                  return eval(charge.join("+")) || '0'
                }
              })
              data.forEach((v1, k1) => {
                if (flagTime) {
                  xFiled.push(v1.dateTime)
                }
                if (seriesObj[v]) { /* 检测对象里是否含有该项 有则直接push */
                  seriesObj[v].push(v1[k])
                } else {
                  seriesObj[v] = [v1[k]] /** 第一次直接赋值 */
                }
              })
              flagTime = false /* 当外层第一次循环结束之后置为false */
            })
            optionsObj.time = $('#dayTime').val().trim() /* 因为副标题需要时间参数 第一次主动获取 */
            $.each(seriesObj, function (k, v) { /* 构架serise */
              series.push({
                "name": k,
                "type": "bar",
                "barMaxWidth": 15,
                "stack": "通道日调用量",
                "data": v,
                itemStyle: {
                  normal: {
                    "opacity": 0.3
                  },
                  emphasis: {
                    opacity: 1
                  }
                }
              })
            })
            module.renderTable({
              id: "#table1",
              data,
              columns: columns2
            })
            let title = { /*  */
              title: '历史调用耗时分析',
              subTitle: optionsObj
            }
            reCharts2 = module.renderChart("#chart2", module.setColumnData(title, xFiled, series));
            $('.fixed-table-toolbar').append('<div class="mv-table-title">历史调用耗时统计</div>')
          } else {
            module.noDataFunction('#chart2');
          }
        })
      },
      toggleShowHide() { /** 点击历史数据 实时数据隐藏和显示 */
        let value = $('[type="radio"]:checked').val()
        if (value === '0') {
          $('#chart1').show();
          $('#chart2').hide();
          $('.big-table .bootstrap-table').hide();
          FN.customerRealTime(); /* 切换至实时数据时 重启定时器 */
          $('.histroy-detail').show()
        } else {
          $('#chart1').hide();
          $('#chart2').show();
          $('.big-table .bootstrap-table').show()
          $('.histroy-detail').hide()
          FN.customerHistory()
        }
      },
      getService() {
        /* 获取所有的服务名称 */
        module.getService().then(res => {
          $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
        })
      },
      initFun() {
        FN.getService()
        $('.radio-search-item').hide() /* 显示查询间隔时长 */
        let timestamp = +new Date()
        let initValue = module.formaterTime(timestamp - 24 * 3600 * 1000, 'yyyy-mm-dd hh:ii:ss') + ' ' + '至' + ' ' + module.formaterTime(timestamp, 'yyyy-mm-dd hh:ii:ss')
        module.initTimeFun({
          range: '至',
          done: (value) => {
            FN.customerHistory(value)
          }
        })
        module.initTimeFun({
          elem: '#time',
          type: 'datetime',
          range: '至',
          max: 1,
          value: initValue,
          done: (value) => {
            FN.detailData(value)
          }
        })
      },
      getParams() {
        let form = $('#paramsForm')
        let options = {}
        if (module.checkForm(form)) {
          let params = form.serializeArray();
          options.serviceNames = [];
          options.loginNames = [];
          $(params).each(function (k, v) {
            if (v.value) {
              options[v.name] = v.value.trim();
            }
          });
          options.date = module.formaterTime(+new Date(), 'yyyy-mm-dd hh:ii:ss')
          options.serviceNames.push(options.serviceName);
          if (!options.loginName) {
            options.loginName = customerAll;
            options.loginName.forEach((v, k) => {
              if (v.loginName) {
                options.loginNames.push(v.loginName)
              }
            })
          } else {
            options.loginName.split(',').forEach((v, k) => {
              if (v.trim()) {
                options.loginNames.push(v)
              }
            });
          }
        };
        delete options.loginName
        delete options.serviceName
        return options;
      }
    };
  $('input[type=radio]').change(function () { /* 单选框切换时 是否显示时间框 为1 显示 反之隐藏 */
    this.value === '1' ? $('.radio-search-item').show() : $('.radio-search-item').hide();
    this.value === '0' ? $('.interval-search-item').show() : $('.interval-search-item').hide(); /* 时间间隔 */
    FN.toggleShowHide()
  });
  FN.initFun() /* 初始化函数 */
  $(document).on('change', '[name="serviceName"]', function () {
    FN.getCustomersByWebServiceNames();
  });
  module.clickTree.queryFun = function () {
    $('.button-group.tabs').find('.margin-r5').trigger('click')
    if ($('input[type=radio]:checked').val() / 1) {
      FN.customerHistory();
    } else {
      FN.customerRealTime()
    }
  }
  $(document).on(EVENT.INIT.DOTREE, function (e, el) {
    if ($(el).find('[name="serviceName"]').length > 0) {
      FN.getCustomersByWebServiceNames();
    }
  })
  window.onresize = function () {
    if (reCharts1) {
      reCharts1.resize();
    }
    if (reCharts2) {
      reCharts2.resize()
    }
    if (reCharts3) {
      reCharts3.resize()
    }
  }

  window.customerHistory = FN.customerHistory // 设为全局变量
  window.detailData = FN.detailData
})
