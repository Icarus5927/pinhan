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
          <el-row>
            <el-col :span="5">
              <el-date-picker
                v-model="query.date"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                :picker-options="{'firstDayOfWeek': 1}"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="5">
              <el-input v-model="query.student_name" type="text" clearable style="width: 200px" placeholder="请输入学生姓名">
                <template slot="prepend">学生</template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="query.teacher_name" type="text" clearable style="width: 200px" placeholder="请输入教师姓名">
                <template slot="prepend">教师</template>
              </el-input>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-select v-model="query.grade" placeholder="选择年级">
                <el-option
                  v-for="item in grades"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="query.course_name" placeholder="选择课程">
                <el-option
                  v-for="item in courses"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="query.subject" placeholder="选择科目">
                <el-option
                  v-for="item in subjects"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button icon="el-icon-search" type="primary" class="search">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="tableClass">

        <edit-table
          :table-header="courseHeader"
          :table-data="tableData"
          :show-summary="true"
        />

      </div>


    </el-card>
  </div>
</template>

<script>
import editTable from '../../components/Form';

export default {
  name: 'Course',
  components: {
    editTable
  },
  data() {
    return {
      // 下拉菜单选项
      grades: ['初一','初二','初三','高一'],
      courses: ['一对一', '班课', '晚辅'],
      subjects: ['数学', '语文', '英语'],
      //查询信息
      query: {
        date: '',// 查询课表的日期
        student_name: '',
        teacher_name: '',
        grade: '',
        course_name: '',
        subject: '',
      },
      // 表头
      courseHeader: [
        { name: 'date', title: '日期', width: 'fit-content', type: "text" },
        { name: 'time', title: '时间', width: 'fit-content', type: "text" },
        { name: 'student_name', title: '学生', width: 'fit-content', type: "text" },
        { name: 'grade', title: '年级', width: 'fit-content', type: "text" },
        { name: 'subject', title: '科目', width: 'fit-content', type: "text" },
        { name: 'teacher_name', title: '教师', width: 'fit-content', type: "text" },
        { name: 'teacher_title', title: '职称', width: 'fit-content', type: "text" },
        { name: 'course_name', title: '课程', width: 'fit-content', type: "text" },
        { name: 'duration', title: '课时', width: 'fit-content', type: "text" },
        { name: 'class_teacher', title: '班主任', width: 'fit-content', type: "text" },
      ],
      // 表格数据
      tableData: [
        {
          date: '3月1日',
          time: '8:00-10:00',
          student_name: '白浩然',
          grade: '初一',
          subject: '物理',
          teacher_name: '盖毫',
          teacher_title: '讲师',
          course_name: '一对一',
          duration: 2,
          class_teacher: '王艺颖'
        },
        {
          date: '3月2日',
          time: '8:00-10:00',
          student_name: '李宗霖',
          grade: '初二',
          subject: '数学',
          teacher_name: '贾博生',
          teacher_title: '讲师',
          course_name: '一对一',
          duration: 1.5,
          class_teacher: '王艺颖'
        },
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
