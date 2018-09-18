import Vue from 'vue'
import Router from 'vue-router'
import Main from '~/views/Main'
import Login from '~/views/Login'
import Demo from '~/views/demo/Demo'

Vue.use(Router)

export default new Router({
	linkActiveClass: 'active',
  mode: 'history',
  routes: [{
    path: "*",
    redirect: "/"
  },{
    path: "/",
    redirect: "/demo"
  },{
      path: '/',
      name: 'Main',
      meta: {
        title: '首页'
      },
      component: Main,
      children: [{
      	path: '/demo',
	      name: 'demo',
	      meta: {
	        title: 'demo'
	      },
	      component: Demo
      }]
  },{
      path: '/login',
      name: 'Login',
      meta: {
        title: '登录'
      },
      component: Login
  }]
})
