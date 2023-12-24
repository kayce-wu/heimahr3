import layout from '@/layout'
export default {
  // 路由信息
  path: '/department',
  component: layout, // 一级路由，一级路由肯定是layout布局，才有的后面的内容展示
  name: 'department',
  children: [{
    path: '', // 二级路由地址为空时 表示 /department 显示一级路由 + 二级路由，说白了就是当没有切确的二级路由时，/department既是一级路由也是二级路由了。
    component: () => import('@/views/department'), // 引入@/views/department组件，二级路由
    name: 'department', // name属性可以用来跳转 也可以标记路由
    meta: {
      // 路由元信息 存储数据的
      icon: 'tree', // 图标，就是左侧导航栏的图标
      title: '组织' // 标题
      // kw: 最后在总路由router/index.js引入
    }
  }]
}
