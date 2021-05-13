<!--课程表左侧表头-->
<template>
  <div id="left-table">
    <ele-table
        :draggable="false"
        :data="tableData"
        :cell-style="cellStyle"
        style="width: 100%"
        :span-method="rowMerge"
        border
        stripe
        :header-cell-style="tableHeaderColor"
    >
      <ele-table-column
          prop="time"
          width="40%"
      >
      </ele-table-column>
      <ele-table-column
          prop="period"
          label="时间"
          width="auto">
      </ele-table-column>
    </ele-table>
  </div>
</template>

<script>
import { eleTable, eleTableColumn } from "@/utils/ele-table";
import "@/utils/ele-table.css";
export default {
  name: "app",
  props: {
    // 传入的实际数据
    node : {
      type: Array
    }
  },
  data() {
    return {
      tableData: [],
    };
  },
  components: {
    eleTable,
    eleTableColumn
  },
  methods: {
    // 设置单元格的样式
    cellStyle() {
      return 'background-color: lightblue; height: 160px'
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: lightblue;color: #fff;font-size: 25px; '
      }
    },
    /**
    * @Description: 控制左侧时间的行合并
    * @author oldMe
    * @date 2021/4/26
    */
    rowMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0){ // 第一列
        if (rowIndex === 0 ) { // 行index是偶数
          return {
            rowspan: 2, // 上午占4行
            colspan: 1
          };
        } else if (rowIndex === 2){
          return {
            rowspan: 2, // 下午占2行
            colspan: 1
          };
        } else if (rowIndex === 4){
          return {
            rowspan: 4, // 下午占4行
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
  },
  mounted() {
    this.tableData = this.node
  },
};
</script>

<style>
#left-table {
  font-family: "微软雅黑", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}
/*标题换行*/
/*.el-table .cell {*/
/*  white-space: pre-line;*/
/*  text-align: center;*/
/*  padding: 0;*/
/*}*/
.el-table  {
  color: black;
  margin: 0;
}
</style>
