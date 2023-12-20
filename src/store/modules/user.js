import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'
// kw:state用来存放数据
const state = {
  token: getToken(), // 从缓存中读取初始值，getToken这个函数来自于'@/utils/auth'，已经由模板封装好了
  userInfo: {}, // 存储用户基本资料状态
  routes: constantRoutes // 静态路由的数组
}

// kw:mutations用来修改数据
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存，获取到token之后，将它设置到缓存中
    setToken(token)
  },
  removeToken(state) {
    // 删除Vuex的token，登出时会用到
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 静态路由 + 动态路由
  }
}

// kw:actions用来做异步操作
const actions = {
  // context上下文，传入参数
  async login(context, data) {
    console.log(data)
    // todo: 调用登录接口，要调用登录接口还需要一些配置如请求模块，vuex封装，代理跨域区分环境等
    const token = await login(data)
    // 返回一个token 123456
    // kw: 提交到vuex共享空间
    context.commit('setToken', token)
  },
  // 获取用户的基本资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result // 返回数据
  },
  // 退出登录的action
  logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('setUserInfo', {}) // 设置用户信息为空对象
    // 重置路由
    resetRouter()
  }
}

// kw:导出上面三个变量
export default {
  namespaced: true, // 开启命名空间，为true就表示调用下面三个变量要带user模块的名称
  state,
  mutations,
  actions
}
