<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 头部搜索区 -->
        <div class="card-header">
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable
                    @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserByName()"></el-button>
          </el-input>

          <el-button type="primary" :disabled="isDisable" @click="addUser()">添加教师</el-button>
        </div>
        <!-- 数据区 -->
        <el-table :data="list" stripe border>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column v-for="(item,index) in teacherList" :key="index" :prop="item.prop" :label="item.label"
                           :width="item.width">
          </el-table-column>
          <el-table-column label="操作" width="110px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button :disabled="isDisable" type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button :disabled="isDisable" type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.workId)"></el-button>
              <!-- <el-button type="warning" icon="el-icon-setting" size="mini"></el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!--  添加教师弹窗  -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="64%" :show-close="false" @close="onreset()">
      <!-- 内容主体区 -->
      <div class="container">
        <el-form ref="teacherForm" label-width="90px" :model="form" :rules="rules">
          <div class="main">
            <div class="header">
<!--              <div class="picture">-->
<!--                <img :src="form.img" class="grid-content-picture-img">-->
<!--                <div @click="picture" class="grid-content-picture-button">上传照片</div>-->
<!--                <input type="file" ref="setfile" @change="upFile" hidden accept="image/*">-->
<!--              </div>-->
              <div class="userInf">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="工号" prop="workId">
                      <el-input v-model="form.workId"></el-input>
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
                    <el-form-item label="学历" prop="education">
                      <el-input v-model="form.education"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="联系方式" prop="tel">
                      <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="家庭住址" prop="address">
                      <el-input v-model="form.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col>
                    <el-form-item label="辅导科目" prop="course">
                      <el-input v-model="form.course"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>
              </div>
            </div>
            <div class="middle">
              <div class="exp">
                <div class="top">
                  <span>工作经验</span>
                </div>
                <el-input type="textarea" autosize placeholder="请输入工作经验" v-model="form.exp">
                </el-input>
              </div>
            </div>
          </div>
          <el-form-item>
            <div class="click-bottom">
              <el-row>
                <el-button @click="onclose"> 取消</el-button>
                <el-button type="primary" @click="upload()">确定</el-button>
              </el-row>

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
  apiAddTeacher,
  apiFindTeacherByName,
  apiGetTeacherList,
  apiRemoveTeacher,
  apiUpdateTeacher
} from '../../network/api/api';

export default {
  name: '',
  data() {
    return {
      title: '添加教师',
      // clearable: true,
      form: {
        workId: '',
        name: '',
        sex: '',
        education: '',
        tel: '',
        address: '',
        course: '',
        // img: require('../../assets/bg.png'),
        exp: ''
      },

      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取教师参数列表对象
      queryInfo: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 建表信息
      teacherList: [
        {
          prop: 'workId',
          label: '工号',
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
          prop: 'education',
          label: '学历',
          width: '100px'
        },
        {
          prop: 'tel',
          label: '联系方式',
          width: '150px'
        },
        {
          prop: 'address',
          label: '家庭住址',
          width: '220px'
        },
        {
          prop: 'course',
          label: '辅导科目'
        }
      ],
      // 实际传入数据
      list: [
      ],
      rules : {
        workId: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'change' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        education: [
          { required: true, message: '请输入学历信息', trigger: 'blur' },
        ],
        tel: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入家庭地址', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在2到25个字符', trigger: 'blur' }
        ],
        course: [
          { required: true, message: '请输入学科', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ]
      },
      total: 100,
      // 控制是否可修改添加
      isDisable: true
    }
  },
  created() {
    if (this.$store.state.token === '0') {
      this.isDisable = false;
    }
    this.getUserList()
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {
      apiGetTeacherList(this.queryInfo.pageNumber)
      .then(res => {
        this.list = res.records;
        this.total = res.total;
      })
    },
    getUserByName() {
      apiFindTeacherByName(this.queryInfo.name)
        .then(res => {
          if (res.total !== 0) {
            this.list = res.records;
            this.total = res.total;
            handleAlert()
          } else {
            handleAlert('暂无数据', 'warning');
          }
        })
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.pageNumber = e
      this.getUserList()
    },
    addUser() {
      this.dialogVisible = true
      this.title = '添加教师'
    },
    // 确定教师弹框
    upload(formName) {
      // 上传成功隐藏就行
      if (this.title === '添加教师') {
        // 表单校验
        this.$refs.teacherForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            // 调用添加教师接口
            apiAddTeacher(this.form)
            .then(res => {
              if (res === 1) {
                handleAlert()
                // 添加后重新获取列表
                this.getUserList()
              } else {
                handleAlert('添加失败', 'warning')
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.teacherForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            handleAlert()
            // 调用修改教师接口
            apiUpdateTeacher(this.form)
              .then(res => {
                console.log(res);
                handleAlert()
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    // 关闭教师弹框
    onclose() {
      this.dialogVisible = false
      handleAlert('取消操作', 'info')
    },
    // 修改教师弹框
    showEditDialog(data) {
      this.dialogVisible = true
      this.title = '修改教师'
      this.form = data
    },
    // 删除教师
    removeUserById(id) {
      const res = handleConfirm('此操作将永久删除该教师, 是否继续?', 'warning', '提示')
        .then(() => {
          // 调用删除教师借口
          apiRemoveTeacher(id)
          .then(res => {
            if (res === 1) {
              handleAlert()
              // 删除后重新获取教师列表
              this.getUserList()
            } else {
              handleAlert('删除失败', 'warning')
            }
          })
        })
        .catch(() => {

          handleAlert('取消操作', 'info')
        })
      console.log(res)
    },
    picture() {
      this.$refs.setfile.click()
    },
    // upFile(e) {
    //   let that = this
    //   if (!e || !window.FileReader) return // 看支持不支持FileReader
    //   let reader = new FileReader()
    //   reader.readAsDataURL(e.target.files[0]) // 这里是最关键的一步，转换就在这里 （参数必须是blob对象）
    //   reader.onloadend = function () {
    //     that.form.img = this.result
    //   }
    //   // console.log(this.item)
    // },
    // form中的数据重设
    onreset() {
      let form = {
        workId: '',
        name: '',
        sex: '',
        education: '',
        tel: '',
        // address: "",
        course: '',
        // img: require('../../assets/bg.png'),
        exp: ''
      }
      this.form = form
    }
  },
  mounted() {
  },
  watch: {
    $route: {
      handler(val) {
        // console.log(val.path)
      }
    }
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

  .userInf {
    width: 90%;
  }

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
    right: 2px;
    width: 10%;
    // border-left: 1px solid rgb(226, 219, 219);
    //.grid-content-picture-img {
    //  width: 100%;
    //  height: 122px;
    //  object-fit: cover;
    //  object-position: center;
    //  border: 1px solid rgb(226, 219, 219);
    //}

    .grid-content-picture-button {
      margin-left: 2px;
      line-height: 40px;
      height: 40px;
      background-color: #046db317;
      margin-top: -5px;
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

.top {
  color: #606266;
  padding: 0 30px;
  font-size: 18px;
  margin-top: 1px;
  font-weight: 600;
  background-color: #046db317;
  height: 40px;
  line-height: 45px;
}

.salay-ul {
  margin: 0;
  width: 60vw;
  padding: 0;
  display: flex;
  justify-content: flex-start;

  .salay-li {
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 67px;
    box-sizing: border-box;
    border-left: 1px solid rgb(226, 219, 219);

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

//
.bottom {
  justify-content: center;
}

.click-bottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

  .el-button {
    margin-left: 40px;
  }
}
</style>
