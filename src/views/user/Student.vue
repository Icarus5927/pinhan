<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 头部搜索区 -->
        <div class="card-header">
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="findStudentByName()"></el-button>
          </el-input>
          <el-button type="primary" :disabled="isDisable" @click="addUser()">添加学生</el-button>
        </div>
        <!-- 数据区 -->
        <el-table :data="list" stripe border>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column v-for="(item,index) in formHeader" :key="index" :prop="item.prop" :label="item.label"
                           :width="item.width">
          </el-table-column>
          <el-table-column label="操作" width="110px">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" :disabled="isDisable" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="isDisable" @click="removeStudentById(scope.row.studentId)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!--学生弹窗dialog，根据dialogVisible的真假显示-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="64%" :show-close="false" @close="onreset()">
      <!-- 添加学生区 -->
      <div class="container">
        <!-- 表单区域 -->
        <el-form ref="stuForm" label-width="90px" :model="form" :rules="rules">
          <div class="main">
            <!-- 头部信息区  -->
            <div class="header">
              <!-- 左侧添加信息区 -->
              <div class="infoArea">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="学号" prop=studentId>
                      <el-input v-model="form.studentId"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group v-model="form.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                      </el-radio-group>
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
                    <el-form-item label="学校" prop="school">
                      <el-input v-model="form.school"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12 ">
                    <el-form-item label="父母手机号" prop="parentTel">
                      <el-input v-model="form.parentTel"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col>
                    <el-form-item label="家庭地址" prop="address">
                      <el-input v-model="form.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col>
                    <el-form-item label="来源" prop="source">
                      <el-radio-group v-model="form.source">
                        <el-radio label="地推"></el-radio>
                        <el-radio label="转介绍"></el-radio>
                        <el-radio label="其他"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="班级排名" prop="classRank">
                      <el-input v-model="form.classRank"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="级部排名" prop="gradeRank">
                      <el-input v-model="form.gradeRank"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <br>
            <!-- 成绩区 -->
            <div class="middle">
              <div class="student-score">
                <div class="top score">
                  <span>成绩</span>
                </div>
                <br>
                <!-- 成绩 -->
                <ul class="score-ul">
                  <li class="score-li" v-for="(item,index) in form.score" :key="index">
                    <span>{{ item.name }}</span>
                    <el-input v-model="item.score" type="number"></el-input>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()"> 取消</el-button>
              <el-button type="primary" @click="upload('stuForm')">确定</el-button>
            </div>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import { handleAlert, handleConfirm } from '../../utils/confirm';
import {
  apiAddGrade,
  apiAddStudent, apiFindGradeByDateId,
  apiFindStudentByName,
  apiGetStudentList,
  apiRemoveStudent, apiUpdateGrade,
  apiUpdateStudent
} from '../../network/api/api';

export default {
  name: 'studentInfo',
  data() {
    return {
      title: '添加学生',
      // 添加学生的表单
      form: {
        studentId: '',
        name: '',
        sex: '',
        grade: '',
        classRank: '',
        gradeRank: '',
        school: '',
        parentTel: '',
        address: '',
        source: '',
        score: [
          {
            name: '语文',
            score: undefined
          },
          {
            name: '数学',
            score: undefined
          },
          {
            name: '英语',
            score: undefined
          },
          {
            name: '物理',
            score: undefined
          },
          {
            name: '化学',
            score: undefined
          },
          {
            name: '历史',
            score: undefined
          },
          {
            name: '地理',
            score: undefined
          },
          {
            name: '生物',
            score: undefined
          },
          {
            name: '道法',
            score: undefined
          },
          {
            name: '微机',
            score: undefined
          }
        ]

      },
      // 表单校验规则
      rules: {
        studentId: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'change' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' },
        ],
        classRank: [
          { required: true, message: '请输入班级排名', trigger: 'blur' },
        ],
        gradeRank: [
          { required: true, message: '请输入年级排名', trigger: 'blur' },
        ],
        school: [
          { required: true, message: '请输入学校名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符', trigger: 'blur' }
        ],
        parentTel: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入家庭地址', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在2到25个字符', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择来源', trigger: 'blur' },
        ],
      },
      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 控制修改权限
      isDisable: true,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 构建表的信息
      formHeader: [
        {
          prop: 'studentId',
          label: '学号',
          width: '100px'
        },
        {
          prop: 'name',
          label: '姓名',
          width: '90px'
        },
        {
          prop: 'sex',
          label: '姓别',
          width: '80px'
        },
        {
          prop: 'grade',
          label: '年级',
          width: '90px'
        },
        {
          prop: 'school',
          label: '学校',
          width: '190px'
        },
        {
          prop: 'classRank',
          label: '班级排名',
          width: '90px'
        },
        {
          prop: 'gradeRank',
          label: '级部排名',
          width: '90px'
        },
        {
          prop: 'parentTel',
          label: '父母联系方式',
          width: '190px'
        },
        {
          prop: 'address',
          label: '家庭住址'
        },
        {
          prop: 'source',
          label: '来源',
          width: '90px'
        }
      ],
      // 后端传入的数据
      list: [
      ],
      // 数据总条数
      total: 0
    }
  },
  created() {
    if (this.$store.state.token === '0') {
      this.isDisable = false;
    }
    // 获取学生信息列表
    this.getUserList()
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {
      apiGetStudentList(this.queryInfo.pageNumber)
      .then(res => {
        this.list = res.records;
        this.total = res.total;
      })
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getUserList()
    },
    // 确定
    upload(formName) {
      if (this.title === '添加学生') {
        // 表单校验
        this.$refs.stuForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            // 调用添加学生接口
            apiAddStudent(this.form)
              .then(res => {
                this.getUserList()
              })
              .catch(err => {
                console.log(err);
              })
            // 添加成绩接口
            apiAddGrade(this.form)
            .then(res => {
              console.log(res);
            })
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.stuForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            // console.log(this.form);

            Promise.all([
              new Promise((resolve, reject) => {
                apiUpdateStudent(this.form)
                  .then(res => {
                    console.log(res);
                  })
              }),
              new Promise((resolve, reject) => {
                apiUpdateGrade(this.form)
                  .then(res => {
                    console.log(res);
                  })
              }),
            ]).then(results => {
              console.log(results);
            })

            // 调用修改用户接口
            apiUpdateStudent(this.form)
            .then(res => {
              console.log(res);
            })
            apiUpdateGrade(this.form)
            .then(res => {
              console.log(res);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false
      handleAlert('操作已取消', 'info')
    },
    // 增加用户弹窗
    addUser() {
      this.title = '添加学生'
      this.dialogVisible = true
    },

    // 修改用户弹框
    showEditDialog(data) {
      // 修改form
      this.form.studentId = data.studentId;
      this.form.name = data.name;
      this.form.sex = data.sex;
      this.form.grade = data.grade;
      this.form.school = data.school;
      this.form.classRank = data.classRank;
      this.form.gradeRank = data.gradeRank;
      this.form.parentTel = data.parentTel;
      this.form.address = data.address;
      this.form.source = data.source;
      this.title = '修改用户'
      this.dialogVisible = true
      apiFindGradeByDateId({studentId: data.studentId})
      .then(res => {
        // 成绩更改
        this.form.score[0].score = res.chinese;
        this.form.score[1].score = res.math;
        this.form.score[2].score = res.english;
        this.form.score[3].score = res.physical;
        this.form.score[4].score = res.chemistry;
        this.form.score[5].score = res.history;
        this.form.score[6].score = res.geography;
        this.form.score[7].score = res.biological;
        this.form.score[8].score = res.daofa;
        this.form.score[9].score = res.computer;
      })
    },
    findStudentByName() {
      if (this.queryInfo.name !== '') {
        // 调用查找接口
        apiFindStudentByName(this.queryInfo.name)
          .then(res => {
            // console.log(res);
            if (res.records.length !== 0) {
              this.list = res.records
            } else {
              handleAlert('暂无该学生信息', 'warning');
            }
          })
      } else {
        handleAlert('请输入要查找的学生姓名', 'warning')
      }
    },
    removeStudentById(id) {
      handleConfirm('此操作将永久删除该用户, 是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作
          apiRemoveStudent(id)
          .then(res => {
            if (res === 1) {
              handleAlert()
            } else {
              handleAlert('删除失败', 'warning')
            }
            // 删除后重新获取学生列表
            this.getUserList()
          })

        })
        .catch(() => {
          handleAlert('已取消操作', 'info')
        })
    },
    // form中的数据重设
    onreset() {
      const form = {
        studentId: '',
          name: '',
          sex: '',
          grade: '',
          classRank: '',
          gradeRank: '',
          school: '',
          parentTel: '',
          address: '',
          source: '',
          score: [
          {
            name: '语文',
            score: undefined
          },
          {
            name: '数学',
            score: undefined
          },
          {
            name: '英语',
            score: undefined
          },
          {
            name: '物理',
            score: undefined
          },
          {
            name: '化学',
            score: undefined
          },
          {
            name: '历史',
            score: undefined
          },
          {
            name: '地理',
            score: undefined
          },
          {
            name: '生物',
            score: undefined
          },
          {
            name: '道法',
            score: undefined
          },
          {
            name: '微机',
            score: undefined
          }
        ]
      }
      this.form = form
    }
  },
  mounted() {
  },
  watch: {
    // $route: {
    //     handler(val) {
    //         // console.log(val.path)
    //     }
    // }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.el-pagination {
  margin-top: 20px;
  // height: 10px;
  // overflow: hidden;
  // .el-pager {
  //     height: 10px !important;
  // }
}

.card-header {
  margin-top: -25px;
  display: flex;
  justify-content: space-between;

  .el-input {
    width: 400px;
  }
}

.container {
  width: 60vw;

  .main {
    border: 1px solid rgb(226, 219, 219);
    overflow: hidden;
  }
}

.el-form {
  position: relative;

  .picture {
    position: absolute;
    top: 0;
    right: 0;
    width: 15%;
    border-left: 1px solid rgb(226, 219, 219);

    //.grid-content-picture-img {
    //  width: 100%;
    //  height: 160px;
    //  object-fit: cover;
    //  object-position: center;
    //}

    .grid-content-picture-button {
      line-height: 37px;
      height: 43px;
      background-color: #046db317;
      margin-top: -7px;
      cursor: pointer;
    }
  }
}

.el-row {
  margin-bottom: 0px;

  .el-form-item {
    margin-bottom: 0px;
  }
}

.infoArea {
  width: 85%;
}

.top {
  color: #606266;
  padding: 0 30px;
  font-size: 18px;
  margin-top: 1px;
  font-weight: 600;
  background-color: #046db317;
  height: 40px;
  line-height: 45px;
  // border: 1px solid rgb(226, 219, 219);
  display: flex;
  justify-content: space-between;

  [class*=" el-icon-"],
  [class^="el-icon-"] {
    line-height: 1.5;
    font-size: 25px;
  }
}

.student-score {
  width: 60vw;
}

.score {
  justify-content: center;
  align-items: center;
  position: relative;

  .score-date {
    position: absolute;
    top: -1px;
    right: 0;
    height: 100%;
  }
}

.score-ul {
  margin: 0;
  width: 60vw;
  padding: 0;
  display: flex;

  .score-li {
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 67px;
    box-sizing: border-box;
    border-left: 1px solid rgb(226, 219, 219);

    .balance-count {
      height: 40px;
    }

    > span {
      width: 100%;
      display: block;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid rgb(226, 219, 219);
    }

    input {
      width: 100%;
      border: 0;
      text-align: center;
    }
  }
}

.bottom {
  justify-content: center;
}

.el-table {
  margin-top: 0px;
}

/*  .box-card {
    width: 480px;
} */
</style>
