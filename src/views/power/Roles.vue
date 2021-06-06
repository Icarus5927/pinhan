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
      <el-table :data="RoleList" stripe border>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
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

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
        <!-- <el-row> -->
        <el-form-item label="设置权限" pro="treeprops">
          <el-tree :props="treeprops" :data="rightsList" ref="tree" node-key="id" default-expand-all
                   :default-checked-keys="defkeys" show-checkbox>
          </el-tree>
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
      // 属性控制的属性绑定对象
      treeprops: {
        label: 'label',
        children: 'children'
      },
      // 所有权限的数据
      rightsList: [
        {
          id: 1,
          label: '教师',
          children: [
            {
              id: 12,
              label: '讲师',
              children: [
                {
                  id: 3,
                  label: '添加课程'
                }
              ]
            }
          ]
        },
        {
          id: 105,
          label: '员工',
          children: [
            {
              id: 12,
              label: 'right1',
              children: [
                {
                  id: 123,
                  label: 'right2'
                }
              ]
            }
          ]
        }
      ],
      // 默认选中的节点ID值
      defkeys: [],
      // 增加角色列表数据
      form: {
        roleName: '',
        roleDesc: ''
      },
      // 从后台返回的数据
      RoleList: [
        {
          // roleId: "",
          roleName: '管理员',
          roleDesc: '管理员',
          rightsList: [
            {
              id: 1,
              label: 'r1',
              children: [
                {
                  id: 12,
                  label: 'r12',
                  children: [
                    {
                      id: 123,
                      label: 'r123'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          // roleId: "",
          roleName: '管理员',
          roleDesc: '管理员',
          rightsList: [
            {
              id: 2,
              label: 'r1',
              children: [
                {
                  id: 21,
                  label: 'r12',
                  children: [
                    {
                      id: 212,
                      label: 'r123'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      setRightDialogVisible: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色的列表
    getRoleList() {
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
      this.getLeafkeys(data.rightsList, this.defkeys)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defkeys)
      })
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取三级权限的ID,并保存到defkeys中
    getLeafkeys(node, arr) {
      // console.log(node)
      node.forEach((item) => {
        if (!item.children) {
          return arr.push(item.id)
        }
        // console.log(item.children)
        item.children.forEach((item) => {
          // console.log(item)
          this.getLeafkeys(item.children, arr)
        })
      })
      console.log(this.defkeys);
    },
    // 重置
    onreset() {
      this.form = {
        roleName: '',
        roleDesc: ''
      }
      this.defkeys = []
      this.$refs.tree.setCheckedKeys([])
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
      get('/user/page',{'page': this.queryInfo.pageNumber})
        .then(res => {
          console.log(res);
        })
      this.getRoleList()
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
