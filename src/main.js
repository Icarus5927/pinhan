import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.less";
import axios from "axios";

Vue.prototype.$http = axios;
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
