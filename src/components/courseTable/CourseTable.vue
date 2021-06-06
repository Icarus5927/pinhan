<!--课程表主体-->
<template>
  <div id="course-table">
    <div class="main-table">
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
    </div>

    <!--课程详细信息弹窗-->
    <div class="detailDialog">
      <el-dialog title="课程详情" :visible.sync="detailTableVisible" width="70%">
        <el-table
          :data="dialogData"
          border
          stripe
          :header-cell-style="tableHeader"
        >
          <el-table-column property="time" label="时间"></el-table-column>
          <el-table-column property="student_name" label="学生"></el-table-column>
          <el-table-column property="grade" label="年级" ></el-table-column>
          <el-table-column property="subject" label="辅导"></el-table-column>
          <el-table-column property="teacher_name" label="教师"></el-table-column>
          <el-table-column property="course_name" label="课程" width="130px"></el-table-column>
          <el-table-column property="duration" label="课时"></el-table-column>
          <el-table-column property="class_teacher" label="班主任"></el-table-column>
          <el-table-column property="adviser" label="教学顾问"></el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 修改课程时间表格 -->
    <div class="updateTime">
      <el-dialog title="修改具体课程时间" :visible.sync="updateTimeTableVisible" width="90%" :close-on-click-modal="false">
        <el-table
          :data="draggingData"
          border
          stripe
          :header-cell-style="tableHeader"
        >
          <el-table-column property="start" label="起始时间">
            <template slot-scope="scope">
              <el-time-select
                placeholder="起始时间"
                v-model="scope.row.start"
                :picker-options="courseDuration[dropRowIndex]">
              </el-time-select>
            </template>
          </el-table-column>
          <el-table-column property="end" label="结束时间">
            <template slot-scope="scope">
              <el-time-select
                placeholder="结束时间"
                v-model="scope.row.end"
                :picker-options="{
                  start: courseDuration[dropRowIndex].start,
                  end: courseDuration[dropRowIndex].end,
                  step: courseDuration[dropRowIndex].step,
                  minTime: scope.row.start
                  }">
              </el-time-select>
              <!--用来修改time-->
              <span style="display: none">{{scope.row.time = scope.row.start + '-' + scope.row.end}}</span>
            </template>
          </el-table-column>

          <el-table-column property="student_name" label="学生"></el-table-column>
          <el-table-column property="grade" label="年级" ></el-table-column>
          <el-table-column property="subject" label="辅导"></el-table-column>
          <el-table-column property="teacher_name" label="教师"></el-table-column>
          <el-table-column property="course_name" label="课程" width="130px"></el-table-column>
          <el-table-column property="duration" label="课时">
            <template slot-scope="scope">
              <span>{{ getDuration(scope.row.start, scope.row.end) }}</span>
              <!--用来修改duration-->
              <span style="display: none">{{scope.row.duration = getDuration(scope.row.start, scope.row.end)}}</span>
            </template>
          </el-table-column>
          <el-table-column property="class_teacher" label="班主任"></el-table-column>
          <el-table-column property="adviser" label="教学顾问"></el-table-column>
        </el-table>

        <div class="buttons">
          <el-button @click="onclose">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </div>
      </el-dialog>
    </div>

  </div>


</template>

<script>
import {eleTable, eleTableColumn} from "@/utils/ele-table";
import "@/utils/ele-table.css";
import { handleAlert, handleConfirm } from '../../utils/confirm';

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
      detailTableVisible: false,// 详情列表是否可见
      updateTimeTableVisible: false,// 修改时间列表是否可见
      dialogData: [], // 详情弹窗中的数据
      draggingData: [], // 修改拖拽课程时间弹窗的数据
      dragging: {}, // 拖拽的单元格
      drop: {}, // 放置的单元格
      dropRowIndex: -1, // 放置行index
      originData: [], // 拖拽单元格原始的数据
      // timepicker的选项
      courseDuration: [
        {start: '08:00', step: '00:30', end: '10:00'},
        {start: '10:00', step: '00:30', end: '12:00'},
        {start: '14:00', step: '00:30', end: '16:00'},
        {start: '16:00', step: '00:30', end: '18:00'},
        {start: '18:00', step: '00:30', end: '23:00'}
      ]
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
    // 检查时间区间
    checkDuration() {
      // console.log(this.draggingData);
      // console.log(this.courseDuration[this.dropRowIndex]);
      let min = parseInt(this.courseDuration[this.dropRowIndex].start.split(':')[0]);// 最小时间
      let max = parseInt(this.courseDuration[this.dropRowIndex].end.split(':')[0]); // 最大时间
      let isLegal = true;// 时间区间是否合法
      for (let item of this.draggingData) {
        let start = parseInt(item.start.split(':')[0]);
        let end = parseInt(item.end.split(':')[0]);
        if (start < min || end > max) {
          isLegal = false
        }
      }
      return isLegal
    },
    // 对课时进行计算
    getDuration(start,end) {
      let clock1 = parseInt(start.split(':')[0]);
      let minutes1 = parseInt(start.split(':')[1]);
      let clock2 = parseInt(end.split(':')[0]);
      let minutes2 = parseInt(end.split(':')[1]);
      let duration = clock2 - clock1;
      if (minutes1 === 30) {
        duration -= 0.5
      }
      if (minutes2 === 30) {
        duration += 0.5
      }
      return duration
    },
    // 对单元格显示内容处理
    typeFormatter(row, column, cellValue, index) {
      if (cellValue.length >= 2){
        return cellValue[0].time + '/' + cellValue[0].student_name + '/' + cellValue[0].grade + '/'+ '\n' + cellValue[0].subject + '/' + cellValue[0].duration + '/' +cellValue[0].course_name + '/' + cellValue[0].teacher_name
          + '\n' +cellValue[1].time + '/' + cellValue[1].student_name + '/' + cellValue[1].grade + '/'+ '\n' + cellValue[1].subject + '/' + cellValue[1].duration + '/' +cellValue[1].course_name + '/' + cellValue[1].teacher_name + '(...)'
      } else if (cellValue.length === 1) {
        return cellValue[0].time + '/' + cellValue[0].student_name + '/' + cellValue[0].grade + '/' + '\n' + cellValue[0].subject + '/' + cellValue[0].duration + '/' + cellValue[0].course_name + '/' + cellValue[0].teacher_name
      } else return
    },
    // 修改table header的背景色
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: lightblue;color: #fff;font-size: 1.2em; text-align: center'
      }
    },
    // 根据设置单元格样式
    cellClass({ row, column, rowIndex, columnIndex }) {
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
        this.detailTableVisible = true
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
      this.dragging = dragging;
      this.drop = drop;
      // 获取拖拽单元格的数据
      this.draggingData = this.tableData[dragging.draggingrow.index][dragging.draggingcolumn.property];
      // 保存原始的数据(JSON转换后不受响应式影响)
      this.originData = JSON.parse(JSON.stringify(this.tableData[dragging.draggingrow.index][dragging.draggingcolumn.property]));
      // 拖拽后弹窗修改课程的时间
      this.updateTimeTableVisible = true;
      // 获取行index
      let rowIndex = drop.droprow.index;
      this.dropRowIndex = rowIndex;
    },
    // 拖拽完成时触发的事件
    handleDrop(row, column, cell, event, draggingNode, dropNode) {
      console.log(row, column, cell, event,"拖拽完成")
    },

    // 拖拽完成，向后端请求修改
    submit() {
      // 检查时间的区间
      const isLegal = this.checkDuration()
      if (isLegal) {
        // 发送修改请求

        // 删除被拖拽单元格原位置信息
        this.$set(this.tableData[this.dragging.draggingrow.index], this.dragging.draggingcolumn.property, [])
        // 获取放置位置对应列名
        const name = this.drop.dropcolumn.property;
        // 修改tableData,将数据放到drop的位置
        for (let item of this.draggingData) {
          this.tableData[this.dropRowIndex][name].push(item)
        }
        // 隐藏弹窗
        this.updateTimeTableVisible = false
        handleAlert('调课成功', 'success')
      } else {
        handleAlert('有课程未调整时间，请您调整后确认','warning')
      }
    },
    onclose() {
      this.updateTimeTableVisible = false;
      // 取消后将数据设为原始的数据
      this.$set(this.tableData[this.dragging.draggingrow.index], this.dragging.draggingcolumn.property, this.originData)
      handleAlert('取消调课', 'info')
    }

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

.main-table .el-table .cell {
  text-align: center;
  /*设置最小行高，去掉border，159*/
  min-height: 159px;
  /*必须加important，不加不生效*/
  white-space:pre-line!important;
}
/*调整表头高度*/
.main-table .el-table__header-wrapper {
  height: 64px;
  line-height: 30px;
  border-bottom: 1px solid #ebeef5;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

</style>
