$(function () {
  let columns = [{
    field: 'loginName',
    title: '客户名称',
    width: '50%',
    footerFormatter: function () {
      $('.fixed-table-footer').remove()
    }
  }, {
    title: '操作',
    width: '50%',
    footerFormatter: function (data) {
      $('.fixed-table-footer').remove()
    },
    formatter: function (value, row, index) {
      return '<div  role="toolbar" class="link">' +
        '<span   data-click ="detail" data-login="' + row.loginName + '">详情</span>' +
        '</div>'
    }
  }],
    FN = {
      customers: function () {
        module.$http(API.lightSignIn.customers, {}, function () {
          let data = []
          $('#table1').closest('.chartArea').removeClass('active')
          if (this.resData.length) {
            this.resData.forEach(v => {
              data.push({
                loginName: v
              })
            })
          }
          module.renderTable({
            id: "#table1",
            data: data,
            columns: columns
          })
        }, { type: 'get' })
      }
    }

  // 查看详情
  module.clickTree.detail = function (e) {
    module.tabManage.create(e, {
      title: $(this).data('login') + '详情',
      url: 'views/app/detail.html',
      loadhide: true,
      click: "loadtab",
      tabid: $(this).data('login') + '详情'
    })
    setTimeout(() => {
      module.postMessage({
        call: 'detail',
        data: $(this).data('login'),
        tabid: $(this).data('login') + '详情'
      })
    }, 100)
  }


  /**
 * 新增
 */

  module.clickTree.add = function (e) {
    module.tabManage.create(e, {
      title: '新增',
      url: 'views/app/add.html',
      loadhide: true,
      click: "loadtab",
      tabid: 'appAdd'
    })
    setTimeout(() => {
      module.postMessage({
        call: 'appAdd',
        data: 'appAdd',
        tabid: 'appAdd'
      })
    }, 100)
  }

  module.messageCallBack.addSucess = function () {
    module.alert(this.data.split('_')[0])
    FN.customers()
  }
  module.messageCallBack.delete = function () {
    FN.customers()
  }
  FN.customers()
})