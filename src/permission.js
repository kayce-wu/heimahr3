import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/**
 *前置守卫
 *kw: 在路由跳转之前会执行下面的回调函数
 *
*/

const whiteList = ['/login', '/404']
//kw:(to, from, next)，to到哪里去，from从哪里来，next执行完回调函数之后往下走，正常跳转网页
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      // 判断是否获取过资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus) // 数组 不确定 可能是8个 1个 0个
        // console.log(asyncRoutes) // 数组 8个
        const filterRoutes = asyncRoutes.filter(item => {
          // return true/false
          return roles.menus.includes(item.name)
        }) // 筛选后的路由
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由信息到路由表
        // router添加动态路由之后 需要转发一下
        next(to.path) // 目的是让路由拥有信息 router的已知缺陷
      } else {
        next() // 放过
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
})

/** *
 * 后置守卫
 * kw:完成跳转后，执行后置守卫
 * **/
router.afterEach(() => {
  console.log('123')
  nprogress.done()
})
