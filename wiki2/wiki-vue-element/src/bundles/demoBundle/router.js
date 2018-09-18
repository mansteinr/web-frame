//改成懒加载的路由模式，避免打包后js文件过大，影响首屏加载速度
const Main = r => require.ensure([], () => r(require('./Main')), 'Main')

export default {
  path: '/demo',
  name: 'demo',
  meta: {
    title: '测试'
  },
  component: Main
}
