<template>
    <div class="login-container">
        <div class="login-box">
            <div class="avatar-box">

            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item prop="number">
                    <el-input v-model="form.work_id" placeholder="请输入工号" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password"> </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetForm()">重置</el-button>
                </el-form-item>
                <!-- </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: "Login",
    data() {
        return {
            form: {
                work_id: "",
                password: ""
            },
            rules: {
                number: {
                    required: true,
                    message: "请输入工号",
                    trigger: "blur"
                },

                password: {
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }
            }
        }
    },
    created() {},
    methods: {
        resetForm(formName) {
            this.$refs.form.resetFields()
        },
        login() {
            var a = 1
            if (a === 1) {
                this.$message.success("登陆成功")
                window.sessionStorage.setItem("token", 234)
                this.$router.push("/main")
            } else {
                this.$message.error("登陆失败")
            }
        }
    },
    mounted() {}
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
