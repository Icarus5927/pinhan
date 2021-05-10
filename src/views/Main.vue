<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <div class="header-img"></div>
        <!-- <img src="" alt="" class="header-img"> -->
        <span>品涵教育管理系统</span>
      </div>
      <el-button type="success" icon="el-icon-switch-button" @click="logout()">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 页面侧边栏，根据isCollapse缩放 -->
      <el-aside :width="isCollapse?'70px':'160px'">
        <!--控制缩放左侧菜单按钮 -->
        <div class="toggle-button" @click="toggleCollapse()">
          <i :class="{'el-icon-s-fold': !isCollapse}"></i>
          <i :class="{'el-icon-s-unfold': isCollapse}"></i>
        </div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#155599f0" text-color="#fff" active-text-color="#04eace" unique-opened
                 :collapse="isCollapse" :collapse-transition="false" router :default-active="path">
          <el-submenu index="/student">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/student" @click="saveNavState('/student')"><i class="el-icon-menu"></i>
              <span>学生管理</span>
            </el-menu-item>
            <el-menu-item index="/teacher" @click="saveNavState('/teacher')"><i class="el-icon-menu"></i>
              <span>教师管理</span>
            </el-menu-item>
            <el-menu-item index="/staff" @click="saveNavState('/staff')"><i class="el-icon-menu"></i>
              <span>员工管理</span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="/finance"> -->
          <el-submenu index="/income">
            <template slot="title">
              <i class="el-icon-s-finance"></i>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/income" @click="saveNavState('/income')"><i class="el-icon-menu"></i>
              <span>收入流水</span>
            </el-menu-item>
            <el-menu-item index="/expenditure" @click="saveNavState('/expenditure')"><i class="el-icon-menu"></i>
              <span>支出流水</span>
            </el-menu-item>
            <el-menu-item index="/student_finance" @click="saveNavState('/student_finance')"><i
              class="el-icon-menu"></i>
              <span>学生费用</span>
            </el-menu-item>
            <el-menu-item index="/teacher_finance" @click="saveNavState('/teacher_finance')"><i
              class="el-icon-menu"></i>
              <span>教师费用</span>
            </el-menu-item>
            <el-menu-item index="/staff_finance" @click="saveNavState('/staff_finance')"><i class="el-icon-menu"></i>
              <span>员工工资</span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="/course" @click="saveNavState('/course')">
              <i class="el-icon-s-grid"></i>
              <span slot="title">课程管理</span>
          </el-menu-item> -->
<!--          <el-menu-item index="/arrangement" @click="saveNavState('/course')">-->
<!--            <i class="el-icon-s-grid"></i>-->
<!--            <span slot="title">课程管理</span>-->
<!--          </el-menu-item>-->

          <el-submenu index="/arrangement">
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              <span slot="title">课程管理</span>
            </template>
            <el-menu-item index="/arrangement" @click="saveNavState('/arrangement')"><i class="el-icon-menu"></i>
              <span>排课</span>
            </el-menu-item>
            <el-menu-item index="/course" @click="saveNavState('/course')"><i class="el-icon-menu"></i>
              <span>课表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="//student_checking-in">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>考勤</span>
            </template>
            <el-menu-item index="/student_checking-in" @click="saveNavState('/student_checking-in')"><i
              class="el-icon-menu"></i>
              <span>学生考勤</span>
            </el-menu-item>
            <el-menu-item index="/teacher_checking-in" @click="saveNavState('/teacher_checking-in')"><i
              class="el-icon-menu"></i>
              <span>教师考勤</span>
            </el-menu-item>
            <el-menu-item index="/staff_checking-in" @click="saveNavState('/staff_checking-in')"><i
              class="el-icon-menu"></i>
              <span>员工考勤</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/roles">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>设置</span>
            </template>
            <el-menu-item index="/roles" @click="saveNavState('/roles')"><i class="el-icon-menu"></i>
              <span>角色管理</span>
            </el-menu-item>
            <el-menu-item index="/password" @click="saveNavState('/password')"><i class="el-icon-menu"></i>
              <span>修改密码</span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="2-1"> <i class="el-icon-location"></i>
                  <span>选项1</span>
              </el-menu-item>
              <el-menu-item index="2-2"> <i class="el-icon-location"></i>
                  <span>选项2</span>
              </el-menu-item> -->
          <!-- </el-submenu> -->
        </el-menu>
      </el-aside>
      <!--主体显示区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Main',
  data() {
    return {
      // 左侧菜单数据
      // menuList: [],
      isCollapse: false,
      // 当前的路径
      path: '/student'
    }
  },
  created() {
    this.path = window.sessionStorage.getItem('path') || this.path
  },
  methods: {
    logout() {
      // 清除sessionStorage，并跳转到登录页
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    toggleCollapse() {
      // 控制左侧菜单栏缩放
      this.isCollapse = !this.isCollapse
    },
    saveNavState(path) {
      // 更改路径，并将path存到sessionStorage中
      this.path = path
      window.sessionStorage.setItem('path', path)
      // console.log(this.path)
    }
  },
  mounted() {
  }

  // watch: {
  //     $route: {
  //         handler(val) {
  //             this.path = val.path
  //             console.log(val.path)
  //         }
  //     }
  // }
}
</script>
<style lang="less" scoped>
// .el-submenu__title {
//     padding: 0 50px !important;
// }
.home-container {
  height: 100%;
  /*设置文字不可被选中*/
  user-select: none;
}

.el-header {
  background-color: #155599f0;
  height: 75px !important;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  font-size: 25px;
  color: #fff;
  font-weight: 900;
  // .el-button--info {
  //     position: absolute;
  //     right: 40px;
  //     top: 15px;
  // }
  > div {
    display: flex;
    align-items: center;

    .header-img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin-right: 10px;
      background: #fff url(../assets/logo.png) no-repeat center;
      background-size: contain;
    }
  }

  .el-button--info {
    height: 50px;
    width: 90px;
  }
}

.el-aside {
  overflow: hidden;
  background-color: #165599;
  // padding-right: 20px;
  // colors: #333;
  text-align: center;
  // line-height: 200px;
  // margin-left: -30px;

  .toggle-button {
    background-color: #409EFF;
    color: #fff;
    cursor: pointer;
    font-size: 17px;
    font-weight: 700;
    // margin-left: 30px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
  }

  .el-menu {
    border: 0;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: fit-content;
  text-align: center;
  line-height: 160px;
  padding: 12px;
  padding-bottom: 1px;
  overflow: scroll;
}

body > .el-container {
  margin-bottom: 40px;
  height: 100%;
}
</style>
