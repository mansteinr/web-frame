'use strict';

window.define(['i18n', 'api', 'lib/common', 'lib/base', 'lib/view-default'], function ($i18n) {

  // 国际化、渲染页面
  document.title = $i18n.index.title;
  // document.body.innerHTML = window.template('jsView', $i18n.index);
  document.body.innerHTML = window.template('jsView', {});
  var module = window.module;

  /*绘画分页*/
  module.pageManage({
    pageTotal: 500,
    pageIndex: 5
  });
  $('.page-navigation').on('pageManageChange', function (e, index) {
    console.log(index);
  });
  module.messageCallBack.getInfo = function () {
    console.log(this);
  };
  /*弹出窗组*/
  module.clickTree.alertDemo = function () {
    module.alert('这是一个confirm');
  };
  module.clickTree.confirmDemo = function () {
    var status = $(this).data('status');
    module.confirm({
      title: '这是一个confirm',
      info: '这里是提示信息',
      status: status
    });
  };
  module.clickTree.popupDemo = function () {
    var id = $(this).data('id');
    module.popup.show({
      title: '这是一个popup',
      content: $(id).html(),
      callback: function () {
        $(document).trigger(EVENT.INIT.DOTREE, this);
      }
    });
  };
  module.clickTree.checkForm = function () {
    var form = $(this).closest('.card-container');
    if (module.checkForm(form)) {
      module.alert('校验通过');
    }
  };

  $(function () {

    module.init();
    module.tabManage.init();

  });

});