// kw: 前后守卫的包
import router from '@/router'
// kw: 进度条
import nprogress from 'nprogress'
// kw: 进度条的相关样式
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/**
 *前置守卫
 *kw: 在路由跳转之前会执行下面的回调函数
 *
*/

const whiteList = ['/login', '/404']
// kw:(to, from, next)，to到哪里去，from从哪里来，next执行完回调函数之后往下走，正常跳转网页
router.beforeEach(async(to, from, next) => {
  // kw: nprogress.start()\nprogress.done()是网页加载中上方的进度条。
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫，所以不会执行后置守卫中的进度条结束nprogress.done()；如果没有地址，就会执行后置守卫
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
        // 我们知道404页必须放到所有路由之后，所以也上面将404路由添加到了路由数组最后一项[...filterRoutes, { path: '*', redirect: '/404', hidden: true }]
        // router添加动态路由之后 需要转发一下
        next(to.path) // 目的是让路由拥有信息 router的已知缺陷，不添加这句话就无法获得路由信息，而跳转到404
      } else {
        next() // 放过
      }
    }
  } else {
    // 没有token
    // kw: 白名单whiteList判断
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
