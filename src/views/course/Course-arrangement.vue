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
          <el-row :gutter="5">
            <el-col :span="3">
              <el-date-picker
                v-model="query.date"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="请选择周"
                style="width: 100%"
                :picker-options="{'firstDayOfWeek': 1}"
              >
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
            <el-col :span="3">
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
              <el-button icon="el-icon-search" style="width: 100%" class="search">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :disabled="isDisable" style="width: 100%" type="primary" @click="addCourse()">添加课程</el-button>
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
                :draggable="draggable"
                :node="dealData"
                :dates="dealDate"
              ></course-table>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-card>
    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close="false" @close="closeDialog()" :close-on-click-modal="false">
      <el-form ref="courseForm" :model="courseForm" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">

            <el-form-item label="日期" prop="date">
              <el-select v-model="courseForm.date" placeholder="请选择">
                <el-option v-for="(item,index) in dealDate" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工号" prop="work_id">
              <el-input v-model="courseForm.work_id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="教师" prop="teacher_name">
              <el-input v-model="courseForm.teacher_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程" prop="course_name">
              <el-input v-model="courseForm.course_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-input v-model="courseForm.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="time">
              <el-time-select
                placeholder="起始时间"
                style="width:50%"
                :clearable="false"
                v-model="courseForm.start"
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
                v-model="courseForm.end"
                :picker-options="{
                  start: '08:30',
                  step: '00:30',
                  end: '23:00',
                  minTime: courseForm.start
                }">
              </el-time-select>
              <!--为了进行表单检验-->
              <span style="display: none">{{ courseForm.start !== '' && courseForm.end !== '' ? courseForm.time = courseForm.start + '-' + courseForm.end : courseForm.time = ''}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课时" prop="duration">
              <template>
                <span v-show="courseForm.start !== '' && courseForm.end !== ''">{{ getDuration(courseForm.start, courseForm.end) }}</span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生" prop="student">
              <el-tree :data="studentData" :props="defaultProps" show-checkbox
                       ref="studentTree"
                       @check-change="handleCheckChange"></el-tree>
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="cancelForm()"> 取消</el-button>
            <el-button type="primary" @click="submitForm('courseForm')">确定</el-button>
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
      // 是否可进行拖拽调课
      draggable: false,
      // 是否可添加课程
      isDisable: true,
      // 下拉菜单选项
      grades: ['初一','初二', '初三', '初四', '高一', '高二', '高三'],
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
      },
      // 添加课程表单
      courseForm: {
        work_id: '',// 工号
        date: '',// 日期
        start: '',// 开始时间
        end: '',// 结束时间
        time: '',// 时间区间
        teacher_name: '',// 教师姓名
        course_name: '',// 课程姓名
        subject: '',// 科目
        duration: '',// 课时
        student: []// 学生列表
      },
      // 表单检验规则
      rules: {
        work_id: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        date: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        time: [
          { type: 'string', required: true, message: '请选择时间', trigger: 'change' }
        ],
        teacher_name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        course_name: [
          { required: true, message: '请输入课程名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符', trigger: 'blur' }
        ],
        subject: [
          { message: '学科名不可包含特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/, },
          { required: true, message: '请输入学科名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        student: [ { type: 'array', required: true, message: '请至少选择一个学生', trigger: 'change' }]
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
          period: '14:00-16:00'
        },
        {
          id: 4,
          time: '下午',
          period: '16:00-18:00'
        },
        {
          id: 5,
          time: '晚上',
          period: '18:00-23:00'
        }
      ]
    }
  },
  components: {
    CourseTable,
    TableLeft
  },
  comments: {},
  created() {
    if (this.$store.state.token === '1' || this.$store.state.token === '0') {
      this.draggable = true;
      this.isDisable = false;
    }
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
        }
      ];
      // 对从接口传来的数据进行处理
      for (let day of this.tableData) {// 遍历每周的课程
        // console.log(i);
        for (let course of day.courses) {// 遍历某天的课程
          let pos = -1// 课程在表格中的位置
          switch (course.start) {
            case '08:00':
            case '08:30':
            case '09:00':
            case '09:30':
              pos = 1
              break;
            case '10:00':
            case '10:30':
            case '11:00':
            case '11:30':
              pos = 2
              break;
            case '14:00':
            case '14:30':
            case '15:00':
            case '15:30':
              pos = 3
              break;
            case '16:00':
            case '16:30':
            case '17:00':
            case '17:30':
              pos = 4
              break;
            case '18:00':
            case '18:30':
            case '19:00':
            case '19:30':
            case '20:00':
            case '20:30':
            case '21:00':
            case '21:30':
            case '22:00':
            case '22:30':
              pos = 5
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
    // 对课时进行计算
    getDuration(start,end) {
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
    },
    // 表单提交
    submitForm(formName) {
      this.courseForm.duration = this.getDuration(this.courseForm.start, this.courseForm.end);
      this.courseForm.time = this.courseForm.start + '-' + this.courseForm.end;
      // 表单验证
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          // console.log(this.courseForm);
          // 验证成功，提交并重置表
          this.resetForm()
          this.dialogVisible = false
          // console.log(valid)
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.courseForm = {
        work_id: '',
        date: '',
        start: '',
        end: '',
        time: '',
        teacher_name: '',
        course_name: '',
        subject: '',
        duration: '',
        student: []
      };
    },
    closeDialog() {
      this.resetForm()
    },
    // 关闭弹窗
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
    // 学生tree选择改变响应方法
    handleCheckChange(data) {
      // 只获取叶子节点的数据
      this.courseForm.student = this.$refs.studentTree.getCheckedNodes(true, false)
      console.log(this.courseForm.student)
    },
    // 课程菜单选择
    handleChange(value) {
      console.log(value);
    },
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
.buttons {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

</style>
