import { get, post, remove, update } from '../request/request';
// api的统一管理
export const apiData = params => post('tableData', params);
export const apiDelete = params => remove('/remove', params);
export const apiUpdate = (id, params) => update('/update', id, params);

// 具体使用方法
// apiData({
//   type: 0,
//   sort:1
// }).then(res => {
//   console.log(res);
// }).catch(err => {
//   console.log(err);
// })


// apiUpdate('1001', {
//   name: 'ugo',
//   work_id: '1000'
// }).then(res => {
//   console.log(res);
// }).catch(err => {
//   console.log(err);
// })
