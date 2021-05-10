<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>教师管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <div class="text item">
                <!-- 头部搜索区 -->
                <div class="card-header">
                    <el-input placeholder="请输入姓名" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>

                    <el-button type="primary" @click="addUser()">添加用户</el-button>
                </div>
                <!-- 数据区 -->

                <el-table :data="list" stripe border>
                    <el-table-column type="index" label="#">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in teacherList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                    </el-table-column>
                    <el-table-column label="操作" width="110px">
                        <template slot-scope="scope">
                            <!-- {{scope.row}} -->
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuser(scope.row.work_id)"></el-button>
                            <!-- <el-button type="warning" icon="el-icon-setting" size="mini"></el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页区 -->
                <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="添加教师" :visible.sync="dialogVisible" width="64%" :show-close="false" @close="onreset()">
            <!-- 内容主体区 -->
            <div class="contanier">
                <el-form ref="form" label-width="90px" :model="form">
                    <div class="main">
                        <div class="header">
                            <div class="pictuer">
                                <img :src="form.img" class="grid-content-picture-img">
                                <div @click="picture" class="grid-content-picture-button">上传照片</div>
                                <input type="file" ref="setfile" @change="upfile" hidden accept="image/*">
                            </div>
                            <div class="userInf">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="工号" prop="work_id">
                                            <el-input v-model="form.work_id"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="姓名" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="性别" prop="gender">
                                            <el-radio-group v-model="form.gender">
                                                <el-radio label="男"></el-radio>
                                                <el-radio label="女"></el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="学历" prop="education">
                                            <el-input v-model="form.education"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="联系方式" prop="contact">
                                            <el-input v-model="form.contact"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="家庭住址" prop="education">
                                            <el-input v-model="form.education"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col>
                                        <el-form-item label="辅导科目" prop="subject">
                                            <el-input v-model="form.subiect"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="middle">
                            <!-- <div class="salay">
                                <div class="top">
                                    <span>薪资</span>
                                </div>
                                <ul class="salay-ul">
                                    <li class="salay-li" v-for="(item,index) in form.salay" :key="index">
                                        <span>{{item.name}}</span>
                                        <input type="text" v-model="item.amount">
                                    </li>
                                </ul>
                            </div> -->
                            <div class="experience">
                                <div class="top">
                                    <span>工作经验</span>
                                </div>
                                <el-input type="textarea" autosize placeholder="请输入工作经验" v-model="form.experience">
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <el-form-item>
                        <div class="click-bottom">
                            <el-row>
                                <!-- <el-col :span="7"> -->
                                <el-button @click="onclose"> 取消</el-button>
                                <el-button type="primary" @click="upload()">确定</el-button>
                                <!-- </el-col> -->
                            </el-row>

                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

    </div>
</template>
<script>
export default {
    name: "",
    data() {
        return {
            title: "添加用户",
            // clearable: true,
            form: {
                work_id: "",
                name: "",
                gender: "",
                education: "",
                contact: "",
                address: "",
                // address: "",
                subject: "",
                img: require("../../assets/bg.png"),
                experience: ""
            },

            // path: "/students",
            // 控制增加对话框的显示与隐藏
            dialogVisible: false,
            // 获取用户参数列表对象
            queryInfo: {
                query: "",
                pagenumber: 1,
                pagesize: 10
            },
            teacherList: [
                { prop: "work_id", label: "工号", width: "100px" },
                { prop: "name", label: "姓名", width: "90px" },
                { prop: "gender", label: "姓别", width: "80px" },
                { prop: "education", label: "学历", width: "100px" },
                { prop: "contact", label: "联系方式", width: "150px" },
                { prop: "address", label: "家庭住址", width: "220px" },
                { prop: "subiect", label: "辅导科目" }
            ],
            list: [
                {
                    work_id: "123",
                    name: "",
                    gender: "女",
                    education: "",
                    contact: "",
                    address: "哈哈哈哈哈哈哈哈哈哈哈哈哈",

                    // address: "",
                    subject: "",
                    img: require("../../assets/bg.png"),
                    experience: ""
                }
            ],
            total: 100
        }
    },
    created() {
        // var path = window.sessionStorage.getItem("path")
        // if (path === "/user1") {
        this.getUserList()
    },
    methods: {
        // 获取后端传过来的数据
        getUserList() {},
        // 分页获取页码
        handleCurrentChange(e) {
            this.pagenumber = e
            this.getUserList()
        },
        addUser() {
            this.dialogVisible = true
            this.title = "添加用户"
        },
        // 确定用户弹框
        upload() {
            // 上传成功隐藏就行
            this.dialogVisible = false
            if (this.title === "添加用户") {
                console.log(123)
                // 调用添加用户接口
            } else {
                console.log(456)
                // 调用修改用户接口
            }
        },
        // 关闭用户弹框
        onclose() {
            this.dialogVisible = false
        },
        // 修改用户弹框
        showEditDialog(data) {
            this.dialogVisible = true
            this.title = "修改用户"
            this.form = data
        },
        // 删除用户
        removeuser(id) {
            const res = this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    // 调用删除用户借口
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    })
                })
            console.log(res)
        },
        picture() {
            this.$refs.setfile.click()
        },
        upfile(e) {
            var that = this
            if (!e || !window.FileReader) return // 看支持不支持FileReader
            var reader = new FileReader()
            reader.readAsDataURL(e.target.files[0]) // 这里是最关键的一步，转换就在这里 （参数必须是blob对象）
            reader.onloadend = function () {
                that.form.img = this.result
            }
            // console.log(this.item)
        },
        // form中的数据重设
        onreset() {
            var form = {
                work_id: "",
                name: "",
                gender: "",
                education: "",
                contact: "",
                // address: "",
                subject: "",
                img: require("../../assets/bg.png"),
                experience: ""
            }
            this.form = form
        }
    },
    mounted() {},
    watch: {
        $route: {
            handler(val) {
                // console.log(val.path)
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
    .userInf {
        width: 90%;
    }

    .main {
        border: 1px solid rgb(226, 219, 219);
        overflow: hidden;
    }
}

.el-form {
    position: relative;
    .pictuer {
        position: absolute;
        top: 0;
        right: 2px;
        width: 10%;
        // border-left: 1px solid rgb(226, 219, 219);
        .grid-content-picture-img {
            width: 100%;
            height: 122px;
            object-fit: cover;
            object-position: center;
            border: 1px solid rgb(226, 219, 219);
        }
        .grid-content-picture-button {
            margin-left: 2px;
            line-height: 40px;
            height: 40px;
            background-color: #046db317;
            margin-top: -5px;
            cursor: pointer;
        }
    }
}
.el-row {
    margin-bottom: 0px;
    .el-form-item {
        margin-bottom: 0px;
    }
}
.top {
    color: #606266;
    padding: 0 30px;
    font-size: 18px;
    margin-top: 1px;
    font-weight: 600;
    background-color: #046db317;
    height: 40px;
    line-height: 45px;
}
.salay-ul {
    margin: 0;
    width: 60vw;
    padding: 0;
    display: flex;
    justify-content: flex-start;

    .salay-li {
        list-style: none;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 67px;
        box-sizing: border-box;
        border-left: 1px solid rgb(226, 219, 219);

        > span {
            width: 100%;
            display: block;
            height: 30px;
            line-height: 30px;
            border-bottom: 1px solid rgb(226, 219, 219);
        }
        input {
            width: 100%;

            border: 0;
            text-align: center;
        }
    }
}
//
.bottom {
    justify-content: center;
}
.click-bottom {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    .el-button {
        margin-left: 40px;
    }
}
</style>
