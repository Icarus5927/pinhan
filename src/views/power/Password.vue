<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">

      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="work_id" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="password" label="当前密码">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="update(scope.row)">
              修改密码
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>

    </el-card>
    <!--修改密码弹窗-->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="40%" @close="onreset()" >
      <el-row>
        <el-col :span="4">
          <span>工作号: {{ user.work_id }}</span>
        </el-col>
        <el-col :span="8">
          <span>姓名：{{ user.name }}</span>
        </el-col>
        <el-col :span="8">
          <span>当前密码：{{ user.password }}</span>
        </el-col>
      </el-row>
      <el-form ref="form" label-width="90px" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="新密码" prop="newPWD">
              <el-input v-model="form.newPWD"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认新密码" prop="confirmPWD">
              <el-input v-model="form.confirmPWD"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      <el-form-item>
        <div class="click-bottom">
          <el-button @click="onclose()"> 取消</el-button>
          <el-button type="primary" @click=" submitForm('form')">确定</el-button>
        </div>
      </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { handleAlert } from '../../utils/confirm';
import { get, post } from '../../network/request/request';
import { apiUpdatePassWord, apiGetUserList } from '../../network/api/api';

export default {
  name: '',
  data() {
    return {
      // 密码必须是6位到16位、必须含有字母、数字
      reg : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      // 弹窗是否可见
      dialogVisible: false,
      // 用户信息列表
      userList: [

      ],
      // 修改信息表单
      form: {
        newPWD: '',// 新密码
        confirmPWD: ''// 确认新密码
      },
      // 正在修改密码的用户
      user: {},
      // 表单验证规则
      rules: {
        newPWD: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        confirmPWD: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ]
      },
      total: 100,
      queryInfo: {
        pageSize: 10,
        pageNumber: 1
      },
    }
  },
  created() {
    // 获取用户信息列表
    // this.userList = this.getUserList()
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      // 获取用户信息列表
      apiGetUserList(this.queryInfo.pageNumber)
        .then(res => {
          // 获取用户列表
          this.userList = res.records
          // 获取页数
          this.total = res.total;
        })
    },
    // 修改密码
    update(user) {
      this.dialogVisible = true
      this.user = user
    },
    onreset() {
      this.form = {
        newPWD: '',
        confirmPWD: ''
      }
    },
    // 关闭
    onclose() {
      this.dialogVisible = false
      handleAlert('操作已取消', 'info')
    },
    // 确定按钮
    submitForm(formName) {
      //表单验证
      this.$refs.form.validate((valid) => {
        if (!this.reg.test(this.form.newPWD)) {
          handleAlert('密码必须是6位到16位、必须含有字母、数字', 'warning')
          return
        }
        if (this.form.newPWD !== this.form.confirmPWD) {
          valid = false
          handleAlert('两次输入不一致', 'warning')
        }
        if (valid) {
          // 调用修改密码接口
          apiUpdatePassWord({workId: this.user.work_id, newPassWord: this.form.newPWD })
          .then(res => {
            console.log(res);
            if (res === 1) {
              handleAlert()
              this.dialogVisible = false
            } else {
              handleAlert('修改失败', 'warning')
            }
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

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
<style scoped>
</style>
