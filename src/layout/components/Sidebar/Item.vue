<script>
export default {
  name: 'MenuItem',
  functional: true, // 函数式组件
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染函数
  render(h, context) {
    // 图标 和标题
    // context上下文，context.props就是layout/components/Sidebar/SidebarItem.vue中item组件传进来的 icon, title，if (icon)判断icon是否存在后，渲染图标，标题
    const { icon, title } = context.props
    const vnodes = []
    // 渲染图标
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }
    // 渲染标题
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes // 渲染节点
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
