<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="card-header">
        <el-button type="primary" @click="addRightDialog()">添加角色</el-button>
      </div>
      <el-table :data="UserList" stripe border>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="work_id" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="level" label="角色描述" >
          <template slot-scope="scope">
            <span v-if="scope.row.level === 0">管理员</span>
            <span v-else-if="scope.row.level === 1">员工</span>
            <span v-else-if="scope.row.level === 2">教师</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateRightDialog(scope.row)">修改
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>

    </el-card>
    <el-dialog :title="title" :visible.sync="setRightDialogVisible" width="40%" @close="onreset()">
      <el-form ref="form" label-width="90px" :model="form">

        <el-form-item label="工号" prop="work_id">
          <el-input v-model="form.work_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设置权限" prop="level">
          <el-select v-model="form.level" placeholder="请选择权限" style="width: 100%">
            <el-option label="管理员" :value="0"></el-option>
            <el-option label="员工" :value="1"></el-option>
            <el-option label="教师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="onclose()"> 取消</el-button>
            <el-button type="primary" @click=" upload()">确定</el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { get } from '../../network/request/request';

export default {
  name: '',
  data() {
    return {
      title: '修改角色',
      total: 100,
      queryInfo: {
        pageSize: 10,
        pageNumber: 1
      },
      // 增加角色列表数据
      form: {
        work_id: '',
        name: '',
        level: ''
      },
      // 从后台返回的数据
      UserList: [
        {
          work_id: '1223',
          name: 'zx',
          level: 1
        },
        {
          work_id: '3321',
          name: 'zxc',
          level: 0
        }
      ],
      setRightDialogVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取所有角色的列表
    getUserList() {
      get('/user/page',{'page': this.queryInfo.pageNumber})
        .then(res => {
          // console.log(res);
          console.log(res.records);
          this.UserList = res.records
          this.total = res.total
        })
    },
    // 展示添加角色
    addRightDialog() {
      this.setRightDialogVisible = true
      this.title = '添加角色'
    },
    // 修改操作
    updateRightDialog(data) {
      this.title = '修改角色'
      this.form = data
      this.setRightDialogVisible = true
    },
    // 重置
    onreset() {
      this.form = {
        work_id: '',
        name: '',
        level: ''
      }
    },
    // 关闭
    onclose() {
      this.setRightDialogVisible = false
      // this.onreset()
    },
    // 确定按钮
    upload() {
      // console.log(val)
      if (this.title === '添加角色') {
        console.log(123)
        // 调用添加角色接口
      } else {
        console.log(456)
        // 调用修改角色接口
      }
      this.setRightDialogVisible = false
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getUserList()
    },
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped>
.card-header {
  // margin-top: -25px;
  display: flex;
  justify-content: flex-end;
}

.el-col {
  display: flex;

  > span {
    width: 86px;
    font-size: 14px;
    padding-right: 5px;
    color: #606266;
    border-left: 1px solid #e2dbdb;
    text-align: right;
    // height: 20px;
    line-height: 38px;
    background-color: #046db317;
  }
}

// .click-bottom {
//     position: absolute;
//     bottom: -60px;
// }
</style>
