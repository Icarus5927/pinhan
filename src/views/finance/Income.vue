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
            <el-date-picker
              v-model="search.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-input v-model="search.name" placeholder="请输入姓名"></el-input>
            <el-input
              v-model="search.adviser"
              placeholder="请输入教学顾问"
            ></el-input>
            <el-input
              v-model="search.course"
              placeholder="请输入课程"
            ></el-input>
            <!--清除按钮-->
            <el-button  class="search" @click="funClear" >清除</el-button>
            <!-- 搜索按钮 -->
            <el-button icon="el-icon-search" type="primary" @click="getListByInfo"></el-button>
            <el-button type="primary" class="add" @click="addFinance()">添加流水</el-button>
          </div>

          <el-table :data="finagetList" stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              v-for="(item, index) in list"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
            >
              <el-table-column
                v-for="(item1, index1) in item.child"
                :key="index1"
                :prop="item1.prop"
                :label="item1.label"
              >
                <el-table-column
                  v-for="(item2, index2) in item1.child"
                  :key="index2"
                  :prop="item2.prop"
                  :label="item2.label"
                >
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="操作" width="110px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeUserById(scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 余额 -->
        <el-footer style="display: none">
        </el-footer>
        <!-- 分页区 -->
        <el-pagination
          background
          layout="total,prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-container>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :show-close="false"
      @close="onreset()"
    >
      <el-form
        ref="incomeForm"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="流水类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择流水类型">
            <el-option label="收入流水" value="收入流水"></el-option>
            <el-option label="支出流水" value="支出流水"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="类型" prop="moneyType">
          <el-select v-model="form.moneyType" placeholder="请选择支付类型">
            <el-option label="微信" value="微信"></el-option>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="银行卡" value="银行卡"></el-option>
            <el-option label="现金" value="现金"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <br/>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="课程" prop="course">
          <el-input v-model="form.course"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="金额" prop="total">
          <el-input v-model="form.total" type="number"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="教学顾问" prop="adviser">
          <el-input v-model="form.adviser"></el-input>
        </el-form-item>
        <br/>
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
import { handleAlert, handleConfirm } from '../../utils/confirm';
import { apiAddStream, apiFindStreamByInfo, apiGetStreamList } from '../../network/api/api';

export default {
  name: '',
  data() {
    return {
      search: {
        // 用户选择的日期
        time: '',
        startTime: '',
        endTime: '',
        name: '',
        adviser: '',
        course: '',
      },
      title: '添加流水',
      // 获取用户参数列表对象
      queryInfo: {
        pageNumber: 1,
        pageSize: 10,
      },
      // 获取后台接口数据
      finagetList: [
        {
          type: '支付宝',
          time: '2021.3.1',
          name: '张三',
          grade: '初一',
          course: '一对一',
          total: '1500',
          adviser: '李四',
          remark: '',
          moneyType: '微信',
          income_wechat: 1500
        },
      ],
      // 表头
      list: [
        {
          prop: 'time',
          label: '日期',
          width: '120px'
        },
        {
          prop: 'name',
          label: '姓名',
          width: '120px'
        },
        {
          prop: 'grade',
          label: '年级',
          width: '120px'
        },
        {
          prop: 'course',
          label: '课程',
          width: '120px'
        },
        {
          prop: 'subject',
          label: '科目',
          width: '120px'
        },
        {
          prop: 'total',
          label: '金额',
          width: '120px'
        },
        {
          prop: 'adviser',
          label: '教学顾问',
          width: '120px'
        },
        {
          prop: 'Income',
          label: '收入',
          child: [
            {
              label: '微信',
              prop: 'income_wechat'
            },
            {
              label: '支付宝',
              prop: 'income_alipay'
            },
            {
              label: '银行卡',
              prop: 'income_bankCard'
            },
            {
              label: '现金',
              prop: 'income_cash'
            },
          ],
        },
        {
          prop: 'Outcome',
          label: '支出',
          child: [
            {
              label: '微信',
              prop: 'outcome_wechat'
            },
            {
              label: '支付宝',
              prop: 'outcome_alipay'
            },
            {
              label: '银行卡',
              prop: 'outcome_bankCard'
            },
            {
              label: '现金',
              prop: 'outcome_cash'
            },
          ],
        },
        {
          prop: 'Balance',
          label: '余额',
          child: [
            {
              label: '微信',
              prop: 'balance_wechat'
            },
            {
              label: '支付宝',
              prop: 'balance_alipay'
            },
            {
              label: '银行卡',
              prop: 'balance_bankcard'
            },
            {
              label: '现金',
              prop: 'balance_cash'
            },
            {
              label: '总金额',
              prop: 'balance_total'
            },
          ],
        },
        {
          prop: 'remark',
          label: '备注',
          width: '250px'
        },
      ],
      // 收入类型
      label: ['微信', '支付宝', '银行卡'],
      form: {
        streamId: '',
        type: '',
        moneyType: '',
        time: '',
        name: '',
        grade: '',
        course: '',
        subject: '',
        total: '',
        adviser: '',
        remark: '',
        income: '',
        WeChat: '',
        Alipay: '',
        BankCard: '',
        Cash: ''
      },
      // 表单校验规则
      rules: {
        type: [{
          required: true,
          message: '请选择流水类别',
          trigger: 'change'
        }],
        moneyType: [{
          required: true,
          message: '请选择支付类别',
          trigger: 'change'
        }],
        time: [{
          required: true,
          message: '请选择日期',
          trigger: 'blur'
        }],
        name: [
          {
            message: '姓名不支持特殊字符',
            trigger: 'blur',
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
          },
          {
            required: true,
            min: 2,
            max: 10,
            message: '请输入姓名，长度在2到10之间',
            trigger: 'blur',
          },
        ],
        grade: [{
          required: true,
          message: '请输入年级',
          trigger: 'blur'
        }],
        course: [
          {
            message: '课程不支持特殊字符',
            trigger: 'blur',
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
          },
          {
            min: 2,
            max: 10,
            message: '请输入课程，长度在2到10之间',
            trigger: 'blur',
          },
        ],
        total: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          },
          {
            pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/,
            message: '输入值需大于零',
            trigger: 'blur',
          },
        ],
        adviser: [
          {
            message: '姓名不支持特殊字符',
            trigger: 'blur',
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
          },
          {
            min: 2,
            max: 10,
            message: '请输入姓名，长度在2到10之间',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      // 数据总条数
      total: 100,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e;
      this.getList();
    },
    // 获取流水接口
    getList() {
      apiGetStreamList(this.queryInfo.pageNumber)
      .then(res => {
        const list = res.records;
        const total = res.total;
        // 转换数据
        if (total > 0) {
          for (let i = 0; i < total; i++) {
            if (list[i].type === '收入流水') {
              switch (list[i].moneyType) {
                case '微信':
                  list[i].income_wechat = list[i].total;
                  break;
                case '支付宝':
                  list[i].income_alipay = list[i].total;
                  break;
                case '银行卡':
                  list[i].income_bankCard = list[i].total;
                  break;
                case '现金':
                  list[i].income_cash = list[i].total;
                  break;
              }
            } else {
              switch (list[i].moneyType) {
                case '微信':
                  list[i].outcome_wechat = list[i].total;
                  break;
                case '支付宝':
                  list[i].outcome_alipay = list[i].total;
                  break;
                case '银行卡':
                  list[i].outcome_bankCard = list[i].total;
                  break;
                case '现金':
                  list[i].outcome_cash = list[i].total;
                  break;
              }
            }
          }
        }
        this.finagetList = res.records;
        this.total = total;
      })
    },
    getListByInfo() {
      if (this.search.time === '' || this.search.time === null) {
        handleAlert('请至少选择时间', 'warning')
      } else {
        this.search.startTime = this.search.time[0];
        this.search.endTime = this.search.time[1];
        apiFindStreamByInfo(this.search)
          .then(res => {
            console.log(res);
            const total = res.total;
            const records = res.records;
            if (total > 0) {
              handleAlert();
              this.finagetList = records;
              this.total = total
            } else {
              handleAlert('暂无数据', 'warning');
            }
          })
      }
    },
    // 确定按钮
    upload() {
      if (this.title === '添加流水') {
        // 表单校验
        this.$refs.incomeForm.validate((valid) => {
          if (valid) {
            this.form.streamId = Date.parse(new Date());
            // 调用添加流水接口
            apiAddStream(this.form)
              .then(res => {
                if (res === 1) {
                  handleAlert();
                  // 重新获取列表
                  this.getList();
                } else {
                  handleAlert('添加失败', 'warning')
                }
              })
            this.dialogVisible = false;
            // 重新获取列表
            this.getList()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      } else {
        // 表单校验
        this.$refs.incomeForm.validate((valid) => {
          if (valid) {
            // 调用修改流水接口

            this.dialogVisible = false;
            handleAlert();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    // 添加用户
    addFinance() {
      this.title = '添加流水';
      this.dialogVisible = true;
    },
    // 关闭增加用户弹框
    onclose() {
      this.dialogVisible = false;
      handleAlert('操作已取消', 'info');
    },
    // 重置
    onreset() {
      let form = {
        type: '',
        time: '',
        name: '',
        course: '',
        total: '',
        adviser: '',
        remark: '',
      };
      this.form = form;
    },

    // 修改用户弹框
    showEditDialog(data) {
      this.title = '修改流水';
      this.dialogVisible = true;
      this.form = data;
      console.log(data);
    },
    removeUserById(id) {
      const res = handleConfirm(
        '此操作将永久删除该流水，是否继续？',
        'warning',
        '提示'
      )
        .then(() => {
          // 调用接口完成删除用户操作

          handleAlert();
        })
        .catch(() => {
          handleAlert('已取消删除', 'info');
        });
      console.log(res);
    },
    // 清除
    funClear () {
      let txts = document.getElementsByTagName('input')
      for (let i = 0; i < txts.length; i++) {
        if (txts[i].type === 'text' || txts[i].type === 'checkbox') {
          txts[i].value = ''
        }
      }
      this.search = {
        time: '',
        startTime: '',
        endTime: '',
        name: '',
        adviser: '',
        course: '',
      }
    }
  },
  mounted() {
  },
  // watch: {
  //   activeName: {
  //     handler(val) {
  //       this.getList();
  //       console.log(val);
  //     },
  //   },
  // },
};
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
  justify-content: left;
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
    margin-left: 10px;
  }

  .el-input {
    width: 150px;
    margin-left: 10px;
  }
}

.totalmation {
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
