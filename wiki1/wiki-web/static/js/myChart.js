(function () {
    var chart = window.chart = {};
    chart.color = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', '#2cb5ab', '#91bf5d', '#f8a89f'];
    module.extend({
        /**
       * 构建柱状图数据
      * */
        buildColumData: function (item) {
            var legend = [],
                data = [],
                obj = {};
            $.each(item, function (k, v) {
                var number = v.number;
                v.number == 0 ? number = null : number = parseInt(number)
                var objDom = {
                    value: number,
                    name: module.strDate(v.point)
                }
                legend.push(module.strDate(v.point));
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
            var chartContainer = $(id)[0],
                myChart = echarts.init(chartContainer);
            myChart.setOption(option);
            return myChart
        },
        /**
         * 折线
        * */
        setLineData: function (legend, xAxisData, series) {
            option = {
                color: chart.color,
                tooltip: {
                    bordeRadius: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: 0,
                    formatter: function (params) {
                        let color = "#757b90";
                        var a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params[0].name + "</div>";
                        a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
                        $.each(params, function (k, v) {
                            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid " + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + v.value + "<br>";
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
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 82,
                    left: "4%",
                    itemGap: 20,
                    //itemWidth:16,
                    //itemHeight:12,
                    data: legend,
                    textStyle: {
                        color: '#6f7479',
                        fontSize: 12
                    }
                },
                grid: {
                    show: true,
                    left: "3%",
                    top: 34,
                    right: "3%",
                    x2: 50,
                    bottom: 143,
                    borderWidth: 0,
                    //  borderColor: 'rgba(170,172,178,0.33)',
                    //  backgroundColor: 'rgba(17, 34, 69, 0.24)',
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: false, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        saveAsImage: {
                            show: true
                        },
                        restore: { show: true }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    //在（type: 'category'）中设置data有效
                    data: xAxisData,

                    //  splitLine: { //坐标轴在 grid 区域中的分隔线；
                    //      show: true,
                    //      lineStyle: { //分割线颜色，可设单个，也可以设置数组。
                    //          color: 'rgba(170,172,178,0.33)'
                    //      }
                    //  },
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
                            fontSize: 14,
                        },

                    },
                }],
                yAxis: [{
                    type: 'value',
                    min: 0,
                    // max: 4000,
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
                            color: '#6f7479',
                            fontSize: 14,
                        },
                    },

                    //  splitArea: {
                    //      show: true,
                    //      areaStyle: {
                    //          color: ['#112245', 'rgba(34,50,82,0.4)']
                    //      }
                    //  }
                }],
                "dataZoom": [{
                    "show": true,
                    "height": 30,
                    bottom: 30,
                    "start": 10,
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


                }],
                series: series
            };
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
                    //subtext: '南丁格尔玫瑰图',
                    // 老树微博，三千诗与画
                    // https://zhuanlan.zhihu.com/p/28989690
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
                        let color = "#757b90";
                        var a = ''
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
        setRadiiData: function (title, obj) {
            option = {
                color: chart.color,
                title: {
                    text: title,
                    //subtext: '南丁格尔玫瑰图',
                    // 老树微博，三千诗与画
                    // https://zhuanlan.zhihu.com/p/28989690
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
                        let color = "#757b90";
                        var a = ''
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
                    x: 'center',
                    y: 'bottom',
                    data: obj.legend
                },
                calculable: true,
                series: [{
                    name: '手机型号',
                    type: 'pie',
                    radius: [40, 130],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    data: obj.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            label: {
                                show: true,
                                //	                            position:'inside',
                                formatter: '{b} : {c} ({d}%)'
                            }
                        },
                        labelLine: {
                            show: true
                        }
                    }
                }]
            };
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
                    text: '地域分布',
                    //subtext: '南丁格尔玫瑰图',
                    // 老树微博，三千诗与画
                    // https://zhuanlan.zhihu.com/p/28989690
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
                        let color = "#757b90";
                        var a = ''
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
                    x: 'right',
                    y: 48,
                    data: obj.legend,
                },
                series: [{
                    name: '地域分布',
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
                                //	                            position:'inside',
                                formatter: '{b} : {c} ({d}%)'
                            }
                        },
                        labelLine: {
                            show: true
                        }
                    }
                }]
            };
            return option;
        },
        setColumnData: function (legend, xAxisData, series) {
            option = {
                legend: {
                    orient: 'horizontal',
                    bottom: 82,
                    left: "4%",
                    itemGap: 20,
                    //itemWidth:16,
                    //itemHeight:12,
                    data: legend,
                    textStyle: {
                        color: '#6f7479',
                        fontSize: 12
                    }
                },
                tooltip: {
                    bordeRadius: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: 0,
                    formatter: function (params) {
                        let color = "#757b90";
                        var a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + params[0].name + "</div>";
                        a += "<div style='padding:5px;color:#36383c;font-size: 14px;'>";
                        $.each(params, function (k, v) {
                            var num = v.value || 0;
                            a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:10px;width: 10px;border: 2px solid " + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + num + "<br>";
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
                },
                grid: {
                    show: true,
                    left: "16%",
                    top: 34,
                    right: "5%",
                    x2: 50,
                    bottom: 143,
                    borderWidth: 0,
                    //  borderColor: 'rgba(170,172,178,0.33)',
                    //  backgroundColor: 'rgba(17, 34, 69, 0.24)',
                },
                toolbox: {
                    show: false,
                    feature: {
                        saveAsImage: {}
                    },
                    top: '11%',
                    right: '3%'
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    //在（type: 'category'）中设置data有效
                    data: xAxisData,

                    //  splitLine: { //坐标轴在 grid 区域中的分隔线；
                    //      show: true,
                    //      lineStyle: { //分割线颜色，可设单个，也可以设置数组。
                    //          color: 'rgba(170,172,178,0.33)'
                    //      }
                    //  },
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
                            fontSize: 14,
                        },

                    },
                }],
                yAxis: [{
                    type: 'value',
                    min: 0,
                    // max: 4000,
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
                            color: '#6f7479',
                            fontSize: 14,
                        },
                    },
                }],
                "dataZoom": [{
                    "show": true,
                    "height": 30,
                    bottom: 30,
                    "start": 10,
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


                }],
                series: series
            };
            return option;
        }
    });
})()