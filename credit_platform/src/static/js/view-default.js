(function () {
  let params = {
    nowTabid: $(window.frameElement).closest('.main-page-item').attr('data-tabid')
  };
  module.extend({
    // url定向
    urlToLocation: function (url) {
      module.postMessage({
        call: 'urlToLocation',
        data: url
      });
    },
    loading: {
      show: function () {
        $(document).trigger(EVENT.TAB.LOADING);
        if (module.loading.checkBackDrop()) {
          module.bloading.show();
        }
      },
      hide: function () {
        $(document).trigger(EVENT.TAB.SUCCESS);
        if (module.loading.checkBackDrop()) {
          module.bloading.hide();
        }
      },
      checkBackDrop: function () {
        let backdrop = $('.backdrop'), canClose = false;
        if (backdrop.find('.loading').length > 0) {
          canClose = true;
        } else if (backdrop.length < 1) {
          canClose = true;
        } else {
          let bEl = backdrop.find('.animated.zoom');
          if (!bEl.hasClass('active')) {
            canClose = true;
          }
        }
        return canClose;
      }
    },
    // 检查form 是否符合提交要求
    checkForm: function (form) {
      let reEls = form.find('[required]'), checkVal = true, checkTypes = {
        tel: /^1[3|4|5|7|8|9][0-9]\d{8}$/,		/*! 匹配手机号 */
        email: /^(\w)+(\.\w)*@(\w)+((\.\w+)+)$/,	/* ! 匹配email */
        chars: /^[\u4E00-\u9FA5a-zA-Z0-9]{1,}$/,	/* ! 禁止输入特殊字符 */
        card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, /* ! 匹配身份证号码 */
        int: /^[0-9]*$/,					/* ! 匹配正整数 */
        pwd: /^[a-zA-Z]\w{5,17}$/,			/* ! 以字母开头，长度在6-18之间，只能包含字符、数字和下划线 密码 */
        num: /^[0-9]+(.[0-9]{1,})?$/,	/* ! 匹配整数和小数 */
      }, addListener = function (el) {
        checkVal = false;
        el.addClass('input-error').on('focus', function () {
          $(this).removeClass('input-error');
          el.off('focus');
        });
      };
      reEls.each(function () {
        if (this.style.display === 'none') return
        let _this = $(this), val = _this.val() || _this.text();
        val = $.trim(val);
        if (!val) {
          /* 是否忽略校验值为空*/
          let ignore = _this.data('ignore');
          if (ignore != true) {
            addListener(_this);
          }
        } else {
          let checkType = _this.data('type');
          if (checkType && checkTypes[checkType] && !checkTypes[checkType].test(val)) {
            addListener(_this);
          }
        }
      });
      return checkVal;
    },
    bloading: {
      show: function (info) {
        info = info ? info : '数据加载中，请稍后...';
        module.backdrop.show('<div class="loading">' + info + '</div>')
      },
      hide: function () {
        module.backdrop.hide();
      }
    },
    // 弹出式popup
    popup: {
      show: function (op) {
        let options = {
          title: 'this is popup title', 				/* ! popup标题 */
          content: '',								/* ! popup内容 */
          bclose: true,								/* ! 点击背景是否关闭，默认false */
          callback: null,								/* ! popup初始化后的回掉 */
          style: ''
        }, paintPopup = function (options) {
          let html = '<div class="popup animated zoom active"';
          if (options.style) {
            html += 'style="' + options.style + '"';
          }
          html += '><div class="popup-title">' +
            options.title + '<i class="iconfont icon-delete close"></i></div><div class="popup-container">' +
            options.content + '</div></div>';
          module.backdrop.show(html);
        };
        $.extend(options, op);
        paintPopup(options);
        /* 添加click监听事件 */
        let _popup = $('.popup'), MTFlag  = options.style.indexOf('margin-top') >= 0
        if(!MTFlag) {
          _popup.css('margin-top', Math.max(-_popup.height(), -300))
        }
        _popup.find('.close').off('click').on('click', function () {
          module.popup.hide();
        });
        if (options.bclose) {
          $('.backdrop').off('click').on('click', function (e) {
            if ($(e.target).eq(0).hasClass("backdrop")) {
              module.popup.hide();
            }
          });
        }
        if (options.callback && $.isFunction(options.callback)) {
          options.callback.call(_popup);
        }
      },
      hide: function () {
        module.backdrop.hide();
      }
    },
    /*
    * confirm
    * */
    confirm: function (op) {
      let options = {
        title: 'this is confirm title', 			/* ! confirm标题 */
        info: '这里是提示信息！',					/* ! confirm提示内容 */
        status: 3,									/* ! confirm状态 */
        bclose: false,								/* ! 点击背景是否关闭，默认false */
        okbtn: '确定',								/* ! 确定按钮文字 */
        cancel: '取消',								/* ! 取消按钮文字 */
        callback: $.noop,							/* ! confirm点击确认回掉 */
        cancelCb: $.noop,							/* ! confirm点击确认回掉 */
      }, statusArray = ['iconfont icon-jinggao', 'iconfont icon-queren', 'iconfont icon-queren1', 'iconfont icon-jinggao'];
      $.extend(options, op);
      let content = `<div class="confirm-info"><i class="${statusArray[options.status]}"></i> <div>${options.info}
        </div></div><div class="confirm-btns"><div class="button button-main">${options.okbtn}</div><div class="button ml" data-click="${options.status === 3 ? 'cancelpopue':'hidepopup'}">${options.cancel}</div></div>`;
      module.popup.show({
        title: options.title,
        content: content,
        bclose: options.bclose,
        callback: function () {
          this.find('.button.button-main').off('click').on('click', function () {
            module.popup.hide();
            options.callback.call();
          });
          this.find('[data-click="cancelpopue"]').off('click').on('click', function () {
            module.popup.hide();
            options.cancelCb.call();
          });
        }
      });
    },
    postMessage: function (op) {
      let options = {
        docall: '',
        tabid: null,
        data: null
      };
      $.extend(options, op);
      options.docall = op.call;
      options.call = 'messageChannel';
      parent.postMessage(options, '*');
    },
    // tab菜单管理
    tabManage: {
      init: function () {
        /* ! 添加tab监听*/
        $(document).on(EVENT.TAB.NEW, module.tabManage.create);
        $(document).on(EVENT.TAB.LOADING, module.tabManage.loading);
        $(document).on(EVENT.TAB.DELETE, module.tabManage.delete);
        $(document).on(EVENT.TAB.CHANGE, module.tabManage.change);
        $(document).on(EVENT.TAB.SUCCESS, module.tabManage.success);
        $(document).on(EVENT.TAB.RELOAD, module.tabManage.reload);
      },
      create: function (e, data) {
        module.tabManage.messagePost(EVENT.TAB.NEW, data);
      },
      delete: function (e, tabid) {
        module.tabManage.messagePost(EVENT.TAB.DELETE, tabid || params.nowTabid);
      },
      change: function (e, tabid) {
        module.tabManage.messagePost(EVENT.TAB.CHANGE, tabid || params.nowTabid);
      },
      success: function (e, tabid) {
        module.tabManage.messagePost(EVENT.TAB.SUCCESS, tabid || params.nowTabid);
      },
      loading: function (e, tabid) {
        module.tabManage.messagePost(EVENT.TAB.LOADING, tabid || params.nowTabid);
      },
      reload: function (e, tabid) {
        module.tabManage.messagePost(EVENT.TAB.RELOAD, tabid || params.nowTabid);
      },
      messagePost: function (ev, data) {
        module.postMessage({
          call: 'tabManage',
          ev: ev,
          data: data
        });
      }
    },
    /* ！分页管理 */
    pageManage: function (op) {
      let options = {
        selector: '.page-navigation',	/* ! 分页容器selector */
        pageTotal: 0,					/* ! 总长度，条数 */
        pageSize: 10,					/* ! 每页条数 */
        pageIndex: 1,					/* ! 当前页码值 */
        showCount: 6					/* ! 显示长度 */
      }, defaultParams = {
        startIndex: 1,					/* ! 页码开始值 */
        endIndex: 1,					/* ! 页码结束值 */
        maxPage: 1						/* ! 最大页码值 */
      }, paintPage = function (op) {
        let html = '<ul class="pagination">';
        if (op.index == 1) {
          html += '<li class="controll-btn disabled"><span class="iconfont icon-arrow1"></span></li><li class="controll-btn disabled"><span class="iconfont icon-arrow3"></span></li>';
        } else {
          html += '<li class="controll-btn" data-index="1"><span class="iconfont icon-arrow1"></span></li><li class="controll-btn" data-index="' +
            (op.index - 1) + '"><span class="iconfont icon-arrow3"></span></li>';
        }
        for (let i = op.start; i < op.end + 1; i++) {
          if (i == op.index) {
            html += '<li class="active" data-index="' + i + '">' + i + '</li>';
          } else {
            html += '<li data-index="' + i + '">' + i + '</li>';
          }
        }
        if (op.index < op.max) {
          html += '<li class="controll-btn" data-index="' + (op.index + 1) + '"><span class="iconfont icon-arrow4"></span></li><li class="controll-btn" data-index="' + op.max + '"><span class="iconfont icon-arrow2"></span></li>';
        } else {
          html += '<li class="controll-btn disabled"><span class="iconfont icon-arrow4"></span></li><li class="controll-btn disabled"><span class="iconfont icon-arrow2"></span></li>';
        }
        html += '</ul>';
        op.el.html(html);
        /*添加监听事件*/
        op.el.find('li').off('click').on('click', function () {
          let _this = $(this), index = _this.attr('data-index');
          if (!_this.hasClass('active') && index) {
            op.el.triggerHandler('pageManageChange', index);
          }
        });
      };
      $.extend(options, op);
      options.pageIndex *= 1;
      if (options.pageTotal > options.pageSize) {
        /* ! 计算最大页码值 */
        defaultParams.maxPage = Math.ceil(options.pageTotal / options.pageSize);
        /* ! 计算开始结束页码值 */
        let dis = Math.floor(options.showCount / 2);
        if (options.pageIndex <= dis) {
          defaultParams.startIndex = 1;
          defaultParams.endIndex = options.showCount > defaultParams.maxPage ? defaultParams.maxPage : options.showCount;
        } else {
          defaultParams.endIndex = options.pageIndex + dis;
          if (defaultParams.endIndex > defaultParams.maxPage) {
            defaultParams.endIndex = defaultParams.maxPage;
          }
          defaultParams.startIndex = defaultParams.endIndex - options.showCount + 1;
          if (defaultParams.startIndex < 1) {
            defaultParams.startIndex = 1;
          }
        }
        if (options.pageIndex > defaultParams.endIndex) {
          options.pageIndex = defaultParams.endIndex;
        }
        /* 绘画分页 */
        paintPage({
          el: $(options.selector),
          start: defaultParams.startIndex,
          end: defaultParams.endIndex,
          index: options.pageIndex,
          showCount: options.showCount,
          max: defaultParams.maxPage
        });
      } else {
        $(options.selector).html('');
      }
    }
  });
	// select选择
  module.doTree.select = function () {
    let options = {
      val: null,			/* ! 默认值 */
      search: false, 		/* ! 是否带search */
      multiple: false,	/* ! 是否支持多选 */
      split: ',' 			/* ! 多选值，分隔符 */
    }, _this = $(this), data = _this.data();
    $.extend(options, data);
    let inputEl = _this.find('input[type="hidden"]'), selectValueEl = _this.find('.selected-value'),
      dropMenu = _this.find('.dropdown-menu'), dropItems = dropMenu.find('.dropdown-item').removeClass('active');
    /* ! 获取选择默认值 */
    if (options.val != 0 && !options.val) {
      let val = inputEl.val();
      if (val != 0 && !val) {
        val = dropItems.eq(0).data('value');
      }
      options.val = val;
    }
    let setDefault = function () {
      /* ! 初始化选择器选择值 */
      let initEl = dropMenu.find('.dropdown-item[data-value="' + options.val + '"]');
      if (initEl.length == 0) {
        initEl = dropItems.eq(0);
      }
      initEl.addClass('active')
      inputEl.val(initEl.data('value'));
      selectValueEl.text(initEl.text()).closest('.select-dropdown').attr('title', initEl.text());
    }, setActive = function () {
      let activeEls = dropMenu.find('.dropdown-item.active'), valArr = [], textArr = [];
      if (activeEls.length) {
        activeEls.each(function () {
          valArr.push($(this).data('value'));
          textArr.push($(this).text());
        });
        inputEl.val(valArr.join(options.split));
        selectValueEl.text(textArr.join(options.split)).closest('.select-dropdown').attr('title', textArr.join(options.split));
      } else {
        inputEl.val('');
        selectValueEl.text('请选择');
      }
    };
    /* !如果是多选，添加多选class */
    if (options.multiple) {
      dropMenu.addClass('multiple');
      if (options.val == 0 || options.val) {
        options.val += '';
        if (options.val.indexOf(options.split) < 0) {
          setDefault();
        } else {
          let valArr = options.val.split(options.split);
          $.each(valArr, function (k, v) {
            dropMenu.find('.dropdown-item[data-value="' + v + '"]').addClass('active');
          });
          setActive();
        }
      } else {
        inputEl.val('');
        selectValueEl.text('');
      }
    } else {
      setDefault();
    }
    if (options.search) {
      /* ! 给item添加拼音码 */
      dropItems.each(function () {
        let pym = pinyin.getFullChars($(this).text());
        $(this).attr('data-pym', pym);
      });
      if (dropMenu.find('.dropdown-input').length < 1) {
        dropMenu.prepend('<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li>');
      }
      dropMenu.find('.dropdown-input input').off('keyup').on('keyup', function () {
        let search = $(this).val().trim();
        if (search) {
          search = '[' + search.toLowerCase().split('').join('].*[') + ']';
          let reg = new RegExp(search);
          dropItems.each(function () {
            let _this = $(this), text = _this.text().toLowerCase(), pym = _this.attr('data-pym').toLowerCase(), val = _this.attr('data-value');
            if (reg.test(text) || reg.test(pym) || (val && reg.test(val.trim().toLowerCase()))) {
              _this[0].style.display = 'block';//用jquery 查询日志易卡顿，故用原生
            } else {
              _this[0].style.display = 'none';
            }
          });
        } else {
          dropItems.show();
        }
      });
    }
    let FN = {
      open: function () {
        _this.addClass('active');
        $(document).on('click', FN.close).on('keydown', FN.keydown);
      },
      close: function () {
        _this.removeClass('active');
        dropMenu.find('.dropdown-item.hover').removeClass('hover');
        $(document).off('click', FN.close).off('keydown', FN.keydown);
      },
      keydown: function (e) {
        let keycode = e.keyCode;
        if (keycode == 13) {
          e.preventDefault();
          dropMenu.find('.dropdown-item.hover').trigger('click');
        } else if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) {
          e.preventDefault();
          let hoverEl = dropMenu.find('.dropdown-item.hover:visible');
          if (hoverEl.length < 1) {
            hoverEl = dropMenu.find('.dropdown-item.active:visible');
          }
          let nextHoverEl;
          if (hoverEl.length) {
            if (keycode == 37 || keycode == 38) {
              nextHoverEl = hoverEl.prev('.dropdown-item');
              while (nextHoverEl.is(':hidden')) {
                nextHoverEl = nextHoverEl.prev('.dropdown-item');
              }
            } else if (keycode == 39 || keycode == 40) {
              nextHoverEl = hoverEl.next('.dropdown-item');
              while (nextHoverEl.is(':hidden')) {
                nextHoverEl = nextHoverEl.next('.dropdown-item');
              }
            }
          } else {
            nextHoverEl = dropMenu.find('.dropdown-item:visible').eq(0);
          }
          if (nextHoverEl.length) {
            nextHoverEl.trigger('mouseover');
            /*处理不可见的内容*/
            let conentHeight = dropMenu.height(), targetTop = nextHoverEl.position().top, itemHeight = 30,
              scrollTop = dropMenu.scrollTop(), showDis = 40;
            if (targetTop + itemHeight > conentHeight - showDis) {
              dropMenu.scrollTop(scrollTop + targetTop + itemHeight + showDis - conentHeight);
            } else if (targetTop < showDis) {
              dropMenu.scrollTop(scrollTop + targetTop - showDis);
            }
          }
        }
      }
    };
    _this.off('click').on('click', function (e) {
      e.stopPropagation();
      let _target = $(e.target);
      if (_target.hasClass('selected-value')) {
        if (_this.hasClass('active')) {
          FN.close();
        } else {
          $(document).trigger('click');
          FN.open();
        }
      } else if (_target.hasClass('dropdown-item')) {
        if (options.multiple) {
          _target.toggleClass('active');
          setActive();
          inputEl.trigger('change');
        } else {
          dropMenu.find('.active').removeClass('active');
          _target.addClass('active');
          inputEl.val(_target.data('value')).trigger('change');
          selectValueEl.text(_target.text()).attr('title', _target.text());
          FN.close();
        }
      }
    });
    dropMenu.off('mouseover').on('mouseover', function (e) {
      let _target = $(e.target);
      if (_target.hasClass('dropdown-item')) {
        if (!_target.hasClass('.hover')) {
          dropMenu.find('.dropdown-item.hover').removeClass('hover');
          if (!_target.hasClass('.active')) {
            _target.addClass('hover');
          }
        }
      }
    });
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
  /*列表 checkbox*/
  module.clickTree.checkbox = function () {
    let options = {
      status: ''
    }, _this = $(this), data = _this.data();
    $.extend(options, data);
    let table = _this.closest('table'), checkBoxs = table.find('tbody [data-click="checkbox"]')
    if (options.status == 'all') {
      if (_this.hasClass('active')) {
        checkBoxs.removeClass('active');
      } else {
        checkBoxs.addClass('active');
      }
      _this.toggleClass('active');
    } else {
      _this.toggleClass('active');
      let nowLen = table.find('tbody .active[data-click="checkbox"]').length;
      if (nowLen < checkBoxs.length) {
        table.find('thead [data-click="checkbox"]').removeClass('active');
      } else if (nowLen == checkBoxs.length) {
        table.find('thead [data-click="checkbox"]').addClass('active');
      }
    }
  }
  /* ! 搜索form 条件重置 */
  module.clickTree.reset = function () {
    let options = {
      parent: null
    }, _this = $(this), data = _this.data(), parent;
    $.extend(options, data);
    if (options.parent) {
      parent = $(options.parent);
    } else {
      parent = _this.closest('form');
    }
    parent.find('input').not('[type="radio"]').val('')
    parent.find('input[type="radio"]').first().trigger('click')
    if (parent.find('[data-multiple="true"]').length >= 1) {
      parent.find('[data-multiple="true"]').find('li').each(function (k, v) {
        if ($(v).hasClass('active')) {
          $(v).removeClass('active');
        }
      });
    }
    parent.find('[data-do="select"]').each(function () {
      $(this).find('.search-input').trigger('keyup')
      $(this).find('.dropdown-menu .dropdown-item').eq(0).trigger('click')
    });

    $(document).trigger(EVENT.INIT.RESET);
  }
  /* ！ 取消隐藏popup */
  module.clickTree.hidepopup = function () {
    module.popup.hide();
  }
  /* *
   * 加载完成后初始化系统
   * */
  $(function () {
    /* ! 初始化 tab */
    module.tabManage.init();
  });
})()