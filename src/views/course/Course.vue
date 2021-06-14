<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="table-header">
        <div class="block">
          <el-row :gutter="5">
            <el-col :span="6">
              <el-date-picker
                v-model="query.date"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-col>
            <el-col :span="4">
              <el-input v-model="query.student_name" type="text" clearable style="width: 100%" placeholder="请输入学生姓名">
                <template slot="prepend">学生</template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="query.teacher_name" type="text" clearable style="width: 100%" placeholder="请输入教师姓名">
                <template slot="prepend">教师</template>
              </el-input>
            </el-col>

            <el-col :span="2">
              <el-select v-model="query.grade" placeholder="选择年级">
                <el-option
                  v-for="item in grades"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-cascader
                v-model="query.course_name"
                :options="courses"
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择课程"
                @change="handleChange">
              </el-cascader>
            </el-col>
            <el-col :span="3">
              <el-select v-model="query.subject" placeholder="选择科目">
                <el-option
                  v-for="item in subjects"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button icon="el-icon-search" type="primary" style="width: 100%" class="search">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>

        <el-table class="tableClass" :data="tableData" border>
          <el-table-column type="index" label="#">
          </el-table-column>

          <el-table-column  v-for="(item,index) in courseHeader" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
          </el-table-column>

          <el-table-column label="学生考勤" prop="studentCheck" width="80px">
            <template slot-scope="scope">
              <button class="check-button" v-show="scope.row.studentCheck === 0" @click="studentCheck(scope.row)">
                <el-icon class="el-icon-success" style="color: #44b336; font-size: 1.2em"/>
              </button>
              <button class="check-button" v-show="scope.row.studentCheck === 1" @click="studentCheck(scope.row)">
                <el-icon class="el-icon-error" style="color: red; font-size: 1.2em"/>
              </button>
            </template>
          </el-table-column>

          <el-table-column label="教师考勤" prop="teacherCheck" width="80px">
            <template slot-scope="scope">
              <button class="check-button" v-show="scope.row.teacherCheck === 0" @click="teacherCheck(scope.row)">
                <el-icon class="el-icon-success" style="color: #44b336; font-size: 1.2em"/>
              </button>
              <button class="check-button" v-show="scope.row.teacherCheck === 1" @click="teacherCheck(scope.row)">
                <el-icon class="el-icon-error" style="color: red; font-size: 1.2em"/>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeCourse(scope.row) "></el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页区 -->
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!-- 修改课程弹窗   -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close="false" @close="onreset()" :close-on-click-modal="false">
      <div>
        <el-form ref="form" label-width="90px" :model="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期" prop="date">
                <el-date-picker v-model="form.date"
                                format="yyyy-MM-dd "
                                value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间" prop="time">
                <el-time-select
                  placeholder="起始时间"
                  style="width:50%"
                  :clearable="false"
                  v-model="form.start"
                  :picker-options="{
                  start: '08:00',
                  step: '00:30',
                  end: '22:30'
                }">
                </el-time-select>
                <el-time-select
                  placeholder="结束时间"
                  style="width:50%"
                  :clearable="false"
                  v-model="form.end"
                  :picker-options="{
                  start: '08:30',
                  step: '00:30',
                  end: '23:00',
                  minTime: form.start
                }">
                </el-time-select>
                <!--为了进行表单检验-->
                <span style="display: none">{{ form.start !== '' && form.end !== '' ? form.time = form.start + '-' + form.end : form.time = ''}}</span>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学生姓名" prop="student_name">
                <el-input v-model="form.student_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-form-item label="科目" prop="subject">
                <el-input v-model="form.subject"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教师" prop="teacher_name">
                <el-input v-model="form.teacher_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职称" prop="teacher_title">
                <el-input v-model="form.teacher_title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程" prop="course_name">
                <el-input v-model="form.course_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-form-item label="课时" prop="duration">
                <template>
                  <el-input disabled :value="getDuration(form.start, form.end)" ></el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班主任" prop="class_teacher">
                <el-input v-model="form.class_teacher"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { handleAlert, handleConfirm } from '../../utils/confirm';

export default {
  name: 'Course',
  data() {
    return {
      // 是否不可编辑,默认可编辑
      notEdit: false,
      // 下拉菜单选项
      grades: ['初一','初二','初三', '初四', '高一', '高二', '高三'],
      // 课程菜单选项
      // 向后端请求ABC一对一班课的所有课程
      courses: [
        {
        value: '晚辅',
        label: '晚辅',
        children: [
          {
            value: 'A辅',
            label: 'A辅',
            children: []
          },
          {
            value: 'B辅',
            label: 'B辅',
            children: []
          },
          {
            value: 'C辅',
            label: 'C辅',
            children: []
          },
        ]
        },
        {
          value: '一对一',
          label: '一对一',
          children: []
        },
        {
          value: '班课',
          label: '班课',
          children: []
        },
      ],
      subjects: ['数学', '语文', '英语'],
      //查询信息
      query: {
        date: '',// 查询课表的日期
        student_name: '',
        teacher_name: '',
        grade: '',
        course_name: '',
        subject: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 数据总条数
      total: 100,
      // 表头
      courseHeader: [
        { prop: "date", label: "日期" },
        { prop: "time", label: "时间" },
        { prop: "student_name", label: "学生" },
        { prop: "grade", label: "年级" },
        { prop: "subject", label: "科目" },
        { prop: "teacher_name", label: "教师" },
        { prop: "teacher_title", label: "职称" },
        { prop: "course_name", label: "课程" },
        { prop: "duration", label: "课时" },
        { prop: "class_teacher", label: "班主任" },
      ],
      // 表格数据
      tableData: [
        {
          date: '2021-05-02',
          start: '08:00',
          end: '10:00',
          time: '08:00-10:00',
          student_name: '白浩然',
          grade: '初一',
          subject: '物理',
          teacher_name: '盖毫',
          teacher_title: '讲师',
          course_name: '一对一',
          duration: 2,
          class_teacher: '王艺颖',
          studentCheck: 1,
          teacherCheck: 1
        },
        {
          date: '2021-05-02',
          start: '08:00',
          end: '10:00',
          time: '08:00-10:00',
          student_name: '李宗霖',
          grade: '初二',
          subject: '数学',
          teacher_name: '贾博生',
          teacher_title: '讲师',
          course_name: '一对一',
          duration: 1.5,
          class_teacher: '王艺颖',
          studentCheck: 1,
          teacherCheck: 1
        },
      ],
      // datepicker的快捷选项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 弹窗名
      title: '修改课程',
      // 弹窗可见控制
      dialogVisible: false,
      // 表单
      form: {
        date: '',
        start: '',
        end: '',
        time: '',
        student_name: '',
        grade: '',
        subject: '',
        teacher_name: '',
        teacher_title: '',
        course_name: '',
        duration: 0,
        class_teacher: ''
      }
    }
  },
  created() {
    // 教师仅能查看课表，不可编辑
    if (this.$store.state.token === '2') {
      this.notEdit = true;
    }
  },
  computed: {
    duration() {
      return this.getDuration(this.form.start, this.form.end)
    }
  },
  methods: {
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getFinanceList()
    },
    // 课程菜单选择
    handleChange(value) {
      console.log(value);
    },
    // 修改课程弹框
    showEditDialog(data) {
      this.title = '修改课程'
      this.dialogVisible = true
      this.form = data
    },
    // 重置表格
    onreset() {
      const form = {
        date: '',
        start: '',
        end: '',
        time: '',
        student_name: '',
        grade: '',
        subject: '',
        teacher_name: '',
        teacher_title: '',
        course_name: '',
        duration: 0,
        class_teacher: ''
      }
      this.form = form
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false;
      handleAlert('操作已取消', 'info')
    },
    // 确定提交
    upload() {
      // 表单校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 调用修改用户接口
          // 修改课时
          this.form.duration = this.duration
          console.log(this.form);
          console.log("修改课程")

          this.dialogVisible = false
          handleAlert()
        } else {
          console.log('error submit!!');
          return false;
        }
      })

    },
    // 对课时进行计算
    getDuration(start,end) {
      if (start !== '' && end !== '') {
        let clock1 = parseInt(start.split(':')[0]);
        let minutes1 = parseInt(start.split(':')[1]);
        let clock2 = parseInt(end.split(':')[0]);
        let minutes2 = parseInt(end.split(':')[1]);
        let duration = clock2 - clock1;
        if (minutes1 === 30) {
          duration -= 0.5
        }
        if (minutes2 === 30) {
          duration += 0.5
        }
        return duration
      }
      return 0
    },
    // 删除课程
    removeCourse(info) {
      const res = handleConfirm(
        '此操作将永久删除该课程，是否继续？',
        'warning',
        '提示'
      )
        .then(() => {
          // 调用接口完成删除课程
          console.log('删除课程');
          console.log(info);
          handleAlert();
        })
        .catch(() => {
          handleAlert('已取消删除', 'info');
        });
      console.log(res);
    },
    // 学生考勤
    studentCheck(info) {
      console.log(info);
      info.studentCheck === 1 ? info.studentCheck = 0 : info.studentCheck = 1;
      console.log(info);
      // 调用学生考勤接口

    },
    // 教师考勤
    teacherCheck(info) {
      // console.log(info.teacherCheck);
      //修改考勤状态
      info.teacherCheck === 1 ? info.teacherCheck = 0 : info.teacherCheck = 1;
      // console.log(info.teacherCheck);
      // 调用教师考勤接口


    }
  }
}
</script>

<style scoped>

  .tableClass {
    border: 1px solid #ebeef5;
  }
  .check-button {
    background-color: transparent;
    border-color: transparent;
    width: 70px;
    height: 40px;
  }
</style>
