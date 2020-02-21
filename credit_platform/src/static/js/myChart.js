(function () {
  let chart = window.chart = {}
  chart.color = ['rgba(44,181,171,1)', 'rgba(145,191,93,1)', 'rgba(248,168,159,1)', 'rgba(134,213,96,1)', 'rgba(175,137,214,1)', 'rgba(89,173,243,1)', 'rgba(255,153,154,1)', 'rgba(255,204,103,1)', 'rgba(0, 0, 255,1)',
    'rgba(138,43,226,1)', 'rgba(220,20,60,1)', 'rgba(0,0,139,1)', 'rgba(255,140,0,1)', 'rgba(121,85,72,1)', 'rgba(124,252,0,1)',
    'rgba(0,0,128,1)', 'rgba(158,158,158,1)', 'rgba(172,89,163,1)', 'rgba(53,231,255,1)', 'rgba(16,16,16,1)', 'rgba(52,135,158,1)']

  module.extend({
    /**
     * 构建柱状图数据
     * */
    buildColumData: function (item) {
      let legend = [],
        data = [],
        obj = {};
      $.each(item, function (k, v) {
        let number = v.number;
        v.number == 0 ? number = null : number = parseInt(number)
        let objDom = {
          value: number,
          name: module.strDate(v.point)
        }
        legend.push(module.strDate(v.point))
        data.push(objDom);
      });
      obj = {
        legend: legend,
        data: data
      }
      return obj;
    },
    /**
     * 绘图
     * */
    renderChart: function (id, option) {
      let chartContainer = $(id)[0],
        myChart = echarts.init(chartContainer);
      myChart.clear();
      myChart.setOption(option);
      return myChart
    },
    /**
     * 折线
     * */
    setLineData: function (title, xAxisData, lineData, yAxis = [{
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
        },
      },
      axisLabel: {
        textStyle: {
          color: '#6f7479'
        },
      }
    }]) {
      
      let legendData = [],
          series = [],
          arrLength = lineData.length > 21 ? 20 : lineData.length
      for (let i = 0; i < arrLength; i++) {
        legendData.push(lineData[i].name)
      }
 
      lineData.forEach((v, k)=> {
        series.push({
          name: v.name,
          type: 'line',
          smooth: true, //是否平滑曲线显示
          yAxisIndex: v.yAxisIndex || 0, // 双折线图 y轴设置
          lineStyle: { //线条样式 
            normal: {
              width: 1,
              color: chart.color[k]
            }
          },
          areaStyle: { //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: chart.color[chart.color[k] ? k : k%10].replace(',1)', ',0.25)')
            }
          },
          itemStyle: { //折现拐点标志的样式 rgba必须加上透明度1,不然hover的时候，没有边圈
            normal: {
              color: chart.color[k]
            }
          },
          data: v.data
        })
      })
      option = {
        color: chart.color,
        title: {
          text: title,
          left: '1%',
          top: '-1%',
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            fontFamily: "微软雅黑",
            color: "#36383c"
          }
        },
        tooltip: {
          bordeRadius: 4,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 0,
          position: function (point, params, dom, rect, size) {
          // 提示框位置
            let containerWidth = $(dom).closest('.chart-area').width(),
                left = point[0] > containerWidth / 2 ? point[0] - $(dom).width() - 20 : point[0] + 20
            return [left, params.length > 18 ? -260 : point[1]]
          },
          formatter: function (params) {
            let color = "#757b90",
                a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params[0].name + "</div>";
            a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
            $.each(params, function (k, v) {
              a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:8px;width: 8px;border: 2px solid " + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + (v.value || '--') + "<br>";
            })
            a += "</div>";
            return a;
          },
          trigger: 'axis',
          textStyle: {
            fontSize: 15,
            color: "#fff"
          },
          axisPointer: {
            lineStyle: {
              color: '#00c1de'
            }
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: 70,
          left: "4%",
          itemGap: 20,
          data: legendData,
          textStyle: {
            color: '#6f7479',
            fontSize: 12
          }
        },
        grid: {
          show: true,
          left: "8%",
          top: 34,
          right: "3%",
          x2: 50,
          borderWidth: 0,
        },
        toolbox: {
          show: true,
          left: 'center',
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: false,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            saveAsImage: {
              show: true
            },
            restore: {
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          axisLine: { //坐标轴轴线相关设置。就是数学上的x轴
            show: true,
            lineStyle: {
              color: '#00c1de',
              width: 2
            },
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            align: "right",
            textStyle: {
              color: '#6f7479',
            },
          },
        }],
        yAxis,
        series: series
      }
      if (xAxisData.length > 20) {
        let dataZoom = []
        dataZoom.push({
          show: true,
          height: 30,
          bottom: 30,
          start: 95,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: "#d3dee5",
          },
          textStyle: {
            color: "#6f7479"
          },
          borderColor: "#90979c"
        }, {
            type: 'inside',
            realtime: true,
            start: 20,
            end: 80
          });
        option.dataZoom = dataZoom;
        option.grid.bottom = 120 + Math.ceil(legendData.length / 8) * 20;
      } else {
        option.grid.bottom = 120;
        option.grid.bottom = 120 + Math.ceil(legendData.length / 8) * 20;
      }
      return option;
    },
    /**
     * 圆环
     * */
    setCircleData: function (title, obj) {
      option = {
        backgroundColor: '#fff',
        color: chart.color,
        title: {
          text: title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          bordeRadius: 4,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 0,
          formatter: function (params) {
            let color = "#757b90", a = ''
            a += "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params.seriesName + "</div>";
            a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid " + params.color + ";border-radius: 50%;'/></span>" + params.name + "  :  " + params.value + "(" + params.percent + "%)";
            a += "</div>";
            return a;
          },
          textStyle: {
            fontSize: 15,
            color: "#fff"
          },
          axisPointer: {
            lineStyle: {
              color: '#00c1de'
            }
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: '0%',
          data: obj.legend
        },
        series: [{
          name: "性别分布",
          type: 'pie',
          selectedMode: 'single',
          radius: ['30%', '70%'],
          label: {
            normal: {
              position: 'inner',
              formatter: '{d}%',
              textStyle: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: obj.data
        }]
      };
      return option;
    },
    /**
     * 半径模式圆
     * */
    setRadiiData: function (title, tipTitle, obj) {
      let legendData = [], seriesData = [], subtitle = title.split('|')[1]
      for (let key in obj) {
        legendData.push(key);
        let _obj = {};
        _obj.value = obj[key];
        _obj.name = key;
        seriesData.push(_obj);
      }
      let option = {
        title: {
          text: title.split('|')[0],
          subtext: subtitle,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legendData,
          itemStyle: {
            normal: {
              opacity: 0.5
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: false,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        series: [{
          name: tipTitle,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        color: ['rgba(0, 175, 159,.5)', 'rgba(41, 168, 227,.5)', 'rgba(53, 117, 88,.5)', 'rgba(221, 129, 187,.5)', 'rgba(120, 208, 123,.5)', 'rgba(119, 146, 202,.5)', 'rgba(155, 141, 175,.5)', 'rgba(215, 191, 110,.5)', 'rgba(125, 193, 213,.5)', 'rgba(133, 137, 184,.5)']
      };
      if ($(window).width() < 480) {
        delete option.legend;
        delete option.toolbox;
      }
      return option;
    },
    /**
     * 圆饼图
     * */
    setPieData: function (title, obj) {
      option = {
        color: chart.color,
        backgroundColor: '#fff',
        title: {
          text: title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          bordeRadius: 4,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 0,
          formatter: function (params) {
            let color = "#757b90", a = ''
            a += "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params.seriesName + "</div>";
            a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid " + params.color + ";border-radius: 50%;'/></span>" + params.name + "  :  " + params.value + "(" + params.percent + "%)";
            a += "</div>";
            return a;
          },
          textStyle: {
            fontSize: 15,
            color: "#fff",
          },
          axisPointer: {
            lineStyle: {
              color: '#00c1de'
            }
          }
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 48,
          data: obj.legend,
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: false,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        series: [{
          name: obj.name,
          type: 'pie',
          radius: '70%',
          center: ['48%', '50%'],
          data: obj.data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal: {
              label: {
                show: false,
                formatter: '{b} : {c} ({d}%)'
              }
            },
            labelLine: {
              show: true
            }
          }
        }],
        color: ['rgba(0, 175, 159,.5)', 'rgba(41, 168, 227,.5)', 'rgba(53, 117, 88,.5)', 'rgba(221, 129, 187,.5)', 'rgba(120, 208, 123,.5)', 'rgba(119, 146, 202,.5)', 'rgba(155, 141, 175,.5)', 'rgba(215, 191, 110,.5)', 'rgba(125, 193, 213,.5)', 'rgba(133, 137, 184,.5)']
      };
      return option;
    },
    setColumnData: function (title, xAxisData, series) {
      let total35 = null, percent35 = null, legendData = [];
      if (title && title.subTitle && title.subTitle.data && title.subTitle.data.length > 0) { /* 兼容质量分析子标题 */
        title.subTitle.data.forEach((v, k) => {
          total35 += v / 1
        })
        for (let i = 0; i < series.length; i++) {
          legendData.push(series[i].name);
        };
        percent35 = total35 === title.subTitle.total ? '100' : String(total35 / title.subTitle.total * 100).substr(0, String(total35 / title.subTitle.total * 100).indexOf('.') + 1) + String(total35 / title.subTitle.total * 100).substr(String(total35 / title.subTitle.total * 100).indexOf('.') + 1, 2)
      }
      let toolTopStyle = {
        bordeRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 0,
        formatter: function (params) {
          let color = "#757b90", a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params[0].name + "</div>";
          a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
          $.each(params, function (k, v) {
            let num = v.value || 0;
            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid "
              + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + num + "<br>";
          })
          a += "</div>";
          return a;
        },
        trigger: 'axis',
        textStyle: {
          fontSize: 15,
          color: "#fff",
        },
        axisPointer: {
          lineStyle: {
            color: '#00c1de'
          }
        }
      }
      let toolTip = {
        bordeRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 0,
        trigger: 'axis',
        formatter: function (params) {
          let totleNum = 0
          $.each(params, function (k, v) {
            let num = v.value || 0;
            if (num && num !== 0) {
              totleNum += num
            }
          })
          let color = "#757b90", a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params[0].name + "</div>";
          a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
          $.each(params, function (k, v) {
            let num = v.value || 0;
            let percentString = ''
            if (num && num !== 0) {
              percentString = "（" + String(num / totleNum * 100).substr(0, String(num / totleNum * 100).indexOf('.') + 1) + String(num / totleNum * 100).substr(String(num / totleNum * 100).indexOf('.') + 1, 2) + "%）"
            }
            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid "
              + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + num + percentString + "<br>";
          })
          a += "</div>";
          return a;
        }
      }
      option = {
        title: {
          text: title.title,
          left: title.subTitle ? 'center' : '1%',
          top: title.subTitle ? '10' : '-1%',
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            fontFamily: "微软雅黑",
            color: "#36383c"
          },
          subtext: title.subTitle ? `${title.subTitle.time} 共调用 ${title.subTitle.total} 条，3s以内 ${total35} 条，占比 ${percent35}%` : '',
          subtextStyle: {
            color: 'black' // 副标题文字颜色
          }
        },
        legend: {
          orient: 'horizontal',
          left: "6%",
          itemGap: 20,
          bottom: 10,
          data: legendData,
          textStyle: {
            color: '#6f7479',
            fontSize: 12
          }
        },
        color: chart.color,
        tooltip: title.subTitle ? toolTip : toolTopStyle,
        grid: {
          show: true,
          left: '7%',
          top: title.subTitle ? 70 : 34,
          bottom: 100,
          right: "4%",
          x2: 50,
          borderWidth: 0,
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: false,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            saveAsImage: {
              show: true
            },
            restore: {
              show: true
            }
          }
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          boundaryGap: true,
          data: xAxisData,
          axisLine: { //坐标轴轴线相关设置。就是数学上的x轴
            show: true,
            lineStyle: {
              color: '#00c1de',
              width: 2
            },
          },
          axisLabel: {
            align: "right",
            textStyle: {
              color: '#6f7479',
              fontSize: 12,
            },
          },
        }],
        yAxis: [{
          type: 'value',
          min: 0,
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
              color: '#6f7479',
            }
          },
        }],
        series: series
      };
      if (xAxisData.length > 20) {
        let dataZoom = [];
        dataZoom.push({
          "show": true,
          "height": 20,
          "bottom": 10,
          "start": 20,
          "end": 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: "#d3dee5",
          },
          textStyle: {
            color: "#6f7479"
          },
          borderColor: "#90979c"
        }, { /* 滚动鼠标时 可以放大缩小echarts */
            "type": "inside",
            "height": 15,
            "bottom": 20,
            "start": 20,
            "end": 80,
          });
        option.dataZoom = dataZoom;
        option.grid.bottom = 120;
        option.legend.bottom = 40
      }
      return option;
    }
  })
})()