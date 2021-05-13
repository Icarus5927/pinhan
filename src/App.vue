<template>
    <div id="app">
        <router-view>

        </router-view>
    </div>
</template>

<script>
export default {
    name: "app",
    components: {}
}
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.el-form-item__label {
    padding: 0 2px 0 2px !important;
    height: 40px;
    text-align: center !important;
    // margin-bottom: 3px;
    border: 1px solid #f3f5fa;
    // border-bottom-width: 0;
    background-color: #046db317;
}
.el-input__inner {
    border-radius: 0px !important;
    border: 1px solid #f3f5fa !important;
    padding: 0 5px !important;
    text-align: center;
}
.el-form-item__content {
    line-height: 39px !important;
    text-align: left;
    // padding-left: 10px;
}

.el-table td {
    padding: 0 !important;
}
// 表格对齐
body .el-table th.gutter{
  display: table-cell!important;
}

.el-table .cell {
    padding: 0 !important;
}
.el-table .cell {
    line-height: 39px !important;
}
.el-main[data-v-c1f1971a] {
    line-height: 20px !important;
}
.el-dialog {
    margin-top: 2vh !important;
    margin-bottom: 1vh !important;
    .el-dialog__body {
        padding: 3px 2vw;
    }
}

.el-breadcrumb {
    margin-bottom: 9px;
}
.el-textarea {
    textarea {
        border: none !important;
    }
}
.el-textarea__inner {
    height: 160px !important;
}
</style>
