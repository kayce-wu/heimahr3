import request from '@/utils/request'

/* kw：login函数嵌套：首先view/login/index.vue中同名函数login调用了store目录下的modules的user.js中的login，store目录下的modules的user.js中的login最后调用了api/user.js中的login(这个文档中的login函数)，这三个函数虽然同名，但不是一个函数
 *整一个流程就是：从view/login/index.vue这里提交了登录表单，然后在store目录下的modules的user.js中实现了一些token等的操作，最后在这个文件里将最终数据经过@/utils/request处理后送到后端接口。
 *后端返回数据(响应)会到@/utils/request中的响应拦截器处理。最终看下面代码return request，是被返回了，如果请求成功，就会返回一个token，token被store目录下的modules的user.js中的login接受并保存到缓存中。
 */
export function login(data) { // kw: 导出login函数
  return request({ // kw: 发送请求
    url: '/sys/login', // kw: 请求的路径，因为'@/utils/request'文件对axios进行了封装，请求只需要写路径
    method: 'post', // kw: 请求方法，get可以不写
    data // kw: 请求参数，data是传进来的参数，里面已经按照接口文档的格式设置好参数
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}

/**
 * 更新密码
 * **/
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
