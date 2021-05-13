<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">

      <div class="card-header">

        <div class="block">
          <el-row>
            <el-col :span="4">
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
            <el-col :span="4">
              <el-input v-model="query.teacher_name" type="text" clearable style="width: 200px" placeholder="请输入教师姓名">
                <template slot="prepend">教师</template>
              </el-input>
            </el-col>
          </el-row>

          <el-row :gutter="8">
            <el-col :span="4">
              <el-select v-model="query.grade" placeholder="选择年级">
                <el-option
                  v-for="item in grades"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="query.course_name" placeholder="选择课程">
                <el-option
                  v-for="item in courses"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="query.subject" placeholder="选择科目">
                <el-option
                  v-for="item in subjects"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-search" class="search">查询</el-button>
              <el-button type="primary" @click="addCourse()">添加课程</el-button>
            </el-col>
          </el-row>

        </div>
      </div>

      <div class="tableClass">
        <el-row>

          <el-col :span="3">
            <div>
              <table-left :node="tableHeader"></table-left>
            </div>
          </el-col>

          <el-col :span="21">
            <div class="table">
              <course-table
                :node="dealData"
                :dates="dealDate"
              ></course-table>
            </div>
          </el-col>

        </el-row>
      </div>

    </el-card>
    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close="false" @close="closeDialog()">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">

            <el-form-item label="日期" prop="date">
              <el-select v-model="form.date" placeholder="请选择">
                <el-option v-for="(item,index) in dealDate" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工号" prop="work_id">
              <el-input v-model="form.work_id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="教师" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程" prop="course">
              <el-input v-model="form.course"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-input v-model="form.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="time">
              <el-input v-model="form.time"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课时" prop="course">
              <el-input v-model="form.date"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生" prop="student">
              <el-tree :data="studentData" :props="defaultProps" show-checkbox
                       @check-change="handleCheckChange"></el-tree>
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="cancelForm()"> 取消</el-button>
            <el-button type="primary" @click="submitForm(form)">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import CourseTable from '../../components/courseTable/CourseTable';
import TableLeft from '../../components/courseTable/TableLeft';

export default {
  name: 'course-management',
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
      // 添加课程表单
      form: {
        work_id: '',
        date: '',
        time: '',
        name: '',
        course: '',
        subject: '',
        hour: '',
        student: []
      },
      dialogVisible: false,
      // 弹窗标题
      title: '',
      // 学生列表
      studentData: [
        {
        label: '初中',
        children: [
          {
            label: '初一',
            children: [
              { label: '学生A' }
            ]
          },
          {
            label: '初二',
            children: [
              { label: '学生B' }
          ]
          },
          {
            label: '初三',
            children: [
              { label: '学生C' }
            ]
          },
          {
            label: '初四',
            children: [
              { label: '学生D' }
            ]
          },
        ]
        },
        {
        label: '高中',
        children: [
          {
            label: '高一',
            children: [
              { label: '学生A' }
            ]
          },
          {
            label: '高二',
            children: [
              { label: '学生B' }
          ]
          },
          {
            label: '高三',
            children: [
              { label: '学生C' }
            ]
          },
        ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 向接口请求的数据格式
      tableData: [
        {
          'week': 1,
          'date': '3月1日',
          'courses': [
            {
              'start': '08:00',
              'end': '10:00',
              'duration': 2,
              'course_name': '一对一',
              'subject': '语文',
              'teacher_name': '张四三',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
            {
              'start': '11:00',
              'end': '12:00',
              'duration': 1,
              'course_name': '一对一',
              'subject': '语文',
              'teacher_name': '张三',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
            {
              'start': '16:00',
              'end': '17:00',
              'duration': 1,
              'course_name': '一对一',
              'subject': '语文',
              'teacher_name': '张三',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
          ]
        },
        {
          'week': 2,
          'date': '3月2日',
          'courses': []
        },
        {
          'week': 3,
          'date': '3月3日',
          'courses': []
        },
        {
          'week': 4,
          'date': '3月4日',
          'courses': []
        },
        {
          'week': 5,
          'date': '3月5日',
          'courses': [
            {
              'start': '08:00',
              'end': '09:00',
              'duration': 1,
              'course_name': '班课',
              'subject': '语文',
              'teacher_name': '张三',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
            {
              'start': '09:00',
              'end': '10:00',
              'duration': 1,
              'course_name': '班课',
              'subject': '语文',
              'teacher_name': '张三',
              'student_name': '鲁豫',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
            {
              'start': '15:00',
              'end': '16:00',
              'duration': 1,
              'course_name': '班课',
              'subject': '生物',
              'teacher_name': '哈哈',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
            {
              'start': '18:00',
              'end': '19:00',
              'duration': 1,
              'course_name': '班课',
              'subject': '语文',
              'teacher_name': '张三',
              'student_name': '李四',
              'class_teacher': '王五',
              'adviser': '赵六',
              'grade': '初一'
            },
          ]
        },
        {
          'week': 6,
          'date': '3月6日',
          'courses': []
        },
        {
          'week': 7,
          'date': '3月7日',
          'courses': []
        },
      ],
      // 左侧时间表头
      tableHeader: [
        {
          id: 1,
          time: '上午',
          period: '08:00-10:00'
        },
        {
          id: 2,
          time: '上午',
          period: '10:00-12:00'
        },
        {
          id: 3,
          time: '下午',
          period: '13:00-15:00'
        },
        {
          id: 4,
          time: '下午',
          period: '15:00-17:00'
        },
        {
          id: 5,
          time: '晚上',
          period: '17:00-19:00'
        },
        {
          id: 6,
          time: '晚上',
          period: '19:00-21:00'
        },
        {
          id: 7,
          time: '晚上',
          period: '21:00-23:00'
        },
      ]
    }
  },
  components: {
    CourseTable,
    TableLeft
  },
  comments: {},
  created() {
    this.getArrlist(this.activeName)
  },
  computed: {
    dealData() {
      // 数据的格式
      // [
      // { day1: [{student_name, grade, subject, teacher, course_name, duration, class_teacher, adviser }, ...], day2: [], day3, day4, day5, day6, day7 },
      // {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      // ]
      // 初始化数据
      let dData = [
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
      ];
      // 对从接口传来的数据进行处理
      for (let day of this.tableData) {// 遍历每周的课程
        // console.log(i);
        for (let course of day.courses) {// 遍历某天的课程
          let pos = -1// 课程在表格中的位置
          switch (course.start) {
            case '08:00':
              pos = 1
              break;
            case '08:30':
              pos = 1
              break;
            case '09:00':
              pos = 1
              break;
            case '09:30':
              pos = 1
              break;
            case '10:00':
              pos = 2
              break;
            case '10:30':
              pos = 2
              break;
            case '11:00':
              pos = 2
              break;
            case '11:30':
              pos = 2
              break;
            case '13:00':
              pos = 3
              break;
            case '13:30':
              pos = 3
              break;
            case '14:00':
              pos = 3
              break;
            case '14:30':
              pos = 3
              break;
            case '15:00':
              pos = 4
              break;
            case '15:30':
              pos = 4
              break;
            case '16:00':
              pos = 4
              break;
            case '16:30':
              pos = 4
              break;
            case '17:00':
              pos = 5
              break;
            case '17:30':
              pos = 5
              break;
            case '18:00':
              pos = 5
              break;
            case '18:30':
              pos = 5
              break;
            case '19:00':
              pos = 6
              break;
            case '19:30':
              pos = 6
              break;
            case '20:00':
              pos = 6
              break;
            case '20:30':
              pos = 6
              break;
            case '21:00':
              pos = 7
              break;
            case '21:30':
              pos = 7
              break;
            case '22:00':
              pos = 7
              break;
            case '22:30':
              pos = 7
              break;
          }
          let start = course.start
          let end = course.end
          let time = start + '-' + end
          let student_name = course.student_name
          let grade = course.grade
          let subject = course.subject
          let teacher_name = course.teacher_name
          let course_name = course.course_name;// 课程名
          let duration = course.duration// 时长
          let class_teacher = course.class_teacher
          let adviser = course.adviser
          let dayName = 'day' + day.week;// 周几
          // 根据课程开始的时间，将课程信息保存到各个区间
          dData[pos - 1][dayName].push({
            start,
            end,
            time,
            student_name,
            grade,
            subject,
            teacher_name,
            course_name,
            duration,
            class_teacher,
            adviser
          })
        }
      }
      // console.log(dData);
      return dData;
    },
    // 获取日期数组
    dealDate() {
      let dateArr = [];
      for (let item of this.tableData) {
        dateArr.push(item.date)
      }
      return dateArr
    }
  },

  methods: {
    // 获取课程安排数据
    getArrlist(data) {
      // console.log(data)
    },
    addCourse() {
      this.title = '添加课程'
      this.dialogVisible = true
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.resetForm(form)
          this.dialogVisible = false
          console.log(valid)
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      let form = {
        type: '',
        work_id: '',
        date: '',
        name: '',
        course: '',
        subject: '',
        hour: '',
        student: []
        // counselor: ""
      }
      this.form = form
    },
    cancelForm() {
      this.dialogVisible = false
    },
    // 修改
    updateCourse(val) {
      this.title = '修改课程'
      this.dialogVisible = true
      this.form = val
      console.log(this.form)
      // console.log(val)
    },
    // 选择学生
    handleCheckChange(data) {
      console.log(data)
    }
  },
  mounted() {
  },
  watch: {
    // activeName: {
    //     handler(val) {
    //         this.getArrlist(this.activeName)
    //     }
    // }
  }
}
</script>
<style lang="less" scoped>
.box-card {
}
.card-header {
   //margin-top: -25px;
  //display: flex;
  //justify-content: flex-end;
}

.el-button {
  // padding: 29px;
  // margin-left: 40px;
}

.el-row {
  width: 100%;
  margin-bottom: 0px;

  .el-form-item {
    margin-bottom: 0px;
  }
}

.el-select {
  width: 100%;
}

.tableClass {
  //max-height: 600px;
  //overflow: scroll;
}

.block {
  display: flex;
  justify-content: space-between;
  position: relative;
  flex-direction: row;
  flex-wrap: wrap;

  .add {
    position: absolute;
    right: 0;
  }

  .input {
    border-radius: 0 4px 4px 0;
  }

  .search {
    border-radius: 0 4px 4px 0;
    background-color: rgb(240, 238, 238);
  }
}

</style>
