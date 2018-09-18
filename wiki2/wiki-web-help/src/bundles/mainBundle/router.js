import Main from './Main'
import messageRouter from '@/bundles/messageBundle/router' //消息路由

export default {
  path: '/',
  name: 'main',
  meta: {
    title: '首页'
  },
  component: Main,
  children: [messageRouter]
}
