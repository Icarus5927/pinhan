<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">

      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prop="work_id">
          <el-input v-model="loginForm.work_id" placeholder="请输入工号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login" @click="submitLogin()">登录</el-button>
          <el-button type="info" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { post, request } from '../network/request/request';
import { handleAlert } from '../utils/confirm';
import store from '../store';
import { GET_USER, SET_TOKEN } from '../store/mutation-types';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        work_id: '',
        password: ''
      },
      rules: {
        work_id: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 3, max: 10, message: "登录名长度在 3 到 10 个字符", trigger: "blur"},
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: "登录名长度在 6 到 16 个字符", trigger: "blur"},
        ]
      }
    }
  },
  created() {
  },
  methods: {
    resetForm(formName) {
      this.$refs.loginForm.resetFields()
    },
    // 登录
    login() {

      post('user/login', this.loginForm)
        .then(res => {
          console.log('请求成功');
          console.log(res);
          if (res === 0 || res === 1){
            handleAlert('登录成功', 'success')
            this.$router.push('/main')
          } else {
            handleAlert(res, 'warning')
          }
        }).catch(err => {
        console.log(err);
      })

    },
    // 登录
    submitLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          post('user/login', this.loginForm)
            .then(res => {
              // console.log(res);
              if (res === 0 || res === 1 || res === 2){
                this.$store.commit(SET_TOKEN, res)
                this.$store.commit(GET_USER, this.loginForm.work_id)
                handleAlert('登录成功', 'success')
                this.$router.push('/main')
                console.log(this.$store.state.user);
                console.log(this.$store.state.token);
                // 保持刷新后登录
                window.sessionStorage.setItem('user', this.loginForm.work_id)
                window.sessionStorage.setItem('token', res)
              } else {
                handleAlert(res, 'warning')
              }
            }).catch(err => {
            console.log(err);
          })
            // .then((response) => {
            //   if (response.status === 200) {
            //     // 从store中获取
            //     this.$store.commit(SET_TOKEN, response.data.token)
            //     this.$store.commit(GET_USER, response.data.user)
            //     handleAlert('登录成功', 'success')
            //     this.$router.push('/main')
            //   }
            // })
            // .catch(function (error) {
            //   handleAlert('登录失败,账号或密码有误', 'warning')
            //   console.log(error)
            // })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
  },
  mounted() {
  }
}
</script>
<style lang="less" scoped>
.login-container {
  background-color: #226ab5f0;
  height: 100%;
}

.login-box {
  border: 7px solid rgb(46, 113, 190);
  width: 500px;
  height: 330px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 200px rgb(3, 74, 133);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar-box {
    background: url(../assets/logo.png) no-repeat center 34%;
    background-size: contain;
    width: 200px;
    height: 330px;
  }

  .el-form {
    width: 260px;
    position: absolute;
    top: 70px;
    right: 20px;

    .el-form-item {
      .el-input {
        margin-top: 10px;
      }

      // margin-top: 10px;
      .el-button {
        margin-top: 10px;
        margin-left: 50px;
      }

      .login {
        margin-left: -5px;
      }
    }
  }
}
</style>
