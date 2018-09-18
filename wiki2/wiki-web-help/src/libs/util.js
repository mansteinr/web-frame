let util = {}

/*设置标题*/
util.title = function (title) {
  title = title ? title + ' - 前端基础框架' : '前端基础框架'
  window.document.title = title
}
/*设置本地存储*/
util.localData = {
  setData: function (key, value) {
    window.localStorage.setItem(key, value)
  },
  getData: function (key) {
    let data = window.localStorage.getItem(key)

    return data ? data : ''
  },
  removeData: function (key) {
    window.localStorage.removeItem(key)
  },
  clearAllData: function () {
    window.localStorage.clear()
  },
  setCookie: function (key, value, day) {
    let exp = new Date(), days = day ? day : 30

    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    this.setBaseCookie(key, value, exp, '/')
  },
  setBaseCookie: function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
    let sCookie = sName + '=' + encodeURIComponent(sValue)

    if (oExpires) {
      sCookie += '; expires=' + oExpires.toGMTString()
    }
    if (sPath) {
      sCookie += '; path=' + sPath
    }
    if (sDomain) {
      sCookie += '; domain=' + sDomain
    }
    if (bSecure) {
      sCookie += '; secure'
    }
    document.cookie = sCookie
  },
  getCookie: function (sName) {
    let sRE = '(?:; )?' + sName + '=([^;]*);?'
    let oRE = new RegExp(sRE)

    if (oRE.test(document.cookie)) {
      return decodeURIComponent(RegExp.$1)
    } else {
      return null
    }
  },
  deleteCookie: function (sName, sPath, sDomain) {
    this.setCookie(sName, '', new Date(0), sPath, sDomain)
  }
}

export default util
