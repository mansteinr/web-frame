/*全局语言配置*/
import myEn from './en'
import myZh from './zh'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

//定义语言数组
let language = {
  en: Object.assign(myEn,enLocale),
  zh: Object.assign(myZh,zhLocale)
}

export default {
  locale: 'zh',
  messages: language
}
