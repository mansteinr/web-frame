(function () {
  var params = {
    nowTabid: $(window.frameElement).closest('.main-page-item').attr('data-tabid')
  };
  module.extend({
    /**
     * url定向
     */
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
        var backdrop = $('.backdrop'),
          canClose = false;
        if (backdrop.find('.loading').length > 0) {
          canClose = true;
        } else if (backdrop.length < 1) {
          canClose = true;
        } else {
          var bEl = backdrop.find('.animated.zoom');
          if (!bEl.hasClass('active')) {
            canClose = true;
          }
        }
        return canClose;
      }
    },
    hoverShowImg: function (el) {
      $(el).find('img').off('mouseenter').unbind('mouseleave').hover(function (e) {
        var showImgDiv = $('<div id="hoverShowImg" style="position:absolute;top:' +
          (e.pageY - 70) + 'px;left:' +
          (e.pageX + 20) + 'px;"></div>');
        var copyImg = $(this).clone();
        copyImg.prop('style', 'width:150px; height:150px;');
        showImgDiv.append(copyImg);
        $('body').append(showImgDiv);
      }, function () {
        $('#hoverShowImg').remove();
      });
    },
    /**
     * 检查form 是否符合提交要求
     */
    checkForm: function (form) {
      var reEls = form.find('[required]'),
        checkVal = true,
        checkTypes = {
          tel: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
          /*! 匹配手机号 */
          email: /^(\w)+(\.\w)*@(\w)+((\.\w+)+)$/,
          /* ! 匹配email */
          chars: /^[\u4E00-\u9FA5a-zA-Z0-9]{1,}$/,
          /* ! 禁止输入特殊字符 */
          card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          /* ! 匹配身份证号码 */
          int: /^[0-9]*$/,
          /* ! 匹配正整数 */
          pwd: /^[a-zA-Z]\w{5,17}$/,
          /* ! 以字母开头，长度在6-18之间，只能包含字符、数字和下划线 密码 */
          num: /^[0-9]+(.[0-9]{1,})?$/,
          /* ! 匹配整数和小数 */
        },
        addListener = function (el) {
          checkVal = false;
          el.addClass('input-error').on('focus', function () {
            $(this).removeClass('input-error');
            el.off('focus');
          });
        };
      reEls.each(function () {
        var _this = $(this),
          val = _this.val() || _this.text();
        val = $.trim(val);
        if (!val) {
          /* 是否忽略校验值为空*/
          var ignore = _this.data('ignore');
          if (ignore != true) {
            addListener(_this);
          }
        } else {
          var checkType = _this.data('type');
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
        var html = '<div class="loading">' + info + '</div>';
        module.backdrop.show(html);
      },
      hide: function () {
        module.backdrop.hide();
      }
    },
    /**
     * 弹出式popup
     */
    popup: {
      show: function (op) {
        var options = {
            title: 'this is popup title',
            /* ! popup标题 */
            content: '',
            /* ! popup内容 */
            bclose: false,
            /* ! 点击背景是否关闭，默认false */
            callback: null,
            /* ! popup初始化后的回掉 */
            style: ''
          },
          paintPopup = function (options) {
            var html = '<div class="popup animated zoom active"';
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
        var _popup = $('.popup');
        _popup.css('margin-top', -_popup.height() / 2);
        if (options.style.indexOf('margin-top') > -1) {
          _popup.prop('style', options.style);
        }
        _popup.find('.close').off('click').on('click', function () {
          module.popup.hide();
        });
        if (options.bclose) {
          $('.backdrop').off('click').on('click', function () {
            module.popup.hide();
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
    /**
     * confirm
     */
    confirm: function (op) {
      var options = {
          title: 'this is confirm title',
          /* ! confirm标题 */
          info: '这里是提示信息！',
          /* ! confirm提示内容 */
          status: 0,
          /* ! confirm状态 */
          bclose: false,
          /* ! 点击背景是否关闭，默认false */
          okbtn: '确定',
          /* ! 确定按钮文字 */
          cancel: '取消',
          /* ! 取消按钮文字 */
          callback: $.noop /* ! confirm点击确认回掉 */
        },
        statusArray = ['iconfont icon-jinggao', 'iconfont icon-queren', 'iconfont icon-queren1'];
      $.extend(options, op);
      var content = '<div class="confirm-info"><i class="' + statusArray[options.status] + '"></i>' + options.info +
        '</div><div class="confirm-btns"><div class="button button-main">' + options.okbtn + '</div><div class="button ml" data-click="hidepopup">' + options.cancel + '</div></div>';
      module.popup.show({
        title: options.title,
        content: content,
        bclose: options.bclose,
        callback: function () {
          this.find('.button.button-main').off('click').on('click', function () {
            module.popup.hide();
            options.callback.call();
          });
        }
      });
    },
    postMessage: function (op) {
      var options = {
        docall: '',
        tabid: null,
        data: null
      };
      $.extend(options, op);
      options.docall = op.call;
      options.call = 'messageChannel';
      parent.postMessage(options, '*');
    },
    /**
     * tab菜单管理
     */
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
      var options = {
          selector: '.page-navigation',
          /* ! 分页容器selector */
          pageTotal: 0,
          /* ! 总长度，条数 */
          pageSize: 10,
          /* ! 每页条数 */
          pageIndex: 1,
          /* ! 当前页码值 */
          showCount: 6 /* ! 显示长度 */
        },
        defaultParams = {
          startIndex: 1,
          /* ! 页码开始值 */
          endIndex: 1,
          /* ! 页码结束值 */
          maxPage: 1 /* ! 最大页码值 */
        },
        paintPage = function (op) {
          var html = '<ul class="pagination">';
          if (op.index == 1) {
            html += '<li class="controll-btn disabled"><span class="iconfont icon-arrow1"></span></li><li class="controll-btn disabled"><span class="iconfont icon-arrow3"></span></li>';
          } else {
            html += '<li class="controll-btn" data-index="1"><span class="iconfont icon-arrow1"></span></li><li class="controll-btn" data-index="' +
              (op.index - 1) + '"><span class="iconfont icon-arrow3"></span></li>';
          }
          for (var i = op.start; i < op.end + 1; i++) {
            var nowIndex = i;
            if (nowIndex == op.index) {
              html += '<li class="active" data-index="' + nowIndex + '">' + nowIndex + '</li>';
            } else {
              html += '<li data-index="' + nowIndex + '">' + nowIndex + '</li>';
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
            var _this = $(this),
              index = _this.attr('data-index');
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
        var dis = Math.floor(options.showCount / 2);
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
  /**
   * 时间选择
   */
  module.doTree.timepick = function () {
    var options = {},
      _this = $(this),
      data = _this.data();
    var params = {
      date: 'defaultDate',
      /*! 时间选择器默认时间 */
      nodate: 'noCalendar',
      /*! 是否显示时间选择 */
      min: 'minDate',
      /*! 最小时间 */
      max: 'maxDate',
      /*! 最大时间 */
      format: 'dateFormat',
      /*! 时间格式化 */
      mode: 'mode',
      /*! 选择权类型 */
      time: 'enableTime',
      /*! 是否可以选择时间 */
      second: 'enableSeconds',
      /*! 是否允许选择秒 */
      time24: 'time_24hr',
      /*! 时间选择是否为24 小时 */
      hour: 'defaultHour',
      /*! 默认小时 */
      minute: 'defaultMinute' /*! 默认分钟 */
    };
    $.each(data, function (k, v) {
      if (params[k] != null) {
        var key = params[k];
        options[key] = v;
      }
    });
    if (options.defaultDate == null) {
      options.defaultDate = _this.val();
    }
    _this.flatpickr(options);
  };
  /**
   * select选择
   */
  module.doTree.select = function () {
    var options = {
        val: null,
        /* ! 默认值 */
        search: false,
        /* ! 是否带search */
        multiple: false,
        /* ! 是否支持多选 */
        split: ',' /* ! 多选值，分隔符 */
      },
      _this = $(this),
      data = _this.data();
    $.extend(options, data);
    var inputEl = _this.find('input[type="hidden"]'),
      selectValueEl = _this.find('.selected-value'),
      dropMenu = _this.find('.dropdown-menu'),
      dropItems = dropMenu.find('.dropdown-item').removeClass('active');
    /* ! 获取选择默认值 */
    if (options.val != 0 && !options.val) {
      var val = inputEl.val();
      if (val != 0 && !val) {
        val = dropItems.eq(0).data('value');
      }
      options.val = val;
    }
    var setDefault = function () {
        /* ! 初始化选择器选择值 */
        var initEl = dropMenu.find('.dropdown-item[data-value="' + options.val + '"]');
        if (initEl.length == 0) {
          initEl = dropItems.eq(0);
        }
        initEl.addClass('active');
        inputEl.val(initEl.data('value'));
        selectValueEl.text(initEl.text());
      },
      setActive = function () {
        var activeEls = dropMenu.find('.dropdown-item.active'),
          valArr = [],
          textArr = [];
        if (activeEls.length) {
          activeEls.each(function () {
            valArr.push($(this).data('value'));
            textArr.push($(this).text());
          });
          var chooseTextVal = textArr.join(options.split);
          inputEl.val(valArr.join(options.split));
          selectValueEl.text(chooseTextVal);
        } else {
          inputEl.val('');
          selectValueEl.text('请选择');
        }
      };
    /* ! 如果是多选，添加多选class*/
    if (options.multiple) {
      dropMenu.addClass('multiple');
      if (options.val == 0 || options.val) {
        options.val += '';
        if (options.val.indexOf(options.split) < 0) {
          setDefault();
        } else {
          var valArr = options.val.split(options.split);
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
        var pym = pinyin.getFullChars($(this).text());
        $(this).attr('data-pym', pym);
      });
      if (dropMenu.find('.dropdown-input').length < 1) {
        dropMenu.prepend('<li class="dropdown-input"><input type="text" placeholder="输入搜索" class="search-input m-input"/></li>');
      }
      dropMenu.find('.dropdown-input input').off('keyup').on('keyup', function () {
        var search = $(this).val();
        dropItems.each(function () {
          var _this = $(this),
            pym = _this.attr('data-pym'),
            val = _this.text();
          if (search.length) {
            if (pym.indexOf(search) > -1 || val.indexOf(search) > -1 || pym.toLowerCase().indexOf(search) > -1 || val.toLowerCase().indexOf(search) > -1 ||
              pym.toUpperCase().indexOf(search) > -1 || val.toUpperCase().indexOf(search) > -1) {
              _this.show();
            } else {
              _this.hide();
            }
          } else {
            _this.show();
          }
        });
      });
    }
    var FN = {
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
        var keycode = e.keyCode;
        if (keycode == 13) {
          e.preventDefault();
          dropMenu.find('.dropdown-item.hover').trigger('click');
        } else if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) {
          e.preventDefault();
          var hoverEl = dropMenu.find('.dropdown-item.hover:visible');
          if (hoverEl.length < 1) {
            hoverEl = dropMenu.find('.dropdown-item.active:visible');
          }
          var nextHoverEl;
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
          console.log(nextHoverEl);
          if (nextHoverEl.length) {
            nextHoverEl.trigger('mouseover');
            /*处理不可见的内容*/
            var conentHeight = dropMenu.height(),
              targetTop = nextHoverEl.position().top,
              itemHeight = 30,
              scrollTop = dropMenu.scrollTop(),
              showDis = 40;
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
      var _target = $(e.target);
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
          selectValueEl.text(_target.text());
          FN.close();
        }
      }
    });
    dropMenu.off('mouseover').on('mouseover', function (e) {
      var _target = $(e.target);
      if (_target.hasClass('dropdown-item')) {
        if (!_target.hasClass('.hover')) {
          dropMenu.find('.dropdown-item.hover').removeClass('hover');
          if (!_target.hasClass('.active')) {
            _target.addClass('hover');
          }
        }
      }
    });
  };
  /* ! menu tree 折叠树 */
  module.clickTree.collapse = function () {
    var options = {
        target: '',
        /* ! 选择弹开菜单*/
        parent: '',
        /* ! 配置父级则 只显示一个*/
        active: 'active',
        /* ! 选中class*/
      },
      _this = $(this),
      data = _this.data();
    $.extend(options, data);
    if (_this.hasClass(options.active)) {
      _this.removeClass(options.active);
      if (options.target) {
        $(options.target).removeClass(options.active);
      }
    } else {
      if (options.parent) {
        var activeEls = $(options.parent + ' > .' + options.active + '[data-click="collapse"]');
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
  };
  /* ! 加载新建tab */
  module.clickTree.loadtab = function () {
    var options = {
        title: '新建tab',
        /* ! tab标题 */
        url: '',
        /* ! 请求url*/
        loadhide: true,
        /* ! 请求完成后是否隐藏加载动画*/
        tabid: null,
        /* ! tabid*/
      },
      _this = $(this),
      data = _this.data();
    $.extend(options, data);
    if (options.tabid == null) {
      options.tabid = new Date().getTime();
      _this.data('tabid', options.tabid).attr('data-tabid', options.tabid);
    }
    /* ! 新建tab */
    $(document).trigger(EVENT.TAB.NEW, options);
  };
  /*列表 checkbox*/
  module.clickTree.checkbox = function () {
    var options = {
        status: ''
      },
      _this = $(this),
      data = _this.data();
    $.extend(options, data);
    var table = _this.closest('table');
    var checkBoxs = table.find('tbody [data-click="checkbox"]');
    if (options.status == 'all') {
      if (_this.hasClass('active')) {
        checkBoxs.removeClass('active');
      } else {
        checkBoxs.addClass('active');
      }
      _this.toggleClass('active');
    } else {
      _this.toggleClass('active');
      var nowLen = table.find('tbody .active[data-click="checkbox"]').length;
      if (nowLen < checkBoxs.length) {
        table.find('thead [data-click="checkbox"]').removeClass('active');
      } else if (nowLen == checkBoxs.length) {
        table.find('thead [data-click="checkbox"]').addClass('active');
      }
    }
  };
  /* ! 搜索form 条件重置 */
  module.clickTree.reset = function () {
    var options = {
        parent: null
      },
      _this = $(this),
      data = _this.data(),
      parent;
    $.extend(options, data);
    if (options.parent) {
      parent = $(options.parent);
    } else {
      parent = _this.closest('form');
    }
    parent.find('input').val('');
    parent.find('[data-do="select"]').each(function () {
      $(this).find('.dropdown-menu .dropdown-item').eq(0).trigger('click');
    });
    $(document).trigger(EVENT.INIT.RESET);
  };
  /* ！ 取消隐藏popup */
  module.clickTree.hidepopup = function () {
    module.popup.hide();
  };

  /**
   *  日历控件
   */
  module.SimpleCalendar = function (query, options) {
    //======== 声明
    // 用B更新A的属性 并返回结果
    this.optionAssign = function (optionsA, optionsB) {
      for (var key in optionsB) {
        if (typeof optionsA[key] === 'function') {
          if (typeof optionsB[key] === 'function') {
            optionsA[key] = optionsB[key];
          } else {
            console.warn(key + ' must be a function');
          }
        } else if (typeof optionsA[key] !== 'object') {
          optionsA[key] = optionsB[key];
        } else {
          optionsA[key] = this.optionAssign(optionsA[key], optionsB[key]);
        }
      }
      return optionsA;
    };

    // 生成日历样式
    this.create = function () {
      var htmlArr = [];
      var root = this.container;
      root.style.width = this._options.width;
      root.style.height = this._options.height;
      if (this._options.isSelect) {
        root.className = 'sc-calendar';
      } else {
        root.className = 'sc-calendar animated zoom active';
      }
      //显示名字
      htmlArr.push('<div class="sc-name">' + this.languageData['name_' + this._options.language] + '<i class="iconfont icon-delete close" data-click="closeCalendar"></i></div>');
      //header头部
      htmlArr.push('<div class="sc-header">');
      //年
      htmlArr.push('<div class="sc-actions">');
      htmlArr.push('<div class="sc-yleft">&lsaquo;</div>');
      htmlArr.push('<select class="sc-select-year" name=""></select>');
      htmlArr.push('<div class="sc-yright">&rsaquo;</div>');
      htmlArr.push('</div>');
      //月
      htmlArr.push('<div class="sc-actions">');
      htmlArr.push('<div class="sc-mleft">&lsaquo;</div>');
      htmlArr.push('<select class="sc-select-month" name=""></select>');
      htmlArr.push('<div class="sc-mright">&rsaquo;</div>');
      htmlArr.push('</div>');
      //保存
      htmlArr.push('<div class="sc-actions"><span class="sc-save-select">' + this.languageData['btnSave_' + this._options.language] + '</span></div>');
      htmlArr.push('</div>');
      //body主体
      htmlArr.push('<div class="sc-body">');
      //星期
      htmlArr.push('<div class="sc-week">');
      for (var i = 0; i < 7; i++) {
        htmlArr.push('<div class="sc-week-item"></div>');
      }
      htmlArr.push('</div>');
      //天
      htmlArr.push('<div class="sc-days">');
      for (var k = 0; k < 42; k++) {
        var dayArr = [];
        var dayStr = '';
        dayArr.push('<div class="sc-item">');
        dayArr.push('<div class="tile">');
        dayArr.push('<div class="tile-title">' + this.languageData['settings_' + this._options.language] + '</div>');
        dayArr.push('<div class="tile-btn">');
        dayArr.push('<span class="workday">' + this.languageData['work_' + this._options.language] + '</span>');
        dayArr.push('<span class="dayoff">' + this.languageData['rest_' + this._options.language] + '</span>');
        dayArr.push('</div>');
        dayArr.push('</div>');
        dayArr.push('<div class="day"></div>');
        dayArr.push('<div class="lunar-day"></div>');
        dayArr.push('</div>');
        dayStr = dayArr.join('');
        htmlArr.push(dayStr);
      }
      htmlArr.push('</div>');

      htmlArr.push('</div>');
      root.innerHTML = htmlArr.join('');
      //判断是设置考勤还是展示考勤
      if (this._options.isSelect) {
        root.querySelector('.sc-save-select').innerHTML = this.languageData['btnSave_' + this._options.language];
      } else {
        this.tyear = this._options.time.year;
        this.tmonth = this._options.time.month;
        root.querySelector('.sc-save-select').innerHTML = '';
      }
      //添加下拉框数据
      this.updateSelect(this.tyear, this.tmonth);
      // 刷新日历
      this.update();
      // 
      if (typeof this._options.initCall === 'function') {
        this._options.initCall.call();
      }
    };

    // 刷新日历
    this.update = function (month, year) {
      month = month || this.tmonth;
      year = year || this.tyear;
      this.updateSize();
      this.updateWeek();
      this.addData(year, month);
      this.addShowData();
      this.updateEvent();
      this.nameShow();
      if (typeof this._options.changeCall === 'function') {
        this._options.changeCall.call();
      }
    };
    // 调整大小
    this.updateSize = function (width, height) {
      width = width || this._options.width;
      height = height || this._options.height;
      // 将大小赋值给option
      this._options.width = width;
      this._options.height = height;

      this.container.style.width = width;
      this.container.style.height = height;
    };

    // 刷新下拉框 只有在初始化和设置语言后才会更新
    this.updateSelect = function (year, month) {
      // 下拉框
      var selectYear = this.container.querySelector('.sc-select-year');
      var selectMonth = this.container.querySelector('.sc-select-month');
      selectYear.innerHTML = '';
      for (var i = this._options.timeRange.startYear; i < this._options.timeRange.endYear + 1; i++) {
        selectYear.innerHTML += '<option value="' + i + '">' + i + '</option>';
      }
      selectMonth.innerHTML = '';
      var data = this.languageData['months_' + this._options.language];
      for (i = 0; i < 12; i++) {
        selectMonth.innerHTML += '<option value="' + (i + 1) + '">' + data[i] + '</option>';
      }
      selectYear.value = year;
      selectMonth.value = month;
    };

    // 刷新星期
    this.updateWeek = function () {
      var weeks = this.arrayFrom(this.container.querySelectorAll('.sc-week-item'));
      var data = this.languageData['days_' + this._options.language];
      if (!data) {
        console.error('language error!');
      }
      weeks.forEach(function (v, i) {
        v.innerHTML = data[i];
      });
    };

    // 添加阳历数据
    this.addData = function (year, month) {
      var daysElement = this.arrayFrom(this.container.querySelectorAll('.sc-item'));
      var day = new Date(year, month - 1, 1);
      var week = day.getDay();
      /*if (week == 0) week = 7;*/
      // 计算得到第一个格子的日期
      var thispageStart = new Date(Date.parse(day) - (week) * 24 * 3600 * 1000);

      // 对每一个格子遍历
      for (var i = 0; i < 42; i++) {
        daysElement[i].className = 'sc-item';
        var theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
        // var writeyear = theday.getFullYear();
        var writeday = theday.getDate();
        var writemonth = theday.getMonth() + 1;
        if (writemonth != month) {
          daysElement[i].classList.add('sc-othermenth');
        }
        daysElement[i].querySelector('.day').innerHTML = writeday;
        //添加today样式(只有考勤展示)
        // if (!this._options.isSelect) {
        //   if (this.tyear == writeyear && this.tday == writeday && this.tmonth == writemonth) {
        //     this.selectDay = daysElement[i];
        //     daysElement[i].classList.add('sc-today');
        //   }
        // }
      }
    };

    //添加设置或考勤展示
    this.addShowData = function (content1, arr1) {
      var num = 0;
      var arr = arr1 || this._defaultOptions.dayOff;
      var daysElement = this.arrayFrom(this.container.querySelectorAll('.sc-item'));

      var year = this.container.querySelector('.sc-select-year').value;
      var month = this.container.querySelector('.sc-select-month').value;
      var nowTime = new Date().getTime();

      var content = content1 || [];
      for (var i = 0; i < 42; i++) {
        var element = daysElement[i].querySelector('.lunar-day');
        if (!daysElement[i].classList.contains('sc-othermenth')) {
          if (content[i - num]) {
            element.innerHTML = content[i - num];
          } else {
            if(arr.length == '0'){
              element.innerHTML = '工作日';
            }else{
              for (var k = 0; k < arr.length; k++) {
                if ((i + (7 - arr[k])) % 7 == '0') {
                  element.innerHTML = '休息';
                  break;
                } else {
                  element.innerHTML = '工作日';
                }
              }
            }
          }
          element.classList.remove('sc-revision');
          var selectVal = element.innerHTML;
          if (selectVal == '休息') {
            element.classList.add('dayoffColor');
            element.setAttribute('data-status','1');
          } else {
            element.classList.remove('dayoffColor');
            element.setAttribute('data-status','0');
          }
          //今日之前禁止设置
          if(this._options.isSelect){
            var day = daysElement[i].querySelector('.day').innerHTML;
            var selectTime = new Date( year + '-' + month + '-' + day).getTime();
            if(selectTime < nowTime){
              daysElement[i].classList.add('is-no-select');
              element.classList.remove('dayoffColor');
            }
          }
        } else {
          num++;
          element.innerHTML = '';
          element.classList.remove('sc-revision');
        }
      }
      if(this._options.isSelect){
        if( new Date( year + '-' + (month/1 + 1)).getTime() <= nowTime){
          this.container.querySelector('.sc-save-select').classList.add('sc-return-show');
        }else{
          this.container.querySelector('.sc-save-select').classList.remove('sc-return-show');
        }
      }
    };
    // 刷新事件
    this.updateEvent = function () {
      var daysElement = this.arrayFrom(this.container.querySelectorAll('.sc-item'));
      var container = this.container;
      var calendar = this;
      daysElement.forEach(function (v, i) {
        v.onmouseover = function (e) {
          //满足设置日历考勤才出现
          if (!$(this).hasClass('is-no-select') && calendar._options.isSelect) {
            this.classList.add('sc-active-day');
          }
        };
        v.onmouseout = function (e) {
          this.classList.remove('sc-active-day');
        };
        v.onclick = function () {
          calendar.selectDay = v;
          var pre = container.querySelector('.sc-selected');
          if (pre) pre.classList.remove('sc-selected');
          this.classList.add('sc-selected');
          if (typeof calendar._options.onSelect === 'function') {
            calendar._options.onSelect(calendar.getSelectedDay());
          }
        };
      });

      var selectYear = container.querySelector('.sc-select-year');
      var selectMonth = container.querySelector('.sc-select-month');
      selectYear.onchange = function () {
        var m = selectMonth.value;
        var y = this.value;
        calendar.update(m, y);
        if (typeof calendar._options.selectYearFn === 'function') {
          calendar._options.selectYearFn.call();
        }
      };
      selectMonth.onchange = function () {
        var y = selectYear.value;
        var m = this.value;
        calendar.update(m, y);
        if (typeof calendar._options.selectMonthFn === 'function') {
          calendar._options.selectMonthFn.call();
        }
      };
      $(selectYear).mousedown(function () {
        if (typeof calendar._options.mousedownYear === 'function') {
          calendar._options.mousedownYear.call(this);
        }
      });
      $(selectMonth).mousedown(function () {
        if (typeof calendar._options.mousedownMonth === 'function') {
          calendar._options.mousedownMonth.call(this);
        }
      });

      var yearadd = container.querySelector('.sc-yright');
      var yearsub = container.querySelector('.sc-yleft');
      var monthadd = container.querySelector('.sc-mright');
      var monthsub = container.querySelector('.sc-mleft');
      var isforbid = true;
      yearadd.onclick = function () {
        isforbid = true;
        if (calendar._options.isChangeSele) {
          var currentyear = selectYear.value;
          var currentmonth = selectMonth.value;
          if (currentyear < calendar._options.timeRange.endYear){
            currentyear++;
          }else{
            isforbid = false;
          }
          if(isforbid){
            selectYear.value = currentyear;
            calendar.update(currentmonth, currentyear);
          }
        }
        if (typeof calendar._options.yRightFn === 'function' && isforbid) {
          calendar._options.yRightFn.call();
        }
      };
      yearsub.onclick = function () {
        isforbid = true;
        if (calendar._options.isChangeSele) {
          var currentyear = selectYear.value;
          var currentmonth = selectMonth.value;
          if (currentyear > calendar._options.timeRange.startYear){
            currentyear--;
          }else{
            isforbid = false;
          }
          if(isforbid){
            selectYear.value = currentyear;
            calendar.update(currentmonth, currentyear);
          }
        }
        if (typeof calendar._options.yLeftFn === 'function' && isforbid) {
          calendar._options.yLeftFn.call();
        }
      };
      monthadd.onclick = function () {
        isforbid = true;
        if (calendar._options.isChangeSele) {
          var currentmonth = selectMonth.value;
          var currentyear = selectYear.value;
          if (currentmonth < 12) currentmonth++;
          else {
            if( currentyear < calendar._options.timeRange.endYear ){
              currentmonth = 1;
              selectYear.value = ++currentyear;
            }else{
              isforbid = false;
            }
          }
          if(isforbid){
            selectMonth.value = currentmonth;
            calendar.update(currentmonth, currentyear);
          }
        }
        if (typeof calendar._options.mRightFn === 'function' && isforbid) {
          calendar._options.mRightFn.call();
        }
      };
      monthsub.onclick = function () {
        isforbid = true;
        if (calendar._options.isChangeSele) {
          var currentmonth = selectMonth.value;
          var currentyear = selectYear.value;
          if (currentmonth > 1) currentmonth--;
          else {
            if( currentyear > calendar._options.timeRange.startYear ){
              currentmonth = 12;
              selectYear.value = --currentyear;
            }else{
              isforbid = false;
            }
          }
          if(isforbid){
            selectMonth.value = currentmonth;
            calendar.update(currentmonth, currentyear);
          }
        }
        if (typeof calendar._options.mLeftFn === 'function' && isforbid) {
          calendar._options.mLeftFn.call();
        }
      };
      //设置
      var workdays = this.arrayFrom(this.container.querySelectorAll('.workday'));
      var dayoffs = this.arrayFrom(this.container.querySelectorAll('.dayoff'));
      workdays.forEach(function(v,i){
        v.onclick = function () {
          if (typeof calendar._options.workdayFn === 'function') {
            calendar._options.workdayFn.call(this);
          }
        };
      });
      dayoffs.forEach(function(v,i){
        v.onclick = function () {
          if (typeof calendar._options.dayoffFn === 'function') {
            calendar._options.dayoffFn.call(this);
          }
        };
      });
      //保存
      var saveMonth = container.querySelector('.sc-save-select');
      saveMonth.onclick = function () {
        if (typeof calendar._options.saveMonSel === 'function') {
          calendar._options.saveMonSel.call(this);
        }
      };
    };
    //是否显示姓名
    this.nameShow = function () {
      var nameEl = this.container.querySelectorAll('.sc-name');
      if(this._options.isSelect){
        $(nameEl).css('display','none');
      }else{
        $(nameEl).css('display','block');
      }
    };
    // 获取用户点击的日期
    this.getSelectedDay = function () {
      var selectYear = this.container.querySelector('.sc-select-year').value;
      var selectMonth = this.container.querySelector('.sc-select-month').value;
      var selectDay = this.selectDay.querySelector('.day').innerHTML;

      // 计算当前界面中的其他月份差
      var count = 0;
      if (this.selectDay.classList.contains('sc-othermenth')) {
        if (+selectDay < 15) count++;
        else count--;
      }
      return new Date(selectYear, selectMonth - 1 + count, selectDay);
    };

    // 设置语言
    this.setLanguage = function (language) {
      this._options.language = language;
      var selectYear = this.container.querySelector('.sc-select-year');
      var selectMonth = this.container.querySelector('.sc-select-month');
      this.updateSelect(selectYear.value, selectMonth.value);
      this.update();
    };

    // 将nodeList转为数组,nodeList转数组
    this.arrayFrom = function (nodeList) {
      var array = [];
      [].forEach.call(nodeList, function (v) {
        array.push(v);
      });
      return array;
    };

    //默认配置
    this._defaultOptions = {
      width: '500px',
      height: '500px',
      isSelect: true, //默认为设置日历(判断设置日历还是展示考勤)
      isChangeSele: true,
      language: 'ZH', //语言
      dayOff: [6, 7],
      onSelect: function () {},
      timeRange: {
        startYear: 2018,
        endYear: 2050
      },
      timeZone: '', //时区
      yLeftFn: function () {}, // 年份的左移
      yRightFn: function () {}, // 年份的右移
      mLeftFn: function () {}, // 月份的左移
      mRightFn: function () {}, // 月份的右移
      selectYearFn: function () {}, //年份下拉年发生变化
      selectMonthFn: function () {}, //月份下拉月发生变化
      mousedownMonth: function () {}, //月份鼠标按下事件
      mousedownYear: function () {},  //年份鼠标按下事件
      initCall: function () {}, // 初始化后的回调函数
      changeCall: function () {}, // 每次日历刷新后的回调
      saveMonSel: function () {}, //保存月度设置
      workdayFn: function () {}, //设置工作日
      dayoffFn: function () {} //设置休息日
    };

    //======== 执行 构造
    this.container = document.querySelector(query);
    this._defaultOptions.width = this.container.style.offsetWidth;
    this._defaultOptions.height = this.container.style.offsetHeight;

    this._options = Object.assign({}, this._defaultOptions, options);

    //得到最终配置
    this._options = this.optionAssign(this._defaultOptions, options);

    this.create();
  };
  module.SimpleCalendar.prototype.languageData = {
    // 
    name_EN: 'Name',
    name_ZH: '姓名',
    btnSave_EN: 'Save',
    btnSave_ZH: '保存',
    btnCancel_EN: 'Cancel',
    btnCancel_ZH: '取消',
    settings_EN: 'Settings',
    settings_ZH: '行政设置',
    work_EN: 'Work',
    work_ZH: '工作日',
    rest_EN: 'Rest',
    rest_ZH: '休息',
    // 星期
    days_EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    days_ZH: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    // 月份
    months_EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    months_ZH: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    vocation: {}
  };
  module.SimpleCalendar.prototype.tyear = new Date().getFullYear();
  module.SimpleCalendar.prototype.tmonth = new Date().getMonth() + 1;
  module.SimpleCalendar.prototype.tday = new Date().getDate();
  /**
   * 穿梭框
   */
  module.transfer = function () {

    // 渲染 正常 normal
    function paintNormalTransfer(op) {
      var arrHtml = [];
      // 标题
      arrHtml.push('<div class="transfer animated zoom active" style="');
      arrHtml.push(op.style);
      arrHtml.push('"><div class="transfer-title"><h3>');
      arrHtml.push(op.title);
      arrHtml.push('</h3><i class="iconfont icon-delete close"></i></div>');

      // 主体
      arrHtml.push('<div class="transfer-main">');
      arrHtml.push('<h4 class="transfer-main-bottom-left">' + op.__self.languageData[op.language].choose + '</h4>');
      arrHtml.push('<h4 class="transfer-main-bottom-right">' + op.__self.languageData[op.language].chosen + '</h4>');

      // 左区域
      arrHtml.push('<div class="transfer-main-left allbtn">');
      arrHtml.push('<div class="transfer-tree">');
      arrHtml.push('<ul></ul>');
      arrHtml.push('<div class="no-data">' + op.__self.languageData[op.language].noneData + '</div>');
      arrHtml.push('</div>');
      arrHtml.push('<div class="transfer-main-left-all"></div>');
      arrHtml.push('</div>');

      // 右区域
      arrHtml.push('<div class="transfer-main-right allbtn">');
      arrHtml.push('<div class="transfer-tree">');
      arrHtml.push('<ul></ul>');
      arrHtml.push('<div class="no-data">' + op.__self.languageData[op.language].noneData + '</div>');
      arrHtml.push('</div>');
      arrHtml.push('<div class="transfer-main-right-all"></div>');
      arrHtml.push('</div>');

      // 穿梭按钮
      arrHtml.push('<div class="transfer-main-btn">');
      arrHtml.push('<span class="first"></span>');
      arrHtml.push('<span class="last"></span>');
      arrHtml.push('</div>');
      arrHtml.push('</div>');

      // 按钮区
      arrHtml.push('<div class="transfer-btn">');
      arrHtml.push('<div class="button btn-cancel">' + op.__self.languageData[op.language].cancel + '</div>');
      arrHtml.push('<div class="button button-main btn-confirm">' + op.__self.languageData[op.language].confirm + '</div></div>');

      op.backdropDom = $('<div class="transfer-backdrop"></div>');
      op.transferDom = $(arrHtml.join(''));
      op.backdropDom.append(op.transferDom);
      op.optionUl = op.transferDom.find('.transfer-main-left ul');
      op.chooseUl = op.transferDom.find('.transfer-main-right ul');
      $('body').append(op.backdropDom);
    }
    // 渲染 搜索 search
    function paintSearchTransfer(op) {
      var arrHtml = [];
      // 标题
      arrHtml.push('<div class="transfer animated zoom active" style="');
      arrHtml.push(op.style);
      arrHtml.push('"><div class="transfer-title"><h3>');
      arrHtml.push(op.title);
      arrHtml.push('</h3><i class="iconfont icon-delete close"></i></div>');

      // 主体
      arrHtml.push('<div class="transfer-main">');
      arrHtml.push('<h4 class="transfer-main-bottom-left">' + op.__self.languageData[op.language].choose + '</h4>');
      arrHtml.push('<h4 class="transfer-main-bottom-right">' + op.__self.languageData[op.language].chosen + '</h4>');

      // 左区域
      arrHtml.push('<div class="transfer-main-left search">');
      arrHtml.push('<input type="text" class="m-input m-input-search" placeholder="' + op.__self.languageData[op.language].search + '" autocomplete="off"/>');
      arrHtml.push('<div class="button button-main ml btn-search">' + op.__self.languageData[op.language].query + '</div>');
      arrHtml.push('<div class="transfer-tree">');
      arrHtml.push('<ul></ul>');
      arrHtml.push('<div class="no-data">' + op.__self.languageData[op.language].noneData + '</div>');
      arrHtml.push('</div>');
      arrHtml.push('</div>');

      // 右区域
      arrHtml.push('<div class="transfer-main-right search">');
      arrHtml.push('<div class="transfer-tree">');
      arrHtml.push('<ul></ul>');
      arrHtml.push('<div class="no-data">' + op.__self.languageData[op.language].noneData + '</div>');
      arrHtml.push('</div>');
      arrHtml.push('</div>');

      // 穿梭按钮
      arrHtml.push('<div class="transfer-main-btn">');
      arrHtml.push('<span class="first"></span>');
      arrHtml.push('</div>');
      arrHtml.push('</div>');

      // 按钮区
      arrHtml.push('<div class="transfer-btn">');
      arrHtml.push('<div class="button btn-cancel">' + op.__self.languageData[op.language].cancel + '</div>');
      arrHtml.push('<div class="button button-main btn-confirm">' + op.__self.languageData[op.language].confirm + '</div></div>');

      op.backdropDom = $('<div class="transfer-backdrop"></div>');
      op.transferDom = $(arrHtml.join(''));
      op.backdropDom.append(op.transferDom);
      op.optionUl = op.transferDom.find('.transfer-main-left ul');
      op.chooseUl = op.transferDom.find('.transfer-main-right ul');
      $('body').append(op.backdropDom);
    }
    // 渲染
    function paintTransfer(op) {
      if (op.isSearch) {
        paintSearchTransfer(op);
      } else {
        paintNormalTransfer(op);
      }
    }
    // 绑定事件
    function initEvent(op) {
      // 添加拖拽事件
      module.dragEvent(null, '.transfer-title', '.transfer');
      // click x 号
      op.transferDom.find('.close').off('click').on('click', function () {
        op.backdropDom.remove();
      });
      // click 取消
      op.transferDom.find('.btn-cancel').off('click').on('click', function () {
        op.backdropDom.remove();
      });
      // click 点击背景
      if (op.bclose) {
        op.backdropDom.off('click').on('click', function () {
          op.backdropDom.remove();
        });
      }

      // ==== 全选 ====
      if (!op.isSearch) {
        // 全选择
        op.transferDom.find('.transfer-main-left-all').off('click').on('click', function () {
          var lis = $('.transfer-main-left li');
          var len1 = lis.length;
          var len2 = $('.transfer-main-left li.active').length;
          if (len1 == len2) {
            lis.toggleClass('active');
          } else {
            lis.addClass('active');
          }
        });
        // 全选择
        op.transferDom.find('.transfer-main-right-all').off('click').on('click', function () {
          var lis = $('.transfer-main-right li');
          var len1 = lis.length;
          var len2 = $('.transfer-main-right li.active').length;
          if (len1 == len2) {
            lis.toggleClass('active');
          } else {
            lis.addClass('active');
          }
        });
      }

      // ==== 查询 ====
      if (op.isSearch) {
        // 查询 事件
        op.transferDom.find('.btn-search').off('click').on('click', function () {
          op.searchFn(op.transferDom.find('.m-input-search').val());
        });
        // 右移
        op.transferDom.find('.transfer-main-btn .first').off('click').on('click', function () {
          // 右移动
          var leftLis = $('.transfer-main-left li.active').removeClass('active');
          var rightLis = $('.transfer-main-right li');
          // 过滤数据
          var existMap = {};
          var i,
            temp;
          rightLis.each(function() {
            existMap[$(this).attr('lblid')] = true;
          });
          for (i = leftLis.length - 1; i > -1; i--) {
            // 移除
            if (existMap[$(leftLis[i]).attr('lblid')]) {
              temp = leftLis.splice(i, 1);
              temp[0].remove();
            }
          }
          // 重新渲染
          $('.transfer-main-right ul').append(leftLis);
          op.__self.changeEvent();
        });
      } else {
        // 左移
        op.transferDom.find('.transfer-main-btn .first').off('click').on('click', function () {
          // 右移动
          var lis = $('.transfer-main-left li.active').removeClass('active');
          $('.transfer-main-right ul').append(lis);
          // 修改数据
          op.__self.changeEvent();
        });
        // 右移
        op.transferDom.find('.transfer-main-btn .last').off('click').on('click', function () {
          // 左移动
          var lis = $('.transfer-main-right li.active').removeClass('active');
          $('.transfer-main-left ul').append(lis);
          // 修改数据
          op.__self.changeEvent();
        });
      }

      // ==== click 确定 设置后回调
      op.transferDom.find('.btn-confirm').off('click').on('click', function () {
        var result = [];
        // 收集数据
        var rightLis = $('.transfer-main-right li');
        rightLis.each(function() {
          result.push($(this).data());
        });
        // 回调数据
        if (op.confirm && $.isFunction(op.confirm)) {
          op.confirm.call(result);
        }
      });
    }

    // 初始化
    function Transfer() {
      this.op = null;
    }
    // 显示
    Transfer.prototype.show = function (op) {
      var defaultOp = {
        /* ! transfer标题 */
        title: 'this is transfer title',
        /* ! transfer内容 */
        content: '',
        /* ! 点击背景是否关闭，默认false */
        bclose: false,
        /* ! transfer确定后是否自动关闭 */
        isAutoClose: false,
        style: '',
        isSearch: false,
        isAllBtn: false,
        transferDom: null,
        backdropDom: null,
        optionUl: null,
        chooseUl: null,
        /* ! transfer初始化后的回调 */
        callback: null,        
        /* ! transfer 搜索框 检索函数 */
        searchFn: null,
        /* ! transfer确定后的回调 */
        confirm: null,
        language: 'ZH'
      };
      this.op = $.extend(defaultOp, op);
      this.op.__self = this;
      paintTransfer(this.op);
      initEvent(this.op);
      // 初始化回调函数
      if (this.op.callback && $.isFunction(this.op.callback)) {
        this.op.callback.call(this);
      }
      return this;
    };
    // 显示 暂无数据
    Transfer.prototype.showNoData = function (el, isShow) {
      this.op.transferDom.find(el)[!isShow ? 'addClass' : 'removeClass']('hide');
    };
    // 重新绑定
    Transfer.prototype.changeEvent = function () {
      // 选择框
      this.op.transferDom.find('.list-checkbox').off('click').on('click', function () {
        $(this).parent().toggleClass('active'); //当前元素
      });
      // 删除
      this.op.transferDom.find('.transfer-main-right .icon-delete').off('click').on('click', function () {
        $(this).parent().remove();
        var leftLis = $('.transfer-main-left li');
        var rightLis = $('.transfer-main-right li');
        // 过滤数据
        var existMap = {};
        rightLis.each(function() {
          existMap[$(this).attr('lblid')] = true;
        });
        // 刷新列表
        leftLis.each(function() {
          var target = $(this);
          if (existMap[target.attr('lblid')]) {
            target.addClass('hide');
          } else {
            target.removeClass('hide');
          }
        });
      });
      var isViewLeft = this.op.optionUl.find('li').length > 0 ? false : true;
      var isViewRight = this.op.chooseUl.find('li').length > 0 ? false : true;
      this.showNoData('.transfer-main-left .no-data', isViewLeft);
      this.showNoData('.transfer-main-right .no-data', isViewRight);
    };
    // 关闭
    Transfer.prototype.close = function () {
      this.op.optionUl = null;
      this.op.chooseUl = null;
      this.op.backdropDom.remove();
    };
    Transfer.prototype.languageData = {
      'ZH': {
        confirm: '确定',
        cancel : '取消',
        noneData: '暂无数据',
        search : '搜索',
        query : '查询',
        choose: '选择',
        chosen: '已选择'
      },
      'EN': {
        confirm: 'Confirm',
        cancel: 'Cancel',
        noneData: 'None Data',
        search: 'Search',
        query: 'Query',
        choose: 'Choose',
        chosen: 'Chosen'
      }
    };
    return new Transfer();
  };
  /**
   * 拖拽事件
   * @param <string> boundary 边界对象
   * @param <string> drag 拖拽对象
   * @param <string> move 移动对象
   */
  module.dragEvent = function (boundary, drag, move) {
    var x,
      y,
      offsetLeft,
      offsetTop,
      isDown,
      boundaryDom = document.querySelector(boundary),
      dragDom = document.querySelector(drag),
      moveDom = document.querySelector(move);

    if (!boundaryDom) {
      boundaryDom = document.body;
    }

    var minLeft = 0,
      maxLeft = boundaryDom.clientWidth - moveDom.clientWidth,
      minTop = 0,
      maxTop = boundaryDom.clientHeight - moveDom.clientHeight;

    // 鼠标按下事件
    dragDom.onmousedown = function (e) {
      // 获取x坐标和y坐标
      x = e.clientX;
      y = e.clientY;
      //获取左部和顶部的偏移量
      offsetLeft = moveDom.offsetLeft;
      offsetTop = moveDom.offsetTop;
      //开关打开
      isDown = true;
      //设置样式
      dragDom.style.cursor = 'move';

      // 放开移动事件
      // 鼠标移动
      if (window.addEventListener) {
        // 默认 false: 冒泡传递
        //      true: 使用捕获传递
        window.addEventListener('mousemove', processMouseMove);
      } else {
        window.attachEvent('onmousemove', processMouseMove);
      }


    };

    // 鼠标抬起事件
    dragDom.onmouseup = window.onmouseup = function () {
      //开关关闭
      isDown = false;
      dragDom.style.cursor = 'default';
      if (window.removeEventListener) {
        window.removeEventListener('mousemove', processMouseMove);
      } else {
        window.detachEvent('onmousemove', processMouseMove);
      }
    };

    // 处理鼠标移动
    function processMouseMove(e) {
      if (isDown == false) {
        return;
      }
      //获取x和y
      var nx = e.clientX;
      var ny = e.clientY;
      maxLeft = boundaryDom.clientWidth - moveDom.clientWidth;
      maxTop = boundaryDom.clientHeight - moveDom.clientHeight;
      //计算移动后的左偏移量和顶部的偏移量
      var nl = offsetLeft + (nx - x);
      var nt = offsetTop + (ny - y);
      nl = nl < minLeft ? minLeft : nl;
      nl = nl > maxLeft ? maxLeft : nl;
      nt = nt < minTop ? minTop : nt;
      nt = nt > maxTop ? maxTop : nt;
      moveDom.style.left = nl + 'px';
      moveDom.style.top = nt + 'px';
    }

  };

  // 获取公司Id
  module.extend({
    single: {
      getCompanyId: function(cb, _op) {
        // 检索公司信息
        function getCompany() {
          var op = { type:'POST' };
          op = _op ? $.extend(op, _op) : op;
          module.$http(
            API.server.org + '/org/queryRootOrg',
            {},
            function() {
              var data = this;
              if (typeof data.resData === 'undefined' || data.resData.length < 1) {
                return console.log('Empty company');
              }
              window.localStorage.setItem('companyId', data.resData[0].orgId);
              window.localStorage.setItem('companyName', data.resData[0].orgName);
              cb.call(data.resData[0].orgId);
            },
            op
          );
        }
        var companyId = module.localData.getData('companyId');
        if (!companyId) {
          // 不存在就检索
          getCompany();
        } else {
          // 存在就返回
          cb.call(companyId);
        }
      }
    }
  });
  // IP组件
  module.doTree.ipinput = function() {
    var $val = $(this).find('input[type="hidden"]');
    var $one = $(this).find('input[ipindex="one"]');
    var $two = $(this).find('input[ipindex="two"]');
    var $three = $(this).find('input[ipindex="three"]');
    var $four = $(this).find('input[ipindex="four"]');
    var vals = $val.val().split('.');
    var ipindex = '';
    var currValue = '';
    var pos = '';

    // 判断参数是否为空
    function isEmpty(obj) {
      if (null == obj || undefined == obj || '' == obj) {
        return true;
      } else {
        return false;
      }
    }

    // 键盘弹起事件
    function keydown(event) {
      // 当前输入的键盘值
      var code = event.keyCode;
      // 除了数字键、删除键、小数点之外全部不允许输入
      if((code < 48 && 8 != code && 9 != code && 37 != code && 39 != code)
          || (code > 57 && code < 96)
          || (code > 105 && 110 != code && 190 != code)) {
        return false;
      }

      // 当前输入框的ID
      ipindex = $(event.currentTarget).attr('ipindex');
      currValue = $(event.currentTarget).val();
      pos = getCursortPosition(event.currentTarget);

      // 9 Tab 键
      if (9 == code) {
        switch(ipindex) {
        case 'one':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return false;
        case 'two':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return false;
        case 'three':
          setTimeout(function() {
            setCaretPosition($four[0], $four.val().length);
          }, 10);
          return false;
        case 'four':
          setTimeout(function() {
            setCaretPosition($one[0], $one.val().length);
          }, 10);
          return false;
        }
      }

      // 110、190代表键盘上的两个点
      if (110 == code || 190 == code) {
        switch(ipindex) {
        case 'one':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return false;
        case 'two':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return false;
        case 'three':
          setTimeout(function() {
            setCaretPosition($four[0], $four.val().length);
          }, 10);
          return false;
        case 'four':
          return false;
        }
      }

      // 8 删除 back键
      if (8 == code && currValue == '') {
        switch(ipindex) {
        case 'one':
          return false;
        case 'two':
          setTimeout(function() {
            setCaretPosition($one[0], $one.val().length);
          }, 10);
          return false;
        case 'three':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return false;
        case 'four':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return false;
        }
      }

      return true;
    }

    // 设置光标位置
    function setCaretPosition(textDom, pos){
      if (textDom.setSelectionRange) {
        // IE Support
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
      } else if (textDom.createTextRange) {
        // Firefox support
        var range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

    // 获取光标位置
    function getCursortPosition (textDom) {
      var cursorPos = 0;
      if (document.selection) {
        // IE Support
        textDom.focus ();
        var selectRange = document.selection.createRange();
        selectRange.moveStart ('character', -textDom.value.length);
        cursorPos = selectRange.text.length;
      }else if (textDom.selectionStart || textDom.selectionStart == '0') {
        // Firefox support
        cursorPos = textDom.selectionStart;
      }
      return cursorPos;
    }

    // 键盘弹起事件
    function keyup(event) {
      // 当前值
      var valueStr = $(event.currentTarget).val();
      if (!isEmpty(valueStr)) {
        value = parseInt(valueStr);
        if (value > 255) {
          // $(event.currentTarget).val(currValue);
          $(event.currentTarget).val(255);
        }
        if (valueStr.indexOf('0') == 0) {
          $(event.currentTarget).val(value);
        }
      }
      // 输入3个自动移动
      if ($(event.currentTarget).val().length == 3 && event.keyCode != 8 &&
        event.keyCode != 37 && event.keyCode != 39) {
        setData();
        switch(ipindex) {
        case 'one':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return true;
        case 'two':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return true;
        case 'three':
          setTimeout(function() {
            setCaretPosition($four[0], $four.val().length);
          }, 10);
          return true;
        case 'four':
        }
      }
      // 37 左移
      if (37 == event.keyCode && pos == 0) {
        switch(ipindex) {
        case 'one':
          return false;
        case 'two':
          setTimeout(function() {
            setCaretPosition($one[0], $one.val().length);
          }, 10);
          return false;
        case 'three':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return false;
        case 'four':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return false;
        }
      }
      // 39 右移
      if (39 == event.keyCode && pos == $(event.currentTarget).val().length) {
        switch(ipindex) {
        case 'one':
          setTimeout(function() {
            setCaretPosition($two[0], $two.val().length);
          }, 10);
          return false;
        case 'two':
          setTimeout(function() {
            setCaretPosition($three[0], $three.val().length);
          }, 10);
          return false;
        case 'three':
          setTimeout(function() {
            setCaretPosition($four[0], $four.val().length);
          }, 10);
          return false;
        case 'four':
          return false;
        }
      }
      setData();
      return true;
    }

    // 赋值给隐藏框
    function setData() {
      // 四个框的值
      var one = $one.val();
      var two = $two.val();
      var three = $three.val();
      var four = $four.val();
      // 如果四个框都有值则赋值给隐藏框
      // if(!isEmpty(one) && !isEmpty(two) && !isEmpty(three) && !isEmpty(four)) {
      var ip = one + '.' + two + '.' + three + '.' + four;
      $val.val(ip);
      // }
      return true;
    }

    // 初始化显示
    if (vals.length === 4) {
      $one.val(vals[0]);
      $two.val(vals[1]);
      $three.val(vals[2]);
      $four.val(vals[3]);
    }

    // 绑定事件 输入框绑定键盘按下事件
    $(this).find('.ipinput-input').keydown(function(event) {
      return keydown(event);
    });
    // 绑定事件 输入框绑定键盘按下弹起事件
    $(this).find('.ipinput-input').keyup(function(event) {
      return keyup(event);
    });
  };

  /**
   * 加载完成后初始化系统
   */
  // $(function(){
  //   /* ! 初始化 tab */
  //   module.tabManage.init();
  // });
})();