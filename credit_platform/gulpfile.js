let gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    rev = require('gulp-rev'), // 生成版本号
    revCollector = require('gulp-rev-collector'), // 替换版本号
    fs = require('fs'),
    path = require('path'),
    uglify = require('gulp-uglify-es').default,
    minfy = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin')

// var reqOptimize = require('gulp-requirejs-optimize'); // requireJs文件合并所需模块
// ====================================================================
/**
 * 替换文件内容(多个文件)
 * 
 * @param {Object} someFile 配置文件
 */
function loadReplaceConfig(someFile) {
  let i = 0,
      replaceFile = JSON.parse(fs.readFileSync(someFile)),
      count = replaceFile.replaces.length
  nextReplace(i, count, replaceFile.replaces, function (index, count, replaceFile, cb) {
    nextReplace(index, count, replaceFile, cb);
  });
}
/**
 * 替换文件内容(单个文件) 递归调用
 * 
 * @param {Number} index
 * @param {Number} count
 * @param {Array} replaceFile
 * @param {Function} cb
 */
function nextReplace(index, count, replaceFile, cb) {
  if (index < count) {
    let replace = replaceFile[index];
    // 读取文件名
    for (let itemFile in replace) {
      // 只读取一个
      fileDisplay(itemFile, function () {
        let _self = this;
        // 读取文件
        fs.readFile(_self.fileName, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          let newFileCtx = data;
          // 替换内容
          for (let i = 0, len = replace[_self.itemFile].length; i < len; i++) {
            newFileCtx = newFileCtx.replace(new RegExp(replace[_self.itemFile][i].rex, 'g'), replace[_self.itemFile][i].newCtx);
          }
          // 重写文件
          fs.writeFile(_self.fileName, newFileCtx, 'utf8', function (err) {
            cb.call(null, index + 1, count, replaceFile, cb);
            if (err) return console.log(err);
          });
        });
      });
      break;
    }
    console.log('打包完成 ' + new Date())
  }
}

/**
 * dist | _test | _dev
 * 读取目录的文件 /static/js/apiConfigxxx.js
 * 读取目录的文件 /static/js/visitor/visit-xxx.js
 * @param {any} filePath 目录
 */

function fileDisplay(filePath, cb) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        let filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            let isFile = stats.isFile(),//是文件
                isDir = stats.isDirectory();//是文件夹
            if (isFile && (filedir.indexOf('apiConfig') > -1)) {
              cb.call({
                itemFile: filePath,
                fileName: filedir
              });
              return;
            }
          }
        });
      });
    }
  });
}

// 服务平台 ======================
function creditPlatformWebTask() {

  // 清空
  gulp.task('creditPlatform:clear', function () {
    // 验证指令
    if (process.argv.length < 5) {
      throw '指令错误:(' + process.argv.length + ')' + process.argv;
    }
    let args = process.argv[4].split(','),
        output = args[0];
    return gulp.src(output + '/*')
      .pipe(vinylPaths(del));
  });

  // 生成
  gulp.task('creditPlatform:rev', ['creditPlatform:clear'], function (cb) {
    let args = process.argv[4].split(','),
        output = args[0],
        delayTime = args[2] ? parseInt(args[2]) : 2000;
    //=================== css
    // 记录css版本号 并copy
    (function () {
      gulp.src(['src/static/css/**'])
        .pipe(rev())
        .pipe(minfy())
        .pipe(gulp.dest(output + '/static/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(output + '_rev/css'));
    }());

    //=================== image
    (function () {
      gulp.src(['src/static/images/**'])
        .pipe(rev())
        .pipe(gulp.dest(output + '/static/images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(output + '_rev/images'));
    }());

    //=================== fonts
    (function () {
      // fonts copy
      gulp.src(['src/static/fonts/**/*'])
        .pipe(gulp.dest(output + '/static/fonts'));
    }());

    //=================== js
    (function () {
      // copy js 生成对应的版本号 js 直接在html引入的
      gulp.src(['src/static/_public/**/*'])
        .pipe(gulp.dest(output + '/static/_public'));

      gulp.src(['src/static/js/**'])
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(output + '/static/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(output + '_rev/js'));
    }());

    //=================== html
    (function () {
      // 压缩copy html
      gulp.src(['src/**/*.html'])
        .pipe(htmlmin({
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true,
          minifyCSS: true
        }))
        .pipe(gulp.dest(output));

    }());

    setTimeout(function () {
      // 执行成功后才能在继续执行
      cb();
    }, delayTime);
  });

  // 替换文本内容(版本号，配置文件)
  gulp.task('creditPlatform:build', ['creditPlatform:rev'], function () {

    let args = process.argv[4].split(','),
        output = args[0],
        configFile = args[1];
    gulp.src([output + '_rev/**/*.json', output + '/**/*.css'])
      .pipe(revCollector())
      .pipe(gulp.dest(output));

    gulp.src([output + '_rev/**/*.json', output + '/**/*.js'])
      .pipe(revCollector())
      .pipe(gulp.dest(output));

    gulp.src([output + '_rev/**/*.json', output + '/**/*.html'])
      .pipe(revCollector())
      .pipe(gulp.dest(output));

    // 替换文件内容
    loadReplaceConfig(configFile);
  });
}

creditPlatformWebTask();



