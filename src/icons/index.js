import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 下面三行代码的任务是 把 同级目录的 svg目录下的.svg图片引入到项目中来
//kw: require.context(目标目录,是否扫描子目录,正则表达式) 扫描./svg目录中的文件
const req = require.context('./svg', false, /\.svg$/)
//kw: req接收的值是一个回调函数
//kw: 下面定义了一个函数requireAll
const requireAll = requireContext => requireContext.keys().map(requireContext)
//kw: 数组方法 map foreach
//kw: map是循环每一项svg图片，map(()=>{})，map的参数是一个回调函数
//kw: req函数能够引用图片到项目中
//kw: 将所有的svg都引用到项目中
requireAll(req) //kw: 调用函数

// 相当于把svg下的所有的svg图片打包到了项目中
// 如果想用svg图片 就在svg目录下去寻找就可以了
