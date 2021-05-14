<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>考勤</el-breadcrumb-item>
      <el-breadcrumb-item>教师考勤</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 头部搜索区 -->
        <div class="card-header">
          <el-date-picker
            type="month"
            value-format="yyyy-M"
            v-model="queryInfo.yearMonth"
            placeholder="请选择月份"
            :clearable="false"
            @on-change="getUserList"
          />
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable
                    @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>

        </div>

        <!-- 数据区 -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">
            <!-- 考勤表 -->
            <CheckinForm
              :table-header="checkinHeader"
              :table-data="list"
              :show-index="true"
              :day-of-month="dayOfMonth"
              @handleEdit="handleEdit"
            ></CheckinForm>

          </el-tab-pane>
        </el-tabs>
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>
<script>
import CheckinForm from '../../components/CheckinForm';
export default {
  name: '',
  components: {
    CheckinForm
  },
  data() {
    return {
      checkinHeader: [
        { name: 'name', title: '姓名', width: 'fit-content', type: "text" },
        { name: 'subject', title: '辅导科目', width: 'fit-content', type: "text" },
      ],
      // 控制增加对话框的显示与隐藏
      dialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        yearMonth: '',
        pageNumber: 1,
        pageSize: 10
      },
      // 导航栏当前选中
      activeName: 'A辅',
      label: ['A辅', 'B辅', '班课'],
      studentList: [
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'subject',
          label: '科目'
        }
        // {prop:'date',}
      ],
      // form: {},
      // 接口获得的数据
      list: [
        {
          name: '周知',
          subject: '初三数学',
          date1: 1,
          date2: 0
        },
        {
          name: '王威',
          subject: '高中化学',
          date1: 1,
          date2: 1
        },
        {
          name: '李牧之',
          subject: '初一物理',
          date1: 0,
          date2: 0
        },
      ],
      total: 100
    }
  },
  created() {
    this.getUserList(this.activeName)
  },
  computed: {
    // 计算选中月的天数
    dayOfMonth() {
      // console.log(this.queryInfo.yearMonth);
      const year = this.queryInfo.yearMonth.split('-')[0];
      const month = this.queryInfo.yearMonth.split('-')[1];
      let day;
      switch (month) {
        case '1':
        case '3':
        case '5':
        case '7':
        case '8':
        case '10':
        case '12':
          day = 31
          break;
        case '2':
          // 判断闰年
          if (year % 4 === 0&&year % 100 !== 0 || year % 400 === 0) {
            day = 29
            break;
          } else {
            day = 28
            break;
          }
        default:
          day = 30
          break;
      }
      return day;
    }
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
    // 用户输入事件响应函数
    handleEdit(info) {
      console.log(info);// 包含rowIndex，row信息
      // console.log(info['row'].name);

      //向后端传递修改数据
    },
  },
  mounted() {
    // 设置默认的时间
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    date = year + '-' + month;
    this.queryInfo.yearMonth = date
  },
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
}

.card-header {
  margin-top: -25px;
  display: flex;
  justify-content: left;
  .el-input {
    width: 400px;
  }
}

.el-table {
  overflow-y: auto !important;
}

</style>
