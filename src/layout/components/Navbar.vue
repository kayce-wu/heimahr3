<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <!-- kw：这里我们使用了可选链操作符 ？， 它的意思是当？前面的变量为空时，它不会继续往下执行，防止报错，特别是那种很多级的调用，如name.addr.id如果name为空，那再往下走会报错，所以name?.addr.id -->
          <!-- kw：charAt(0)取字符串的第一个字符 -->
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent阻止默认事件 -->
          <!-- a标签是h5标签，可以直接定义H5事件，不需要加native，但是a标签有一个默认事件，所以要阻止默认事件 -->
          <!-- updatePassword函数执行后会弹出下面的dialog对话框 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native事件修饰符，注册组件的根元素的原生事件 -->
          <!-- 原生事件：H5事件，el-dropdown-item这个组件并不是H5标签，所以无法触发H5事件，@click.native就是为了让这个组件触发H5事件，如果单纯是@click事件，那就是这个组件的自定义事件，但是实际上这个组件没有自定义事件，只能让它触发H5事件 -->
          <!-- 可以查看element文档中下拉列表的item事件，并没有click事件 -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 放置dialog -->
    <!-- sync- 可以接收子组件传过来的事件和值，就是弹层上面那个叉叉可以直接响应关闭弹层，但是这个操作只是关闭了弹层，一些校验信息会残留，所以还需要@close="btnCancel"进一步清除 -->
    <!-- showDialog: false, // 控制弹层的显示和隐藏，下面数据data中有定义 -->
    <!-- @close="btnCancel"控制弹层的叉叉事件，使得表单校验信息重置 -->
    <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" @close="btnCancel">
      <!-- 放置表单 -->
      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOK">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 控制弹层的显示和隐藏
      passForm: {
        oldPassword: '', // 旧密码，这里的名字命名都是参照修改密码接口文档的参数来的，为了方便传输参数。
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      rules: {
        // kw：required: true表示这是必填项
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }], // 旧密码
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          min: 6,
          max: 16,
          message: '新密码的长度为6-16位之间'
        }], // 新密码
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          // kw：validator: (rule, value, callback) =>这里用了箭头函数，不然this.passForm.newPassword会报错-取不到this数据。
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              // 直接执行
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      }
    }
  },
  computed: {
    // 引入头像和用户名称，这个就是Vuex中使用getters暴露属性-代码位置(**src/store/getters.js**)，在这里得到了引用
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword() {
      // 弹出层
      this.showDialog = true // 显示弹层
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 调用退出登录的action
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    // 确定
    btnOK() {
      // kw: this.$refs.passForm.validate这里对全部表单进行了校验
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口，import { updatePassword } from '@/api/user'，这个函数名虽然和上面的那个函数重名，实际上上面那个是通过this来调用的，所以在vue2中这两个不冲突。
          await updatePassword(this.passForm)
          // kw: this.passForm有三个参数，而接口只需要两个参数？只要接口不限制，多传参数没问题
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    // 取消
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单，resetFields这个方法在element文档的form中有写
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        // kw: 水平居中
        display: flex;
        align-items: center;
        .name {
          //  用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }
        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          // kw: 圆形
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          // kw: 距离右边的距离
          margin-right: 4px;
        }
        .el-icon-setting {
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
