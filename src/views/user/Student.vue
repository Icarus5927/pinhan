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
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable
                    @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>

          <el-button type="primary" @click="addUser()">添加用户</el-button>
        </div>
        <!-- 数据区 -->
        <el-table :data="list" stripe border>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column v-for="(item,index) in studentList" :key="index" :prop="item.prop" :label="item.label"
                           :width="item.width">
          </el-table-column>
          <el-table-column label="操作" width="110px">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuserByid(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!--添加用户弹窗dialog，根据dialogVisible的真假显示-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="64%" :show-close="false" @close="onreset()">
      <!-- 添加用户区 -->
      <div class="contanier">
        <!-- 表单区域 -->
        <el-form ref="form" label-width="90px" :model="form">
          <div class="main">
            <!-- 头部信息区  -->
            <div class="header">
              <!--上传头像 -->
              <div class="picture">
                <img :src="form.img" class="grid-content-picture-img">
                <div @click="picture" class="grid-content-picture-button">上传照片</div>
                <!-- 隐藏input -->
                <input type="file" ref="setfile" @change="upfile" hidden accept="image/*">
              </div>

              <!-- 左侧添加信息区 -->
              <div class="infoArea">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="学号" prop=work_id>
                      <el-input v-model="form.work_id"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                      <el-radio-group v-model="form.gender">
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

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="学校" prop="school">
                      <el-input v-model="form.school"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12 ">
                    <el-form-item label="父母联系方式" prop="contact">
                      <el-input v-model="form.contact"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col>
                    <el-form-item label="家庭地址" prop="address">
                      <el-input v-model="form.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row >
                  <el-col>
                    <el-form-item label="来源" prop="origin">
                      <el-radio-group v-model="form.origin">
                        <el-radio label="地推"></el-radio>
                        <el-radio label="转介绍"></el-radio>
                        <el-radio label="其他"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="班级排名" prop="class_rank">
                      <el-input v-model="form.class_rank"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="级部排名" prop="dep_rank">
                      <el-input v-model="form.dep_rank"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 中部成绩区 -->
            <div class="middle">
              <div class="student-score">
                <div class="top score">
                  <span>成绩</span>
                  <!--日期-->
                  <div class="score-date">
                    <el-form-item prop="address" label="日期">
                      <el-date-picker v-model="form.score.date" type="date" placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
                <!-- 成绩 -->
                <ul class="score-ul">
                  <li class="score-li" v-for="(item,index) in form.score.result" :key="index">
                    <span>{{ item.name }}</span>
                    <el-input v-model="item.score"></el-input>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()"> 取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- <el-dialog title="修改学生" :visible.sync="editdialogVisible" width="64%" :show-close="false">
        <student @onupload="onupload" @onclose="onclose"></student>
    </el-dialog> -->
  </div>
</template>
<script>
// import Student from "../../components/Student"
export default {
  name: 'studentInfo',
  data() {
    return {
      title: '添加用户',
      // 添加用户的表单
      form: {
        work_id: '',
        name: '',
        gender: '',
        class_rank: '',
        dep_rank: '',
        school: '',
        contact: '',
        address: '',
        origin: '',
        img: require('../../assets/bg.png'),
        score: {
          date: '',
          result: [
            {
              name: '语文',
              score: ''
            },
            {
              name: '数学',
              score: ''
            },
            {
              name: '英语',
              score: ''
            },
            {
              name: '物理',
              score: ''
            },
            {
              name: '化学',
              score: ''
            },
            {
              name: '历史',
              score: ''
            },
            {
              name: '地理',
              score: ''
            },
            {
              name: '生物',
              score: ''
            },
            {
              name: '道法',
              score: ''
            },
            {
              name: '微机',
              score: ''
            }
          ]
        }
      },
      // path: "/students",
      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        pagenumber: 1,
        pagesize: 10
      },
      // 构建表的信息
      studentList: [
        {
          prop: 'work_id',
          label: '学号',
          width: '100px'
        },
        {
          prop: 'name',
          label: '姓名',
          width: '90px'
        },
        {
          prop: 'gender',
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
          prop: 'contact',
          label: '父母联系方式',
          width: '190px'
        },
        {
          prop: 'address',
          label: '家庭住址'
        },
        {
          prop: 'origin',
          label: '来源',
          width: '90px'
        },
        {
          prop: 'class_rank',
          label: '班级排名',
          width: '90px'
        },
        {
          prop: 'dep_rank',
          label: '级部排名',
          width: '90px'
        }
      ],
      // 表具体数据
      list: [
        {
          work_id: 'ddd',
          name: 'fff',
          gender: '男',
          grade: '1',
          school: 'peking university',
          contact: '110',
          address: 'dddd',
          origin: '其他',
          class_rank: 1,
          dep_rank: 1,
          img: require('../../assets/bg.png'),
          score: {
            date: '',
            result: [
              {
                name: '语文',
                score: '99/100'
              },
              {
                name: '数学',
                score: '/'
              },
              {
                name: '英语',
                score: '/'
              },
              {
                name: '物理',
                score: '/'
              },
              {
                name: '化学',
                score: '/'
              },
              {
                name: '历史',
                score: '/'
              },
              {
                name: '地理',
                score: '/'
              },
              {
                name: '生物',
                score: '/'
              },
              {
                name: '道法',
                score: '/'
              },
              {
                name: '微机',
                score: '/'
              }
            ]
          }
        }
      ],
      // 数据总条数
      total: 100
    }
  },
  created() {
    // 获取学生信息列表
    this.getUserList()
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pagenumber = e
      this.getUserList()
    },
    // 确定
    upload() {
      // console.log(val)
      if (this.title === '添加用户') {
        console.log(123)
        // 调用添加用户接口
      } else {
        console.log(456)
        // 调用修改用户接口
      }
      this.dialogVisible = false
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false
    },
    // 增加用户弹窗
    addUser() {
      this.title = '添加用户'
      this.dialogVisible = true
    },

    // 修改用户弹框
    showEditDialog(data) {
      this.title = '修改用户'
      this.dialogVisible = true
      this.form = data
      // console.log(id)
    },
    removeuserByid() {
      const res = this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 调用接口完成删除用户操作
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      console.log(res)
    },
    picture() {
      this.$refs.setfile.click()
    },
    // 上传头像图片
    upfile(e) {
      const that = this
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0]) // 这里是最关键的一步，转换就在这里 （参数必须是blob对象）
      reader.onloadend = function () {
        that.form.img = this.result
      }
      // console.log(this.item)
    },
    // form中的数据重设
    onreset() {
      const form = {
        work_id: '/',
        name: '/',
        gender: '/',
        grade: '/',
        school: '/',
        contact: '/',
        address: '/',
        origin: '/',
        img: require('../../assets/bg.png'),
        score: {
          date: '',
          result: [
            {
              name: '语文',
              score: ''
            },
            {
              name: '数学',
              score: ''
            },
            {
              name: '英语',
              score: ''
            },
            {
              name: '物理',
              score: ''
            },
            {
              name: '化学',
              score: ''
            },
            {
              name: '历史',
              score: ''
            },
            {
              name: '地理',
              score: ''
            },
            {
              name: '生物',
              score: ''
            },
            {
              name: '道法',
              score: ''
            },
            {
              name: '微机',
              score: ''
            }
          ]
        }
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

.contanier {
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

    .grid-content-picture-img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      object-position: center;
    }

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
