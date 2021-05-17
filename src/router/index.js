import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main";
import Student from "../views/user/Student.vue";
import StudentF from "../views/finance/Student.vue";
import StaffF from "../views/finance/Staff.vue";
import TeacherF from "../views/finance/Teacher.vue";
import Teacher from "../views/user/Teacher.vue";
import Income from "../views/finance/Income.vue";
import Expenditure from "../views/finance/Expenditure.vue";
import Roles from "../views/power/Roles";
import Password from "../views/power/Password";
import Staff from "../views/user/Staff";
import Arrangement from "../views/course/Course-arrangement.vue";
import Course from "../views/course/Course"
import StudentC from "../views/checking-in/Student.vue";
import TeacherC from "../views/checking-in/Teacher.vue";
import StaffC from "../views/checking-in/Staff.vue";
import store from '../store';
import { handleAlert } from '../utils/confirm';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
    redirect: "/student",
    children: [
      {
        path: "/income",
        component: Income
      },
      {
        path: "/expenditure",
        component: Expenditure
      },
      {
        path: "/student",
        component: Student
      },
      {
        path: "/student_checking-in",
        component: StudentC
      },
      {
        path: "/student_finance",
        component: StudentF
      },
      {
        path: "/teacher_finance",
        component: TeacherF
      },
      {
        path: "/teacher_checking-in",
        component: TeacherC
      },
      {
        path: "/staff_checking-in",
        component: StaffC
      },
      {
        path: "/staff_finance",
        component: StaffF
      },
      {
        path: "/teacher",
        component: Teacher
      },
      {
        path: "/staff",
        component: Staff
      },
      {
        path: "/arrangement",
        component: Arrangement
      },
      {
        path: "/course",
        component: Course
      },
      {
        path: "/roles",
        component: Roles
      },
      {
        path: "/password",
        component: Password
      }
    ]
  }
];

const router = new VueRouter({
  routes,
  // 将路由模式改为history
  mode: 'history'
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 通过vuex state获取当前的token
  const token = store.state.token;
  if (to.path === '/login') {
    next();
  } else {
    // 如果未登录，则跳回login界面
    if (token === null || token === '')  {
      handleAlert('您尚未登录', 'warning')
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
