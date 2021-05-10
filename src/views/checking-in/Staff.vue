<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
            <el-breadcrumb-item>考勤</el-breadcrumb-item>
            <el-breadcrumb-item>员工考勤</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <div class="text item">
                <!-- 头部搜索区 -->
                <div class="card-header">
                    <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>

                    <!-- <el-button type="primary" @click="addFinance()">添加费用</el-button> -->
                </div>
                <!-- 数据区 -->
                <el-table :data="list" stripe border>
                    <el-table-column type="index" label="#">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in staffList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                    </el-table-column>
                    <el-table-column v-for="index of 31" :prop="'date'+index" :label="index+''" width="29px" :key="index+'1'">
                    </el-table-column>
                    <!-- <el-table-column label="考勤记录">
                                <template>
                                    <el-tag type="success">3.14</el-tag>
                                    <el-tag type="danger">3.15</el-tag>
                                </template>
                            </el-table-column> -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="upload(scope.row)">提交</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页区 -->
                <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
// import Student from "../../components/Student"
export default {
    // components: {
    //     Student
    // },
    name: "",
    data() {
        return {
            // path: "/students",
            // 控制增加对话框的显示与隐藏
            dialogVisible: false,
            // 获取用户参数列表对象
            queryInfo: {
                name: "",
                pagenumber: 1,
                pagesize: 10
            },
            activeName: "A辅",
            // label: ["A辅", "B辅", "一对一", "班课"],
            staffList: [
                { prop: "work_id", label: "学号" },
                { prop: "name", label: "姓名" }
                // { prop: "name", label: "科目", width: "94px" }
                // {prop:'date',}
            ],
            // form: {},
            list: [
                {
                    work_id: "123",
                    name: "王二",
                    date1: 1,
                    date2: 0
                    // date2: 3
                }
            ],
            total: 100
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取后端传过来的数据
        getUserList() {},
        // 分页获取页码
        handleCurrentChange(e) {
            this.queryInfo.pagenumber = e
            this.getUserList()
        },
        // 向后端传输考勤记录
        upload() {}
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
}
.card-header {
    margin-top: -25px;
    display: flex;
    justify-content: space-between;
    .el-input {
        width: 400px;
    }
}
</style>
