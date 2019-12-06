$(function () {
  let editor = null, // 保存editor实例
    noAlarm = {}, // 保存全局对应关系
    FN = {
      getThreshold() {
        // 获取配置参数
        module.$http(API.qualityAnalyze.getThreshold, op = {}, function () {
          let data = this.resData, doms = ''
          $('.plain-input').each(function (k, v) {
            $('[name="' + v.name + '"]').val(data[v.name])
          })
          $('#guidResult').empty()
          let jsonContainer = document.getElementById("guidResult")
          editor = new JSONEditor(jsonContainer, {
            onEditable: function (path, field, value) { // 取消编辑
              return {
                value: false
              }
            },
            onCreateMenu: function (items, node) {
              let newItems = []
              items.forEach(v => {
                if (v.text === 'Remove' || v.text === '移除') {
                  newItems.push(v)
                }
              })
              return newItems
            }
          })
          editor.set(data.noAlarm)
          $('.jsoneditor-expand-all').click()
          // 将插件中需要的部分去除或者隐藏起来
          $(document).find('.jsoneditor-menu').remove()
            .end().find('.jsoneditor-navigation-bar').remove()
          noAlarm = editor.get()
        }, {
          type: 'get'
        })
      },

      // 修改
      postThreshold(op) {
        module.$http(API.qualityAnalyze.postThreshold, op, function () {
          if (this.resCode === 1) {
            module.alert('修改成功')
            FN.getThreshold()
          } else {
            module.alert('修改失败')
          }
        })
      },

      /*获取客户名称*/
      getCustomers() {
        module.getCustomers().then(res => {
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
          FN.hasServices()
        })
      },

      hasServices() {
        module.hasServices().then(res => {
          let lis = '<li class="dropdown-item  text-warp" data-value = "" >全部</li>' + res
          $('[name="serviceName"]').closest('.select-dropdown').find('.dropdown-menu').html(lis + res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="serviceName"]').closest('.search-item'))
          module.selected()
        })
      },

      init() {
        // 获取客户名称
        FN.getCustomers()
        // 获取参数
        FN.getThreshold()
        // 只能输入数字
        $(document).on('keyup', function () {
          /*验证数字*/
          module.keyup()
        })
      }
    }

  /*客户变化 其对应的服务也发生变化*/
  $('[name="loginName"]').off('change').on('change', function () {
    FN.hasServices()
  })

  module.clickTree.queryFun = function () {
    // 组装参数 
    let options = {}, noAlarm = {}
    $('.plain-input').each(function (k, v) {
      let value = v.value.trim()
      if (value) {
        options[v.name] = value / 1
      }
    })
    // 若对应关系为空 则noAlarm传个空对象{}
    options.noAlarm = editor.get()
    FN.postThreshold(options, 'post')
  }

  
  // 确定修改
  module.clickTree.confirmFun = function () {
    let loginName = $('[name="loginName"]').val(), serviceName = $('[name="serviceName"]').val()
    noAlarm = editor.get()
    if (!loginName || serviceName.indexOf('暂无数据') > -1) return
    // 选择全部服务时
    if (!serviceName) {
      let lis = $('[name="serviceName"]').closest('.search-item').find('li.dropdown-item.text-warp')
      if (lis.length) {
        $(lis).each(function (k, v) {
          if ($(v).data('serviceid')) {
            if (!noAlarm[loginName]) {
              noAlarm[loginName] = [$(v).data('value')]
            } else {
              // 检测是否重复添加
              if (!noAlarm[loginName].includes($(v).data('value'))) {
                noAlarm[loginName].push($(v).data('value'))
              }
            }
          }
        })
      }
    } else {
      // 当选择不是全部接口时
      serviceName.split(',').forEach((v, k) => {
        if (!noAlarm[loginName]) {
          noAlarm[loginName] = [v]
        } else {
          // 检测是否重复添加
          if (!noAlarm[loginName].includes(v)) {
            noAlarm[loginName].push(v)
          }
        }
      })
    }
    editor.set(noAlarm)
  }

  //清空所有的对应的关系
  module.clickTree.clearFun = function () {
    editor.set({})
  }

  // 初始化
  FN.init()
})