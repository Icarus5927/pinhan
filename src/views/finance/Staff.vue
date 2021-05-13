<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
            <el-breadcrumb-item>财务管理</el-breadcrumb-item>
            <el-breadcrumb-item>员工工资</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <div class="text item">
                <!-- 头部搜索区 -->
                <div class="card-header">
                    <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>

                    <el-button type="primary" @click="addFinance()">添加工资</el-button>
                </div>
                <!-- 数据区 -->

                <el-tabs type="border-card">

                    <el-table :data="list" stripe border>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column v-for="(item,index) in staffList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                        </el-table-column>
                        <el-table-column label="操作" width="150px">
                            <template slot-scope="scope">
                                <!--修改按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeUserById(scope.row.work_id) "></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tabs>
                <el-footer>
                    <div class="balance-count"><span>合计：{{ totalSalary }}</span></div>
                </el-footer>
                <!-- 分页区 -->
                <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加工资弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :show-close="false" @close="onreset()">
            <div>
                <el-form ref="form" label-width="90px" :model="form">
                    <el-row>
                        <el-form-item label="工号" prop=work_id>
                            <el-input v-model="form.work_id"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="姓名" prop=name>
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="基本工资" prop="base_pay">
                            <el-input v-model="form.base_pay"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="部门" prop="department">
                            <el-input v-model="form.department"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="form.position"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="全勤奖" prop="perfect_attendance_award">
                            <el-input v-model="form.perfect_attendance_award"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="提成" prop="commission">
                            <el-input v-model="form.commission"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="住房补贴" prop="housing_allowance">
                            <el-input v-model="form.housing_allowance"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="请假/迟到" prop="leave_late">
                            <el-input v-model="form.leave_late"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="差旅补助" prop="travel_allowance">
                            <el-input v-model="form.travel_allowance"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="花费补助" prop="phone_allowance">
                            <el-input v-model="form.phone_allowance"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="实发工资" prop="net_salary">
                            <el-input v-model="form.net_salary"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <div class="click-bottom">
                          <el-button type="primary" @click="upload()">确定</el-button>
                          <el-button @click="onclose()"> 取消</el-button>
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
  name: "",
  data() {
    return {
      title: "添加工资",

      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
          name: "",
          pageNumber: 1,
          pageSize: 10
      },
      staffList: [
          { prop: "work_id", label: "工号" },
          { prop: "name", label: "姓名" },
          { prop: "department", label: "部门" },
          { prop: "position", label: "职位" },
          { prop: "base_pay", label: "基本工资" },
          { prop: "perfect_attendance_award", label: "全勤奖" },
          { prop: "commission", label: "提成" },
          { prop: "housing_allowance", label: "住房补贴" },
          { prop: "leave_late", label: "请假/迟到" },
          { prop: "travel_allowance", label: "差旅补助" },
          { prop: "phone_allowance", label: "话费补助" },
          { prop: "net_salary", label: "实发工资" }
      ],
      // 新增用户表单
      form: {
        work_id: '',
        name: '',
        department: '',
        position: '',
        base_pay: '',
        perfect_attendance_award: '',
        commission: '',
        housing_allowance: '',
        leave_late: '',
        travel_allowance: '',
        phone_allowance: '',
        net_salary: ''
      },
      // 获取后台接口数据
      list: [
        {
          work_id: '1001',
          name: '张三丰',
          department: '教学部',
          position: '讲师',
          base_pay: '6000',
          perfect_attendance_award: '500',
          commission: '1000',
          housing_allowance: '300',
          leave_late: '0',
          travel_allowance: '200',
          phone_allowance: '300',
          net_salary: '7300'
        }
      ],
      // 数据总条数
      total: 100
    }
  },

  created() {
      this.getUserList()
  },
  computed: {
    // 计算工资合计
    totalSalary() {
      let totalSalary = 0;
      for (let item of this.list) {
        totalSalary += parseFloat(item.net_salary)
      }
      return totalSalary
    }
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {},
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getUserList()
    },
    // 确定
    upload() {
      // console.log(val)
      if (this.title === "添加工资") {
        // 调用添加用户接口

      } else {
        console.log(456)
        // 调用修改用户接口

      }
      this.dialogVisible = false
      handleAlert()
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false
      handleAlert('取消操作', 'info')
    },
    // 增加用户弹框
    addFinance() {
      this.title = "添加工资"
      this.dialogVisible = true
    },

    // 修改用户弹框
    showEditDialog(data) {
      this.title = "修改工资"
      this.dialogVisible = true
      this.form = data
      // console.log(id)
    },
    removeUserById() {
      const res = handleConfirm('此操作将永久删除该工资记录, 是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作

          handleAlert()
        })
        .catch(() => {
          handleAlert('已取消操作', 'info')
        })
        console.log(res)
    },
    // 把form中的数据重新设置
    onreset() {
      let form = {
        work_id: '',
        name: '',
        department: '',
        position: '',
        base_pay: '',
        perfect_attendance_award: '',
        commission: '',
        housing_allowance: '',
        leave_late: '',
        travel_allowance: '',
        phone_allowance: '',
        net_salary: ''
      }
      this.form = form
    }
  },
    mounted() {},
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
.el-row {
    margin-bottom: 0px;
    .el-form-item {
        margin-bottom: 0px;
    }
}

// .score {
//     justify-content: center;
//     align-items: center;
//     position: relative;
//     .score-date {
//         position: absolute;
//         top: -1px;
//         right: 0;
//         height: 100%;
//     }
// }
// .score-ul {
//     margin: 0;
//     width: 60vw;
//     padding: 0;
//     display: flex;
//     .score-li {
//         list-style: none;
//         display: flex;
//         flex-direction: column;
//         flex: 1;
//         height: 67px;
//         box-sizing: border-box;
//         border-left: 1px solid rgb(226, 219, 219);
//         .balance-count {
//             height: 40px;
//         }
//         > span {
//             width: 100%;
//             display: block;
//             height: 30px;
//             line-height: 30px;
//             border-bottom: 1px solid rgb(226, 219, 219);
//         }
//         input {
//             width: 100%;
//             border: 0;
//             text-align: center;
//         }
//     }
// }
.bottom {
    justify-content: center;
}
.el-table {
    margin-top: 0px;
}
.el-footer {
    border: 1px solid rgb(223, 222, 222);

    // background-color: rgb(174, 201, 236);
    // display: flex;
    flex-direction: column;
    height: 35px !important;
    padding: 0;
    margin-top: 10px;
    // margin-top: 3px;
    background-color: #e5eff8;
    .balance-count {
        width: 100%;
        text-align: right;
        flex: 1;
        line-height: 35px;
        span {
            padding-right: 55px;
        }
    }
}

/*  .box-card {
    width: 480px;
} */
</style>
