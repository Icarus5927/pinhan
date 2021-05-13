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
            <edit-table
              :table-header="studentListHeader"
              :table-data="list"
              @onTableBtn="deleteStuInfo"/>
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
        <el-form ref="form" label-width="90px" :model="form">
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
              <el-form-item label="年级" prop="name">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="课程" prop=work_id>
                <el-input v-model="form.course_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="name">
                <el-input v-model="form.subject"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际缴费" prop="name">
                <el-input v-model="form.actualPay"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支付方式" prop="name">
                <el-input v-model="form.payment"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="教学顾问" prop="name">
                <el-input v-model="form.counselor"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="A辅转入" prop=work_id>
                <el-input v-model="form.fromA"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="B辅转入" prop="name">
                <el-input v-model="form.fromB"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="一对一转入" prop="name">
                <el-input v-model="form.from121"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班课转入" prop=work_id>
                <el-input v-model="form.fromClass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合计" prop="name">
                <el-input v-model="form.total"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优惠/减免" prop="name">
                <el-input v-model="form.discount"></el-input>
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
      // 主数据表头
      studentListHeader: [
        { name: 'name', title: '姓名', width: 'fit-content', type: "text" },
        { name: 'grade', title: '年级', width: 'fit-content', type: "text" },
        { name: 'actualPay', title: '实际缴费', width: 'fit-content', type: "text" },
        { name: 'fromA', title: 'A辅转入', width: 'fit-content', type: 'text' },
        { name: 'fromB', title: 'B辅转入', width: 'fit-content', type: 'text' },
        { name: 'from121', title: '一对一转入', width: 'fit-content', type: 'text' },
        { name: 'fromClass', title: '班课转入', width: 'fit-content', type: 'text' },
        { name: 'total', title: '合计', width: 'fit-content', type: 'text' },
        { name: 'discount', title: '优惠/减免', width: 'fit-content', type: 'text' },
        { name: 'cost', title: '消费费用', width: 'fit-content', type: 'text' },
        { name: 'RemainingFee', title: '剩余课时费', width: 'fit-content', type: 'text' },
        { name: 'btn-d', title: '操作', width: 'fit-content', type: 'btn-d', text: '删除' },
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
      // 获取后台接口数据
      list: [
        {
          name: 'Tom',
          grade: 2,
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
      // console.log(val)
      if (this.title === '添加费用') {
        console.log("添加费用")
        // 调用添加用户接口
      } else {
        console.log("修改费用")
        // 调用修改用户接口
      }
      handleAlert()
      this.dialogVisible = false;
      this.ratesdialogVisible = false;
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false;
      this.ratesdialogVisible = false;
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
    // showEditDialog(data) {
    //   this.title = '修改费用'
    //   this.dialogVisible = true
    //   this.form = data
    //   // console.log(id)
    // },
    // 把form中的数据重新设置，这里我还没命名
    onreset() {
      const form = {
        work_id: '',
        name: ''
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
          this.charges[this.activeTag].splice(row.index, 1);
          handleAlert('删除成功', 'success')
          console.log(res);
        }).catch(err => {
        handleAlert('已取消删除','info')
        console.log(err);
      })
    },
    /**
    * @Description: 删除学生费用信息
    * @author oldMe
    * @date 2021/4/22
    */
    deleteStuInfo(row) {
      handleConfirm('此操作将永久删除该缴费信息, 是否继续?', 'warning', '提示')
      .then(res => {
        this.list.splice(row.index,1)
        handleAlert('删除成功', 'success')
      }).catch(err => {
        handleAlert('已取消删除','info')
        console.log(err);
      })
    },
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
