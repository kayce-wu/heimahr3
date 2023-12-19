import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

//VUEX仓库的实例化
const store = new Vuex.Store({
  //kw:模块
  modules: {
    app,
    settings,
    user
  },
  //kw:VUEX的“计算属性”
  getters
})

export default store
