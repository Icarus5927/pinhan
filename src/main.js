import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.less";
import axios from "axios";
//到如vuex
import store from './store';

Vue.prototype.$http = axios;
// 全局拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
}, error => {
  console.log(error);
});

Vue.config.productionTip = false;

new Vue({
  router,
  // 注册store
  store,
  render: h => h(App)
}).$mount("#app");
