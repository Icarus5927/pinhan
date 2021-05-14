<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生费用</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 头部搜索区 -->
        <div class="card-header">
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable
                    @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
          <div class="button">
            <el-button type="success" @click="addRates()">收费标准</el-button>
            <el-button type="primary" @click="addFinance()">添加费用</el-button>
          </div>

        </div>
        <!-- 学生缴费数据区 -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">

            <el-table :data="list" stripe border>
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column v-for="(item,index) in studentHeader" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
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
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- 标准收费弹窗-->
    <el-dialog title="收费标准" :visible.sync="ratesdialogVisible" width="50%" :show-close="false" @close="onreset()">
      <!-- 收费标准 -->
      <div class="standard">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
          <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">
          </el-tab-pane>
        </el-tabs>
        <!-- 收费标准数据表格 -->
        <editTable
          ref="editTable"
          :tableData="charges[activeTag]"
          :height="tableHeight"
          :disabled="disabled"
          :tableHeader="standardHeader"
          @onTableBtn="deleteStandard"
          @handleEdit="updateStandard"
          />

      </div>
      <!--添加行按钮 -->
      <div>
        <el-button type="success" @click="addNewStandard">添加新标准</el-button>
      </div>

      <div class="click-bottom">
        <el-button @click="onclose()"> 取消</el-button>
        <el-button type="primary" @click="upload()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加费用弹窗   -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" :show-close="false" @close="onreset()">
      <div>
        <el-form ref="addForm" label-width="90px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="学号" prop=work_id>
                <el-input v-model="form.work_id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="课程" prop=course_name>
                <el-input v-model="form.course_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="subject">
                <el-input v-model="form.subject"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际缴费" prop="actualPay">
                <el-input v-model="form.actualPay" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支付方式" prop="payment">
                <el-select v-model="form.payment" placeholder="支付方式" style="width: 100%">
                  <el-option label="微信" value="微信"></el-option>
                  <el-option label="支付宝" value="支付宝"></el-option>
                  <el-option label="银行卡" value="银行卡"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="教学顾问" prop="counselor">
                <el-input v-model="form.counselor"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="A辅转入" prop="fromA">
                <el-input v-model="form.fromA" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="B辅转入" prop="fromB">
                <el-input v-model="form.fromB" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="一对一转入" prop="from121">
                <el-input v-model="form.from121" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班课转入" prop="fromClass">
                <el-input v-model="form.fromClass" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠/减免" prop="discount">
                <el-input v-model="form.discount" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合计" prop="total">
                <el-input v-model="form.total" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editTable from '../../components/Form';
import { handleConfirm, handleAlert} from '../../utils/confirm';
export default {
  name: '',
  components: {
    editTable
  },
  data() {
    return {
      title: '添加用户',
      // path: "/students",
      // 控制增加对话框的显示与隐藏,
      ratesdialogVisible: false,
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 当前选中的课程类型
      activeName: '晚辅',
      label: ['晚辅', '一对一', '班课'],
      // 表头
      studentHeader: [
        { prop: "name", label: "姓名" },
        { prop: "grade", label: "年级" },
        { prop: "actualPay", label: "实际缴费" },
        { prop: "fromA", label: "A辅转入" },
        { prop: "fromB", label: "B辅转入" },
        { prop: "from121", label: "一对一转入" },
        { prop: "fromClass", label: "班课转入" },
        { prop: "total", label: "合计" },
        { prop: "discount", label: "优惠/减免" },
        { prop: "cost", label: "消费费用" },
        { prop: "RemainingFee", label: "剩余课时费" }
      ],
      // 添加费用表单
      form: {
        work_id: '',
        name: '',
        grade: '',
        course_name: '',
        subject: '',
        actualPay: '',
        payment: '',
        counselor: '',
        fromA: '',
        fromB: '',
        from121: '',
        fromClass: '',
        total: '',
        discount: ''
      },
      // 添加费用表单规则
      rules: {
        work_id: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'blur' },
        ],
        name: [
          { message: '姓名不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' },
        ],
        course_name: [
          { message: '课程不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入课程名，长度在2到10之间', trigger: 'blur' }
        ],
        subject: [
          { required: true, min: 2, max: 10, message: '请输入学科名，长度在2到10之间', trigger: 'blur' }
        ],
        actualPay: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        payment: [
          { required: true, message: '请选择类别', trigger: 'change' },
        ],
        fromA: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        fromB: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        from121: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        fromClass: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        total: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        discount: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ]
      },
      // 获取后台接口数据
      list: [
        {
          work_id: '10021',
          name: 'Tom',
          grade: '初一',
          course_name: '一对一',
          subject: '数学',
          payment: '支付宝',
          actualPay: 1000,
          fromA: 0,
          fromB: 0,
          from121: 0,
          fromClass: 0,
          total: 1000,
          discount: 20,
          cost: 500,
          RemainingFee: 10,
        }
      ],
      // 数据条数
      total: 100,
      // 收费标准数据
      charges: {
        // 晚辅
        evening: [
          {
            type: 'A辅',
            standard: '2',
            hours: '',
            dayCost: ''
          },
          {
            type: 'B辅',
            standard: '3',
            hours: '',
            dayCost: ''
          },
          {
            type: 'C辅',
            standard: '4',
            hours: '',
            dayCost: ''
          }
        ],
        // 1对1
        one2one: [
          {
            type: '小学一对一',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '初中一对一',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '高中一对一',
            standard: '',
            hours: '',
            dayCost: ''
          }
        ],
        // 班课
        classCourse: [
          {
            type: '周末培优班',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '小中考押题班',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '中考押题班',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '寒假班',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '暑假班',
            standard: '',
            hours: '',
            dayCost: ''
          },
          {
            type: '单词007班',
            standard: '',
            hours: '',
            dayCost: ''
          }
        ]
      },
      // 选中的课程类别
      activeTag: 'evening',
      tableHeight: 300,
      // 设置表格可编辑
      disabled: false,
      // 收费标准table_header
      standardHeader: [
        { name: 'type', title: '类型', width: '100', type: "text" },
        { name: 'standard', title: '收费标准', width: '150', type: "text" },
        { name: 'hours', title: '预计上课', width: '150', type: "text" },
        { name: 'dayCost', title: '每天费用', width: '150', type: 'text' },
        { name: 'btn', title: '操作', width: '100', type: 'btn-d', text: '删除' }
      ]
    }
  },
  created() {
    this.getUserList(this.activeName)
  },
  methods: {
    // 获取后端传过来的数据
    getUserList() {
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getUserList(this.activeName)
    },
    // 确定提交
    upload() {
      if (this.title === '添加费用') {
        // 表单校验
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            // 调用添加费用接口
            console.log("添加费用")

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {
        // 表单校验
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.ratesdialogVisible = false;
            console.log("修改费用")
            // 调用修改用户接口

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
      this.dialogVisible = false;
      this.ratesdialogVisible = false;
      handleAlert('操作已取消', 'info')
    },
    // 收费标准
    addRates() {
      this.ratesdialogVisible = true
    },

    // 增加用户弹窗
    addFinance() {
      this.title = '添加费用'
      this.dialogVisible = true
    },

    // 修改用户弹框
    showEditDialog(data) {
      this.title = '修改费用'
      this.dialogVisible = true
      this.form = data
      // console.log(id)
    },
    // 根据id删除用户信息
    removeUserById(id) {
      const res = handleConfirm('此操作将永久删除该费用,是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作
          console.log(id);
          handleAlert()
        })
        .catch(() => {
          handleAlert('已取消删除', 'info')
        })
      console.log(res)
    },

    // 把form中的数据重新设置
    onreset() {
      const form = {
        work_id: '',
        name: '',
        grade: '',
        course_name: '',
        subject: '',
        actualPay: '',
        payment: '',
        counselor: '',
        fromA: '',
        fromB: '',
        from121: '',
        fromClass: '',
        total: '',
        discount: ''
      }
      this.form = form
    },
    /**
    * @Description: tab标签点击事件
    * @author oldMe
    * @date 2021/4/22
    */
    tabClick(tab) {
      const name = tab.$options.propsData.name;
      if (name === '晚辅') {
        this.activeTag = 'evening'
      } else if (name === '一对一') {
        this.activeTag = 'one2one'
      } else {
        this.activeTag = 'classCourse'
      }
    },
    /**
    * @Description: 增加新的收费标准
    * @author oldMe
    * @date 2021/4/22
    */
    addNewStandard() {
      this.charges[this.activeTag].push({})
      handleAlert()
    },

    /**
    * @Description: 删除收费标准
    * @author oldMe
    * @date 2021/4/22
    */
    deleteStandard(row) {
      // row 包含index和行信息row
      handleConfirm('此操作将永久删除该收费标准信息, 是否继续?', 'warning', '提示')
        .then(res => {

          // 调用收费标准删除接口

          this.charges[this.activeTag].splice(row.index, 1);
          handleAlert('删除成功', 'success')
          console.log(res);
        }).catch(err => {
        handleAlert('已取消删除','info')
        console.log(err);
      })
    },
    /**
    * @Description: 调用接口更改收费标准
    * @author oldMe
    * @date 2021/5/14
    */
    updateStandard(info) {
      console.log(info);
      // 调用接口更改收费标准
      setTimeout(() => {
        handleAlert()
      },500)
    }
  },
  mounted() {
  },
  watch: {
    activeName: {
      handler(val) {
        this.getUserList(this.activeName)
        // console.log(val)
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

.content {
  display: flex;
  flex-direction: row;

  li {
    flex: 1;
    border: 1px solid rgb(226, 219, 219);
    display: flex;
    flex-direction: column;
    height: 50px;

    input {
      border: 0;
      text-align: center;
      color: rgb(111, 109, 109);
      border-top: 1px solid rgb(226, 219, 219);
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
