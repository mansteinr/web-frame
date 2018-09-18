import MvMessage from './message'

const components = [
  MvMessage
]

const install = function (Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })

  //Vue.use(Loading.directive)


  // Vue.prototype.$loading = Loading.service;
  // Vue.prototype.$msgbox = MessageBox;
  // Vue.prototype.$alert = MessageBox.alert;
  // Vue.prototype.$confirm = MessageBox.confirm;
  // Vue.prototype.$prompt = MessageBox.prompt;
  // Vue.prototype.$notify = Notification;
  // Vue.prototype.$message = Message;
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

//导出各个组件模块
export {
  MvMessage
}
//导出整个组件库
let modules = {
  version: '1.0.0',
  install
}

components.map(component => {
  modules[component.name] = component
})

export default {
  install,
  MvMessage
}
