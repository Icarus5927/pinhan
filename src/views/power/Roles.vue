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
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateRightDialog(scope.row)">修改</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!-- <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button> -->

                    </template>
                </el-table-column>
            </el-table>

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
                    <el-tree :props="treeprops" :data="rightslist" ref="tree" node-key="id" default-expand-all :default-checked-keys="defkeys" show-checkbox>
                    </el-tree>
                </el-form-item>
                <!-- <el-col :span="8"><span>设置权限</span></el-col>
                <el-col :span="16">
                    <el-tree :props="treeprops" :data="rightslist" ref="tree" node-key="id" default-expand-all :default-checked-keys="defkeys" show-checkbox>
                    </el-tree>
                </el-col> -->
                <!-- </el-row> -->
                <el-form-item>
                    <div class="click-bottom">
                        <el-button @click="onclose()"> 取消</el-button>
                        <el-button type="primary" @click=" upload()">确定</el-button>

                    </div>
                    <!-- </div> -->
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "",
    data() {
        return {
            title: "修改角色",
            // 属性控制的属性绑定对象
            treeprops: {
                label: "label",
                children: "children"
            },
            // 所有权限的数据
            rightslist: [
                {
                    id: 103,
                    label: "hhh",
                    children: [
                        {
                            id: 124,
                            label: "hhhgggh",
                            children: [
                                {
                                    id: 1234,
                                    label: "uubnj"
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 105,
                    label: "hhh",
                    children: [
                        {
                            id: 12,
                            label: "hhhgggh",
                            children: [
                                {
                                    id: 123455,
                                    label: "wdffg"
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
                roleName: "",
                roleDesc: ""
            },
            RoleList: [
                {
                    // roleId: "",
                    roleName: "123",
                    roleDesc: "123",
                    rightslist: [
                        {
                            id: 103,
                            label: "hhh",
                            children: [
                                {
                                    id: 124,
                                    label: "hhhgggh",
                                    children: [
                                        {
                                            id: 1234,
                                            label: "uubnj"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    // roleId: "",
                    roleName: "12uii3",
                    roleDesc: "123",
                    rightslist: [
                        {
                            id: 105,
                            label: "hhh",
                            children: [
                                {
                                    id: 12,
                                    label: "hhhgggh",
                                    children: [
                                        {
                                            id: 123455,
                                            label: "wdffg"
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
        getRoleList() {},
        // 展示添加角色
        addRightDialog() {
            this.setRightDialogVisible = true
            this.title = "添加角色"
        },
        // 修改操作
        updateRightDialog(data) {
            this.title = "修改角色"
            this.form = data
            this.getLeafkeys(data.rightslist, this.defkeys)
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
        },
        // 重置
        onreset() {
            this.form = {
                roleName: "",
                roleDesc: ""
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
            if (this.title === "添加角色") {
                console.log(123)
                // 调用添加角色接口
            } else {
                console.log(456)
                // 调用修改角色接口
            }
            this.setRightDialogVisible = false
        }
    },
    mounted() {}
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
