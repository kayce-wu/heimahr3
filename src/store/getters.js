const getters = {
  sidebar: state => state.app.sidebar, // kw：取了app模块的属性
  device: state => state.app.device,
  token: state => state.user.token,
  // kw: 将userId放到getters是为了让在权限拦截处调用action(src/pemission.js)做是否获取过用户信息判断使用，当然这只是用途之一
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名称
  routes: state => state.user.routes,
  company: state => state.user.userInfo.company, // 公司名称
  departmentName: state => state.user.userInfo.departmentName // 部门名称
}
// kw：getters主要是便捷访问，以后需要访问头像就直接：getters.avatar即可，不需要state => state.user.userInfo.staffPhoto那么麻烦
export default getters
