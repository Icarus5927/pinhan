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
export const apiGetStandardList = params => get('/standard/page', params)
// 根据页码查询课程
export const apiGetCourseList = params => get('/lesson/page', params)
// 根据页码查询学生费用
export const apiGetStudentFeeList = params => get('/sfee/page', params)


/**
* @Description: 添加信息
* @author oldMe
*/
// 添加学生
export const apiAddStudent = params => post('/student/add', params)
// 添加成绩
export const apiAddGrade = params => post('/grade/add',
  { studentId: params.studentId, name: params.name, chinese: params.score[0].score, math: params.score[1].score,
  english: params.score[2].score, physical: params.score[3].score, chemistry: params.score[4].score,
  history: params.score[5].score, geography: params.score[6].score, biological: params.score[7].score,
  daofa: params.score[8].score, computer: params.score[9].score })
// 添加流水
export const apiAddStream = params => post('/stream/add', params)
// 添加员工
export const apiAddStaff = params => post('/staff/add', params)
// 添加教师
export const apiAddTeacher = params => post('/teacher/add', params)
// 添加系统用户
export const apiAddUser = params => post('/user/add', params)
// 添加课程
export const apiAddCourse = params => post('/lesson/add', params)
// 添加收费标准
export const apiAddStandard = params => post('/standard/add', params)
// 添加学生费用
export const apiAddStudentFee = params => post('/sfee/add', params)
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
// 删除系统用户
export const apiRemoveUser = params => get('/user/del', { work_id: params })
// 删除系统课程
export const apiRemoveCourse = params => get('/lesson/del', { projectId: params })
// 删除收费标准
export const apiRemoveStandard = params => get('/standard/del', { standardId: params })
// 删除学生费用
export const apiRemoveStudentFee = params => get('/sfee/del', { feeId: params })
/**
* @Description: 更新信息
* @author oldMe
*/
// 更新用户信息
export const apiUpdateUser = params => post('user/update', params)
// 更新用户密码
export const apiUpdatePassWord = params => post('user/reset', params)
// 更新学生
export const apiUpdateStudent = params => post('/student/update', params)
// 更新员工
export const apiUpdateStaff = params => post('/staff/update', params)
// 更新教师
export const apiUpdateTeacher = params => post('/teacher/update', params)
// 更新课程(包含考勤)
export const apiUpdateCourse = params => post('/lesson/update', params)
// 更新收费标准
export const apiUpdateStandard = params => post('/standard/update', params)
// 更新收费标准
export const apiUpdateStudentFee = params => post('/sfee/update', params)
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
// 根据日期和学号查询成绩
export const apiFindGradeByDateId = params => get('/grade/select', params)
// 根据信息查询课程
export const apiFindCourseByInfo = params => get('/lesson/select', params)
// 根据信息查询流水
export const apiFindStreamByInfo = params => get('/stream/namePage', params)


/**
* @Description: 其他操作
* @author oldMe
*/
// 学生费用转接
export const apiTurnStudentFee = params => get('sfee', params)
