'use strict';

window.define(['i18n', 'api', 'lib/common', 'lib/base'], function($i18n) {

  // 国际化、渲染页面
  document.title = $i18n.index.title;
  document.body.innerHTML = window.template('jsView', $i18n.index);
  var module = window.module;

  // click 事件 菜单显示隐藏
  module.clickTree.showMenu = function() {
    var activeMenu = $('.menu-item-1.active[data-click="collapse"]'),
      time = 800;

    if(activeMenu.length){
      activeMenu.trigger('click');
      setTimeout(function(){
        $('body').toggleClass('menu-hide');
      },600);
      time = 1500;
    } else {
      $('body').toggleClass('menu-hide');
    }

    setTimeout(function(){
      module.tabManage.tabReset();
    },time);
  };

  $(function() {

    module.init();
    module.tabManage.init();

  });

});