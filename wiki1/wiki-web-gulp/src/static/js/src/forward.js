'use strict';
(function (win, document) {

  var url = win.location.href,
    htmlName = '',
    level = 0, // html 在根路径的几级目录中
    start = 0,
    end = 0,
    folder = '',
    folders = '';

  /**
   * 获取页面名称 - 用来导入与之对应的 js
   *
   * substing(start, end)
   * substr(start, length)
   */
  if(/(.*)\.html\?.*$/.test(url)) {
    start = RegExp.$1.lastIndexOf('/') + 1,
    end = url.length - 5;
    htmlName = url.substring(start, end).replace(/\.html\?.*$/g, '');
  }
  if(/(.*)\.html$/.test(url)) {
    start = RegExp.$1.lastIndexOf('/') + 1,
    end = url.length - 5;
    htmlName = url.substring(start, end);
  }
  htmlName = htmlName === '' ? 'index' : htmlName;

  /**
   * 获取页面层级
   */
  if (/^((.*)views)/.test(url)) {
    folder = url.substr(RegExp.$1.length);
    folders = folder.split('/');
    level = folders.length - 1;
  }

  /**
   * 修改basUrl层级
   */
  if (level > 0) {
    for(var i = level; i > 0; i--) {
      win.rConfig.baseUrl = '../' + win.rConfig.baseUrl;
      if (i > 1) {
        htmlName = folders[i - 1] + '/' + htmlName;
      }
    }
  } else {
    win.rConfig.baseUrl = './' + win.rConfig.baseUrl;
  }

  win.require.config(win.rConfig);

  win.require([htmlName], function() {});

})(window, document);