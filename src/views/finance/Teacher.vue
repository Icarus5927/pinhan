<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
            <el-breadcrumb-item>财务管理</el-breadcrumb-item>
            <el-breadcrumb-item>教师费用</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <div class="text item">
                <!-- 头部搜索区 -->
                <div class="card-header">
                    <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                    <el-button type="primary" @click="addFinance()">添加费用</el-button>
                </div>
                <!-- 数据区 -->
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">

                        <el-table :data="list" stripe border v-show="activeName === 'A辅' || activeName === 'B辅'">
                            <el-table-column type="index" label="#">
                            </el-table-column>
                            <el-table-column  v-for="(item,index) in headerAB" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
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

                        <el-table :data="list" stripe border v-show="activeName === '一对一'">
                            <el-table-column type="index" label="#">
                            </el-table-column>
                            <el-table-column v-for="(item,index) in header121" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
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

                        <el-table :data="list" stripe border v-show="activeName === '班课'">
                            <el-table-column type="index" label="#">
                            </el-table-column>
                            <el-table-column v-show="activeName === '班课'" v-for="(item,index) in headerClassCourse" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
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
                    </el-tab-pane>
                </el-tabs>
                <el-footer>
                    <div class="balance">
                        <span>合计</span>
                    </div>
                    <ul>
                        <li v-for="(item,index) in balance_amount" :key="index">
                            <span>{{item.type}}</span><span>{{item.balance}}</span>
                        </li>
                    </ul>
                    <div class="balance-count"><span>共计：{{ totalBalance }}</span></div>
                </el-footer>
                <!-- 分页区 -->
                <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加费用弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :show-close="false" @close="onreset()">
            <div>
              <el-form v-show="activeName === 'A辅'|| activeName === 'B辅'" ref="formA" label-width="90px" :model="form" :rules="rules">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="辅导类型" prop="type">
                      <el-input disabled :placeholder="activeName">{{ form.type = activeName }}</el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br/>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="工号" prop='work_id'>
                      <el-input v-model="form.work_id"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop='name'>
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="工资/天" prop='daily_salary'>
                      <el-input v-model="form.daily_salary"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="工作天数" prop='work_days'>
                      <el-input v-model="form.work_days"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="工资" prop='salary'>
                      <el-input v-model="form.salary" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="全勤奖" prop='perfect_attendance_award'>
                      <el-input v-model="form.perfect_attendance_award" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="其他奖励" prop='other_award'>
                      <el-input v-model="form.other_award" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="迟到/早退" prop='leave_late'>
                      <el-input v-model="form.leave_late" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="实发工资" prop='net_salary'>
                      <el-input v-model="form.net_salary" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item>
                    <div class="click-bottom">
                        <el-button type="primary" @click="upload()">确定</el-button>
                        <el-button @click="onclose()"> 取消</el-button>
                    </div>
                </el-form-item>
              </el-form>
              <el-form v-show="activeName === '一对一'" ref="formB" label-width="90px" :model="form" :rules="rules">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="辅导类型" prop="type">
                        <el-input disabled :placeholder="activeName">{{ form.type = activeName }}</el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <br/>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="工号" prop='work_id'>
                        <el-input v-model="form.work_id"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="姓名" prop='name'>
                        <el-input v-model="form.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <br>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="辅导科目" prop='subject'>
                        <el-input v-model="form.subject"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <br>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="课时费" prop='class_fee'>
                        <el-input v-model="form.class_fee" type="number"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="总课时" prop='total_hour'>
                        <el-input v-model="form.total_hour" type="number"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <br>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="总课时费" prop='class_fee'>
                        <el-input v-model="form.total_fee" type="number"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="个人总费用" prop='total_expenses'>
                        <el-input v-model="form.total_expenses" type="number"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <br>

                  <el-form-item>
                      <div class="click-bottom">
                          <el-button type="primary" @click="upload()">确定</el-button>
                          <el-button @click="onclose()"> 取消</el-button>
                      </div>
                  </el-form-item>
                </el-form>
              <el-form v-show="activeName === '班课'" ref="formClass" label-width="90px" :model="form" :rules="rules">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="辅导类型" prop="type">
                      <el-input disabled :placeholder="activeName">{{ form.type = activeName }}</el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br/>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="工号" prop='work_id'>
                      <el-input v-model="form.work_id"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop='name'>
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="年级" prop='grade'>
                      <el-input v-model="form.grade"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="课时费/h" prop='class_fee'>
                      <el-input v-model="form.class_fee"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="总课时" prop='total_hour'>
                      <el-input v-model="form.total_hour" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="总课时费" prop='total_fee'>
                      <el-input v-model="form.total_fee" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注" prop='remarks'>
                      <el-input v-model="form.remarks" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br>

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
import { handleConfirm, handleAlert} from '../../utils/confirm';

export default {
  name: "teacher_finance",
  data() {
    return {
      title: "添加用户",
      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
          name: "",
          pageNumber: 1,
          pageSize: 10
      },

      activeName: "A辅",
      label: ["A辅", "B辅", "一对一", "班课"],
      // 表头
      headerAB: [
          { prop: "name", label: "姓名" },
          { prop: "daily_salary", label: "工资/天" },
          { prop: "work_days", label: "工作天数" },
          { prop: "salary", label: "工资" },
          { prop: "perfect_attendance_award", label: "全勤奖" },
          { prop: "other_award", label: "其他奖励" },
          { prop: "leave_late", label: "迟到/早退" },
          { prop: "net_salary", label: "实发工资" }
      ],
      header121: [
          { prop: "name", label: "姓名" },
          { prop: "subject", label: "辅导科目" },
          { prop: "class_fee", label: "课时费/h" },
          { prop: "total_hour", label: "总课时" },
          { prop: "total_fee", label: "总课时费" },
          { prop: "total_expenses", label: "个人总费用" }
      ],
      headerClassCourse: [
        { prop: "name", label: "姓名" },
        { prop: "grade", label: "年级" },
        { prop: "class_fee", label: "课时费/h" },
        { prop: "total_hour", label: "总课时" },
        { prop: "total_fee", label: "总课时费" },
        { prop: "remarks", label: "备注" },
      ],
      // 添加费用表单
      form: {
        type : '',// 辅导类型
        work_id: '',//工号
        name: '',//姓名
        daily_salary: '',//日薪
        work_days: '',//工作天数
        salary: '',//工资
        perfect_attendance_award: '',// 全勤奖
        other_award: '',// 其他奖励
        leave_late: '',// 迟到、早退
        net_salary: '',// 实发工资
        subject: '',// 辅导科目
        class_fee: '',// 课时费
        total_hour: '',// 总课时
        total_fee: '',// 共课时费
        total_expenses: '',// 个人总费用
        grade: '',// 年级
        remarks: ''// 备注
      },
      rules: {
        work_id: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'blur' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        course_name: [
          { message: '课程不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入课程名，长度在2到10之间', trigger: 'blur' }
        ],
        subject: [
          { required: true, min: 2, max: 10, message: '请输入学科名，长度在2到10之间', trigger: 'blur' }
        ],
        class_fee: [
          { required: true, message: '请输入课时费', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        total_hour: [
          { required: true, message: '请输入总课时', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        total_fee: [
          { required: true,message: '请输入总课时费', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        total_expenses: [
          { required: true, message: '请输入总课时费', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ]
      },
      // 获取后台接口数据
      list: [
        {
          work_id: '1001',
          name: 'zs',
          subject: 'dsa',
          course_name: 'math',
          class_fee: 213,
          total_hour: 43,
          total_fee: 213,
          total_expenses: 213
        }
      ],
      balance_amount: [
          {
              type: "A辅",
              balance: 0
          },
          {
              type: "B辅",
              balance: 0
          },
          {
              type: "一对一",
              balance: 0
          },
          {
              type: "班课",
              balance: 0
          }
      ],
      total: 100
    }
  },
  computed: {
    // 计算合计费用
    totalBalance: function () {
      let totalBalance = 0;
      for (let i = 0; i < this.balance_amount.length; i++) {
        totalBalance += this.balance_amount[i]['balance']
      }
      return totalBalance
    },
  },
  created() {
      this.getUserList(this.activeName)
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {},
    // 分页获取页码
    handleCurrentChange(e) {
        this.queryInfo.pageNumber = e
        this.getUserList(this.activeName)
    },
    // 确定
    upload() {
      if (this.title === "添加费用") {
        // 表单校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            alert(valid)
            // 调用添加费用接口

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 调用修改费用接口

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false
      handleAlert('取消操作', 'info')
    },
    // 增加费用弹框
    addFinance() {
      this.title = "添加费用"
      this.dialogVisible = true
    },

    // 修改费用弹框
    showEditDialog(data) {
        this.title = "修改费用"
        this.dialogVisible = true
        this.form = data
        // console.log(id)
    },
    removeUserById(id) {
      const res = handleConfirm('此操作将永久删除该费用,是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作
          // console.log(id);
          handleAlert()
        })
        .catch(() => {
          handleAlert('已取消删除', 'info')
        })
      console.log(res)
    },
    // 把form中的数据重置
    onreset() {
        let form = {
          work_id: '',
          name: '',
          course_name: '',
          subject: '',
          class_fee: undefined,
          total_hour: undefined,
          total_fee: undefined,
          total_expenses: undefined
        }
        this.form = form
    }
  },
  mounted() {},
  watch: {
      activeName: {
          handler(val) {
              this.getUserList(this.activeName)
              console.log(val)
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
.contanier {
    width: 60vw;

    .main {
        border: 1px solid rgb(226, 219, 219);
        overflow: hidden;
    }
}
.el-footer {
    border: 1px solid rgb(223, 222, 222);

    // background-color: rgb(174, 201, 236);
    display: flex;
    flex-direction: column;
    height: 110px !important;
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
    .balance {
        flex: 1;
        line-height: 35px;
    }

    ul {
        flex: 1;
        line-height: 40px;
        display: flex;
        li {
            flex: 1;
            display: flex;
            span {
                flex: 1;
                border: 1px solid rgb(223, 222, 222);
            }
        }
    }
}
.el-row {
    margin-bottom: 0px;
    .el-form-item {
        margin-bottom: 0px;
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
