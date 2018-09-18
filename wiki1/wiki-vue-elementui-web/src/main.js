import Vue from 'vue'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/base.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import Util from './libs/util'
import API from './config/apiConfig'
import myLanguage from './lang'

/*设置路由前进后退处理*/
router.beforeEach((to, from, next) => {
    Util.title(to.meta.title)
    next()
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0)
});

/*使用Vue-I18n做语言切换配置*/
Vue.use(VueI18n)
/*设置Vue全局变量*/
Vue.prototype.API = API
Vue.prototype.Util = Util

/*通过 PLAY_LANG 属性来获取浏览器的语言*/
let getCookie = (name,defaultValue = 'zh') => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return defaultValue;
}

/*设置默认语言类型，将我们项目中的语言包与Element的语言包进行合并*/
const i18n = new VueI18n({
  locale: getCookie('PLAY_LANG'),
  messages: myLanguage
});

/*合并使用语言*/
Vue.use(ElementUI,{i18n: (key, value) => i18n.t(key, value)})

/*使用VueResource*/
Vue.use(VueResource)
/*设置VueResource请求相关参数*/
Vue.http.options.emulateJSON = true
Vue.http.options.headers = {
	mvUserName: Util.localData.getData('usermtk')
}
/*配置http拦截器*/
Vue.http.interceptors.push(function(request) {
	/*这里设置http请求默认参数*/

  return function(response) {
		/*公用处处理请求返回参数*/
  }
})

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
})
