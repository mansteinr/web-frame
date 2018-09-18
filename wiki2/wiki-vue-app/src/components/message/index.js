import Message from './Main'

/* install 方法 用于Vue.use */
Message.install = function (Vue) {
  Vue.component(Message.name, Message)
}

export default Message
