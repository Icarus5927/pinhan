import axios from "axios";
import store from '../../store';
import router from '../../router';
import QS from 'qs'
import { handleAlert } from '../../utils/confirm';
import {Loading} from 'element-ui';

//加载动画
let loading
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() {
  loading.close()
}

export function request(config) {
  // 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://localhost:8081',
    // 请求超时时间
    timeout: 5000,
    // 请求头设置
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      // 'Content-Type': "text/plain",
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
      // 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    }
  })
  // 拦截请求
  instance.interceptors.request.use(config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = token;
    }
    startLoading()
    console.log(config);
    // 拦截后需要将config返回，否则没有配置信息，无法请求数据
    return config
  },err => {
    endLoading()
    console.log(err);
  });

  // 响应拦截器
  instance.interceptors.response.use(res => {
    // console.log(res);
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (res.status === 200) {
      endLoading()
      // 可以对接口返回的结果进行一些处理后，返回res
      return res.data
    } else {
      return 'error'
    }
  },err => {
    handleAlert(err, 'warning')
    endLoading()
    switch (error.response.status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        break;

      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        handleAlert('登录过期，请重新登录', 'warning');
        // 清除token
        window.sessionStorage.removeItem('token');
        store.commit('loginSuccess', null);
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        setTimeout(() => {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }, 1000);
        break;

      // 404请求不存在
      case 404:
        handleAlert('网络请求不存在', 'warning');
        break;
      // 其他错误，直接抛出错误提示
      default:
        handleAlert(error.response.data.message, 'warning');
    }

  })
  // 发送真正的网络请求
  return instance(config)
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param  params [请求时携带的参数]
 * @returns {AxiosPromise}
 */
export function get(url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param  params [请求时携带的参数]
 * @returns {AxiosPromise}
 */
export function post(url, params) {
  console.log(JSON.stringify(params))
  return request({
    url: url,
    method: 'post',
    // 使用qs将参数序列化
    // data: QS.stringify(params)
    // 将数据转为JSON格式
    data: JSON.stringify(params)
  })
}

/**
 * update方法，对应patch请求
 * @param {String} url [请求的url地址]
 * @param {String} id [请求修改的id]
 * @param  params [请求时携带的参数]
 * @returns {AxiosPromise}
 */
export function update(url, id, params) {
  return request({
    url: url,
    method: 'patch',
    data: param
  })
}

/**
 * remove方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param params [请求时携带的参数]
 * @returns {AxiosPromise}
 */
export function remove(url, params) {
  return request({
    url: url,
    method: 'delete',
    params: params
  })
}


