/**
 * 运行入口
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import API from './config/apiConfig'
import i18nOptions from './lang'
import VueI18n from 'vue-i18n'
import Util from './libs/util'

Vue.config.productionTip = false

//定义Vue全局内容
Vue.prototype.API = API
Vue.prototype.Util = Util

/*使用Vue-I18n做语言切换配置*/
Vue.use(VueI18n)
/*设置默认语言类型，将我们项目中的语言包与Element的语言包进行合并*/
const i18n = new VueI18n(i18nOptions)


/*使用VueResource*/
Vue.use(VueResource)
/*设置VueResource请求相关参数*/
Vue.http.options.emulateJSON = false
Vue.http.options.timeout = 10000
/*配置http拦截器*/
Vue.http.interceptors.push(function (request) {
  /*这里设置http请求默认参数*/
  request.headers.set('mtk', Util.localData.getData('usermtk'))
  return function (response) {
    /*公用处处理请求返回参数*/
    let data = response.body

    if (data.resCode != 1) {
      if (data.resMsg) {
        if (data.resMsg[0].msgCode == 10005) {
          router.push({name: 'login'})
        } else {
          console.log(data.resMsg[0].msgText)
        }
      } else {
        console.log('resMsg不存在')
      }
    }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n, //定义语言切换
  components: { App },
  template: '<App/>'
})
