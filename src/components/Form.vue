<template>
  <!-- 对element-UI中的table进一步封装 -->
  <el-table :data="tableData"
            class="tb-edit"
            border
            stripe
            :show-summary="showSummary"
            :height="height"
            :highlight-current-row="!disabled"
            :cell-class-name="cellClassName"
            @cell-dblclick="handleCurrentChange">
    <el-table-column
      v-if="showIndex"
      type="index"
      width="50">
    </el-table-column>
    <!-- 根据传入的表头和其他信息创建表   -->
    <el-table-column
      v-for="(item,index) in tableHeader"
      :key="index"
      :prop="item.name"
      :headerAlign="'center'"
      :align="item.align"
      :label="item.title"
      :fixed="item.fixed"
      :width="item.width"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <!-- select  -->
        <el-select v-if="item.type === 'select'" size="small" v-model="scope.row[item.name]"
                   @change="handleEdit(scope.$index, scope.row)"
                   placeholder="请选择内容"
                   value="">
          <el-option
            v-for="option in item.data"
            :disabled="disabled"
            :value="option.name"
            :key="option.name"
            :label="option.name"/>
        </el-select>
        <!-- button-delete -->
        <el-button v-else-if="item.type === 'btn-d'" :disabled="disabled" @click="onSelected(scope.$index,scope.row)"
                   type="danger" size="small">
          {{ item.text }}
        </el-button>
        <!-- button -->
        <el-button v-else-if="item.type === 'btn'" :disabled="disabled" @click="onSelected(scope.$index,scope.row)"
                   type="primary" size="small">
          {{ item.text }}
        </el-button>
        <!-- boolean -->
        <!--    <el-radio-group v-else-if="item.type === 'boolean'" v-model="scope.row[item.name]">-->
        <!--      <el-radio :label="true" >是</el-radio>-->
        <!--      <el-radio :label="false" >否</el-radio>-->
        <!--    </el-radio-group>-->
        <el-switch
          v-else-if="item.type === 'boolean'"
          v-model="scope.row[item.name]"
          active-color="#13ce66"
          inactive-color="#6666"></el-switch>
        <div v-else-if="item.type === 'text'" >
          <el-input  v-show="currentRowIndex === scope.row.index && currentColIndex === scope.column.index" size="small" :disabled="item.disabled || disabled" v-model="scope.row[item.name]"
                     placeholder="请输入"
                     @change="handleEdit(scope.$index, scope.row)"
                     :ref='"cell" + scope.row.index + scope.column.index'
                     @blur="onblur"
                     @keyup.enter.native="$event.target.blur"
          />
        </div>
        <div v-else>
          <el-input  v-show="currentRowIndex === scope.row.index && currentColIndex === scope.column.index" size="small" :disabled="item.disabled || disabled" v-model="scope.row[item.name]"
                     placeholder="请输入"
                     type="number"
                     @change="handleEdit(scope.$index, scope.row)"
                     :ref='"cell" + scope.row.index + scope.column.index'
                     @blur="onblur"
                     @keyup.enter.native="$event.target.blur"
          />
        </div>
        <!--如果和当前选中cell的index相同，则隐藏 -->
        <span v-show="!(currentRowIndex === scope.row.index && currentColIndex === scope.column.index) && item.type !== 'boolean'" >{{ showInfo(scope.row[item.name]) }}</span>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
export default {
  name: 'edit_table',
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
    'showSummary': {// 是否显示合计
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 当前选中 行、列的index
      currentRowIndex: '',
      currentColIndex: ''
    }
  },
  computed: {
  },
  methods: {
    cellClassName({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex
      column.index = columnIndex
    },
    // cell点击事件
    handleCurrentChange(row, column, cell,event) {
      // console.log(row.index)
      // 当行发生点击时，将currentIndex设置为当前行的index
      this.currentRowIndex = row.index
      this.currentColIndex = column.index
      // console.log('row:' + this.currentRowIndex + ',col:' + this.currentColIndex)
      setTimeout(() =>{
        this.onfocus()
      },1)
    },
    // 当内容修改时
    handleEdit(index, row) {
      // console.log(index, row);
      this.$emit('handleEdit', { index: index, row: row })
    },
    // 当select被选中时
    onSelected: function (index, row) {
      // console.log(row);
      this.$emit('onTableBtn', {
        index: index,
        row: row
      })
    },
    showInfo(value) {
      if(value === true){
        return '是'
      }
      else if (value === false){
        return '否'
      } else {
        return value
      }
    },
    // cell获取焦点时,将input自动聚焦
    onfocus() {
      this.$refs['cell' + this.currentRowIndex + this.currentColIndex][0].focus()
    },
    // 失去焦点时
    onblur() {
      this.currentColIndex = '';
      this.currentRowIndex = '';
    }
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
