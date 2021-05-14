<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>收入流水</el-breadcrumb-item>
    </el-breadcrumb>
      <el-card class="box-card">
        <el-container>
          <el-main>
            <div class="block">
                <div>
                    <el-date-picker v-model="queryInfo.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button icon="el-icon-search" class="search" @click="getFinanceList"></el-button>
                    <el-button type="primary" class="add" @click="addFinance() ">添加流水</el-button>
                </div>
            </div>

            <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">

                <el-table :data="financeList" stripe border>
                  <el-table-column type="index" label="#">
                  </el-table-column>
                  <el-table-column v-for="(item,index) in list" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                  </el-table-column>
                  <el-table-column label="操作" width="110px">
                    <template slot-scope="scope">
                      <!-- {{scope.row}} -->
                      <!-- 修改按钮 -->
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                      <!-- 删除按钮 -->
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeUserById(scope.row.id) "></el-button>

                    </template>
                  </el-table-column>
                </el-table>
                  <div class="summation">
                    <ul>
                      <li class="summation-title">共计: {{ singleTotal }}</li>
                      <li></li>
                    </ul>
                  </div>
              </el-tab-pane>
            </el-tabs>
          </el-main>
            <!-- 余额 -->
            <el-footer>
              <div class="balance">
                <span>余额</span>
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
        </el-container>
      </el-card>
        <!-- 弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :show-close="false" @close="onreset()">
          <el-form ref="incomeForm" :model="form" label-width="100px" :rules="rules">

            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择支付类型">
                <el-option label="微信" value="微信"></el-option>
                <el-option label="支付宝" value="支付宝"></el-option>
                <el-option label="银行卡" value="银行卡"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="日期" prop="date">
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="课程" prop="course">
              <el-input v-model="form.course"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="金额" prop="sum">
              <el-input v-model="form.sum" type="number"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="教学顾问" prop="counselor">
              <el-input v-model="form.counselor"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="click-bottom">
                <el-button @click="onclose()"> 取消</el-button>
                <el-button type="primary" @click="upload()">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
  </div>
</template>
<script>
// import Detail from "../../components/Income-detail"
import { handleAlert, handleConfirm } from '../../utils/confirm';

export default {
  name: "",
  data() {
    return {
      title: "添加流水",
      // 获取用户参数列表对象
      queryInfo: {
        // 用户选择的日期
        date: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 获取后台接口数据
      financeList: [
        {
          type: "支付宝",
          date: "3.1",
          name: "张三",
          grade: "初一",
          course: "一对一",
          sum: "1500",
          counselor: "李四",
          remark: ""
        }
      ],
      // 表头
      list: [
        { prop: "date", label: "日期", width: "120px" },
        { prop: "name", label: "姓名", width: "120px" },
        { prop: "grade", label: "年级", width: "120px" },
        { prop: "course", label: "课程", width: "120px" },
        { prop: "sum", label: "金额", width: "150px" },
        { prop: "counselor", label: "教学顾问", width: "150px" },
        { prop: "remark", label: "备注" }
      ],
      // 收入类型
      label: ["微信", "支付宝", "银行卡"],
      form: {
        type: "",
        date: "",
        name: "",
        grade: "",
        course: "",
        sum: "",
        counselor: "",
        remark: ""
      },
      // 表单校验规则
      rules: {
        type: [
          { required: true, message: '请选择类别', trigger: 'change' },
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' },
        ],
        course: [
          { message: '课程不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { min: 2, max: 10, message: '请输入课程，长度在2到10之间', trigger: 'blur' }
        ],
        sum: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}

        ],
        counselor: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      activeName: "微信",
      // 数据总条数
      total: 100,
      // 从后端获取的余额
      balance_amount: [
        {
          type: "微信",
          balance: 0
        },
        {
          type: "支付宝",
          balance: 200
        },
        {
          type: "银行卡",
          balance: 300
        }
      ]

    }
  },
  computed: {
    // 计算总的余额
    totalBalance: function () {
      let totalBalance = 0;
      for (let i = 0; i < this.balance_amount.length; i++) {
        totalBalance += this.balance_amount[i]['balance']
      }
      return totalBalance
    },
    // 计算单项的合计入账
    singleTotal: function () {
      let singleTotal = 0;
      for (let item of this.financeList) {
        singleTotal += parseFloat(item.sum)
      }
      return singleTotal
    }
  },
  created() {
      this.getFinanceList(this.activeName)
  },
  methods: {
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getFinanceList(this.activeName)
    },
    // 获取流水接口
    getFinanceList() {
      // console.log(this.date === '')
      // console.log(this.date, this.activeName)

    },
    // 确定按钮
    upload() {
      if (this.title === "添加流水") {

        // 表单校验
        this.$refs.incomeForm.validate((valid) => {
          if (valid) {
            // 调用添加流水接口

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.incomeForm.validate((valid) => {
          if (valid) {
            // 调用修改流水接口

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    // 添加用户
    addFinance() {
      this.title = "添加流水"
      this.dialogVisible = true
    },
    // 关闭增加用户弹框
    onclose() {
      this.dialogVisible = false
      handleAlert('操作已取消', 'info')
    },
    // 重置
    onreset() {
      let form = {
        type: "",
        date: "",
        name: "",
        course: "",
        sum: "",
        counselor: "",
        remark: ""
      }
      this.form = form
    },

    // 修改用户弹框
    showEditDialog(data) {
      this.title = "修改流水"
      this.dialogVisible = true
      this.form = data
      console.log(data)
    },
    removeUserById(id) {
        const res = handleConfirm('此操作将永久删除该收入流水，是否继续？', 'warning', '提示')
          .then(() => {
            // 调用接口完成删除用户操作

            handleAlert()
          })
          .catch(() => {

            handleAlert('已取消删除', 'info')
          })
        console.log(res)
    }
  },
  mounted() {},
  watch: {
    activeName: {
      handler(val) {
        this.getFinanceList(this.activeName)
        console.log(val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-main {
    /* background-color: rgb(143, 28, 28); */
    padding: 0;
}
.el-form-item {
    margin-bottom: 5px;
}
.el-select {
    width: 100%;
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
.el-date-editor.el-input {
    width: 100%;
}
.block {
    // border: 1px solid #000;
    // background-color: rgb(174, 201, 236);
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 2px;
    // span {
    //     background-color: rgb(88, 134, 219);
    .add {
        position: absolute;
        right: 0;
    }
    .search {
        border-radius: 0 4px 4px 0;
        background-color: rgb(240, 238, 238);
    }
}
.summation {
    height: 40px;
    // border: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    margin-bottom: -5px;
    ul {
        width: 200px;
        display: flex;
        li {
            line-height: 40px;
            margin-left: 5px;
        }
    }
}
</style>
