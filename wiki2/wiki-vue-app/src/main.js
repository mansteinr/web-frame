/**
 * 运行入口
 */
import Vue from 'vue'
import App from './App'
import router from './router' //引入路由
import API from './config/apiConfig' //引入API 配置文件
import i18nOptions from './lang' //引入语言包
import VueI18n from 'vue-i18n' //引入语言切换工具
import Util from './libs/util' //引入公用工具包
import axios from 'axios' //引入 axios
import MVUI from './components' //引入所有UI组件
import './components/all.scss'
import 'babel-polyfill' //引入IE兼容编译

Vue.config.productionTip = false

//设置全局http请求
let errorRun = () => {
  //这里处理请求出错的场景
}

//拦截request请求，配置请求参数
axios.interceptors.request.use(function (config) {
  console.log(config)
  config.timeout = 5000 //设置请求超时时长
  config.headers.mtk = Util.localData.getData('usermtk') //设置请求用户token
  return config
}, function (error) {
  errorRun()
  return Promise.reject(error)
})

//拦截response 处理返回问题
axios.interceptors.response.use(function (response) {
  let data = response.data

  if (data.resCode == '10005') {
    //这里跳转到登录
  }

  return data
}, function (error) {
  errorRun()
  return Promise.reject(error)
})

//定义Vue全局内容
Vue.prototype.$API = API //配置全局使用的api接口
Vue.prototype.$Util = Util //配置全局的工具类
Vue.prototype.$http = axios

//使用 MVUI
Vue.use(MVUI)


/*使用Vue-I18n做语言切换配置*/
Vue.use(VueI18n)
/*设置默认语言类型，将我们项目中的语言包与Element的语言包进行合并*/
const i18n = new VueI18n(i18nOptions)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n, //定义语言切换
  components: { App },
  template: '<App/>'
})
