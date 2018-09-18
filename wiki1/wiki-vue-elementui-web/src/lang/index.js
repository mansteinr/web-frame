/*全局语言配置*/
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import myEn from './en'
import myZh from './zh'

let language = {
  en: {...myEn,...enLocale},
  zh: {...myZh,...zhLocale}
}
export default language