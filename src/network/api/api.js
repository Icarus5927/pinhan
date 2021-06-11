import { get, post, remove, update } from '../request/request';
import { GET_USER, SET_TOKEN } from '../../store/mutation-types';
import { handleAlert } from '../../utils/confirm';
import store from '../../store';
import router from '../../router/index'

/**
* @Description: API的统一管理
* @author oldMe
* @date 2021/6/11
*/
// 登录
export const apiLogin = params => post('/user/login', params)
  .then(res => {
    if (res === 0 || res === 1 || res === 2){
      store.commit(SET_TOKEN, res)
      store.commit(GET_USER, params.work_id)
      router.push('/main').then(() => {
        handleAlert('登录成功', 'success')
      })
      // 保持刷新后登录
      window.sessionStorage.setItem('user', params.work_id)
      window.sessionStorage.setItem('token', res)
    } else {
      handleAlert(res, 'warning')
    }
  }).catch(err => {
    console.log(err);
  })
// 根据页码获取系统用户列表
export const apiGetUserList = params => get('/user/page',{'page': params})
// 根据页码获取流水
export const apiGetStreamList = params => get('/stream/page', {'page': params})
// 根据页码获取学生
export const apiGetStudentList = params => get('student/page', {'page': params})
// 根据页码获取教师
export const apiGetTeacherList = params => get('teacher/page', {'page': params})
// 根据页码获取员工
export const apiGetStaffList = params => get('staff/page', {'page': params})
// 修改用户密码
export const apiChangePassWord = params => post('user/reset', params)
// 添加学生
export const apiAddStudent = params => post('/student/add', params)
// 添加流水
export const apiAddStream = params => post('/stream/add', params)
// 获取收费标准
export const apiGetStandardList = params => get('/standard/page', {'page': params})


