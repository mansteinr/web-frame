(function() {
  let config = {
      debug: true,
      scrollloading: false
    },
    EVENT = {
      CONTEXTMENU: 'CONTEXTMENU',
      /* ! 右键事件*/
      LOADREADY: 'LOADREADY',
      /* ! 加载成功*/
      TAB: {
        NEW: 'NEW',
        /* ! 新建tab*/
        LOADING: 'LOADING',
        /* ! tab加载中*/
        CHANGE: 'CHANGE',
        /* ! tab切换*/
        DELETE: 'DELETE',
        /* ! 移除tab*/
        SUCCESS: 'SUCCESS',
        /* ! tab加载成功*/
        ERROR: 'ERROR',
        /* ! tab加载失败*/
        RELOAD: 'RELOAD',
        /* ! tab刷新加载*/
        CLEAR: 'CLEAR' /* ! 清除所有tab*/
      },
      ALERT: 'ALERT',
      /* ! 打印提示*/
      INIT: {
        DOTREE: 'DOTREE',
        /* ! 监听初始化*/
        RESET: 'RESET' /* ! 初始化搜索框 */
      }
    },
    module = {
      params: {
        alertTime: null
      },
      /*消息执行函数*/
      messageCallBack: {},
      /* ! do 事件*/
      doTree: {},
      /* ! click 事件*/
      clickTree: {},
      init: function() {
        /* ! 屏蔽鼠标的右键菜单*/
        document.oncontextmenu = function() {
          $(document).trigger(EVENT.CONTEXTMENU)
          return false
        }
            /* ！ 添加全局基本事件监听 和 添加 默认事件处理 */
        module.initListener()
        /* ! 重写系统console.log方法*/
        if (!config.debug) {
          window.console.log = $.noop
        }
      },
      /*继承函数*/
      extend: function(a, b) {
        if (typeof a == 'string') {
          module[a] = b
        } else {
          for (let funcName in a) {
            module[funcName] = a[funcName]
          }
        }
      }
    }
    /* *
     * 使用继承方法完成基本功能方法定义
     * */
    module.extend({
      initListener: function() {
        let initFN = {
          doTree: function(el) {
            let els = el ? el.find('[data-do]') : $('[data-do]')
            els.each(function() {
              let dowhat = $(this).attr('data-do')
              if (dowhat && module.doTree[dowhat] && $.isFunction(module.doTree[dowhat]))
                module.doTree[dowhat].call(this)
            })
          }
        }
        /* ! 全局事件处理 */
        initFN.doTree()
        $(document).on(EVENT.INIT.DOTREE, function(e, el) {
            initFN.doTree($(el))
        })
          /* ! 全局添加处理 data-click事件处理 */
        $(document).on('click', '[data-click]', function() {
          let dowhat = $(this).attr('data-click')
          if (dowhat && module.clickTree[dowhat] && $.isFunction(module.clickTree[dowhat]))
              module.clickTree[dowhat].call(this)
        })
        /* ! 添加消息通知 */
        window.addEventListener('message', function(event) {
            let data = event.data;
            if (data.call && module.messageCallBack[data.call] && $.isFunction(module.messageCallBack[data.call]))
                module.messageCallBack[data.call].call(data)
        }, false)
      },
        $http: function(url, params, cb, op) {
            let options = {
                type: 'POST',
                datatype: 'JSON',
                isform: false,
                error: null
              },
              ajaxOptions = {
                url: url,
                data: {},
                headers: { "mtk": module.localData.getData('usermtk') || API.localMtk },
                crossDomain: true,
                beforeSend: function() { //开始loading
                  if (params && JSON.stringify(params).indexOf('暂无数据') >= 0) {
                    module.alert('请检测参数')
                    return
                  }
                  module.loading.show()
                },
                success: function(data) {
                  module.loading.hide()
                  if (data.resCode == 1) {
                    cb.call(data)
                  } else {
                    if (data.resMsg[0].msgCode == 10005) {
                      module.urlToLocation(API.base.login)
                    } else if (data.resMsg[0].msgCode === '-3006') {
                      // 配置参数 接口参数维护 配置参数规则 该返回字数较多，需要的时间较长
                      module.alert(data.resMsg[0].msgText, 5000, 'height: auto;padding:5px;')
                    } else {
                      module.alert(data.resMsg[0].msgText)
                      cb.call(data)
                    }
                  }
                },
                complete: function() {
                  module.loading.hide()
                }
              }
            $.extend(options, op);
            ajaxOptions.type = options.type;
            ajaxOptions.dataType = options.datatype;
            ajaxOptions.error = options.error || function() {
                module.alert('呀，加载失败啦！');
            };
            if (options.isform) {
                ajaxOptions.data = params;
            } else {
                ajaxOptions.contentType = 'application/json; charset=utf-8';
                if (options.type.toLocaleUpperCase() == 'POST' || options.type.toLocaleUpperCase() == 'PUT' || options.type.toLocaleUpperCase() == 'DELETE') {
                    ajaxOptions.data = JSON.stringify(params);
                }
            }
            if (url) {
                $.ajax(ajaxOptions);
            }
        },

        // 时间结束后移除元素
        timeToRemove: function(el, time) {
            time = time ? time : 600;
            if (el.hasClass('animated')) {
                el.removeClass('active');
            } else {
                el.parent().find('.animated.zoom.active').removeClass('active');
            }
            setTimeout(function() {
                el.remove();
            }, time);
        },

        /* *
         * toast 弹出提示，仿照app
         * @param info  信息提示内容
         * @param time  信息提示显示时间
         * */
        alert: function(op, time, style) {
            let options = {
                info: 'this alert info!',
                time: time || 2000
            };
            if (typeof op == 'string') {
                options.info = op;
            } else {
                $.extend(options, op);
            }
            let toast = $('.toast');
            if (toast.length) {
                clearTimeout(module.params.alertTime)
                toast.text(options.info)
            } else {
                $('body').append('<div style="z-index:10001;' + style + '" class="toast animated zoom active">' + options.info + '</div>')
            }
            module.params.alertTime = setTimeout(function() {
                module.timeToRemove($('.toast'));
            }, options.time);
        },
        /* *
         * 显示幕布
         * @function show 显示幕布
         *      @param html  幕布中的内容，可选
         * @function hide 隐藏幕布
         * */
        backdrop: {
            show: function(html) {
                html = html ? html : '';
                let backdrop = $('.backdrop');
                if (backdrop.length) {
                    backdrop.html(html);
                } else {
                    $('body').append('<div class="backdrop" data-click="hideBackdrops">' + html + '</div>');
                }
            },
            hide: function() {
                let el = $('.backdrop').find('.animated.zoom.active');
                if (el.length) {
                    module.timeToRemove($('.backdrop'));
                } else {
                    $('.backdrop').remove();
                }
            }
        },
        /* *
         * 滚动加载
         * @param elSelector 加载内容选择器
         * @param selector 选择器 默认 window
         * @param urlSource 加载地址选择
         * */
        scrollLoading: function(options) {
            let defaults = {
                    elSelector: '[data-loading]',
                    selector: window,
                    urlSource: 'data-url'
                },
                container;
            let params = $.extend({}, defaults, options || {});
            container = $(params.selector);
            let loading = function() {
                let contHeight = container.height(),
                    contop = 0,
                    els;
                els = $(elSelector);
                if (params.selector == window) {
                    contop = $(window).scrollTop();
                } else {
                    contop = container.offset().top;
                }
                $.each(els, function(k, v) {
                    let el = $(v),
                        tag = v.nodeName.toLowerCase(),
                        url = $(v).attr(params.urlSource),
                        post, posb;
                    if (url) {
                        post = el.offset().top - contop, posb = post + el.height();
                        if (el.is(':visible') && (post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                            el.addClass('bgloading');
                            if (tag === "img") {
                                el.attr("src", url);
                            } else {
                                el.load(url, {}, function() {
                                    el.removeClass('bgloading');
                                });
                            }
                            el.removeAttr(params.urlSource);
                        }
                    }
                });
            };
            /*第一次初始化*/
            loading();
            container.off('scroll', loading).on('scroll', loading);
        },
        /* !
         * 获取url参数数组
         * */
        getUrlParams: function() {
            let url = arguments.length > 0 ? arguments[0] : window.location.href,
                theRequest = {},
                index = url.indexOf('?');
            if (index > -1) {
                let str = url.substr(index + 1),
                    strs = str.split('&');
                for (let i = 0; i < strs.length; i++) {
                    let stomp = strs[i].split('=');
                    theRequest[stomp[0]] = stomp[1];
                }
            }
            return theRequest;
        },
        /* !
         * 本地存储
         * */
        localData: {
            setData: function(key, value) {
                window.localStorage.setItem(key, value);
            },
            getData: function(key) {
                let data = window.localStorage.getItem(key);
                return !!data ? data : '';
            },
            removeData: function(key) {
                window.localStorage.removeItem(key);
            },
            clearAllData: function() {
                window.localStorage.clear();
            },
            setCookie: function(key, value, day) {
                let exp = new Date(),
                    days = day ? day : 30;
                exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
                this.setBaseCookie(key, value, exp, "/");
            },
            setBaseCookie: function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
                let sCookie = sName + "=" + encodeURIComponent(sValue);
                if (oExpires) {
                    sCookie += "; expires=" + oExpires.toGMTString();
                }
                if (sPath) {
                    sCookie += "; path=" + sPath;
                }
                if (sDomain) {
                    sCookie += "; domain=" + sDomain;
                }
                if (bSecure) {
                    sCookie += "; secure";
                }
                document.cookie = sCookie;
            },
            getCookie: function(sName) {
                let sRE = "(?:; )?" + sName + "=([^;]*);?",
                    oRE = new RegExp(sRE);

                if (oRE.test(document.cookie)) {
                    return decodeURIComponent(RegExp["$1"]);
                } else {
                    return null;
                }
            },
            deleteCookie: function(sName, sPath, sDomain) {
                this.setCookie(sName, '', new Date(0), sPath, sDomain);
            }
        },
        /* !
         * 判断对象，字符串等是否为空 false-为空
         * */
        empty: function(obj) {
            if (!obj || obj == "" || obj == '--') {
                return false;
            } else if (typeof obj === "object") {
                for (let prop in obj) {
                    return true;
                }
                return false;
            }
            return true;
        }
    });
    /* *
     * 加载完成后初始化系统
     * */
    $(function() {
        module.init();
    });
    /* ！ 挂载到window全家变量 */
    window.EVENT = EVENT;
    window.module = module;
})()