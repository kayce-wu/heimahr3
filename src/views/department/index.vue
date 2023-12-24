<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <!-- default-expand-all默认所有子节点展开 -->
      <!-- 在收起操作菜单时会把整个树形结构收起，所以这个属性就是控制 :expand-on-click-node="false -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template -->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <!-- data.managerName负责人名称 -->
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 ，默认值，用来传command="add"-->
              <!-- 根据element文档，command就是触发下拉菜单事件，再根据command="add"这些值在operateDept函数做对应操作 -->
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- .sync表示会接受子组件(add-dept)的事件  update:showDialog, 值 => 属性 说白了，就是会监听组件add-dept中update:showDialog的值，用于实现叉叉关闭弹层功能-->
    <!-- ref 可以获取dom实例对象 ref也可以获取自定义组件的实例对象 -->
    <!-- 这里你肯定好奇为什么没有对添加子部门的操作代码，因为add-dept是我们自己封装的一个组件，在里面实现了表单校验src/views/department/components/add-dept.vue -->
    <!-- currentNodeId--存储当前点击的id(用于判断在哪个部门下添加的子部门) -->
    <!-- @updateDepartment="getDepartment"在子组件add-dept中点击确定后，更新部门，有一个通知父组件的操作：this.$emit('updateDepartment')，所以这里父组件只需要监听子组件发过来的通知，然后getDepartment更新部门信息 -->
    <add-dept ref="addDept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'

// kw: 导出默认对象
export default {
  name: 'Department',
  // kw: import AddDept from './components/add-dept.vue'应用组件后，在这里注册弹层组件
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false, // 控制弹层的显示和隐藏
      depts: [], // 数据属性
      defaultProps: {
        label: 'name', // 要显示的字段的名字，就是数据depts中如果有name，那就显示depts中name的值
        children: 'children' // 读取子节点的字段名，还是depts中children里的数据，子节点，层级结构
      }
    }
  },
  created() {
    this.getDepartment() // 调用获取数据的接口
  },
  methods: {
    // 封装好方法
    async getDepartment() {
      const result = await getDepartment()
      // kw: 因为接口返回的数据不是层级结构的，所以需要转化
      this.depts = transListToTreeData(result, 0)
    },
    // 操作部门方法
    operateDept(type, id) {
      if (type === 'add') {
        // 添加子部门
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门场景
        this.showDialog = true
        this.currentNodeId = id // 记录id 要用它获取数据
        // 更新props- 异步动作
        // 直接调用了子组件的方法 同步的方法
        // 要在子组件获取数据
        // 父组件调用子组件的方法来获取数据
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail() // this.$refs.addDept等同于子组件的this
        // kw: 上面总结就是，打开弹层是一个同步的操作，就是获取数据和打开弹层一起了，所以会导致弹层中没办法显示数据，所以要保证先拿到数据再在弹层显示
        })
      } else {
        // 删除部门，根据element文档设置提示$confirm
        this.$confirm('您确认要删除该部门吗').then(async() => {
          // 调用delDepartment删除部门
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          // 重新拉取数据
          this.getDepartment()
        })
        // 取消不用管，会自动关闭提示，本身也是啥也不用做。
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
