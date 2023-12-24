import Vue from 'vue'

// 导入初始样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// index网页的样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// kw:判断是否为生产环境，mock就是如果没有接口数据就模拟接口数据
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// kw:注册ElementUI组件，属于全局注册，其他地方不需要引用即可使用
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 封装自定义指令 用来控制操作权
Vue.directive('permission', {
  // inserted会在指令作用的元素插入到页面完成以后触发
  inserted(el, binding) {
    // el 指令作用的元素的dom对象
    // binding是v-permission='表达式'中表达式的信息
    console.log(el)
    const points = store.state.user.userInfo?.roles?.points || [] // store.state.user.userInfo?.roles?.points保存了当前用户信息的操作权
    // binding.value 是v-permission='表达式'中表达式的值,如下面代码v-permission="'add-employee'"中的add-employee，这个add-employee就是添加员工那个按钮
    if (!points.includes(binding.value)) {
      // 不存在就要删除或者禁用
      el.remove() // 删除元素
      // el.disabled = true  如果使用这个值，注释掉el.remove()那就是能看到添加员工按钮，但是无法使用
      // 线上的权限数据和线下的代码进行对应
    }
  }

})

// kw:实例化vue
new Vue({
  el: '#app', // kw:指向app.vue
  router, // kw:挂载vuex仓库，挂载router，store
  store,
  render: h => h(App) // kw:渲染根组件
})
