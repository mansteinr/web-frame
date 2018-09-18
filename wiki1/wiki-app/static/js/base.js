/**
 * 自定义基本类库，依赖于zepto或jquery
 * */
(function(_$) {
	/* ！定义 module 和基本方法*/
	var config = {
		version: '1.0.0',
		debug: true
	},params = {
		alertTime: null, /* 记录alert 时间*/
	},module = {
		EVENT: {
			BACKDROP: 'BACKDROP', /* ! 点击了背景 */
		},
		NATIVE: {
			PULL: {
				startPullDown: 'startPullDown', 		/* ! 开始下拉刷新*/
				endPullDown: 'endPullDown',				/* ! 结束下拉刷新*/
				startPullUp: 'startPullUp',				/* ! 开始上拉刷新*/
				endPullUp: 'endPullUp',					/* ! 结束上拉刷新*/
				noData: 'noData',						/* ! 没有上拉刷新，无数据*/
			},
			BACK: {
				registerBack: 'registerBack',			/* ! 注册返回键 */
				releaseBack: 'releaseBack'				/* ! 释放返回键 */
			},
			MESSAGE: {
				TOAST: 'toast'							/* ! toast 提示 */
			}
		},
		TOSELF: {
			PULL: {
				pullDown: 'pullDown',					/* ! 下拉刷新触发 */
				pullUp: 'pullUp'						/* ! 上拉刷新触发 */
			},
			back: 'back'								/* ! 返回键回调 */
		},
		/* ! 设置config */
		setConfig: function(a, b) {
			if(typeof a == 'string') {
				if(config[a]) {
					config[a] = b;
				}
			} else {
				for (var configKey in a) {
					module.setConfig(configKey,a[configKey]);
	            }
			}
		},
		/*消息执行函数*/
    	messageCallBack: {},
		/* ! 模块方法继承函数*/
		extend: function(a, b) {
			if (typeof a == 'string') {
	            module[a] = b;
	        } else {
	            for (var funcName in a) {
	            	module.extend(funcName,a[funcName]);
	            }
	        }
		},
		init: function() {
			/* ! 添加跳转过滤  */
	       	module.linkFilter();
            /* ! 重写系统console.log方法*/
            if(!config.debug) {
            	window.console.log = $.noop;
            }
		}
	};
	/* ！ 使用extend 继承扩展方法 */
	module.extend({
		linkFilter: function() {
			var linkFilter = function(e) {
				e.preventDefault();
				var _this = $(this),op = _this.data();
				module.urlToLocation(module.linkFormat(op));
			};
			$('[data-href]').off('tap',linkFilter).on('tap',linkFilter);
		},
		/* 新建页面 数据转换*/
		linkFormat: function(op) {
			var options = {
				title: '打开标题',
				tc: '',
				fv: false,
				back: true,
				href: '',
				bc: '',
				hbar: true,
				opacity: 1,
				pdown: false,
				pup: false,
				reload: false,
				share: false
			};
			$.extend(options,op);
			return {
				title: options.title,
				titleColor: options.tc,
				fullView: options.fv,
				hasBack: options.back,
				url: options.href || options.url,
				barColor: options.bc,
				hasBar: options.hbar,
				opacity: options.opacity,
				pullDown: options.pdown,
				pullUp: options.pup,
				tools: {
					reload: options.reload,
					share: options.share
				}
			};
		},
		/* *
         * 链接跳转
         * @params op 
         * 	@params title 新建窗口title
         * 	@params titleColor title颜色
         * 	@params fullView 是否全屏
         * 	@params hasBack 是否有返回按钮
         *	@params url 新建窗口url
         * 	@params barColor 导航条颜色
         *  @params hasBar 是否有导航条
         * 	@params opacity 导航条透明度
         * 	@params pullDown 是否存在下拉刷新
         * 	@params pullUp 是否存在上拉刷新
         *  @params tools 工具栏
         * 		@params reload 是否有刷新功能
         * 		@params share 是否有分享功能
         * */
		urlToLocation: function (op) {
			var options = {
				title: '打开标题',
				titleColor: '',
				fullView: false,
				hasBack: true,
				url: '',
				barColor: '',
				hasBar: true,
				opacity: 1,
				pullDown: false,
				pullUp: false,
				tools: {
					reload: false,
					share: false
				}
			};
			$.extend(options,op);
			if(options.url) {
				if(typeof viewModule != 'undefined') {
					viewModule.newWindow(null,null,options);
				} else {
					window.location.href = window.location.href.split('www')[0] + 'www/' + options.url;
				}
			}
        },
        $http: function (url, params, cb, errorcb,dataType) {
        	if(url){
        		$.ajax({
	                type: 'POST',
	                url: url,
	                data: {param: JSON.stringify(params)},
	                dataType: dataType||'json',
	                headers:{actk:module.localData.getData('useractk'),projectCode:'uang-xpress'},
	                timeout: 10000,
	                success: function(data) {
						module.loading.hide();
						if(data.resCode == 1){
							cb.call(data);
						} else {
							var msgCode = data.resMsg[0].msgCode;
							/*通知结束刷新*/
							module.postToNativeMessage({call: module.NATIVE.PULL.endPullDown});
							module.postToNativeMessage({call: module.NATIVE.PULL.endPullUp});
						    if(msgCode == 10005 || msgCode == 10006){
								module.goLogin();
							}else{
								module.alert(data.resMsg[0].msgText);
							}
						}
					},
	                error: errorcb || function(){
	                    module.loading.hide();
	                    module.postToNativeMessage({call: module.NATIVE.PULL.endPullDown});
	                    module.postToNativeMessage({call: module.NATIVE.PULL.endPullUp});
	                    module.alert('呀，加载失败啦！');
	                }
	            });
        	}
        },
        uploadFile: function(formData,cb) {
        	module.loading.show();
        	var userInfoStr = module.localData.getData('userinfo'),username = 'noUser';
			if(userInfoStr) {
				userInfoStr = JSON.parse(userInfoStr);
				username = userInfoStr.name;
			}
        	$.ajax({
                type: 'POST',
                url: API.base.upload,
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                headers:{mvUserName: username,sysName:'uang-xpress'},
                timeout: 10000,
                success: function(data) {
                	var data = JSON.parse(data);
					module.loading.hide();
					cb.call(data);
				},
                error: function(){
                    module.loading.hide();
                    module.alert('文件上传失败！');
                }
            });
        },
        goLogin: function() {
        	module.alert('您未登录，请先登录！',1000);
        	setTimeout(function() {
        		module.urlToLocation({
	        		title: 'Login',
					url: 'views/login.html',
					fullView: true,
					opacity: 0
	        	});
        	},1000);
        },
        checkLogin: function(cb) {
        	var actk = module.localData.getData('useractk');
        	if(actk) {
        		module.loading.show();
	        	module.$http(API.userApi.checkLogin,{},function() {
	        		cb.call();
	        	});
        	} else {
        		module.goLogin();
        	}
        },
        platForms: {
            ua: window.navigator.userAgent,
            is: function (type) {
                type = type.toLowerCase();
                return this.ua.toLowerCase().indexOf(type) >= 0;
            },
            isMobile: function () {
                return !!this.ua.match(/(iPhone|iPod|Android|ios)/i);
            },
            isIOS: function () {
                return !!this.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            },
            isIPad: function () {
                return this.is("ipad");
            },
            isiPhone: function () {
                return this.is("iPhone");
            },
            isAndroid: function () {
                return this.is('android') || this.is('Linux');
            },
            isWindowsPhone: function () {
                return this.is("Windows Phone");
            },
            isWx: function () {
                return this.is("micromessenger");
            },
            isApp: function () {
                return this.is("minivision");
            }
        },
        /**
         * 滑动到底端
         * */
        scrollBottom: function(el){
            var scrollBar = el?$(el):$('html, body');
            scrollBar.scrollTop(scrollBar[0].scrollHeight);
        },
        /**
         * 页面滑动到顶部
         * */
        scrollTop: function(el){
            var scrollBar = el?$(el):$('html, body');
            scrollBar.scrollTop(0);
        },
        /* *
         * 滚动加载
         * @function elSelector 加在内容选择器
         * @function selector 选择器
         * */
        scrollLoading: function(elSelector,selector){
            var attr='data-url',container = selector?$(selector):$(window),els;
            if(selector){
                container = $(selector);
                els = elSelector?container.find(elSelector + '['+attr+']'):container.find('['+attr+']');
            } else {
                container = $(window);
                els = elSelector?$(elSelector + '['+attr+']'):$('['+attr+']');
            }
            var loading = function(){
                var contHeight = container.height(),contop = 0;
                if (selector) {
                    contop = container.offset().top;
                } else {
                    contop = $(window).scrollTop();
                }
                $.each(els,function(k,v){
                    var el = $(v),tag = v.nodeName.toLowerCase(), url = $(v).attr(attr), post, posb;
                    if(url){
                        post = el.offset().top - contop, posb = post + el.height();
                        if (el.is(':visible') && (post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                            el.addClass('bgloading');
                            if (tag === "img") {
                                el.attr("src", url);
                            } else {
                                el.load(url, {}, function(){
                                    el.removeClass('bgloading');
                                });
                            }
                            el.removeAttr(attr);
                        }
                    }
                });
            };
            /*第一次初始化*/
            loading();
            container.off('scroll',loading).on('scroll',loading);
        },
        /**
         * 时间结束后移除元素
         * */
        timeToRemove: function(el,time){
            setTimeout(function(){
                el.remove();
            },time);
        },
        /* *
         * 显示提示信息
         * @params info 显示信息
         * @params time 定时器，定时取消显示，默认2000ms
         * */
        alert: function (info, time) {
        	if(module.platForms.isApp()) {
        		module.postToNativeMessage({call: module.NATIVE.MESSAGE.TOAST,data: info});
        	} else {
        		var toast = $(".toast");
	            info = info || 'this alert info !';
	            time = time || 2000;
	            if (!toast.length) {
	                var html = '<div class="toast animated zoom active">' + info + "</div>";
	                $("body").append(html);
	                toast = $(".toast");
	            } else {
	            	clearTimeout(params.alertTime);
	                toast.text(info);
	            }
	            params.alertTime = setTimeout(function () {
	                toast.removeClass("active");
	                module.timeToRemove(toast, 2000);
	            }, time);
        	}
        },
        /* *
         * 显示加载
         * @function show 显示
         * @function hide 隐藏
         * */
        loading: {
            show: function(){
                var loading = $('.loading');
                if(loading.length < 1){
                	module.backdrop.show(true);
                	$('body').append('<div class="loading animated zoom active"></div>');
                }
            },
            hide: function(){
            	var loading = $('.loading').removeClass('active');
                module.backdrop.hide();
                module.timeToRemove(loading, 600);
            }
        },
        /**
         * 显示幕布
         * @function show
     	 *	@param nobg 是否显示幕布背景
         * @function hide 移除幕布
         */
        backdrop: {
            show: function(nobg){
            	var backdrop = $('.backdrop');
            	if(backdrop.length) {
            		!!nobg ? backdrop.removeClass('no-bg') : backdrop.addClass('no-bg');
            	} else {
            		var html = !!nobg?'<div class="backdrop no-bg"></div>':'<div class="backdrop"></div>';
            		backdrop=  $(html);
            		$('body').append(backdrop);
            	}
            	/* ！ 点击抛出事件 */
            	backdrop.off('tap').on('tap',function() {
            		$(document).trigger(module.EVENT.BACKDROP);
            	});
            },
            hide: function(target){
            	$('.backdrop').remove();
            }
        },
        /* *
         * 显示弹出窗
         * @function show 显示
         *  @param op 参数
	     *      @param title 弹出框标题，字符串为空不显示
	     *      @param content 内容，可以为信息也可为html
	     * 		@param class 弹出框添加 class
	     *      @param style 弹出框添加 style
	     *      @param btns 按钮组，按钮组平分大小,自定义按钮组 {title: '',callback: ,style:'', class: ''}
	     *      @param okCall 确定按钮的calllback，如果为空没有确定按钮
	     * 		@param okName 确定按钮 显示 名字
	     *  	@param cancelCall 取消按钮的callback，如果为空没有取消按钮
	     *      @param cancelName 取消按钮 显示 名字
	     * 		@param autoClose 点击按钮是否自动关闭dialog，默认false
	     *      @param nobg 是否显示背景颜色，默认背景颜色为rgba(0,0,0,。4)
	     * 		@param bclose 是否点击背景关闭dialog，默认false
	     * 		@param callback dialog 初始化完成后的回调
         * @function hide 隐藏
         * */
        dialog: {
            show: function(op){
                var options = {
                    title: '',
                    content: '',
                    class: '',
                    style: '',
                    btns: [],
                    okCall: null,
                    okName: '确定',
                    cancelCall: null,
                    cancelName: '取消',
                    autoClose: false,
                    nobg: false,				
                    bclose: false,
                    callback: $.noop
                },callBacks = {};
                $.extend(options,op);
                var dialog = $('.dialog');
                if(dialog.length){
                    dialog.remove();
                }
                dialog = $('<div class="dialog animated'+ (options.class?' '+options.class:'') +'"'+ (options.style?' style="'+options.style+'" ':'') +'></div>');
                if(options.title){
                    dialog.append('<div class="dialog-header text-warp line-bottom">'+options.title+'</div>');
                }
                dialog.append('<div class="dialog-content">'+options.content+'</div>');
                var dialogFooter = $('<div class="dialog-footer flex-warp line-top"></div>');
                if(options.cancelCall != null) {
                    callBacks.cancel = options.cancelCall;
                    dialogFooter.append('<span class="dialog-btn dialog-cancel line-right flex-con" data-tap="cancel">'+options.cancelName+'</span>');
                }
                var btnLen = options.btns.length,noLine = options.okCall == null;
                if(btnLen){
                    for(var i = 0;i< btnLen; i++){
                        var btn = options.btns[i];
                        callBacks['btn'+i] = btn.callback;
                        var appendHtml = '';
                        if(i == btnLen - 1 &&　noLine) {
                        	appendHtml = '<span class="dialog-btn flex-con';
                        } else {
                        	appendHtml = '<span class="dialog-btn line-right flex-con';
                        }
                        appendHtml += (btn.class?' '+btn.class:'')+'"'+(btn.style?' style="'+btn.style+'" ':'')+'data-tap="btn'+i+'">'+btn.title+'</span>'; 
                        dialogFooter.append(appendHtml);
                    }
                } 
                if(options.okCall != null) {
                    callBacks.ok = options.okCall;
                    dialogFooter.append('<span class="dialog-btn flex-con" data-tap="ok">'+options.okName+'</span>');
                }
                /* ! 添加背景点击关闭操作*/
               	if(options.bclose) {
               		$(document).off(module.EVENT.BACKDROP,module.dialog.hide).on(module.EVENT.BACKDROP,module.dialog.hide);
               	}
                dialogFooter.on('tap',function(e){
                	if(options.autoClose) {
                		module.dialog.hide();
                	}
                    var callName = $(e.target).data('tap');
                    if(callName && callBacks[callName] && $.isFunction(callBacks[callName])){
                        callBacks[callName].call();
                    }
                });
                dialog.append(dialogFooter);
                module.backdrop.show(options.nobg);
                $('body').append(dialog);
                dialog.css('margin-top',-dialog.height()/2).addClass('zoom active');
                options.callback.call(dialog);
                /*注册返回键*/
               	module.postToNativeMessage({call: module.NATIVE.BACK.registerBack});
            },
            hide: function(){
            	module.backdrop.hide();
            	/*释放返回键*/
				module.postToNativeMessage({call: module.NATIVE.BACK.releaseBack});
                var dialog = $('.dialog').removeClass("active");
               	module.timeToRemove(dialog,600);
            }
        },
        /* *
         * 显示弹出窗
         * @function show 显示
         *  @param op 参数
	     *      @param title 弹出框标题，字符串为空不显示
	     *      @param content 内容，可以为信息也可为html
	     * 		@param class 弹出框添加 class
	     *      @param style 弹出框添加 style
	     *      @param btns 按钮组，按钮组平分大小,自定义按钮组 {title: '',callback: ,style:'', class: ''}
	     *      @param okCall 确定按钮的calllback，如果为空没有确定按钮
	     * 		@param okName 确定按钮 显示 名字
	     *  	@param cancelCall 取消按钮的callback，如果为空没有取消按钮
	     *      @param cancelName 取消按钮 显示 名字
	     * 		@param autoClose 点击按钮是否自动关闭dialog，默认false
	     *      @param nobg 是否显示背景颜色，默认背景颜色为rgba(0,0,0,。4)
	     * 		@param bclose 是否点击背景关闭dialog，默认true
	     *		@param callback popup 初始化完成后的回调
         * @function hide 隐藏
         * */
        popup: {
            show: function(op) {
                var options = {
                    title:'',
                    content:'',
                    class: '',
                    style: '',
                    btns: [],
                    okCall: null,
                    okName: '确定',
                    cancelCall: null,
                    cancelName: '取消',
                    autoClose: false,
                    nobg: false,
                    bclose: true
                },callBacks = {};
                $.extend(options,op);
                var popup = $('.popup');
                if(popup.length){
                    popup.remove();
                }
                popup = $('<div class="popup animated'+ (options.class?' '+options.class:'') +'"'+ (options.style?' style="'+options.style+'" ':'') +'></div>');
                if(options.title){
                    popup.append('<div class="popup-header text-warp line-bottom">'+options.title+'</div>');
                }
                popup.append('<div class="popup-content">'+options.content+'</div>');
                var popupFooter = $('<div class="popup-footer flex-warp line-top"></div>');
                if(options.cancelCall != null) {
                    callBacks.cancel = options.cancelCall;
                    popupFooter.append('<span class="popup-btn popup-cancel line-right flex-con" data-tap="cancel">'+options.cancelName+'</span>');
                }
                var btnLen = options.btns.length,noLine = options.okCall == null;
                if(btnLen){
                    for(var i = 0;i< btnLen; i++){
                        var btn = options.btns[i];
                        callBacks['btn'+i] = btn.callback;
                        var appendHtml = '';
                        if(i == btnLen - 1 &&　noLine) {
                        	appendHtml = '<span class="popup-btn flex-con';
                        } else {
                        	appendHtml = '<span class="popup-btn line-right flex-con';
                        }
                        appendHtml += (btn.class?' '+btn.class:'')+'"'+(btn.style?' style="'+btn.style+'" ':'')+'data-tap="btn'+i+'">'+btn.title+'</span>'; 
                        popupFooter.append(appendHtml);
                    }
                } 
                if(options.okCall != null) {
                    callBacks.ok = options.okCall;
                    popupFooter.append('<span class="popup-btn flex-con" data-tap="ok">'+options.okName+'</span>');
                }
                /* ! 添加背景点击关闭操作*/
               	if(options.bclose) {
               		$(document).off(module.EVENT.BACKDROP,module.popup.hide).on(module.EVENT.BACKDROP,module.popup.hide);
               	}
                popupFooter.on('tap',function(e){
                	if(options.autoClose) {
                		module.popup.hide();
                	}
                    var callName = $(e.target).data('tap');
                    if(callName && callBacks[callName] && $.isFunction(callBacks[callName])){
                        callBacks[callName].call();
                    }
                });
                popup.append(popupFooter);
                module.backdrop.show(options.nobg);
                $('body').append(popup);
                popup.addClass('sliderUp active');
                options.callback.call(popup);
                /*注册返回键*/
               	module.postToNativeMessage({call: module.NATIVE.BACK.registerBack});
            },
            hide: function(){
            	module.backdrop.hide();
            	/*释放返回键*/
				module.postToNativeMessage({call: module.NATIVE.BACK.releaseBack});
            	var popup = $('.popup').removeClass('active');
                module.timeToRemove(popup,600);
            }
        },
        /* *
         * 动态加载js方法
         * */
        loadScript: function (url, cb) {
            if (!url)
                return;
            var heade = document.getElementsByTagName("head")[0];
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            heade.appendChild(script);
            if (!!cb) {
                if (document.all) {
                    script.onreadystatechange = function () {
                        var state = this.readyState;
                        if (state === 'loaded' || state === 'complete') {
                            cb();
                        }
                    }
                } else {
                    script.onload = function () {
                        cb();
                    }
                }
            }
        },
        /* *
         * 获得url参数数组
         * */
        getUrlPars: function () {
            var url = arguments.length>0?arguments[0]:window.location.href;
            var theRequest = {},index = url.indexOf("?");
            if (index != -1) {
                var str = url.substr(index+1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var sTemp = strs[i].split("=");
                    theRequest[sTemp[0]] = (sTemp[1]);
                }
            }
            return theRequest;
        },
        /* *
         * 获得hash 锚点值
         * */
        getHash: function(){
            if(arguments.length>0){
                var hashs = arguments[0].split('#');
                return hashs.length>1?hashs[1].split('?')[0]:'';
            }
            var hash = window.location.hash;
            return hash?hash.substr(1).split('?')[0]:hash;
        },
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
        postMessage: function(op){
    		var options = {
    			call: '',
        		data: null
    		};
    		$.extend(options, op);
    		if(options.call && module.messageCallBack[options.call] && $.isFunction(module.messageCallBack[options.call]))
	        	module.messageCallBack[options.call].call(options);
    	},
    	postToNativeMessage: function(op) {
    		if(typeof viewModule != 'undefined') {
				viewModule.postMessage(null,null,op);
			} 
    	},
    	/* * native 方法*/
    	closeToWindow: function(op) {
    		var options = {
    			reload: false,
    			step: 1
    		};
    		$.extend(options, op);
    		if(typeof viewModule != 'undefined') {
				viewModule.closeToWindow(null,null,options);
			} else {
				window.history.go(-options.step);
			}
    	},
    	fileManage: {
    		formData: function(op) {
    			var options = {
    				name: 'file',
    				dataURI: '',
    				type: 'image/jpeg',
    				fileName: "file_" + Date.parse(new Date()) + ".jpeg"
    			},formData;
    			$.extend(options, op);
    			if(!!options.dataURI) {
    				formData = new FormData();
    				var $Blob = module.fileManage.toBlobBydataURI(options.dataURI,options.type);
    				formData.append(options.name, $Blob, options.fileName);
    			}
    			return formData;
    		},
    		toBlobBydataURI: function(dataURI, type) {
    			var binary = atob(dataURI.split(',')[1]);
				var array = [];
				for(var i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], {
					type: type
				});
    		}
    	}
	});
	/* ! 初始化 */
	module.init();
	/* *
     * 定义window全局变量module
     * */
    window.module = module;
})($)
