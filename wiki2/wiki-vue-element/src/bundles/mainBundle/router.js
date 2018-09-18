import Main from './Main'
import demoRouter from '@/bundles/demoBundle/router' //demo

export default {
  path: '/',
  name: 'main',
  meta: {
    title: '首页'
  },
  component: Main,
  children: [demoRouter]
}
