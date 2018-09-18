import Vue from 'vue'
import Router from 'vue-router'
import Util from '@/libs/util'
import mainRouter from '@/bundles/mainBundle/router' //首页路由

Vue.use(Router)

let routerOptions = {
  linkActiveClass: 'active',
  mode: 'history',
  routes: [{
    path: '*',
    redirect: '/'
  }]
}

//和main 同级使用push
routerOptions.routes.push(mainRouter)

let router = new Router(routerOptions)

//设置router 跳转配置
//设置路由前进后退处理
router.beforeEach((to, from, next) => {
  Util.title(to.meta.title)
  next()
})

export default router
