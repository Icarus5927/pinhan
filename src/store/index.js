// store index.js
import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

Vue.use(Vuex)
// 初始化时用sessionStore.getItem('token'),这样刷新页面就无需重新登录
const state = {
  // user: window.sessionStorage.getItem('user'),
  // token: window.sessionStorage.getItem('token')
  user: '',
  token: ''
}

// 新建Vuex.store实例
const store =new Vuex.Store({
  // state 状态
  state,
  // mutations 操作状态的方法(同步方法)
  mutations,
  // Getters 相当于是计算属性
  getters,
  // action用来处理异步操作，action --> mutation --> state
  actions,
})


export default store
