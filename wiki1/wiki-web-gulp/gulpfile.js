/**
 * gulp - 打包配置文件
 */
var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var rev = require('gulp-rev'); // 生成版本号
var revCollector = require('gulp-rev-collector'); // 替换版本号
var minifyHTML = require('gulp-minify-html'); // 压缩html
var minifyCSS = require('gulp-minify-css'); // 压缩html
var uglify = require('gulp-uglify'); // 压缩html
var babel = require('gulp-babel');
var fs = require('fs');
// var reqOptimize = require('gulp-requirejs-optimize'); // requireJs文件合并所需模块

// dev ==================================================================
// dev 清空目录
gulp.task('clear:_dev', function() {
  return gulp.src('_dev/*')
    .pipe(vinylPaths(del));
});
// 不压缩 记录版本号 及 生成发布文件
gulp.task('dev:rev', ['clear:_dev'], function(cb) {
  // 记录css版本号 并copy
  gulp.src(['src/**/*.css'])
    // .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('_dev'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('_dev_rev/css'));

  // 记录img版本号 并copy
  gulp.src(['src/static/images/**/*'])
    .pipe(rev())
    .pipe(gulp.dest('_dev/static/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('_dev_rev/images'));

  // copy js
  gulp.src(['src/static/i18n/**/*.js'])
    .pipe(gulp.dest('_dev/static/i18n'));

  // copy js
  gulp.src(['src/static/js/**/*.js'])
    .pipe(gulp.dest('_dev/static/js'));

  // 记录js版本号 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js', 'src/static/js/src/forward.js', 'src/static/_public/*.js'])
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('_dev_rev/js'));

  // copy js 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/_public/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('_dev/static/_public'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js'])
    .pipe(rev())
    .pipe(gulp.dest('_dev/static/js/lib'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/src/forward.js'])
    .pipe(rev())
    .pipe(gulp.dest('_dev/static/js/src'));

  // 压缩copy html
  gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('_dev/'));

  setTimeout(function() {
    cb();
  }, 500);
});
// dev 替换版本号
gulp.task('revDev',['dev:rev'] , function() {

  gulp.src(['_dev_rev/**/*.json', '_dev/**/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('_dev'));

  gulp.src(['_dev_rev/**/*.json', '_dev/**/*.js'])
    .pipe(revCollector())
    .pipe(gulp.dest('_dev'));

  gulp.src(['_dev_rev/**/*.json', '_dev/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('_dev'));

  // 替换文件内容
  loadReplaceConfig('apiDev.json');
});


// test =================================================================
// test 清空目录
gulp.task('clear:_test', function() {
  return gulp.src('_test/*')
    .pipe(vinylPaths(del));
});
// 不压缩 记录版本号 及 生成发布文件
gulp.task('test:rev', ['clear:_test'], function(cb) {
  // 记录css版本号 并copy
  gulp.src(['src/**/*.css'])
    // .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('_test'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('_test_rev/css'));

  // 记录img版本号 并copy
  gulp.src(['src/static/images/**/*'])
    .pipe(rev())
    .pipe(gulp.dest('_test/static/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('_test_rev/images'));

  // copy js
  gulp.src(['src/static/i18n/**/*.js'])
    .pipe(gulp.dest('_test/static/i18n'));

  // copy js
  gulp.src(['src/static/js/**/*.js'])
    .pipe(gulp.dest('_test/static/js'));

  // 记录js版本号 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js', 'src/static/js/src/forward.js', 'src/static/_public/*.js'])
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('_test_rev/js'));

  // copy js 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/_public/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('_test/static/_public'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js'])
    .pipe(rev())
    .pipe(gulp.dest('_test/static/js/lib'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/src/forward.js'])
    .pipe(rev())
    .pipe(gulp.dest('_test/static/js/src'));

  // 压缩copy html
  gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('_test/'));

  setTimeout(function() {
    cb();
  }, 500);
});
// test 替换版本号
gulp.task('revTest', ['test:rev'], function() {

  gulp.src(['_test_rev/**/*.json', '_test/**/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('_test'));

  gulp.src(['_test_rev/**/*.json', '_test/**/*.js'])
    .pipe(revCollector())
    .pipe(gulp.dest('_test'));

  gulp.src(['_test_rev/**/*.json', '_test/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('_test'));

  // 替换文件内容
  loadReplaceConfig('apiTest.json');
});

// build ================================================================
// 清空目录
gulp.task('clear:dist', function () {
  return gulp.src('dist/*')
    .pipe(vinylPaths(del));
});

// 记录版本号 及 生成发布文件 压缩(代码压缩失败)
gulp.task('uglify:rev', ['clear:dist'], function(cb) {

  // 记录css版本号 并copy
  gulp.src(['src/**/*.css'])
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));

  // 记录img版本号 并copy
  gulp.src(['src/static/images/**/*'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/images'));

  // 压缩copy js
  gulp.src(['src/static/i18n/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/i18n'));

  // 压缩copy js
  gulp.src(['src/static/js/**/*.js'])
    .pipe(uglify())
    // .pipe(reqOptimize({
    //   optimize: 'none',                //- none为不压缩资源
    //   // findNestedDependencies: true, //- 解析嵌套中的require
    //   paths: {                         //- 所有文件的路径都相对于forward.js
    //     'api': '../js/apiConfig',
    //     'i18n': '../i18n/zh-Hans/settings'
    //   }
    // }))
    .pipe(gulp.dest('dist/static/js'));

  // 记录js版本号 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js', 'src/static/js/src/forward.js', 'src/static/_public/*.js'])
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));

  // copy js 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/_public/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/_public'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js'])
    .pipe(rev())
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js/lib'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/src/forward.js'])
    .pipe(rev())
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js/src'));

  // 压缩copy html
  gulp.src(['src/**/*.html'])
    .pipe(minifyHTML({
      empty: true,
      spare: true
    }))
    .pipe(gulp.dest('dist/'));

  cb();
});

// 不压缩 记录版本号 及 生成发布文件
gulp.task('build:rev', ['clear:dist'], function(cb) {
  // 记录css版本号 并copy
  gulp.src(['src/**/*.css'])
    // .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));

  // 记录img版本号 并copy
  gulp.src(['src/static/images/**/*'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/images'));

  // copy js
  gulp.src(['src/static/i18n/**/*.js'])
    .pipe(gulp.dest('dist/static/i18n'));

  // copy js
  gulp.src(['src/static/js/**/*.js'])
    .pipe(gulp.dest('dist/static/js'));

  // 记录js版本号 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js', 'src/static/js/src/forward.js', 'src/static/_public/*.js'])
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));

  // copy js 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/_public/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/_public'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/lib/rConfig.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/js/lib'));

  // 生成对应的版本号 js 直接在html引入的
  gulp.src(['src/static/js/src/forward.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist/static/js/src'));

  // 压缩copy html
  gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('dist/'));

  setTimeout(function() {
    cb();
  }, 500);
});

// 替换版本号
gulp.task('revProduct', ['build:rev'], function() {

  gulp.src(['rev/**/*.json', 'dist/**/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'));

  gulp.src(['rev/**/*.json', 'dist/**/*.js'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'));

  gulp.src(['rev/**/*.json', 'dist/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'));

  // 替换文件内容
  loadReplaceConfig('apiBuild.json');
  
});

// ====================================================================
/**
 * 替换文件内容
 */
function loadReplaceConfig(someFile) {
  var replaces = JSON.parse(fs.readFileSync(someFile));
  for(var itemFile in replaces) {
    // 立即执行
    ((function(itemFile, replaces) {
      
      // 读取文件
      fs.readFile(itemFile, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var newFileCtx = data;
        // 替换内容
        for(var i = 0, len = replaces[itemFile].length; i < len; i++) {
          newFileCtx = newFileCtx.replace(new RegExp(replaces[itemFile][i].rex, 'g'), replaces[itemFile][i].newCtx);
        }
        // 重写文件
        fs.writeFile(itemFile, newFileCtx, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      });
    
    })(itemFile, replaces));
  }
}

/**
 * 替换文件内容
 * 
 * @parame <String> someFile 文件夹路径(相对当前文件的)
 * @parame <RegExp> rex 根据正则表达是查找要替换的内容
 * @parame <String> newCtx 要替换的内容
 */
function replaceFileCtx(someFile, rex, newCtx) {
  fs.readFile(someFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(rex, newCtx);

    fs.writeFile(someFile, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}