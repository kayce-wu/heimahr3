<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form > el-form-item > el-input kw:这个是表单校验的必须标签 -->
        <!-- kw: 为了完成表单校验给el-form绑定了3个属性，ref="form" :model="loginForm" :rules="loginRules"-->
        <!-- kw: ref="form"--在点击登录按钮时，就可以通过ref来获取整个表单的实例，然后进行表单的校验-->
        <!-- kw: rules="loginRules"--所有的规则都写在了rules所绑定的变量loginRules里-->
        <!-- kw: :model="loginForm"是一个数据结构，表示这个表单所绑定的数据都在loginForm找-->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <!-- kw: prop="password"，prop属性去找password相关的rules属性-->
          <el-form-item prop="password">
            <!-- kw: v-model="loginForm.password"双向绑定，最重要的一个属性，双向绑定说白了就是互通，使得密码值永远只有最新的一个，主要用于回显-->
            <!-- kw: 例如el-input输入了一个新值，那loginForm.password也会拿到这个新值，反之，当loginForm.password被重新赋值，这边的密码也会立即显示最新的密码-->
            <!-- kw: show-password密文-->
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <!-- kw: 勾选框 -->
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <!-- kw: el-button按钮，type="primary"是已经写好的初始样式，@click="login"是点击事件的处理函数，在代码76行methods:中实现-->
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      /* kw：mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
       *解析：判断当前环境是否为'development'开发环境，是就给默认值，不是就空
      **/
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      /* kw：trigger: 'blur'，失去焦点时提示message
       *解析：两个值'change/blur'时表示里面输入的值改变或者失去焦点时提示message
       *required：必填检查，只能检测 null undefined ""，不能检查布尔值
       **/
      loginRules: {
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度应该为6-16位之间',
          trigger: 'blur'

        }],
        // required只能检测 null undefined ""
        isAgree: [{
          // kw: 自定义的校验方式，属性validator是一个函数
          validator: (rule, value, callback) => {
            // rule校验规则
            // value 校验的值
            // callback 函数 - promise resolve reject，一定会去执行成功或者失败
            // callback()成功 callback(new Error(错误信息))失败
            value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
          }
        }]
      }
    }
  },
  methods: {
    // kw：表单的整体校验
    // kw：validate是一个校验函数，在里面加了回调函数()=>{}判断表单是否正确，OK就跳转到主页
    // kw：async，await异步
    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          // kw：this.$store.dispatch('user/login', this.loginForm)：store目录下的user.js是实现方法
          await this.$store.dispatch('user/login', this.loginForm)
          // Vuex 中的action 返回的promise
          // kw: 有async await所以只有登录成功才能执行下面的跳转主页
          // 跳转主页
          // kw: 为什么'/'代表主页？可以看router文件，'/'指向'/dashboard'，这个不就是主页的位置嘛
          this.$router.push('/')
        }
      })
    }

  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
