'use strict';

define([], function () {
  // 公用
  var common = {
    chooseProject: '项目选择',
    exit: '退出',
    refresh: '刷新',
    delAllTab: '删除所有tab'
  };

  // index 页面
  var index = {
    title: '后台管理',
    menuItem1: '效果展示'
  };

  // 应用模块
  var app = {
    index: index,
  };

  /**
   * 用来判断一个对象是否有你给出名称的属性或对象
   * hasOwnProperty 非原型练
   * isPrototypeOf 原型链
   *
   * [注]此处仅属性情况
   */
  for (var appKey in app) {
    var appItem = app[appKey];
    for (var key in common) {
      if (!appItem.hasOwnProperty(key)) {
        appItem[key] = common[key];
      }
    }
  }

  return app;
});