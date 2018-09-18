/*全局语言配置*/
import myEn from './en'
import myZh from './zh'
import MVEN from '../components/common/lang/en'
import MVZH from '../components/common/lang/zh'

//定义语言数组
let language = {
  en: Object.assign(myEn,MVEN),
  zh: Object.assign(myZh,MVZH)
}

export default {
  locale: 'zh',
  messages: language
}
