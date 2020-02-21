$(function () {
  module.extend({
    /*格式化时间*/
    formaterTime: function (timestamp, format = 'yyyy-mm-dd') {
      //format:  "yyyy-m-d h:i:s.S","yyyy年mm月dd日 hh:ii:ss"  default: "yyyy-mm-dd"
      let obj = parseInt(timestamp), date = new Date(obj),
        data = {
          "m+": date.getMonth() + 1,                 //月   
          "d+": date.getDate(),                    //日   
          "h+": date.getHours(),                   //小时   
          "i+": date.getMinutes(),                 //分   
          "s+": date.getSeconds(),                 //秒   
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
          "S": date.getMilliseconds()             //毫秒   
        }
      if (/(y+)/.test(format)) {  // date.getFullYear() + ""  转为字符串
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
      }
      for (let k in data) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (data[k]) : (("00" + data[k]).substring(("" + data[k]).length)))
        }
      }
      return format
    },

    substrTime(params) {
      return params.substr(params.length - 4).substr(0, 2) + ':' + params.substr(params.length - 4).substr(2, 4)
    },

    /* table 封装 */
    renderTable: function (options, otherOpt = {}) {
      let bootstrapTableOpt = {
        pagination: true, // 显示分页
        pageList: "[5, 10, 25, 50]",
        pageNumber: options.pageNumber || 1, // 初始化显示的页码
        pageSize: 10, // 每一页加载数据条数
        classes: 'table table-hover table-no-bordered', // 删除表格的边框样式
        columns: options.columns,
        showExport: true, //是否显示导出
        exportDataType: 'basic',
        search: true,
        showFooter: true,
        exportDataType: 'all',
        data: options.data,
        onSort: options.onSort,
        onPageChange: options.onPageChange,
        sidePagination: options.sidePagination || 'client'
      }
      $(options.id).bootstrapTable('destroy').bootstrapTable(Object.assign(bootstrapTableOpt, otherOpt))
    },

    // 根据服务名查询参数
    queryParamsByServiceName: function (form) {
      let liActive = form.find('.serviceId li.active'),
        op = {}
      op.serviceName = liActive.data('value').trim()
      op.serviceNameCh = liActive.text().trim()
      op.serviceId = liActive.data('serviceid') || liActive.data('id')
      return new Promise(resolve => {
        module.$http(API.operatorPlat.queryParamsByServiceName, op, function () {
          let lis = ''
          if (this.resData.paramNameBeans && this.resData.paramNameBeans.length > 0) {
            this.resData.paramNameBeans.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp"  title ="' + v.paramNameCh + ' (' + v.paramName + ')' + '" data-value = "' + v.paramName + '">' + v.paramNameCh + '</li>'
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "">暂无数据</li>'
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('根据服务名查询参数异常' + err.message)
      })
    },

    /*获取行业类型*/
    getBusinessTypes: function () {
      return new Promise(resolve => {
        module.$http(API.commomApi.businessTypes, {}, function () {
          let data = this.resData, lis = ''
          if (data && data.length > 0) {
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp" title = "' + v.typeName + '" data-value = "' + v.typeId + '" >' + v.typeName + '</li>';
            })
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('获取行业类型异常' + err.message)
      })
    },

    /*获取客户名称 onlyData只要不为空就行*/
    getCustomers: function (onlyData) {
      let businessTypeId = $('[name="businessType"]').val()
      return new Promise(resolve => {
        module.$http(API.commomApi.customers, {}, function () {
          let data = this.resData, lis = ''
          if(onlyData) {
            resolve(data)
            return 
          }
          if (data && data.length > 0) {
            data.forEach(function (v, k) {
              if (!businessTypeId) {
                lis += `<li class="dropdown-item  text-warp" data-customerid = "${ v.customerId }" title = "${ v.customerName } (${ v.loginName })" data-value = "${ v.loginName }" data-businessid="${ v.businessId }" data-loginname="${ v.loginName }"  data-businessname="${ v.businessName }">${ v.customerName }</li>`
              } else {
                if (v.businessId == businessTypeId) {
                  lis += `<li class="dropdown-item  text-warp" data-customerid = "${ v.customerId }" title = "${ v.customerName }" data-value = "${ v.loginName }" data-businessid="${ v.businessId }" data-loginname="${ v.loginName }"  data-businessname="${ v.businessName }">${ v.customerName }</li>`
                }
              }
            })
          } else {
            lis = `<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>`
          }
          if (!lis) {
            lis = `<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>`
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('获取客户异常' + err.message)
      })
    },

    /*客户拥有的服务 onlyData只要不为空就行*/
    hasServices: function (onlyData) {
      let options = {
        customerId: $('[name="loginName"]').closest('.select-dropdown').find('ul li.active').data('customerid')
      };
      return new Promise((resolve, reject) => {
        // 当客户不存在时 可以默认拉取全部的服务
        if (!options.customerId) {
          module.getService().then(res => {
            resolve(res)
          })
          return
        }
        module.$http(API.commomApi.hasServices, options, function () {
          let data = this.resData, lis = ''
          if(onlyData) {
            resolve(data)
            return
          }
          if (module.empty(data)) {
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item text-warp" data-serviceid = "' + v.serviceId + '" title = "' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" data-servicenamezh="' + v.serviceNameZh + '">' + v.serviceNameZh + '</li>'
            })
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('客户拥有的服务接口异常' + err.message)
      })
    },

    /*获取所有的接口类型*/
    getService: function () {
      return new Promise(resolve => {
        module.$http(API.commomApi.services, {}, function () {
          let data = this.resData, lis = ''
          if (module.empty(data)) {
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item text-warp" data-serviceid = "' + v.serviceId + '" title="' + v.serviceNameZh + ' (' + v.serviceName + ')' + '" data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('获取所有服务接口异常' + err.message)
      })
    },

    allService() {
      return new Promise(resolve => {
        module.$http(API.safePlat.allService, {}, function () {
          let data = this.resData, lis = ''
          if (module.empty(data)) {
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp" data-combine="' + v.combine + '"  data-id="' + v.serviceId + '" title="' + v.serviceNameZh + '"  data-value = "' + v.serviceName + '" >' + v.serviceNameZh + '</li>';
            });
          } else {
            lis = `<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>`
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert(`获取所有服务接口异常${err.message}`)
      })
    },

    /*获取所有上游名称*/
    getSupplierCompanys: function () {
      return new Promise(resolve => {
        module.$http(API.upServicePlat.companys, {}, function () {
          let data = this.resData,
            lis = '';
          if (module.empty(data)) {
            data.forEach(function (v, k) {
              lis += '<li class="dropdown-item  text-warp" title = "' + v + '" data-value = "' + v + '" data-servicenamezh="' + v + '">' + v + '</li>'
            });
          } else {
            lis = '<li class="dropdown-item  text-warp" data-value = "暂无数据">暂无数据</li>'
          }
          resolve(lis)
        })
      }).catch(err => {
        module.alert('获取所有上游名称接口异常' + err.message)
      })
    },

    renderParams: function (op, selector, flag) {
      module.$http(API.operatorPlat.queryParamsByServiceName, op, function () {
        let existsDom = $('.query-hide').find('input'), divs = '', alreadyObj = {}
        if (existsDom.length) {
          $.each(existsDom, function (k, v) {
            let value = $(v).val().trim()
            if (value) {
              alreadyObj[v.name] = value
            }
          })
        }
        if (module.empty(this.resData.paramNameBeans)) {
          this.resData.paramNameBeans.forEach((v, k) => {
            divs += `<div class="search-item">
              <label style="white-space: nowrap;overflow: hidden;" title="${v.paramNameCh}" class="input-label">${v.paramNameCh}：</label>
              <input type="text" name="${v.paramName}" class="m-input form-input" placeholder="请输入${v.paramNameCh}" value="${alreadyObj[v.paramName] ? alreadyObj[v.paramName] : ''}">
            </div>`
          })
        } else if (this.resMsg.length) {
          if (this.resMsg[0].msgCode === '-0003') { // 若该服务无参数 提示可客户
            module.alert(`该服务参数${this.resMsg[0].msgText}`)
          } else {
            module.alert(this.resMsg[0].msgText)
          }
        } else {
          module.alert('该服务参数无查询结果')
        }
        if (flag) {
          divs += `
          <div class="search-item">
            <label class="input-label">耗时大于：</label>
            <input type="text" name="lowerCostTime" class="m-input form-input numbers" placeholder="请输入响应时间" value="${alreadyObj.lowerCostTime ? alreadyObj.lowerCostTime : ''}">
          </div>
          <div class="search-item">
            <label class="input-label">耗时小于：</label>
            <input type="text" name="upperCostTime" class="m-input form-input numbers" placeholder="请输入响应时间" value="${alreadyObj.upperCostTime ? alreadyObj.upperCostTime : ''}">
          </div>`
        }
        // 渲染查询参数
        $(selector).html(divs)
      })
    },

    /* 模拟当前所有的分钟 */
    mockminutes: function () {
      let startTime = +new Date() - 1 * 24 * 3600 * 1000, arr = []
      for (let i = 0; i <= 1440; i++) {
        arr.push(module.formaterTime(startTime + (i * 60 * 1000), 'yyyymmddhhii'))
      }
      return arr
    },

    /*keyup事件校验*/
    keyup: function (options = {}) {
      let selector = options.selector || $('.numbers')
      selector.keyup(function () {
        $(this).val($(this).val().replace(options.reg || /[^0-9]/g, options.flag || ''))
      }).bind("paste", function () { //CTR+V事件处理                  
        $(this).val($(this).val().replace(options.reg || /[^0-9]/g, options.flag || ''))
      }) //CSS设置输入法不可用            
    },

    /*单独验证手机号码*/
    checkTel: function (param) {
      return /^1[0-9]\d{9}$/.test(param)
    },

    // 根据guid查询日志详情
    queryByGuid: function (guid) {
      let value = guid.trim()
      if(!value) {
        module.alert("guid不能为空")
        return
      }
      module.$http(API.logsPlat.logDetail, {
        "guid": value
      }, function () {
        if (!module.empty(this.resData)) {
          module.alert("暂未查到数据")
          this.resData = {}
        }
        let that = this.resData
        module.popup.show({
          title: 'Guid查询',
          content: $("#queryGuid").html(),
          bclose: true,
          style: 'position: absolute;width: 55%;min-width: 610px;top: 20px;left: 40%;margin-top:0;',
          callback: function () {
            let _this = $(this),
              jsonContainer = _this.find('#jsonView').get(0)
              editor = new JSONEditor(jsonContainer, {
              mode: 'view',
              timestampTag: true
            })
            _this.find('#guid').val(guid).attr('data-guid', guid)
            editor.set(that)
            $(document).find('.jsoneditor-expand-all').click()
            $(document).find('.jsoneditor-navigation-bar').remove()
          }
        })
      })
    },

    selected: function (selector = 'serviceName') {
      /*多选 控制全部与不是全部的逻辑关系*/
      let lis = $(document).find('[name="' + selector + '"]').closest('.select-dropdown').find('ul li')
      lis.each(function (k, v) {
        $(v).off("click").on('click', function () {
          let flag = false
          if ($(this).closest('div').data('multiple')) {
            if (($(this).data('pym') == 'QuanBu') && !$(this).hasClass('active')) {
              lis.not('[data-pym="QuanBu"]').each(function (k, v) {
                $(v).removeClass('active')
              })
            } else {
              lis.not('[data-pym="QuanBu"]').each(function (k, v) {
                $(v).hasClass('active')
                flag = true
                return
              })
            }
          }
          if (flag) {
            $('[data-pym="QuanBu"]').removeClass('active')
          }
        })
      })
    },
    // keydown事件
    keyEnter: function () {
      $(document).on('keydown', function (e) {
        if (e.keyCode == 13 && !$('.backdrop').length) {
          e.preventDefault()
          $('[data-click="queryFun"]').trigger("click")
        }
      })
    },
    /** guid弹框查询guid */
    blur: function() {
      $(document).on('keydown', function (e) {
        if(e.keyCode === 32 && $('.backdrop #guid').length) {
          e.preventDefault()
          let form = $('.backdrop').find('.result-box'),
              guid = form.find('#guid').val().trim()

          if(!guid) {
            module.alert('guid不能为空')
            return
          }
        
          form.find('#jsonView').empty()
          jsonContainer = form.find('#jsonView').get(0)
            editor = new JSONEditor(jsonContainer, {
            mode: 'view',
            timestampTag: true
          })
          module.$http(API.logsPlat.logDetail, {
            guid
          }, function() {
            form.find('#guid').val(guid)
            editor.set(module.empty(this.resData) ? this.resData : {})
            $(document).find('.jsoneditor-expand-all').click()
            $(document).find('.jsoneditor-navigation-bar').remove()
          })
        }
      })
    },

    // 查看一比一图片 日志中的图片
    viewImage: function () {
      $(document).on('click', '.jsoneditor-value', function () {
        let text = $(this).text()
        if (text.indexOf('/data') > -1) {
          window.open(API.base.imageApi + text)
        } else if (/^(http|https):\/\//.test(text)) {
          window.open(text)
        }
      })
    },

    /*初始化时间*/
    initTimeFun: function (dataOp = {}, timeOp) {
      // 时间段
      let dataOptions = {
        elem: '#dayTime', //指定元素
        theme: '#00c2de',
        min: '2017-03-15',
        max: 'today',
        isInitValue: true,
        type: 'date'
      }, today = +new Date(),
        tiemOptions = {
          elem: '#time',
          type: 'time',
          range: '至'
        }
      // 七天之前的时间戳 因为默认时间跨度为七天
      let today_7 = today - 7 * 24 * 3600 * 1000, dateStart = module.formaterTime(today_7, 'yyyy-mm-dd'),
        dateEnd = module.formaterTime(today, 'yyyy-mm-dd'),
        timeStart = module.formaterTime(today - 1 * 3600 * 1000, 'hh:ii:ss'),
        timeEnd = module.formaterTime(today, 'hh:ii:ss')
      if (dataOp.range && dataOp.type === 'datetime') {
        // 默认时间
        if (!dataOp.value) {
          dataOp.value = dateStart + ' ' + timeStart + ' 至 ' + dateEnd + ' ' + timeEnd
        }
      } else if (dataOp.range) {
        // 默认时间
        if (!dataOp.value) {
          dataOp.value = dateStart + ' 至 ' + dateEnd
        }
      } else {
        // 默认日期
        if (!dataOp.value) {
          dataOp.value = dateEnd
        }
      }
      laydate.render(Object.assign(dataOptions, dataOp))
      if (module.empty(timeOp)) {
        if (!timeOp.range) {
          laydate.render({
            elem: '#start',
            type: 'time',
            value: timeStart
          })
          laydate.render({
            elem: '#end',
            type: 'time',
            value: timeEnd
          })
        } else {
          timeOp.value = timeStart + ' 至 ' + timeEnd
          laydate.render(Object.assign(tiemOptions, timeOp))
        }
      }
    },

    noDataFunction: function (selector) {
      $(selector).closest(".card-space").find('.chartArea').addClass('active')
      $(selector).closest(".card-space").find('.chart-area').hide()
      $(selector).closest(".card-space").find('.chartArea .item-box').hide()
    },

    hasDataFunction: function (selector) {
      $(selector).closest(".card-space").find('.chartArea').removeClass('active')
      $(selector).closest(".card-space").find('.chart-area').show()
      $(selector).closest(".card-space").find('.chartArea .item-box').show()
    },

    getAllAbilityInfo: function (selector) { // 获取所有的能力 有点地方需要serviceId 有的地方需要serviceName
      let inputSelector = $('[name="' + selector + '"]')
      module.$http(API.vehicle.getAllAbilityInfo, {}, function () {
        let lis = ''
        if (this.resData.length) {
          this.resData.map(v => {
            lis += '<li class="dropdown-item  text-warp" title ="' + v.serviceName + ' (' + v.serviceNamezh + ')' + '" data-value = "' + v.serviceId + '"  data-servicename = "' + v.serviceName + '" >' + v.serviceNamezh + '</li>'
          })
        }
        inputSelector.closest('.search-item').find('.dropdown-menu').html(lis)
        inputSelector.closest('.search-item').trigger(EVENT.INIT.DOTREE, $('[name="' + selector + '"]').closest('.search-item'))
        inputSelector.trigger('change')
      }, { type: 'get' })
    },

    pluck(arr, keyWord) {
      let pluck = []
      if (arr.length) {
        arr.forEach(v => {
          pluck.push(v[keyWord])
        })
      }
      return pluck.length ? pluck : [0]
    },

    groupBy(arr, keyWord) {
      let groupByObj = {}
      if (arr.length) {
        arr.forEach(v => {
          let key = v[keyWord] ? v[keyWord] : v['loginName']
          if (groupByObj[key]) {
            groupByObj[key].push(v)
          } else {
            groupByObj[key] = [v]
          }
        })
      }
      return groupByObj
    },

    // 数组排序 reverse倒叙 order正序
    // rule是对比规则  如2017-01-01类型的排序 只有将-去除之后 方可排序
    sort(arr, key, isOrder = 'order', rule) {
      if (arr.length) {
        return arr.sort((a, b) => {
          if (typeof a === 'number' || typeof a === 'string') {
            return isOrder === 'reverse' ? -(a - b) : (a - b)
          } else {
            if (rule) {
              return isOrder === 'reverse' ? -(a[key].match(rule).join('') - b[key].match(rule).join('')) : (a[key].match(rule).join('') - b[key].match(rule).join(''))
            } else {
              return isOrder === 'reverse' ? -(a[key] - b[key]) : (a[key] - b[key])
            }
          }
        })
      } else {
        return []
      }
    },

    // 获取图片大小
    getImgSize(base64url) {
      //获取base64图片大小，返回KB数字
      let str = base64url.replace('data:image/jpeg;base64,', ''),//这里根据自己上传图片的格式进行相应修改
        strLength = str.length,
        fileLength = parseInt(strLength - (strLength / 8) * 2),
        // 由字节转换为KB
        size = (fileLength / 1024).toFixed(2)
      return parseInt(size)
    },

    /** 校验IP */
    isValidIP(ip) {
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip)
    }
  })

  // 快速查询：最近7天，最近一个月等等
  $(document).on('change', '.quick-search', function () {
    let day = $(this).val().split('-')[1]
    if (day == "all") {
      day = (Date.parse(new Date()) - Date.parse('2017-3-15')) / (24 * 3600 * 1000);
    }
    let timestamp_today_last = Date.parse(new Date()) - day * 24 * 3600 * 1000,
      start = module.formaterTime(timestamp_today_last),
      end = module.formaterTime(+new Date())
    $('[name="rangetime"]').val(start + ' 至 ' + end);
  })

  // 数据视图和图形视图切换
  $(document).on('click', '.card-space .tabs .button', function (event) {
    let index = $(this).index();
    $(this).addClass('active').siblings('.button').removeClass('active');
    $(this).parents('.card-space').find('.card-container .item').eq(index).addClass('active').siblings().removeClass('active');
  })
  
  /*点击搜索时 自动获取焦点*/
  $(".selected-value").on("click", function () {
    $(this).closest(".select-dropdown").find(".dropdown-menu .dropdown-input input").trigger('focus');
  })
  
  // 时间输入框
  $('.timepick-warp').find('input').not('[readonly]').on('blur', function() {
    let value = $(this).val().trim()
    if(value.indexOf(':') <= -1) {
      let newValue = value.slice(0,2)+':'+value.slice(2,4)+':'+value.slice(4)
      $(this).val(newValue)
    }
  })

  module.clickTree.queryLogDetail = function() {
    let form = $(this).closest('.result-box'),
        guid = form.find('#guid').val().trim()

    if(!guid) {
      module.alert('guid不能为空')
      return
    }
  
    form.find('#jsonView').empty()
    jsonContainer = form.find('#jsonView').get(0)
      editor = new JSONEditor(jsonContainer, {
      mode: 'view',
      timestampTag: true
    })
    module.$http(API.logsPlat.logDetail, {
      guid
    }, function() {
      form.find('#guid').val(guid)
      editor.set(module.empty(this.resData) ? this.resData : {})
      $(document).find('.jsoneditor-expand-all').click()
      $(document).find('.jsoneditor-navigation-bar').remove()
    })
  }

  module.keyEnter()
  module.blur()
})