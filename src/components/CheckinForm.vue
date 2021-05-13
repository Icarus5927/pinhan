<template>
  <!-- 对element-UI中的table进一步封装 -->
  <el-table :data="tableData"
            class="tb-edit"
            border
            stripe
            :height="height"
            :highlight-current-row="!disabled"
            :cell-class-name="cellClassName"
            @cell-dblclick="handleCurrentChange">
    <el-table-column
      v-if="showIndex"
      type="index"
      label="#"
      width="50">
    </el-table-column>
    <!-- 信息部分   -->
    <el-table-column
      v-for="(item,index) in tableHeader"
      :key="index"
      :prop="item.name"
      :headerAlign="'center'"
      :label="item.title"
      :width="item.width"
      show-overflow-tooltip
    >
    </el-table-column>
    <!--考勤部分-->
    <el-table-column
      v-for="index of dayOfMonth"
      :prop="'date' + index"
      :label="index+''"
      width="29px"
      :key="index+'1'">
      <template slot-scope="scope">
          <el-input-number  v-show="currentColIndex === scope.column.index && currentRowIndex === scope.row.index"
                     v-model="scope.row['date'+index]"
                     size="medium"
                     @change="handleEdit(scope.$index, scope.row, scope.column.index, scope.row['date'+index])"
                     :ref='"cell" + scope.row.index + scope.column.index'
                     @blur="onblur"
                     @keyup.enter.native="$event.target.blur"
          />
        <!--如果和当前选中cell的index相同，则隐藏 -->
        <div v-show="!(currentColIndex === scope.column.index && currentRowIndex === scope.row.index)">
          <el-icon v-if="scope.row['date' + index] === 1" class="el-icon-success" style="color: #44b336"/>
          <el-icon v-else-if="scope.row['date' + index] === 0" class="el-icon-error" style="color: red"/>
        </div>
      </template>
    </el-table-column>


  </el-table>
</template>

<script>
import { handleAlert } from '../utils/confirm';

export default {
  name: 'edit_table',
  data() {
    return {
      // 当前选中 行、列的index
      currentRowIndex: '',
      currentColIndex: ''
    }
  },
  props: {
    'tableData': Array,
    'showIndex': { // 是否显示首列 index
      type: Boolean,
      default: false
    },
    'tableHeader': Array,
    'height': Number,
    'stripe': { // 是否为斑马纹table
      type: Boolean,
      default: true
    },
    'disabled': Boolean,
    // 一个月的天数
    'dayOfMonth': {
      type: Number,
      default: 31
    }
  },
  computed: {
  },
  methods: {
    cellClassName({row, column, rowIndex, columnIndex}) {
      // 为了index列从1开始显示，这里都+1
      row.index = rowIndex + 1
      column.index = columnIndex + 1
    },
    // cell点击事件
    handleCurrentChange(row, column, cell,event) {
      // console.log(row.index)
      // 当发生双击时，将currentIndex设置为当前行的index
      this.currentRowIndex = row.index
      this.currentColIndex = column.index
      // console.log('row:' + this.currentRowIndex + ',col:' + this.currentColIndex)
      setTimeout(() =>{
        this.onfocus()
      },1)
    },
    // 当内容修改时
    handleEdit(rowIndex, row, colIndex , value) {
      // 对输入值进行限制
      if (value !== 0 && value !== 1) {
        // 对输入有误的值重置为-1，并提示
        this.$set(row, 'date' +　(colIndex - this.tableHeader.length - 1), -1)
        handleAlert('输入值有误', 'warning')
      }
      // console.log(index);
      this.$emit('handleEdit', {
        index: rowIndex,
        row: row
      })
    },
    // 当select被选中时
    onSelected: function (index, row) {
      // console.log(row);
      this.$emit('onTableBtn', {
        index: index,
        row: row
      })
    },
    // cell获取焦点时,将input自动聚焦
    onfocus() {
      this.$refs['cell' + this.currentRowIndex + this.currentColIndex][0].focus()
    },
    // 失去焦点时
    onblur() {
      this.currentColIndex = '';
      this.currentRowIndex = '';
    },
  }
}
</script>

<style scoped>
.tb-edit .el-input, .tb-edit .el-select {
  display: none
}

.tb-edit .current-row .el-input, .tb-edit .current-row .el-select {
  display: block
}

.tb-edit .current-row .el-input + span, .tb-edit .current-row .el-select + span {
  display: none
}
.el-radio {
  margin-right: 10px;
}
</style>
