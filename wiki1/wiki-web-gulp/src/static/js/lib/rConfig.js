'use strict';
(function(win) {

  var lang = 'zh-Hans';
  // switch (win.CookieUtil.get('lang')) {
  // case 'en': {
  //   lang = 'en';
  //   break;
  // }
  // case 'zh': {
  //   lang = 'zh';
  //   break;
  // }
  // }

  win.rConfig = win.rConfig || {};

  /* baseUrl 所有模块的查找根路径 */
  win.rConfig.baseUrl = 'static/js/src';

  /* 在放弃加载一个脚本之前等待的秒数。设为0禁用等待超时。默认为7秒。 */
  win.rConfig.waitSencods = 15;

  /**
   * paths 映射那些不直接放置于baseUrl下的模块名
   *   设置path时起始位置是相对于baseUrl的
   *   除非该path设置以'/'开头或含有URL协议(如http)
   */
  win.rConfig.paths = {
    'lib': '../lib',
    'api': '../../js/apiConfig',
    'i18n': '../../i18n/' + lang + '/settings'
  };

  /**
   * 为那些没有使用define()来声明依赖关系
   *   设置模块的'浏览器全局变量注入'型脚本做依赖和导出配置
   * [注]
   * 1.shim配置仅设置了代码的依赖关系，想要实际加载shim指定的或涉及的模块，
   *   仍然需要一个常规的require/define调用。设置shim本身不会触发代码的加载。
   * 2.请仅使用其他'shim'模块作为shim脚本的依赖，或那些没有依赖关系，
   *   并且在调用define()之前定义了全局变量(如jQuery或lodash)的AMD库。
   *   否则，如果你使用了一个AMD模块作为一个shim配置模块的依赖，在build之后，
   *   AMD模块可能在shim托管代码执行之前都不会被执行，这会导致错误。
   *   终极的解决方案是将所有shim托管代码都升级为含有可选的AMD define()调用。
   */
  win.rConfig.shim = {
    'lib/base': {
      deps: ['lib/common']
    },
    'lib/view-default': {
      deps: ['lib/common']
    }
  };

  /* 对于给定的模块前缀，使用一个不同的模块ID来加载该模块。 */
  win.rConfig.map = {
  };

  /**
   * 指定要加载的一个依赖数组。当将require设置为一个config object在加载require.js之前使用时很有用。
   * 一旦require.js被定义，这些依赖就已加载。使用deps就像调用require([])，但它在loader处理配置完毕之后就立即生效。
   * 它并不阻塞其他的require()调用，它仅是指定某些模块作为config块的一部分而异步加载的手段而已。
   */
  win.rConfig.deps = [
  ];

  /**
   * RequireJS获取资源时附加在URL后面的额外的query参数。
   * 作为浏览器或服务器未正确配置时的'cache bust'手段很有用。
   */
  win.rConfig.urlArgs = '' + (new Date()).getTime();

})(window);