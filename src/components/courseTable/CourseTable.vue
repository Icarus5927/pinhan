<!--课程表主体-->
<template>
  <div id="course-table">
    <ele-table
        draggable
        stripe
        border
        :cell-style="cellClass"
        :header-cell-style="tableHeader"
        :row-style="{height: '40px', padding: '0'}"
        box-sizing="border-box"
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        :data="tableData"
        :cell-class-name="cellClassName"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @cell-dblclick="cellClick"
        style="width: 100%">

      <ele-table-column
          v-for="(item, index) in dates"
          :label="item + ' 星期' + weekDays[index]"
          :show-overflow-tooltip='true'
          :formatter="typeFormatter"
          :key="'day' + index + 1"
          :prop="'day' + (index + 1)"
      >
      </ele-table-column>

    </ele-table>
    <!--课程详细信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <el-table
          :data="dialogData"
          border
          stripe
          :header-cell-style="tableHeader"
      >
        <el-table-column property="student_name" label="学生"></el-table-column>
        <el-table-column property="grade" label="年级" ></el-table-column>
        <el-table-column property="subject" label="辅导"></el-table-column>
        <el-table-column property="teacher" label="教师"></el-table-column>
        <el-table-column property="course_name" label="课程" width="130px"></el-table-column>
        <el-table-column property="duration" label="课时"></el-table-column>
        <el-table-column property="class_teacher" label="班主任"></el-table-column>
        <el-table-column property="adviser" label="教学顾问"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import {eleTable, eleTableColumn} from "@/utils/ele-table";
import "@/utils/ele-table.css";

export default {
  name: "courseTable",
  props: {
    // 传入的实际数据
    node: {
      type: Array
    },
    dates: {
      type: Array
    }
  },
  data() {
    return {
      tableData: [],// 表格数据
      weekDays: ['一', '二', '三', '四', '五', '六', '天'],
      // colorArray: [
      //   '#ef5b9c','#f15b6c', '#f26522', '#ffd400', '#8552a1', '#7fb80e', '#65c294', '#78cdd1', '#33a3dc'
      // ],
      dialogTableVisible: false,// 弹出窗是否可见
      dialogData: [], // 弹出窗表格中的内容
    };
  },
  components: {
    eleTable,
    eleTableColumn
  },
  mounted() {
    this.tableData = this.node
  },
  methods: {
    // 对显示内容处理
    typeFormatter(row, column, cellValue, index) {
      // console.log(cellValue)
      if (cellValue.length > 1){
        return cellValue[0].student_name + '/' + cellValue[0].grade + '/' + cellValue[0].subject +cellValue[0].course_name + '/' + cellValue[0].teacher_name +'(...)'
      } else if (cellValue.length === 1) {
        return cellValue[0].student_name + '/' + cellValue[0].grade + '/' + cellValue[0].subject + '/' +cellValue[0].course_name + '/' + cellValue[0].teacher_name
      } else return
    },
    // 修改table header的背景色
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: lightblue;color: #fff;font-size: 1.2em text-align: center'
      }
    },
    // 根据设置单元格样式
    cellClass({ row, column, rowIndex, columnIndex }) {
      // console.log(this.tableData[rowIndex]['day' + columnIndex])
      // if (this.tableData[rowIndex]['day' + (columnIndex + 1)][0]) {
      //   return {backgroundColor: this.colorArray[(rowIndex + columnIndex) % 9], color: 'white'}
      // }
      return {fontSize: '1px', maxHeight: '10px',padding: '0', overflow: 'hidden'}
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex

    },
    // 单元格双击响应事件
    cellClick(row, column, cell, event) {
      // console.log(row.index, column.property);
      // 如果单元格内保存的数据数量大于1
      if (cell.innerText.indexOf('(...)') != -1) {
        this.dialogData = this.tableData[row.index][column.property]
        this.dialogTableVisible = true
      }
      // console.log(this.dialogData);
    },
    // 判断能否被放置
    allowDrop(row, column, dropNode, event, type) {
      // console.log(dropNode);
      if (dropNode.innerText == '') {
        return true
      } else {
        return false
      }
    },
    // 判断是否允许拖拽
    allowDrag(row, column, cell, event) {

      // 空cell不允许拖拽
      if (cell.innerText !== '') {
        return true
      } else {
        return false
      }
    },
    // 节点开始拖拽时触发的事件
    handleDragStart(row, column, cell, event) {
      // console.log(row, column, cell, event, "开始")
    },
    // 拖拽进入其他节点时触发的事件
    handleDragEnter(row, column, cell, event, draggingNode) {
      // console.log(row, column, cell, event, draggingNode,"进入")
    },
    // 拖拽离开某个节点时触发的事件
    handleDragLeave(row, column, cell, event, draggingNode) {
      // console.log(row, column, cell, event, draggingNode,"离开")
    },
    // 在拖拽节点时触发的事件
    handleDragOver(row, column, cell, event, draggingNode, dropNode) {
      // console.log(row, column, cell, event, draggingNode,"拖拽中")
    },
    /**
     * 拖拽结束时表的更改信息
     * @param dragging 正在拖拽的单元格
     * @param drop 放置的单元格
     * @param dropType 放置的类型
     * @param event 事件
     */
    handleDragEnd(dragging, drop, dropType, event) {
      // 获取拖拽单元格的数据
      let data = this.tableData[dragging.draggingrow.index][dragging.draggingcolumn.property]
      // 删除被拖拽单元格原位置信息
      this.$set(this.tableData[dragging.draggingrow.index], dragging.draggingcolumn.property, [])
      // 获取放置位置对应列名
      const name = drop.dropcolumn.property;
      // 获取行index
      let rowIndex = drop.droprow.index;
      // 修改tableData
      for (let item of data) {
        this.tableData[rowIndex][name].push(item)
      }
      console.log(this.tableData)
    },
    // 拖拽完成时触发的事件
    handleDrop(row, column, cell, event, draggingNode, dropNode) {
      console.log(row, column, cell, event,"拖拽完成")
    }
  },
  computed: {
  }
};
</script>

<style>
#course-table {
  font-family: "微软雅黑", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  padding: 0;
  margin: 0;
}

.el-table .cell {
  white-space: nowrap;
  text-align: center;
  min-height: 39px;
  /*overflow:hidden;*/
  /*text-overflow:ellipsis;*/
  white-space:nowrap;
}

/*.el-table  {*/
/*  color: black;*/
/*  margin-left: 0px;*/
/*}*/
</style>
