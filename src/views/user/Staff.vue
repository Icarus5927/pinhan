<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
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
          <el-table-column v-for="(item,index) in tableHeader" :key="index" :prop="item.prop" :label="item.label"
                           :width="item.width">
          </el-table-column>
          <el-table-column label="操作" width="110px">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeuserByid(scope.row.work_id)"></el-button>

            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" :show-close="false" @close="onreset()">
      <div>
        <el-form ref="staffForm" label-width="90px" :model="form" :rules="rules">
<!--          <div class="picture">-->
<!--            <img :src="form.img" class="grid-content-picture-img">-->
<!--            <div @click="picture" class="grid-content-picture-button">上传照片</div>-->
<!--            <input type="file" ref="setfile" @change="upfile" hidden accept="image/*">-->
<!--          </div>-->
          <div class="aaa">
            <el-row>
              <el-col :span="12">
                <el-form-item label="工号" prop=work_id>
                  <el-input v-model="form.work_id"></el-input>
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
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="form.gender">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="department">
                  <el-select v-model="form.department">
                    <el-option label="办公室" value="办公室">
                    </el-option>
                    <el-option label="市场部" value="市场部">
                    </el-option>
                    <el-option label="财务部" value="财务部">
                    </el-option>
                    <el-option label="教务部" value="教务部">
                    </el-option>
                  </el-select>

                </el-form-item>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="12">
                <el-form-item label="职位" prop="post">
                  <el-select v-model="form.post">
                    <el-option label="1" value="1">
                    </el-option>
                    <el-option label="2" value="2">
                    </el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="联系方式" prop="contact">
                  <el-input v-model="form.contact"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col>
                <el-form-item label="家庭住址" prop="address">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <br>
          </div>

          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()"> 取消</el-button>
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
  name: '',
  data() {
    return {
      title: '添加用户',
      form: {
        // img: require('../../assets/bg.png'),
        work_id: '',
        name: '',
        gender: '',
        post: '',
        department: '',
        contact: '',
        address: ''
      },
      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 建表信息
      tableHeader: [
        {
          prop: 'work_id',
          label: '工号',
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
          prop: 'department',
          label: '部门',
          width: '150px'
        },
        {
          prop: 'post',
          label: '职位',
          width: '150px'
        },
        {
          prop: 'contact',
          label: '联系方式'
        },
        {
          prop: 'address',
          label: '家庭住址'
        }
      ],
      // 实际传入数据
      list: [
        {
          work_id: '1002',
          name: '王丽',
          gender: '女',
          post: '讲师',
          department: '教学部',
          contact: '155556328',
          address: '淄博市张店区',
          // img: require('../../assets/bg.png')
        }
      ],
      rules: {
        work_id: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'change' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        post: [
          { required: true, message: '请选择职位', trigger: 'blur' },
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入家庭地址', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在2到25个字符', trigger: 'blur' }
        ]
      },
      total: 100
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.pageNumber = e
      this.getUserList()
    },
    // 确定按钮
    upload() {
      if (this.title === '添加用户') {

        // 表单校验
        this.$refs.staffForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            handleAlert()
            // 调用添加用户接口

          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.staffForm.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            handleAlert()
            // 调用修改用户接口

          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }

    },
    // 添加用户
    addUser() {
      this.title = '添加用户'
      this.dialogVisible = true
    },
    // 关闭增加用户弹框
    onclose() {
      this.dialogVisible = false
      // this.onreset()
      handleAlert('操作已取消', 'info')
    },
    // 修改用户弹框
    showEditDialog(data) {
      this.title = '修改用户'
      this.dialogVisible = true
      this.form = data
      console.log(data)
    },
    removeuserByid() {
      const res = handleConfirm('此操作将永久删除该用户, 是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作
          handleAlert()
        })
        .catch(() => {
          handleAlert('操作已取消', 'info')
        })
      console.log(res)
    },
    picture() {
      this.$refs.setfile.click()
    },
    // upfile(e) {
    //   let that = this
    //   if (!e || !window.FileReader) return // 看支持不支持FileReader
    //   let reader = new FileReader()
    //   reader.readAsDataURL(e.target.files[0]) // 这里是最关键的一步，转换就在这里 （参数必须是blob对象）
    //   reader.onloadend = function () {
    //     that.form.img = this.result
    //   }
    //   // console.log(this.item)
    // },
    onreset() {
      let form = {
        work_id: '',
        name: '',
        gender: '',
        post: '',
        department: '',
        contact: '',
        // img: require('../../assets/bg.png')
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
}

.card-header {
  margin-top: -25px;
  display: flex;
  justify-content: space-between;

  .el-input {
    width: 400px;
  }
}

.infoArea {
  width: 100%;
}

.el-row {
  margin-bottom: 10px;

  .el-form-item {
    margin-bottom: 0px;
  }
}

.el-form {
  position: relative;

  .picture {
    position: absolute;
    top: 0;
    right: 0;
    width: 11%;
    border: 1px solid rgb(243, 241, 241);
    border-left: 1px solid rgb(226, 219, 219);

    //.grid-content-picture-img {
    //  width: 100%;
    //  height: 120px;
    //  object-fit: cover;
    //  object-position: center;
    //}

    .grid-content-picture-button {
      line-height: 37px;
      height: 40px;
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

.aaa {
  width: 89%;
}

// picture
// .card-header {
//     margin-top: -25px;
//     display: flex;
//     justify-content: space-between;
//     .el-input {
//         width: 400px;
//     }
// }
.el-select {
  width: 100%;
}
</style>
