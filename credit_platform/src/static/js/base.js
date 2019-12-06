(function () {
  let params = {
    tabs: {},				//存储tab
    tabFix: 'tab',			//存储tab前缀
  };
  module.extend({
    loading: {
      show: function (info) {
        info = info ? info : '数据加载中，请稍后...';
        let html = '<div class="loading">' + info + '</div>';
        module.backdrop.show(html);
      },
      hide: function () {
        module.backdrop.hide();
      }
    },
    /* ! 向iframe 通知消息*/
    postMessage: function (op) {
      let options = {
        tabid: null,
        call: null,
        data: null
      }, iframeEls;
      $.extend(options, op);
      if (options.tabid) {
        iframeEls = $('.main-page-item[data-tabid="' + options.tabid + '"] iframe');
      } else {
        iframeEls = $('#main-pages iframe');
      }
      if (iframeEls.length) {
        $.each(iframeEls, function (k, v) {
          v.contentWindow.postMessage(options, '*');
        });
      }
    },
		//  url定向
    urlToLocation: function (url) {
      url = url ? url : '';
      window.location.href = url;
    },
		//  tab菜单管理
    tabManage: {
      init: function () {
        /* ! tab区域添加监听*/
        $('#tab-space').on('click', function (e) {
          let _target = $(e.target);
          if (_target.hasClass('tab-close')) {
            $(document).trigger(EVENT.TAB.DELETE, _target.closest('.tab-item').attr('data-tabid'));
          } else if (_target.hasClass('tab-item')) {
            $(document).trigger(EVENT.TAB.CHANGE, _target.attr('data-tabid'));
          }
        });
        $(window).resize(function () { module.tabManage.tabReset(); });
        let wheelFn = function (e) {
          e = e || window.event;
          let delta = e.wheelDelta || e.detail, removeDis = 20;
          if (delta < 0) removeDis = -removeDis;
          module.tabManage.tabReset(removeDis);
        };
        $('#tab-space').closest('.main-tabs').on('mouseover', function () {
          if (this.addEventListener) {
            this.addEventListener('DOMMouseScroll', wheelFn, false);
          }
          this.onmousewheel = wheelFn;
        }).on('mouseout', function () {
          if (this.removeEventListener) {
            this.removeEventListener('DOMMouseScroll', wheelFn, false);
          }
          this.onmousewheel = null;
        });
        /* ! 添加tab监听*/
        $(document).on(EVENT.TAB.NEW, module.tabManage.create);
        $(document).on(EVENT.TAB.CHANGE, module.tabManage.change);
        $(document).on(EVENT.TAB.DELETE, module.tabManage.delete);
        $(document).on(EVENT.TAB.ERROR, module.tabManage.error);
        $(document).on(EVENT.TAB.RELOAD, module.tabManage.reload);
        $(document).on(EVENT.TAB.LOADING, module.tabManage.loading);
        $(document).on(EVENT.TAB.SUCCESS, module.tabManage.success);
        $(document).on(EVENT.TAB.CLEAR, module.tabManage.clear);
      },
      create: function (e, data) {
        let key = params.tabFix + data.tabid;
        if (params.tabs[key] != null) {
          $(document).trigger(EVENT.TAB.CHANGE, data.tabid);
        } else if (data.url) {
          params.tabs[key] = data;
          /**!
           * tab html
           * <div class="tab-item">测试tab<i class="tab-close"></i></div>
           * 显示区域 html
           * <div class="main-page-item active"><iframe src="views/view1.html"></iframe></div>
           * */
          /*! 添加tab*/
          $('#tab-space .tab-item.active').removeClass('active');
          $('#tab-space').append('<div class="tab-item tab-loading active" data-tabid="' + data.tabid + '">' + data.title + '<i class="tab-close"></i></div>');
          /*! 添加显示区域*/
          $('#main-pages').append('<div class="main-page-item" data-tabid="' + data.tabid + '"><iframe onload="module.tabManage.success(this)" src="' + data.url + '"></iframe></div>');
          $(document).trigger(EVENT.TAB.CHANGE, data.tabid);
          module.tabManage.tabController();
        } else {
          module.alert('缺少打开url！');
        }
      },
      change: function (e, tabid) {
        let tabEl = $('#tab-space .tab-item[data-tabid="' + tabid + '"]');
        if (!tabEl.hasClass('active')) {
          $('#tab-space .tab-item.active').removeClass('active');
          tabEl.addClass('active');
        }
        let mainPage = $('#main-pages .main-page-item[data-tabid="' + tabid + '"]');
        if (!mainPage.hasClass('active')) {
          $('#main-pages .main-page-item.active').removeClass('active');
          $('#main-pages .main-page-item[data-tabid="' + tabid + '"]').addClass('active');
        }
        module.tabManage.tabReset();
      },
      delete: function (e, tabid) {
        let key = params.tabFix + tabid;
        if (params.tabs[key] != null) {
          let tabEL = $('#tab-space .tab-item[data-tabid="' + tabid + '"]');
          tabEL.remove();
          if (tabEL.hasClass('active')) {
            let lastTab = $('#tab-space .tab-item:last-child');
            $(document).trigger(EVENT.TAB.CHANGE, lastTab.attr('data-tabid'));
            $('#main-pages .main-page-item[data-tabid="' + tabid + '"]').remove();
          } else {
            $('#main-pages .main-page-item[data-tabid="' + tabid + '"]').remove();
            module.tabManage.tabReset();
          }
          let tabSwap = {};
          $.each(params.tabs, function (k, v) {
            if (v.tabid != tabid) {
              tabSwap[k] = v;
            }
          });
          params.tabs = tabSwap;
          module.tabManage.tabController();
        }
      },
      success: function (e, tabid) {
        if (!tabid) {
          tabid = $(e).closest('.main-page-item').attr('data-tabid');
        }
        let loadEl = $('#tab-space .tab-item[data-tabid="' + tabid + '"]');
        if (loadEl.length) {
          let key = params.tabFix + tabid;
          if (params.tabs[key] == null || params.tabs[key].loadhide) {
            loadEl.removeClass('tab-loading');
          }
        }
      },
      error: function (e, tabid) {

      },
      reload: function (e, tabid) {
        let iframeEl = $('.main-page-item[data-tabid="' + tabid + '"] iframe');
        if (iframeEl.length) {
          $(document).trigger(EVENT.TAB.LOADING, tabid);
          iframeEl.attr('src', iframeEl.attr('src'));
        }
      },
      loading: function (e, tabid) {
        $('#tab-space .tab-item[data-tabid="' + tabid + '"]').addClass('tab-loading');
      },
      clear: function () {
        params.tabs = {};
        $('#tab-space').empty();
        $('#main-pages').empty();
        module.tabManage.tabReset();
        module.tabManage.tabController();
      },
      tabReset: function (wheelRemoveDis) {
        let tabSpace = $('#tab-space'), containerWidth = tabSpace.closest('.main-tabs').width(),
          tabWidth = tabSpace.width(), removeDis = 0, maxDis = containerWidth - tabWidth;
        if (tabWidth > containerWidth) {
          tabSpace.removeClass('has-animated');
          let tabCWidth = 140, tabLeft = tabSpace.position().left;
          if (wheelRemoveDis) {
            removeDis = tabLeft + wheelRemoveDis;
            if (removeDis > 0) {
              removeDis = 0;
            } else if (removeDis < maxDis) {
              removeDis = maxDis;
            }
          } else {
            tabSpace.addClass('has-animated');
            let activeTab = $('#tab-space .tab-item.active'), pleft = activeTab.position().left;
            if (pleft < 0) {
              removeDis = tabLeft - pleft;
            } else if (pleft + tabCWidth > containerWidth) {
              removeDis = tabLeft + containerWidth - pleft - tabCWidth;
            } else if (tabLeft < maxDis) {
              removeDis = maxDis;
            } else {
              removeDis = tabLeft;
            }
          }
        }
        tabSpace.css('transform', 'translateX(' + removeDis + 'px)');
      },
      tabController: function () {
        /* ！ 处理右侧功能菜单 */
        if ($.isEmptyObject(params.tabs)) {
          $('.tabs-controller').hide();
        } else {
          $('.tabs-controller').show();
        }
      }
    }
  });
  /* ！ 定义通信callback */
  module.messageCallBack.messageChannel = function () {
    let call = this.docall;
    if (module.messageCallBack[call] && $.isFunction(module.messageCallBack[call]))
      module.messageCallBack[call].call(this);
    else {
      module.postMessage({
        tabid: this.tabid,
        call: call,
        data: this.data
      });
    }
  }
  /* ！ 定义tab管理 */
  module.messageCallBack.tabManage = function () {
    $(document).trigger(this.ev, this.data);
  }
  /* ！ 定义url定向 */
  module.messageCallBack.urlToLocation = function () {
    module.urlToLocation(this.data);
  }
  /* ! menu tree 折叠树 */
  module.clickTree.collapse = function () {
    let options = {
      target: '', 							/* ! 选择弹开菜单*/
      parent: '',								/* ! 配置父级则 只显示一个*/
      active: 'active',						/* ! 选中class*/
    }, _this = $(this), data = _this.data();
    $.extend(options, data);
    if (_this.hasClass(options.active)) {
      _this.removeClass(options.active);
      if (options.target) {
        $(options.target).removeClass(options.active);
      }
    } else {
      if (options.parent) {
        let activeEls = $(options.parent + ' > .' + options.active + '[data-click="collapse"]');
        activeEls.removeClass(options.active);
        $.each(activeEls, function (k, v) {
          if ($(v).data('target')) {
            $($(v).data('target')).removeClass(options.active);
          }
        });
      }
      _this.addClass(options.active);
      if (options.target) {
        $(options.target).addClass(options.active);
      }
    }
  }
  /* ! 加载新建tab */
  module.clickTree.loadtab = function () {
    let options = {
      title: '新建tab',						/* ! tab标题 */
      url: '',								/* ! 请求url*/
      loadhide: true,							/* ! 请求完成后是否隐藏加载动画*/
      tabid: null,							/* ! tabid*/
    }, _this = $(this), data = _this.data();
    $.extend(options, data);
    if (options.tabid == null) {
      options.tabid = new Date().getTime();
      _this.data('tabid', options.tabid).attr('data-tabid', options.tabid);
    }
    /* ! 新建tab */
    $(document).trigger(EVENT.TAB.NEW, options);
  }
})()