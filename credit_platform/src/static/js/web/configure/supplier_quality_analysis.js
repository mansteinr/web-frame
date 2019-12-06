$(function () {
  let optionsAll = '', reCharts1 = null, reCharts2 = null, reCharts3 = null,
    keys = {
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
    }, originData = null
  let FN = {
    supplierRealTime() {
      if (!FN.getClassName()) {
        module.alert('通道名称为空')
        module.noDataFunction('#chart1')
        return
      }
      let op = {
        date: module.formaterTime(Date.parse(new Date()), 'yyyy-mm-dd hh:ii:ss'),
        classNames: FN.getClassName()
      }
      module.$http(API.qualityAnalyze.supplierRealTime, op, function () {
        originData = this.resData
        FN.detailSupplierData()
        let dataArr = Object.keys(this.resData.avgCallTime); /* 因为返回是个对象 所以提取对象的key并组成一个数组 这是平均相应时长*/
        if (dataArr && dataArr.length > 0) {
          let data = this.resData.avgCallTime,
            dataCall = this.resData.callNum,
            xFiled = [], /* x轴数据 */
            yFiled = [], /* y平均响应时间y轴数据 */
            yCallFiled = [], /* 平均调用量y轴数据 */
            handleObj = {};
          module.mockminutes().forEach((v, k) => {
            if (data[v]) { /* 检测某个点是否存在 则不动 反之 补一个空  这样写的好处 就是不会改变时间点的顺序 */
              handleObj[v] = data[v];
            } else {
              handleObj[v] = '';
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
          })
          let lineData = [{
            name: '实时响应分析(ms)',
            yAxisIndex: 0,
            data: yFiled
          }, {
            name: '实时调用量(条)',
            yAxisIndex: 1,
            data: yCallFiled
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
    detailSupplierData(value) {
      let dataArr = Object.keys(originData.avgCallTime)
      $('.detail-time').show()
      if (!dataArr.length) {
        module.noDataFunction('#chart3')
        return
      }
      let dateTime = value ? value : $('#time').val(),
      // 将2019-02-02 14:12:25转为20190202141225形式 去除秒 并转为Number类型 并去除秒 
      // 因为后天返回的key 是201902021412 方便操作
        startDayTime = dateTime.split('至')[0].trim().match(/\d+/g).join('').substring(0, 12) / 1,
        endDayTime = dateTime.split('至')[1].trim().match(/\d+/g).join('').substring(0, 12) / 1,
        data = {}, dataCall = {}
      $.each(originData.avgCallTime, function (k, v) {
        // 筛检 事件范围内的数据
        if ((k / 1) >= startDayTime && (k / 1) <= endDayTime) {
          data[k] = v
          dataCall[k] = originData.callNum[k]
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
        }
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
      }], xBarFiled = [], yOptionsCall = {}

      // 么得规律 只有手写 
      $.each(data, function (k, v) {
        switch (true) {
          case v <= 50:
            if (yOptionsCall.item0) {
              yOptionsCall.item0 += dataCall[k] || 0
            } else {
              yOptionsCall.item0 = dataCall[k] || 0
            }
            break;
          case v <= 100:
            if (yOptionsCall.item1) {
              yOptionsCall.item1 += dataCall[k] || 0
            } else {
              yOptionsCall.item1 = dataCall[k] || 0
            }
            break;
          case v <= 200:
            if (yOptionsCall.item2) {
              yOptionsCall.item2 += dataCall[k] || 0
            } else {
              yOptionsCall.item2 = dataCall[k] || 0
            }
            break;
          case v <= 300:
            if (yOptionsCall.item3) {
              yOptionsCall.item3 += dataCall[k] || 0
            } else {
              yOptionsCall.item3 = dataCall[k] || 0
            }
            break;
          case v <= 500:
            if (yOptionsCall.item4) {
              yOptionsCall.item4 += dataCall[k] || 0
            } else {
              yOptionsCall.item4 = dataCall[k] || 0
            }
            break;
          case v <= 800:
            if (yOptionsCall.item5) {
              yOptionsCall.item5 += dataCall[k] || 0
            } else {
              yOptionsCall.item5 = dataCall[k] || 0
            }
            break;
          case v <= 1000:
            if (yOptionsCall.item6) {
              yOptionsCall.item6 += dataCall[k] || 0
            } else {
              yOptionsCall.item6 = dataCall[k] || 0
            }
            break;
          case v <= 1500:
            if (yOptionsCall.item7) {
              yOptionsCall.item7 += dataCall[k] || 0
            } else {
              yOptionsCall.item7 = dataCall[k] || 0
            }
            break;
          case v <= 2000:
            if (yOptionsCall.item8) {
              yOptionsCall.item8 += dataCall[k] || 0
            } else {
              yOptionsCall.item8 = dataCall[k] || 0
            }
            break;
          case v <= 2500:
            if (yOptionsCall.item9) {
              yOptionsCall.item9 += dataCall[k] || 0
            } else {
              yOptionsCall.item9 = dataCall[k] || 0
            }
            break;
          case v <= 3000:
            if (yOptionsCall.item10) {
              yOptionsCall.item10 += dataCall[k] || 0
            } else {
              yOptionsCall.item10 = dataCall[k] || 0
            }
            break;
          case v <= 4000:
            if (yOptionsCall.item11) {
              yOptionsCall.item11 += dataCall[k] || 0
            } else {
              yOptionsCall.item11 = dataCall[k] || 0
            }
            break;
          case v <= 5000:
            if (yOptionsCall.item12) {
              yOptionsCall.item12 += dataCall[k] || 0
            } else {
              yOptionsCall.item12 = dataCall[k] || 0
            }
            break;
          case v <= 8000:
            if (yOptionsCall.item13) {
              yOptionsCall.item13 += dataCall[k] || 0
            } else {
              yOptionsCall.item13 = dataCall[k] || 0
            }
            break;
          case v <= 10000:
            if (yOptionsCall.item14) {
              yOptionsCall.item14 += dataCall[k] || 0
            } else {
              yOptionsCall.item14 = dataCall[k] || 0
            }
            break;
          case v <= 15000:
            if (yOptionsCall.item15) {
              yOptionsCall.item15 += dataCall[k] || 0
            } else {
              yOptionsCall.item15 = dataCall[k] || 0
            }
            break;
          case v <= 20000:
            if (yOptionsCall.item16) {
              yOptionsCall.item16 += dataCall[k] || 0
            } else {
              yOptionsCall.item16 = dataCall[k] || 0
            }
            break;
          case v > 20000:
            if (yOptionsCall.item17) {
              yOptionsCall.item17 += dataCall[k] || 0
            } else {
              yOptionsCall.item17 = dataCall[k] || 0
            }
            break;
          default:
            break;
        }
      })

      let yOptionsCallArr = [], columnsData = []

      $.each(keys, function (k, v) {
        xBarFiled.push(v)
        if (!yOptionsCall[k]) {
          yOptionsCall[k] = 0
        }

        yOptionsCallArr.push(yOptionsCall[k])
        columnsData.push({
          callTime: v,
          callNum: yOptionsCall[k]
        })
      })

      let series1 = [{
        name: '调用总量',
        type: 'bar',
        data: yOptionsCallArr
      }]

      reCharts3 = module.renderChart("#chart3", module.setColumnData('', xBarFiled, series1))
      // 渲染table
      module.renderTable({
        id: "#table3",
        data: columnsData,
        columns: columns1
      })
    },
    getClassName() { /* 获取通道名称 */
      let classNames = [],
          options = $('[name="className"]').val().trim() /* 获取通道名称 */
      if (options === '暂无数据') { /* 通道名为空时 直接返回 并提示客户 */
        module.alert('通道名称为空');
        return
      }
      if (!options) {
        options = optionsAll /* 为全部时 */
      }
      options.split(',').forEach((v, k) => {
        if (v) {
          classNames.push(v)
        }
      })
      return classNames; /* 返回通道名称 */
    },
    supplierHistory(value) {
      $('.big-table .bootstrap-table').hide()
      if (!FN.getClassName()) {
        module.alert('通道名称为空')
        module.noDataFunction('#chart2')
        return
      }
      module.hasDataFunction('#chart2')
      let time = value ? value : $('#dayTime').val(),
          opt = {
        "startTime": time.split('至')[0].trim() + ' 00:00:00',
        "endTime": time.split('至')[1].trim() + ' 23:59:59',
        classNames: FN.getClassName()
      }
      module.$http(API.qualityAnalyze.supplierHistory, opt, function () {
        let data = this.resData, optionsObj = {}
        optionsObj.data = []
        if (data && data.length > 0) {
          $('.big-table .bootstrap-table').show()
          let columns = [{ /* 定义table */
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
              // 这是保存总调用总量 因为echarts要计算3s之内占比
              optionsObj.total = count
              return count || '0' /* 兼容所有数据为空时 赋值一个字符串0 number0 不显示 */
            }
          }],
          series = [], 
          seriesObj = {}, 
          xFiled = [], 
          flagTime = true/* flag取总量和时间 */
          $.each(keys, function (k, v) {
            columns.push({ /* 构建table */
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
            data.forEach(v1 => {
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
          optionsObj.time = time; /* 因为副标题需要时间参数 */
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
          let title = { /*  */
            title: '历史调用耗时分析',
            subTitle: optionsObj
          }
          reCharts2 = module.renderChart("#chart2", module.setColumnData(title, xFiled, series));
          $('.fixed-table-toolbar').append('<div class="mv-table-title">历史调用耗时统计</div>')
        } else {
          module.noDataFunction('#chart2')
        }
      })
    },
    toggleShowHide() { /** 点击历史数据 实时数据隐藏和显示 */
      let value = $('[type="radio"]:checked').val()
      if (value === '0') {
        $('#chart1').show();
        $('#chart2').hide();
        $('.big-table .bootstrap-table').hide()
        $('.histroy-detail').show()
        FN.supplierRealTime()
      } else {
        $('#chart1').hide()
        $('#chart2').show()
        $('.big-table .bootstrap-table').show()
        $('.histroy-detail').hide()
        FN.supplierHistory()
      }
    },
    querySupInfoList() { /** 查询供应商列表 */
      module.$http(API.commomApi.querySupInfoList, {}, function () {
        let data = this.resData.supInfos;
        let lis = '';
        if (data && data.length > 0) {
          data.forEach(function (v, k) {
            lis += '<li class="dropdown-item  text-warp"  data-supid = "' + v.supId + '" title ="' + v.supName + '" data-value = "' + v.supId + '">' + v.supName + '</li>'
          });
          $('[name="supplierName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis);
          /*初始化*/
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="supplierName"]').closest('.search-item'));
          FN.querySupServiceList()
        }
      })
    },
    querySupServiceList() { /** 查询供应商服务列表 */
      let opt = {
        supId: $('[name="supplierName"]').closest('.select-dropdown').find('ul li.active').data('supid')
      }
      module.$http(API.commomApi.querySupServiceList, opt, function () {
        let data = this.resData.supServiceInfos;
        let lis = '';
        if (data && data.length > 0) {
          data.forEach(function (v, k) {
            lis += '<li class="dropdown-item  text-warp"  data-supserviceid = "' + v.supServiceId + '" title ="' + v.supServiceNameCn + '" data-value = "' + v.supServiceId + '">' + v.supServiceNameCn + '</li>'
          });
        } else {
          lis += '<li class="dropdown-item  text-warp" title ="暂无数据">暂无数据</li>'
        }
        $('[name="supplierServiceName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis);
        /*初始化*/
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="supplierServiceName"]').closest('.search-item'));
        FN.queryPipeList()
      })
    },
    queryPipeList() { /** 根据供应商服务id查询引用该服务的通道列表 */
      let opt = {
        supServiceId: $('[name="supplierServiceName"]').closest('.select-dropdown').find('ul li.active').data('supserviceid')
      }
      module.$http(API.commomApi.queryPipeList, opt, function () {
        optionsAll = '';
        let data = this.resData.simplePipeInfos, lis = '';
        if (data && data.length > 0) {
          lis = '<li class="dropdown-item  text-warp" title ="全部">全部</li>'
          data.forEach(function (v, k) {
            optionsAll += v.pipeName + ','
            lis += '<li class="dropdown-item  text-warp"  data-classname = "' + v.pipeName + '" title ="' + v.pipeName + '" data-value = "' + v.pipeName + '">' + v.pipeName + '</li>'
          });
        } else {
          lis += '<li class="dropdown-item  text-warp" data-value = "暂无数据" title ="暂无数据">暂无数据</li>'
        }
        $('[name="className"]').closest('.select-dropdown').find('.dropdown-menu').html(lis)
        /*初始化*/
        $(document).trigger(EVENT.INIT.DOTREE, $('[name="className"]').closest('.search-item'))
        $('input[type=radio]:checked').val() === '1' ? $('.radio-search-item').show() : $('.radio-search-item').hide(); /* 显示查询间隔时长 */
        $('[data-click="queryFun"]').trigger('click')
        module.selected('className]')
      })
    },
    initFun() {
      $('.radio-search-item').hide() /* 显示查询间隔时长 */
      FN.supplierRealTime()
      let timestamp = +new Date()
      let initValue = module.formaterTime(timestamp - 24 * 3600 * 1000, 'yyyy-mm-dd hh:ii:ss') + ' ' + '至' + ' ' + module.formaterTime(timestamp, 'yyyy-mm-dd hh:ii:ss')
      module.initTimeFun({
        elem: '#time',
        type: 'datetime',
        range: '至',
        value: initValue,
        done: (value) => {
          FN.detailSupplierData(value)
        }
      })
      module.initTimeFun({
        range: '至',
        done: (value) => {
          FN.supplierHistory(value)
        }
      })
    }
  }
  $('input[type=radio]').change(function () { /* 单选框切换时 是否显示时间框 为1 显示 反之隐藏 */
    this.value === '1' ? $('.radio-search-item').show() : $('.radio-search-item').hide();
    this.value === '0' ? $('.interval-search-item').show() : $('.interval-search-item').hide(); /* 时间间隔 */
    FN.toggleShowHide()
  });
  FN.querySupInfoList() /* 获取供应商名称 */
  $(document).on('change', '[name="supplierName"]', function () { /* 切换应商服务列表 服务的通道列表更新 */
    FN.querySupServiceList();
  });
  $(document).on('change', '[name="supplierServiceName"]', function () { /* 切换应商服务列表 服务的通道列表更新 */
    FN.queryPipeList();
  });
  module.clickTree.queryFun = function () {
    $('.button-group.tabs').find('.margin-r5').trigger('click')
    if ($('input[type=radio]:checked').val() / 1) {
      FN.supplierHistory()
    } else {
      FN.supplierRealTime()
    }
  }

  FN.initFun()

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
})