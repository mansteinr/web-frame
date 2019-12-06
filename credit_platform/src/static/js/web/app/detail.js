$(function() {
  let columns = [{
    field: 'appName',
    title: '应用名称',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'appBusiness',
    title: '所属行业',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'appType',
    title: '应用类型',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  },  {
    field: 'icon',
    title: 'icon',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(val) {
      return `<div class="img-wrapper">
      <img src="data:image/jpeg;base64,${val}"/>
      </div>`
    }
  },  {
    field: 'platform',
    title: '平台详情',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  },{
    field: 'androidLink',
    title: '链接',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },  
    formatter: function(value, row, index) {
      return row.platform === 'Andriod' ? row.androidLink : row.iosLink
    }
  }, {
    field: 'appState',
    title: 'APP状态',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value) {
      return value === '0' ? '启用' : (value === '1' ? '停用' : '已删除')
    }
  }, {
    field: 'createTime',
    title: '创建时间',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    title: '操作',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return `<div role="toolbar" class="link">
          <span data-click ="detailId" data-message='${JSON.stringify(row)}'>查看</span>
          <span class="ml" data-click ="editor" data-message='${JSON.stringify(row)}'>编辑</span>
          <span class="ml" data-click ="delete" data-message='${JSON.stringify(row)}'>删除</span>
        </div>`
    }
  }], columns1 = [{
    field: 'id',
    title: '应用ID',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'appId',
    title: 'appId',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'appKey',
    title: 'appKey',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    field: 'provider',
    title: '供应商',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    },
    formatter: function(value) {
      if (value === '0') {
        return '创蓝'
      } else if (value === '1') {
        return '电信'
      } else if (value === '2') {
        return '移动'
      } else if (value === '3') {
        return '联通'
      }
    }
  }],
  FN = {
    appInfo: function(value) { // 获取所有的app
      if (!value) return
      module.$http(API.lightSignIn.appInfo+'/'+value, {}, function() {
        $('.chartArea').removeClass('active')
        if (this.resData.length) {
          module.renderTable({
            id: "#table1",
            data: this.resData,
            columns: columns
          })
        } else {
          // 若无数据 关闭该页面
          module.tabManage.delete('', value + '详情')
          // 通知父页面刷新
          module.postMessage({
            call:'delete',
            tabid: ''
          })
        }
        
      }, {type:'get'})
    }
  }

  module.messageCallBack.detail = function(){ 
    FN.appInfo(this.data)
  }

  $('.tab-item', parent.document).each(function(k, v) {
    if ([...v.classList].includes('active')) {
      FN.appInfo($(v).data('tabid').replace(/[^a-zA-Z]/g, ''))
    }
  })

  /**
   * 查看id
   */
   module.clickTree.detailId = function() {
    let message = $(this).data('message')
    module.popup.show({
      title: 'app详情',
      bclose: true,
      style: 'width:60%;margin-left:-30%;',
      content: $("#popupLook").html(),
      callback: function () {
        let _this = $(this), table2 = _this.find('table')[0]
        module.$http(API.lightSignIn.secret+'/'+ message.appId, {}, function() {
          module.renderTable({
            id: table2,
            data: this.resData,
            columns: columns1
          })
          _this.find('.fixed-table-toolbar').remove()
        }, {type:'get'})

        let html = ''
        html += `<span>小视_appId：${message.appId}</span><span>小视_appKey：${message.appKey}</span><span>包名：${message.packageName}</span><span>包签名：${message.packageSign}</span><span>bundleId：${message.bundleId}</span>`
        $(this).find('.detail-item').html(html)
      }
    })
   }

  //  修改
  module.clickTree.editor = function (e) {
    let message = $(this).data('message')
    module.tabManage.create(e, {
      title: message.loginName + '编辑',
      url: 'views/app/add.html',
      loadhide: true,
      click: "loadtab",
      tabid: message.appId + message.loginName + '编辑'
    })
    setTimeout(()=>{
      module.postMessage({
        call:'update',
        data: message,
        tabid: message.appId + message.loginName + '编辑'
      })
    },100)
  }

  // 更新成功之后 通知详情页面 更新
  module.messageCallBack.updateSucess = function () {
    module.alert(this.data.split('_')[0])
    FN.appInfo(this.data.split('_')[1])
  }

  // 新增成功之后 通知详情页面 更新
  module.messageCallBack.addSucess = function () {
    module.alert(this.data.split('_')[0])
    FN.appInfo(this.data.split('_')[1])
  }
  
  // 删除
  module.clickTree.delete = function () {
    let message = $(this).data('message')
    module.confirm({
      title: '删除',
      info: '确定删除?',
      status: 0,
      callback: function () {
        module.$http(API.lightSignIn.appInfo + '/' + message.appId, {}, function() {
          if (this.resCode) {
            FN.appInfo(message.loginName) 
            module.alert('删除成功')
          } else {
            module.alert(this.resMsg[0].msgText)
          }
        }, {type : 'DELETE'})
      }
    })
  }
})