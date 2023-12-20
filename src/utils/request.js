import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  // kw：process.env.VUE_APP_BASE_API这个值是根据生产环境和开发环境决定的，可以通过.env.production、.env.development这两个文件查看值，当前是开发环境就取'/api'，生产环境就取'/prod-api'
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 10000
}) // 创建一个新的axios实例
// kw: 请求拦截器
// 成功执行1 失败2
service.interceptors.request.use((config) => {
  // 注入token
  //  this.$store.getters，不能这种写法，必须先引用，再调用
  // store.getters.token => 请求头里面，这个就是文件store里写getters的好处了，直接调用就行了
  if (store.getters.token) {
    // kw：将token放到请求头，config.headers.Authorization这个是根据接口文档找到请求头的字段写出来的。除了登录接口不需要，其他接口都需要传token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  // axios默认包裹了data
  // 判断是不是Blob
  if (response.data instanceof Blob) return response.data // 返回了Blob对象
  const { data, message, success } = response.data // 默认json格式
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if (error.response.status === 401) {
    // KW: import { Message } from 'element-ui'
    Message({ type: 'warning', message: 'token超时了' })
    // 说明token超时了
    await store.dispatch('user/logout') // 调用action 退出登录
    //  主动跳到登录页
    router.push('/login') // 跳转到登录页
    return Promise.reject(error)
  }
  // error.message
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
// kw: 导出axios实例，供调用
export default service
