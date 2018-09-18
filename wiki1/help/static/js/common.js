(function () {
	var config = {
		debug: true,
		scrollloading: false
	}, EVENT = {
		CONTEXTMENU: 'CONTEXTMENU',  					/* ! 右键事件*/
		LOADREADY: 'LOADREADY',							/* ! 加载成功*/
		TAB: {
			NEW: 'NEW',									/* ! 新建tab*/
			LOADING: 'LOADING',							/* ! tab加载中*/
			CHANGE: 'CHANGE',							/* ! tab切换*/
			DELETE: 'DELETE',							/* ! 移除tab*/
			SUCCESS: 'SUCCESS',                         /* ! tab加载成功*/
			ERROR: 'ERROR',                   			/* ! tab加载失败*/
			RELOAD: 'RELOAD',                   		/* ! tab刷新加载*/
			CLEAR: 'CLEAR'                   			/* ! 清除所有tab*/
		},
		ALERT: 'ALERT',									/* ! 打印提示*/
		INIT: {
			DOTREE: 'DOTREE',							/* ! 监听初始化*/
			RESET: 'RESET'								/* ! 初始化搜索框 */
		}
	}, module = {
		params: {
			alertTime: null
		},
		/*消息执行函数*/
		messageCallBack: {},
		/* ! do 事件*/
		doTree: {},
		/* ! click 事件*/
		clickTree: {},
		init: function () {
			/* ! 屏蔽鼠标的右键菜单*/
			document.oncontextmenu = function () {
				$(document).trigger(EVENT.CONTEXTMENU);
				return false;
			}
			/* ！ 添加全局基本事件监听 和 添加 默认事件处理 */
			module.initListener();
			/* ! 重写系统console.log方法*/
			if (!config.debug) {
				window.console.log = $.noop;
			}
		},
		/*继承函数*/
		extend: function (a, b) {
			if (typeof a == 'string') {
				module[a] = b;
			} else {
				for (var funcName in a) {
					module[funcName] = a[funcName];
				}
			}
		}
	};
    /* *
    * 使用继承方法完成基本功能方法定义
    * */
	module.extend({
		initListener: function () {
			var initFN = {
				doTree: function (el) {
					var els = el ? el.find('[data-do]') : $('[data-do]');
					els.each(function () {
						var dowhat = $(this).attr('data-do');
						if (dowhat && module.doTree[dowhat] && $.isFunction(module.doTree[dowhat]))
							module.doTree[dowhat].call(this);
					});
				}
			};
			/* ! 全局事件处理 */
			initFN.doTree();
			$(document).on(EVENT.INIT.DOTREE, function (e, el) {
				initFN.doTree($(el));
			});
			/* ! 全局添加处理 data-click事件处理 */
			$(document).on('click', '[data-click]', function () {
				var dowhat = $(this).attr('data-click');
				if (dowhat && module.clickTree[dowhat] && $.isFunction(module.clickTree[dowhat]))
					module.clickTree[dowhat].call(this);
			});
			/* ! 添加消息通知 */
			window.addEventListener('message', function (event) {
				var data = event.data;
				if (data.call && module.messageCallBack[data.call] && $.isFunction(module.messageCallBack[data.call]))
					module.messageCallBack[data.call].call(data);
			}, false);
		},
		$http: function (url, params, cb, op) {
			var options = {
				type: 'POST',
				datatype: 'JSON',
				isform: false,
				error: null
			}, ajaxOptions = {
				url: url,
				data: {},
				headers: { "mtk": module.localData.getData('usermtk') },
				crossDomain: true,
				beforeSend: function(){  //开始loading
                    module.loading.show();
                },
				success: function (data) {
					module.loading.hide();
					if (data.resCode == 1) {
						cb.call(data);
					} else {
						if (data.resMsg[0].msgCode == 10005) {
							module.urlToLocation(API.base.login);
						} else {
							module.alert(data.resMsg[0].msgText);
						}
					}
				},
				complete: function(){
                	module.loading.hide();
                }
			};
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
				if (options.type.toLocaleUpperCase() == 'POST') {
					ajaxOptions.data = JSON.stringify(params);
				}
			}
			if (url) {
				$.ajax(ajaxOptions);
			}
		},
		/**
         * 时间结束后移除元素
         * */
		timeToRemove: function (el, time) {
			time = time ? time : 600;
			if (el.hasClass('animated')) {
				el.removeClass('active');
			} else {
				el.parent().find('.animated.zoom.active').removeClass('active');
			}
			setTimeout(function () {
				el.remove();
			}, time);
		},
        /* *
         * toast 弹出提示，仿照app
         * @param info  信息提示内容
         * @param time  信息提示显示时间
         * */
		alert: function (op) {
			var options = {
				info: 'this alert info!',
				time: 2000
			};
			if (typeof op == 'string') {
				options.info = op;
			} else {
				$.extend(options, op);
			}
			var toast = $('.toast');
			if (toast.length) {
				clearTimeout(module.params.alertTime);
				toast.text(options.info);
			} else {
				$('body').append('<div class="toast animated zoom active">' + options.info + '</div>');
			}
			module.params.alertTime = setTimeout(function () {
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
			show: function (html) {
				html = html ? html : '';
				var backdrop = $('.backdrop');
				if (backdrop.length) {
					backdrop.html(html);
				} else {
					$('body').append('<div class="backdrop">' + html + '</div>');
				}
			},
			hide: function () {
				var el = $('.backdrop').find('.animated.zoom.active');
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
		scrollLoading: function (options) {
			var defaults = {
				elSelector: '[data-loading]',
				selector: window,
				urlSource: 'data-url'
			}, container;
			var params = $.extend({}, defaults, options || {});
			container = $(params.selector);
			var loading = function () {
				var contHeight = container.height(), contop = 0, els;
				els = $(elSelector);
				if (params.selector == window) {
					contop = $(window).scrollTop();
				} else {
					contop = container.offset().top;
				}
				$.each(els, function (k, v) {
					var el = $(v), tag = v.nodeName.toLowerCase(), url = $(v).attr(params.urlSource), post, posb;
					if (url) {
						post = el.offset().top - contop, posb = post + el.height();
						if (el.is(':visible') && (post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
							el.addClass('bgloading');
							if (tag === "img") {
								el.attr("src", url);
							} else {
								el.load(url, {}, function () {
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
		getUrlParams: function () {
			var url = arguments.length > 0 ? arguments[0] : window.location.href;
			var theRequest = {}, index = url.indexOf('?');
			if (index > -1) {
				var str = url.substr(index + 1);
				var strs = str.split('&');
				for (var i = 0; i < strs.length; i++) {
					var stomp = strs[i].split('=');
					theRequest[stomp[0]] = stomp[1];
				}
			}
			return theRequest;
		},
        /* !
         * 本地存储
         * */
		localData: {
			setData: function (key, value) {
				window.localStorage.setItem(key, value);
			},
			getData: function (key) {
				var data = window.localStorage.getItem(key);
				return !!data ? data : '';
			},
			removeData: function (key) {
				window.localStorage.removeItem(key);
			},
			clearAllData: function () {
				window.localStorage.clear();
			},
			setCookie: function (key, value, day) {
				var exp = new Date(), days = day ? day : 30;
				exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
				this.setBaseCookie(key, value, exp, "/");
			},
			setBaseCookie: function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
				var sCookie = sName + "=" + encodeURIComponent(sValue);
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
			getCookie: function (sName) {
				var sRE = "(?:; )?" + sName + "=([^;]*);?";
				var oRE = new RegExp(sRE);

				if (oRE.test(document.cookie)) {
					return decodeURIComponent(RegExp["$1"]);
				} else {
					return null;
				}
			},
			deleteCookie: function (sName, sPath, sDomain) {
				this.setCookie(sName, '', new Date(0), sPath, sDomain);
			}
		},
		/* !
         * 时间戳转换
         * */
		FormatDate: function (obj, format) {//format:  "yyyy-m-d h:i:s.S","yyyy年mm月dd日 hh:ii:ss"  default: "yyyy-mm-dd hh:ii:ss"
			var obj = parseInt(obj);
			var date = new Date(obj);
			var data = {
				"m+": date.getMonth() + 1,                 //月   
				"d+": date.getDate(),                    //日   
				"h+": date.getHours(),                   //小时   
				"i+": date.getMinutes(),                 //分   
				"s+": date.getSeconds(),                 //秒   
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
				"S": date.getMilliseconds()             //毫秒   
			};
			if (!format) {
				format = "yyyy-mm-dd hh:ii:ss";
			}
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (var k in data) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (data[k]) : (("00" + data[k]).substring(("" + data[k]).length)));
				}
			}
			return format;
		},
		/* !
         * 判断对象，字符串等是否为空 false-为空
         * */
		empty: function(obj) {
            if (!obj || obj == "" || obj == '--') {
                return false;
            } else if (typeof obj === "object") {
                for (var prop in obj) {
                    return true;
                }
                return false;
            }
            return true;
        },
	});
	/* *
	* 加载完成后初始化系统
	* */
	$(function () {
		module.init();
	});
	/* ！ 挂载到window全家变量 */
	window.EVENT = EVENT;
	window.module = module;
})()
