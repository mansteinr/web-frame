# 一.wiki-web-gulp

> 基于jQuery、requirejs、art-template等三方js库的前端基础框架。
> 使用gulp进行代码的版本号管理。

## 二.应用

### 1.安装项目依赖文件
> npm install

### 2.指令及配置文件
> 1.[生产环境] 配置文件 apiBuild.json
> 运行后会生成 dist、rev文件夹
> dist 存放附加版本号的代码
> rev 存放记录版本号的文件
```
npm run build
```
> 2.[测试环境] 配置文件 apiTest.json
> 运行后会生成 _test、_test_rev文件夹
> _test 存放附加版本号的代码
> _test_rev 存放记录版本号的文件
```
npm run test
```
> 3.[开发环境] 配置文件 apiDev.json
> 运行后会生成 _dev、_dev_rev文件夹
> _dev 存放附加版本号的代码
> _dev_rev 存放记录版本号的文件
```
npm run dev
```

### 3.配置文件说明
```
{
  "xx/xx/xx/apiConfig.js" : [
    {
      "rex": "123",
      "newCtx": "456"
    }
  ]
}
```
> 一级属性为文件名(需要修改的文件)，值为Array类型，
> Array的元素为 { "rex"："xxx", "newCtx": "xxxx" }
> stringObject.relpalce(regexp/subsrt, replacement);
> rex 为 replace函数的参数1
> newCtx 为 replace函数的参数2

## 三.gulp 版本号说明

### 1.需要依赖包 gulp-rev
> 作用 => 1.扫描文件；2.生成 key(文件名) : value(加了随机版本号的文件名)；3.输出到json文件 4.将文件名修改

```
var gulp = require('gulp');
var rev = require('gulp-rev');
var vinylPaths = require('vinyl-paths');

gulp.task('test:rev', function(cb) {
  // 清空目录
  gulp.src('_test/*')
    .pipe(vinylPaths(del));
  // 记录css版本号 及 生成发布文件
  gulp.src(['src/**/*.css'])
    .pipe(rev()) // 生成版本号
    .pipe(gulp.dest('_test')) // 将文件名根据版本号列表，进行文件名的替换
    .pipe(rev.manifest()) // 把所有生成的带版本号的文件名保存到json文件中
    .pipe(gulp.dest('_test_rev/css')); // 指定json文件的路径
  // 防止读写冲突，延迟进行处理
  setTimeout(function() {
    cb();
  }, 500);
});

```

### 2.需要依赖包 gulp-rev-collector
> 作用 => 通过json文件，替换文件内部的字符串(根据文件名字符串匹配)

```
var gulp = require('gulp');
var revCollector = require('gulp-rev-collector');

gulp.task('revTest', ['test:rev'], function() {
  gulp.src(['_test_rev/**/*.json', '_test/**/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('_test'));
});

```

## 四.RequireJS (实现模块化)

### 1.RequireJS(v2.3.5) 配置文件
> 通过require.config({}); 的形式进行配置项的配置。
> 现架构中将配置的json对象声明及使用分别写在 src/js/lib/rConfig.js src/js/src/forward.js
> RequireJS 引入js模块时，只写js文件名称就可以。

```
var lang = 'zh-Hans';
window.rConfig = {
  // 所有模块的查找跟路径
  baseUrl: 'static/js/src',
  // 在放弃加载一个脚本之前等待的秒数。设为0禁用等待超时。默认为7秒。
  waitSenCode: 15,
  /**
   * 映射那些不直接放置于baseUrl下的模块名
   *   一般设置path时起始位置是相对与baseUrl的
   *   除非该path设置以'/'开头 或者 含有URL协议(如http)，不以baseUrl的相对路径
   */
  paths: {
    'lib': '../lib',
    'api': '../../js/apiConfig',
    // lang 是变量，记录本地环境的语言环境的变量。根据语言的不同读取不同的js文件。
    'i18n': '../../i18n/' + lang + '/settings'
  },
  /**
   * 为那些没有使用define()来声明依赖关系
   * (换句话，就是为没有遵循requiresjs的模块化定义规则的模块，附加模块标记)
   *   设置模块的'浏览器全局变量注入'型脚本做依赖和导出配置。
   * [注]
   * 1.shim配置仅设置了代码的依赖关系，想要实际加载shim指定的或涉及的模块，
   *   仍然需要一个常规的require/define调用。设置shim本身不会触发代码的加载。
   * 2.请仅使用其他'shim'模块作为shim脚本的依赖，或那些没有依赖关系，
   *   并且在调用define()之前定义了全局变量(如jQuery或lodash)的AMD库。
   *   否则，如果你使用了一个AMD模块作为一个shim配置模块的依赖，在build之后，
   *   AMD模块可能在shim托管代码执行之前都不会被执行，这会导致错误。
   *   终极的解决方案是将所有shim托管代码都升级为含有可选的AMD define()调用。
   */
  shim: {
    'lib/base': {
      deps: ['lib/common']
    },
    'lib/view-default': {
      deps: ['lib/common']
    }
  },
  /**
   * 对于给定的模块前缀，使用一个不同的模块ID来加载该模块。
   * (现架构中没有使用)
   */
  map: {},
  /**
   * 指定要加载的一个依赖数组。当将require设置为一个config object在加载require.js之前使用时很有用。
   * 一旦require.js被定义，这些依赖就已加载。使用deps就像调用require([])，但它在loader处理配置完毕
   * 之后就立即生效。它并不阻塞其他的require()调用，它仅是指定某些模块作为config块的一部分而异步加载
   * 的手段而已。
   * (现架构中没有使用)
   */
  deps: [],
  /**
   * (每次都动态加载js，禁止缓存)
   * RequireJS获取资源是附加在URL后面的额外的query参数。
   * 作为浏览器或服务器未正确配置时的'cache bust'手段很有用。
   * [注]
   * 1.针对不经常变化的三方js库不建议使用这种方式，还是采用文件版本号的形式(gulp附加版本号)。
   * 2.针对与业务不固定、需求经常修改的可采用这种方式，可以避免不打版本号或清除浏览器缓存就没法
   * 正常联调的问题。
   */
   urlArgs: '' + (new Date()).getTime()
};
```

```
/**
 * 不同html页面，肯定会调用不同的js文件件。
 * 为了不想写这种对应关系操作，定义了一个规则。
 * 即：
 *   1.html页面，引入的js是 [文件名称相同的]
 *   2.html页面的相对路径 (基于src/views文件夹) 的路径与 js的相对路径相同 (基于src/js/src)
 *   3.src下的HTML 映射在 src/js/src
 * 例：
 *   src/index.html => src/js/src/index.js
 *   src/views/demo.html => src/js/src/demo.js
 *   src/views/demo/demo1.html => src/js/src/demo/demo1.js
 * 
 * 通过 window.location.href 和 正则表达式匹配 实现
 */
var htmlName = '';
// 设置配置信息
window.require.config(window.rConfig);
// 调用
window.requrie([htmlName], function() {});
```