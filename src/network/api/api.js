import { get, post, remove, update } from '../request/request';
import { GET_USER, SET_TOKEN } from '../../store/mutation-types';
import { handleAlert } from '../../utils/confirm';
import store from '../../store';
import router from '../../router/index'

/**
* @Description: API的统一管理
* @author oldMe
*/
// 用户登录
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
/**
* @Description: 按页码查询信息
* @author oldMe
*/
// 根据页码获取系统用户
export const apiGetUserList = params => get('/user/page',{'page': params})
// 根据页码获取流水
export const apiGetStreamList = params => get('/stream/page', {'page': params})
// 根据页码获取学生
export const apiGetStudentList = params => get('student/page', {'page': params})
// 根据页码获取教师
export const apiGetTeacherList = params => get('teacher/page', {'page': params})
// 根据页码获取员工
export const apiGetStaffList = params => get('staff/page', {'page': params})
// 根据页码获取收费标准
export const apiGetStandardList = params => get('/standard/page', {'page': params})
/**
* @Description: 添加信息
* @author oldMe
*/
// 添加学生
export const apiAddStudent = params => post('/student/add', params)
// 添加流水
export const apiAddStream = params => post('/stream/add', params)
// 添加员工
export const apiAddStaff = params => post('/staff/add', params)
// 添加教师
export const apiAddTeacher = params => post('/teacher/add', params)
/**
* @Description: 删除信息
* @author oldMe
*/
// 删除学生
export const apiRemoveStudent = params => get('/student/del', { studentId: params })
// 删除员工
export const apiRemoveStaff = params => get('/staff/del', { work_id: params })
// 删除教师
export const apiRemoveTeacher = params => get('/teacher/del', { work_id: params })
/**
* @Description: 更新信息
* @author oldMe
*/
// 更新用户密码
export const apiUpdatePassWord = params => post('user/reset', params)
// 更新学生
export const apiUpdateStudent = params => post('/student/update', params)
// 更新员工
export const apiUpdateStaff = params => post('/staff/update', params)
// 更新教师
export const apiUpdateTeacher = params => post('/teacher/update', params)

/**
* @Description: 根据信息查询
* @author oldMe
*/
// 根据姓名查找学生
export const apiFindStudentByName = params => get('/student/namePage', { studentName: params })
// 根据姓名查找员工
export const apiFindStaffByName = params => get('/staff/pageName', { name: params })
// 根据姓名查找教师
export const apiFindTeacherByName = params => get('/teacher/namePage', { name: params })


