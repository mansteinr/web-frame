$(function () {
  let randonArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    FN = {
      ranomFun: function (randomFlag, min, max) {
        let str = "",
          range = min,
          pos = ''
        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (let i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (randonArr.length - 1));
          str += randonArr[pos];
        }
        return str;
      },
      /*获取客户名称*/
      getCustomers() {
        module.getCustomers().then(res => {
          $('[name="loginName"]').closest('.select-dropdown').find('.dropdown-menu').html(res)
          $(document).trigger(EVENT.INIT.DOTREE, $('[name="loginName"]').closest('.search-item'))
          // 这里  主要做个异步 防止函数立马执行 从而导致报错 
          if ($('.card-title').text().indexOf('新增') >= 0) {
            $('.secrets-wrapper').append(html)
            $(document).trigger(EVENT.INIT.DOTREE, $(document).find('.secrets-wrapper'))
          }
          $('.app-item>input[name="appId"]').val(FN.ranomFun(true, 6, 8))
          $('.app-item>input[name="appKey"]').val(FN.ranomFun(true, 6, 8))
          $('.IOS').hide()
        })
      },
      initFun: function () {
        /*获取客户名称*/
        FN.getCustomers()
      },
      // 更新
      initUpdate(message) {
        if (!message.appId) return
        $.each(message, function (k, v) {
          $('.form-item>input[name="' + k + '"]').val(v)
        })
        $('[name="appType"]').closest('div').find('li[data-value="' + message.appType + '"]').trigger('click')
        $('[name="appBusiness"]').closest('div').find('li[data-value="' + message.appBusiness + '"]').trigger('click')
        $('[name="platform"][value="' + message.platform + '"]').trigger('click')
        $('[name="loginName"]').attr('disabled', true).attr("data-customer", message.company)
        $('[name="introduce"]').val(message.introduce)
        $('#imgUpload').attr('src', 'data:image/jpeg;base64,' + message.icon).attr("data-icon", message.icon)
        $('.icon-iconfontshangchuan').hide()
        $('#imgUpload').show()
        module.$http(API.lightSignIn.secret + '/' + message.appId, {}, function () {
          if (!this.resData.length) {
            $('.secrets-wrapper').append(html)
            $(document).trigger(EVENT.INIT.DOTREE, $(this).closest('.secrets-wrapper'))
          }
          let divs = ''
          this.resData.forEach(v => {
            divs += `<div class='secrets-son'>
            <i class="iconfont icon-jian" data-click="mins"></i>
            <div class="form-item form-must-icon">
              <label class="form-label">appId</label>
              <input type="text" name="appId" class="m-input form-input" value="${v.appId}" required placeholder="请输入appId"/>
            </div>
            <div class="form-item form-must-icon">
              <label class="form-label">appKey</label>
              <input type="text" name="appKey" class="m-input form-input" value="${v.appKey}" required placeholder="请输入appKey"/>
            </div>
            <div class="form-item app-item form-must-icon">
                <label class="form-label">供应商</label>
                <div class="select-dropdown m-input" data-do="select">
                  <div class="text-warp selected-value"></div>
                  <input type="hidden" name="provider"  value="${v.provider}" />
                  <ul class="dropdown-menu">
                    <li class="dropdown-item text-warp" data-value="0" title="创蓝">创蓝</li>
                    <li class="dropdown-item text-warp" data-value="1" title="电信">电信</li>
                    <li class="dropdown-item text-warp" data-value="2" title="移动">移动</li>
                    <li class="dropdown-item text-warp" data-value="3" title="联通">联通</li>
                  </ul>
                </div>
              </div>
            <i class="iconfont icon-zengjia" data-click="add"></i>
          </div>`
          })
          $('.secrets-wrapper').append(divs)
          $(document).trigger(EVENT.INIT.DOTREE, $(document).find('.secrets-wrapper'))
        }, { type: 'get' })
      }
    },
    html = `<div class='secrets-son'>
    <i class="iconfont icon-jian" data-click="mins"></i>
    <div class="form-item form-must-icon">
      <label class="form-label">appId</label>
      <input type="text" name="appId" class="m-input form-input" required placeholder="请输入appId"/>
    </div>
    <div class="form-item form-must-icon">
      <label class="form-label">appKey</label>
      <input type="text" name="appKey" class="m-input form-input" required placeholder="请输入appKey"/>
    </div>
    <div class="form-item app-item form-must-icon">
        <label class="form-label">供应商</label>
        <div class="select-dropdown m-input" data-do="select">
          <div class="text-warp selected-value"></div>
          <input type="hidden" name="provider"  value="0" />
          <ul class="dropdown-menu">
            <li class="dropdown-item text-warp" data-value="0" title="创蓝">创蓝</li>
            <li class="dropdown-item text-warp" data-value="1" title="电信">电信</li>
            <li class="dropdown-item text-warp" data-value="2" title="移动">移动</li>
            <li class="dropdown-item text-warp" data-value="3" title="联通">联通</li>
          </ul>
        </div>
      </div>
    <i class="iconfont icon-zengjia" data-click="add"></i>
  </div>`,
    isFirst = true

  FN.initFun()

  module.clickTree.add = function () { // 新增密钥 
    let flag = false // 每个app的密钥的供应商只能出现一次
    // 最多只能添加四个
    if ($(document).find('.secrets-son').length === 4) {
      module.alert('密钥最多只能添加四个')
      return
    }
    // 每次添加之前 检测上面是否有未填完整信息项
    $(document).find('.secrets-son').each(function (k, v) {
      $(v).find('input').each(function (k1, v1) {
        if (v1.name && !v1.value) {
          flag = true
        }
      })
      if (flag) return
    })
    if (flag) {
      module.alert('请将上面的信息填写完整，在开始新的')
      return
    }
    $('.secrets-wrapper').append(html)
    $(document).trigger(EVENT.INIT.DOTREE, $(this).closest('.secrets-wrapper'))
  }

  $('[name="platform"]').off('change').on('change', function () { // ios和安卓相互切换时 影藏和显示
    if ($(this).val() === 'Andriod') {
      $('.andriod').show()
      $('.IOS').hide()
    } else {
      $('.IOS').show()
      $('.andriod').hide()
    }
  })

  module.clickTree.addFuns = function () { //  发送保存信息
    let isUpdate = false, isRepeatFlag = false // 判断是否是更新
    if ($('.card-title').text().indexOf('编辑') > 0) {
      isUpdate = true // 是更新
    }
    let form = $(this).closest('.card-container');
    if (!module.checkForm(form)) {
      module.alert('请将信息填写完整')
      return
    }
    let options = {}, secrets = [], info = {}, imgSrc = $('#imgUpload').attr('src')
    $(document).find('form>.form-item input').each(function (k, v) {
      if (this.style.display === 'none') return
      if (v.name && v.value) {
        info[v.name] = v.value
      }
    })

    /**
     * 更新时 要和原图片对比 若是同一个图片 则需要传空，反之需要
     */
    if (isUpdate) {
      // 更新的时候 客户没有更新图标 则不需要上传图标 反之上传
      if (imgSrc === $('#imgUpload').data('icon')) {
        info.icon = ''
      } else {
        info.icon = imgSrc.split(',')[1]
      }
    } else {
      if (imgSrc) {
        info.icon = imgSrc.split(',')[1]
      } else {
        module.alert('请上传图标')
        return
      }
    }
    info.introduce = $('[name="introduce"]').val().trim()
    if (!info.introduce) {
      module.alert('请填写应用简介')
      return
    }

    if (module.getImgSize(imgSrc) > 20) {
      module.alert('图标不能大于20kb')
      return
    }

    info.platform = $('[name="platform"]:checked').val()
    info.company = isUpdate ? $('[name="loginName"]').data('customer') : $('[name="loginName"]').closest('.select-dropdown').find('li.active').text().trim()
    options.info = info

    let isEmpty = false, isRepeatObj = {} // 判断密钥是否全为空

    $(document).find('.secrets-son').each(function (k, v) {
      let option = {}
      $(v).find('input').each(function (k1, v1) {
        if (v1.name && v1.value) {
          if (v1.name === 'provider') {
            if (!isRepeatObj[v1.value]) { // 检测供应商是否重复了
              isRepeatObj[v1.value] = v1.value
            } else {
              isRepeatFlag = true
            }
          }
          option[v1.name] = v1.value
          option.id = options.info.appId
          isEmpty = true
        }
        if (isRepeatFlag) return
      })
      secrets.push(option)
    })
    if (isRepeatFlag) {
      module.alert('供应商重复了')
      return
    }
    if (!isEmpty) {
      module.alert('密钥不能全部为空')
      return
    }
    options.secrets = secrets


    /**
     * 增加和修改都是同一个接口 但是新增用的是post 修改用的是put
     */
    let isAddFlag = $('.card-title').text().indexOf('新增') >= 0
    module.$http(API.lightSignIn.appInfo, options, function (e) {
      if (this.resCode) {
        let _this = this
        $('.tab-item', parent.document).each(function (k, v) {
          if ([...v.classList].includes('active')) {
            module.postMessage({
              call: isAddFlag ? 'addSucess' : 'updateSucess',
              data: _this.resMsg[0].msgText + '_' + options.info.loginName,
              tabid: isAddFlag ? '' : options.info.loginName + '详情'
            })
            module.tabManage.delete(e, $(v).data('tabid'))
          }
        })

      } else {
        module.alert(this.resMsg[0].msgText)
      }
    }, {
      type: isAddFlag ? 'post' : 'put'
    })
  }
  
  module.clickTree.mins = function () {
    if ($(document).find('.secrets-son').length === 1) {
      module.alert('不能全部删除')
      return
    }
    $(this).closest('.secrets-son').remove()
  }

  module.messageCallBack.appAdd = function () { // 新增
    $('.card-title').text('新增')
    // 更新的时候 客户名称不能修改
    $('.app-add').show()
    $('.app-editor').hide()
  }

  /**
   * 更新
   * 
  */
  module.messageCallBack.update = function () {
    $('.card-title').text(this.data.loginName + '编辑')
    FN.initUpdate(this.data)
    // 更新的时候 客户名称不能修改
    $('.app-add').hide()
    $('.app-editor').show()
    isFirst = false
  }
  setTimeout(() => {
    if (isFirst) {
      $('.tab-item', parent.document).each(function (k, v) {
        if ([...v.classList].includes('active')) {
          if ($(v).data('tabid').indexOf('编辑') > 0) {
            module.tabManage.delete('', $(v).data('tabid'))
          }
        }
      })
    }
  }, 300)

  // 检测input 防止客户输入单引号
  $(document).find('input').on('blur', function () {
    let value = $(this).val().trim()
    if (value && (value.indexOf('\'') >= 0 || value.indexOf('\"') >= 0)) {
      module.alert(`${$(this).closest('.form-item').find('label').text().split('：')[0]} 请不要输入含有单引号的字符`)
    }
  })
})