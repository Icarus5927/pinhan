<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="card-header">
        <el-button type="primary" @click="addRightDialog()">添加角色</el-button>
      </div>
      <el-table :data="UserList" stripe border>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="work_id" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="level" label="角色描述" >
          <template slot-scope="scope">
            <span v-if="scope.row.level === 0">管理员</span>
            <span v-else-if="scope.row.level === 1">员工</span>
            <span v-else-if="scope.row.level === 2">教师</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateRightDialog(scope.row)">修改
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.work_id)">删除</el-button>
            <!-- <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>

    </el-card>
    <el-dialog :title="title" :visible.sync="setRightDialogVisible" width="40%" @close="onreset()">
      <el-form ref="form" label-width="90px" :model="form" :rules="rules">

        <el-form-item label="工号" prop="work_id">
          <el-input v-model="form.work_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item v-show="title === '添加角色'" label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="设置权限" prop="level">
          <el-select v-model="form.level" placeholder="请选择权限" style="width: 100%">
            <el-option label="管理员" :value="0"></el-option>
            <el-option label="员工" :value="1"></el-option>
            <el-option label="教师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="onclose()"> 取消</el-button>
            <el-button type="primary" @click=" upload()">确定</el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { handleAlert, handleConfirm } from '../../utils/confirm';
import { apiAddTeacher, apiAddUser, apiGetUserList, apiRemoveUser, apiUpdateUser } from '../../network/api/api';

export default {
  name: '',
  data() {
    return {
      title: '修改角色',
      total: 100,
      queryInfo: {
        pageSize: 10,
        pageNumber: 1
      },
      // 增加角色列表数据
      form: {
        work_id: '',
        name: '',
        password: '',
        level: ''
      },
      // 从后台返回的数据
      UserList: [
      ],
      setRightDialogVisible: false,
      // 密码必须是6位到16位、必须含有字母、数字
      reg : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      // 表单校验
      rules: {
        work_id: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'change' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '请选择权限', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取所有角色的列表
    getUserList() {
      apiGetUserList(this.queryInfo.pageNumber)
        .then(res => {
          this.UserList = res.records
          this.total = res.total
        })
    },
    // 展示添加角色
    addRightDialog() {
      this.setRightDialogVisible = true
      this.title = '添加角色'
    },
    // 修改操作
    updateRightDialog(data) {
      this.title = '修改角色'
      this.form = data
      this.setRightDialogVisible = true
    },
    //删除操作
    deleteUser(work_id) {
      const res = handleConfirm(
        '此操作将永久删除该用户，是否继续？',
        'warning',
        '提示'
      )
        .then(() => {
          // 调用接口完成删除用户操作
          apiRemoveUser(work_id)
            .then(res => {
              if (res === 1) {
                handleAlert()
                this.getUserList()
              } else {
                handleAlert('删除失败', 'warning')
              }
            })
        })
        .catch(() => {
          handleAlert('已取消删除', 'info');
        });
      console.log(res);

    },
    // 重置
    onreset() {
      this.form = {
        work_id: '',
        name: '',
        password: '',
        level: ''
      }
    },
    // 关闭
    onclose() {
      this.setRightDialogVisible = false
      handleAlert('操作已取消', 'info')
      // this.onreset()
    },
    // 确定按钮
    upload() {
      // console.log(val)
      if (this.title === '添加角色') {
        if (!this.reg.test(this.form.password)) {
          handleAlert('密码必须是6位到16位、必须含有字母、数字', 'warning')
          return
        }
        // 表单校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            // 调用添加角色接口
            apiAddUser(this.form)
              .then(res => {
                if (res === 1) {
                  handleAlert()
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
        // 调用修改角色接口
        apiUpdateUser(this.form)
          .then(res => {
            if (res === 1) {
              handleAlert()
              this.getUserList()
            } else {
              handleAlert('修改失败', 'warning')
            }
          })
      }
      this.setRightDialogVisible = false
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getUserList()
    },
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped>
.card-header {
  // margin-top: -25px;
  display: flex;
  justify-content: flex-end;
}

.el-col {
  display: flex;

  > span {
    width: 86px;
    font-size: 14px;
    padding-right: 5px;
    color: #606266;
    border-left: 1px solid #e2dbdb;
    text-align: right;
    // height: 20px;
    line-height: 38px;
    background-color: #046db317;
  }
}

// .click-bottom {
//     position: absolute;
//     bottom: -60px;
// }
</style>
