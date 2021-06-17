<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>品涵教育</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生费用</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 头部搜索区 -->
        <div class="card-header">
          <el-input placeholder="请输入姓名" v-model="queryInfo.name" class="input-with-select" clearable
                    @clear="getList()">
            <el-button slot="append" icon="el-icon-search" @click="getListByName()"></el-button>
          </el-input>
          <div class="button">
            <el-button type="success" @click="addRates()">收费标准</el-button>
            <el-button type="primary" @click="addFinance()">添加费用</el-button>
          </div>

        </div>
        <!-- 学生缴费数据区 -->
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">
            <el-table :data="list" stripe border v-show="activeName === 'A辅'|| activeName === 'B辅' || activeName === 'C辅'">
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column  v-for="(item,index) in studentHeaderABC" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              </el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <!--修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                  <!-- 结转按钮 -->
                  <el-button type="success" icon="el-icon-top-right" size="mini" @click="showTransferDialog(scope.row)"></el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeUserById(scope.row.studentid) "></el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-table :data="list" stripe border v-show="activeName === '一对一'">
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column  v-for="(item,index) in studentHeader121" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              </el-table-column>
              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <!--修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeUserById(scope.row.studentid) "></el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-table :data="list" stripe border v-show="activeName === '班课'">
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column  v-for="(item,index) in studentHeaderClassCourse" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
              </el-table-column>
              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <!--修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click=" removeUserById(scope.row.studentid) "></el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- 收费标准弹窗-->
    <el-dialog title="收费标准" :visible.sync="ratesDialogVisible" width="50%" :show-close="false" @close="onreset()" :close-on-click-modal="false"	>
      <!-- 收费标准 -->
      <div class="standard">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
          <el-tab-pane :label="item" v-for="(item,index) in label" :key="index" :name="item">
          </el-tab-pane>
        </el-tabs>
        <!-- 收费标准数据表格 -->
        <el-table
          v-show="activeTag === 'A'|| activeTag === 'B' || activeTag === 'C'"
          :data="charges[activeTag]"
          :height="tableHeight">
          <el-table-column v-for="(item, index) in standardHeaderABC" :key="index" :label="item.label" :prop="item.prop">
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showStandardEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click=" deleteStandard(scope.row) "></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-show="activeTag === 'one2one'"
          :data="charges[activeTag]"
          :height="tableHeight">
          <el-table-column v-for="(item, index) in standardHeader121" :key="index" :label="item.label" :prop="item.prop">
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showStandardEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click=" deleteStandard(scope.row) "></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-show="activeTag === 'classCourse'"
          :data="charges[activeTag]"
          :height="tableHeight">
          <el-table-column v-for="(item, index) in standardHeaderCourse" :key="index" :label="item.label" :prop="item.prop">
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showStandardEditDialog(scope.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click=" deleteStandard(scope.row) "></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination background layout="total,prev, pager, next" :total="standardInfo.pageNumber" @current-change="handlePageChange">
        </el-pagination>
      </div>
      <!--添加行按钮 -->
      <div>
        <el-button type="success" @click="addNewStandard">添加新标准</el-button>
      </div>

      <div class="click-bottom">
        <el-button @click="onclose()"> 取消</el-button>
        <el-button type="primary" @click="upload()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加\修改收费标准弹窗 -->
    <el-dialog :title="standardTitle" :visible.sync="standardDialogVisible" width="50%" :show-close="false" @close="onreset()" :close-on-click-modal="false">
      <el-form v-show="activeName === 'A辅'|| activeName === 'B辅'|| activeName === 'C辅'" ref="standardForm" label-width="90px" v-model="formStandard">
        <el-form-item label="课程类型" prop="type">
          <el-input disabled :placeholder="activeName">{{ formStandard.type = activeName }}</el-input>
        </el-form-item>
        <el-form-item label="类型" prop="standardName">
          <el-input v-model="formStandard.standardName"></el-input>
        </el-form-item>
        <el-form-item label="收费/月" prop="monthCost">
          <el-input v-model="formStandard.monthCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="预计上课" prop="hours">
          <el-input v-model="formStandard.classCount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="每天费用" prop="dayCost">
          <el-input v-model="formStandard.dayCost" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="standardClose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>

      <el-form v-show="activeName === '一对一'" ref="standardForm" label-width="90px" v-model="formStandard">
        <el-form-item label="课程类型" prop="type">
          <el-input disabled :placeholder="activeName">{{ formStandard.type = activeName }}</el-input>
        </el-form-item>
        <el-form-item label="类型" prop="standardName">
          <el-input v-model="formStandard.standardName"></el-input>
        </el-form-item>
        <el-form-item label="收费/h" prop="hourCost">
          <el-input v-model="formStandard.hourCost" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="standardClose()">取消</el-button>
            <el-button type="primary" @click="upload()">确定</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-form v-show="activeName === '班课'" ref="standardForm" label-width="90px" v-model="formStandard">
        <el-form-item label="课程类型" prop="type">
          <el-input disabled :placeholder="activeName">{{ formStandard.type = activeName }}</el-input>
        </el-form-item>
        <el-form-item label="类型" prop="standardName">
          <el-input v-model="formStandard.standardName"></el-input>
        </el-form-item>
        <el-form-item label="收费标准" prop="monthCost">
          <el-input v-model="formStandard.monthCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="课次" prop="times">
          <el-input v-model="formStandard.classCount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="hours">
          <el-input v-model="formStandard.classTimes" type="number"></el-input>
        </el-form-item>
        <el-form-item label="课时费/h" prop="hourCost">
          <el-input v-model="formStandard.hourCost" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="standardClose()">取消</el-button>
            <el-button type="primary" @click="upload()">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加\修改费用弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close="false" @close="onreset()" :close-on-click-modal="false">
      <div>
        <!-- A\B\C-->
        <el-form v-show="activeName === 'A辅'|| activeName === 'B辅'|| activeName === 'C辅'" ref="addForm" label-width="90px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="课程类型" prop="type">
                <el-input disabled :placeholder="activeName">{{ form.coursetype = activeName }}</el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br/>
          <el-row>
            <el-col :span="24">
              <el-form-item label="收费标准" prop="standardId">
                <el-select v-show="activeName === 'A辅'" v-model="form.standardId" placeholder="收费标准" style="width: 100%">
                  <el-option v-for="item in charges['A']" :key="item.standardName" :label="item.standardName" :value="item.standardid"></el-option>
                </el-select>
                <el-select v-show="activeName === 'B辅'" v-model="form.standardId" placeholder="收费标准" style="width: 100%">
                  <el-option v-for="item in charges['B']" :key="item.standardName" :label="item.standardName" :value="item.standardid"></el-option>
                </el-select>
                <el-select v-show="activeName === 'C辅'" v-model="form.standardId" placeholder="收费标准" style="width: 100%">
                  <el-option v-for="item in charges['C']" :key="item.standardName" :label="item.standardName" :value="item.standardid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学号" prop=studentid>
                <el-input v-model="form.studentid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.studentname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="课程" prop=coursename>
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="coursename">
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际缴费" prop="fee">
                <el-input v-model="form.fee" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支付方式" prop="paytype">
                <el-select v-model="form.paytype" placeholder="支付方式" style="width: 100%">
                  <el-option label="微信" value="微信"></el-option>
                  <el-option label="支付宝" value="支付宝"></el-option>
                  <el-option label="银行卡" value="银行卡"></el-option>
                  <el-option label="现金" value="现金"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="教学顾问" prop="adviser">
                <el-input v-model="form.adviser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="A辅转入" prop="aturn">
                <el-input v-model="form.aturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="B辅转入" prop="bturn">
                <el-input v-model="form.bturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="一对一转入" prop="oneturn">
                <el-input v-model="form.oneturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班课转入" prop="classturn">
                <el-input v-model="form.classturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠/减免" prop="reducefee">
                <el-input v-model="form.reducefee" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合计" prop="total">
                <el-input v-model="form.total" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际天数" prop="daycount">
                <el-input v-model="form.daycount" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="剩余天数" prop="daylast">
                <el-input v-model="form.daylast" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际费用" prop="feefact">
                <el-input v-model="form.feefact" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="余额" prop="feeover">
                <el-input v-model="form.feeover" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!--一对一-->
        <el-form v-show="activeName === '一对一'" ref="addForm" label-width="90px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="课程类型" prop="type">
                <el-input disabled :placeholder="activeName">{{ form.coursetype = activeName }}</el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br/>
          <el-row>
            <el-col :span="24">
              <el-form-item label="收费标准" prop="standardId">
                <el-select v-model="form.standardId" placeholder="收费标准" style="width: 100%">
                  <el-option v-for="item in charges['one2one']" :key="item.standardid" :label="item.standardName" :value="item.standardid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学号" prop=studentid>
                <el-input v-model="form.studentid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.studentname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="课程" prop=coursename>
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="coursename">
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际缴费" prop="fee">
                <el-input v-model="form.fee" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支付方式" prop="paytype">
                <el-select v-model="form.paytype" placeholder="支付方式" style="width: 100%">
                  <el-option label="微信" value="微信"></el-option>
                  <el-option label="支付宝" value="支付宝"></el-option>
                  <el-option label="银行卡" value="银行卡"></el-option>
                  <el-option label="现金" value="现金"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="教学顾问" prop="adviser">
                <el-input v-model="form.adviser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="A辅转入" prop="aturn">
                <el-input v-model="form.aturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="B辅转入" prop="bturn">
                <el-input v-model="form.bturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="一对一转入" prop="oneturn">
                <el-input v-model="form.oneturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班课转入" prop="classturn">
                <el-input v-model="form.classturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠/减免" prop="reducefee">
                <el-input v-model="form.reducefee" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合计" prop="total">
                <el-input v-model="form.total" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="赠课时" prop="gitclass">
                <el-input v-model="form.gitclass" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合计课时" prop="totalclass">
                <el-input v-model="form.totalclass" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- 班课-->
        <el-form v-show="activeName === '班课'" ref="addForm" label-width="90px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="课程类型" prop="type">
                <el-input disabled :placeholder="activeName">{{ form.coursetype = activeName }}</el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="24">
              <el-form-item label="收费标准" prop="standardId">
                <el-select v-model="form.standardId" placeholder="收费标准" style="width: 100%">
                  <el-option v-for="item in charges['classCourse']" :key="item.standardid" :label="item.standardName" :value="item.standardid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <br/>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学号" prop=studentid>
                <el-input v-model="form.studentid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.studentname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="课程" prop=coursename>
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="coursename">
                <el-input v-model="form.coursename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际缴费" prop="fee">
                <el-input v-model="form.fee" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="支付方式" prop="paytype">
                <el-select v-model="form.paytype" placeholder="支付方式" style="width: 100%">
                  <el-option label="微信" value="微信"></el-option>
                  <el-option label="支付宝" value="支付宝"></el-option>
                  <el-option label="银行卡" value="银行卡"></el-option>
                  <el-option label="现金" value="现金"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="教学顾问" prop="adviser">
                <el-input v-model="form.adviser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="A辅转入" prop="aturn">
                <el-input v-model="form.aturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="B辅转入" prop="bturn">
                <el-input v-model="form.bturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="一对一转入" prop="oneturn">
                <el-input v-model="form.oneturn" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班课转入" prop="classturn">
                <el-input v-model="form.classturn" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠/减免" prop="reducefee">
                <el-input v-model="form.reducefee" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合计" prop="total">
                <el-input v-model="form.total" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="剩余课时" prop="classlast">
                <el-input v-model="form.classlast" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8">
              <el-form-item label="剩余课次" prop="countlast">
                <el-input v-model="form.countlast" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="余额" prop="feeover">
                <el-input v-model="form.feeover" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div class="click-bottom">
              <el-button @click="onclose()">取消</el-button>
              <el-button type="primary" @click="upload()">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 转出费用弹窗 -->
    <el-dialog title="转出费用" :visible.sync="transferVisible" width="30%" :show-close="false" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="转入课程类型">
          <el-select v-model="formTransfer.to" style="width: 70%">
            <el-option
              v-for="item in label"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="click-bottom">
            <el-button @click="onclose()">取消</el-button>
            <el-button type="primary" @click="upload()">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { handleConfirm, handleAlert} from '../../utils/confirm';
import {
  apiAddStandard,
  apiAddStudentFee,
  apiGetStandardList,
  apiRemoveStandard,
  apiUpdateStandard,
  apiGetStudentFeeList, apiTurnStudentFee
} from '../../network/api/api';
export default {
  name: '',
  data() {
    return {
      title: '',
      standardTitle: '',
      // 控制添加收费标准弹窗显示
      ratesDialogVisible: false,
      // 控制添加费用弹窗显示
      dialogVisible: false,
      // 控制转出弹窗
      transferVisible: false,
      // 修改收费标准弹窗
      standardDialogVisible: false,
      // 获取用户参数列表对象
      queryInfo: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      standardInfo: {
        total: 30,
        pageNumber: 1,
        pageSize: 10
      },
      // 当前选中的课程类型
      activeName: 'A辅',
      label: ['A辅', 'B辅', 'C辅', '一对一', '班课'],
      // 转入课程类型
      options: [
      ],
      // A\B\C辅表头
      studentHeaderABC: [
        { prop: "grade", label: "年级" },
        { prop: "name", label: "姓名" },
        { prop: "fee", label: "实际缴费" },
        { prop: "aturn", label: "A辅转入" },
        { prop: "bturn", label: "B辅转入" },
        { prop: "oneturn", label: "一对一转入" },
        { prop: "classturn", label: "班课转入" },
        { prop: "total", label: "合计" },
        { prop: "reducefee", label: "优惠/减免" },
        { prop: "daycount", label: "实际天数" },
        { prop: "daylast", label: "剩余天数" },
        { prop: "feefact", label: "实际费用" },
        { prop: "feeover", label: "余额" }
      ],
      // 一对一表头
      studentHeader121: [
        { prop: "grade", label: "年级" },
        { prop: "name", label: "姓名" },
        { prop: "coursename", label: "补习科目" },
        { prop: "fee", label: "实际缴费" },
        { prop: "aturn", label: "A辅转入" },
        { prop: "bturn", label: "B辅转入" },
        { prop: "oneturn", label: "一对一转入" },
        { prop: "classturn", label: "班课转入" },
        { prop: "total", label: "合计" },
        { prop: "reducefee", label: "优惠/减免" },
        { prop: "gitclass", label: "赠课时" },
        { prop: "totalclass", label: "合计课时" },
        { prop: "remark", label: "备注" }
      ],
      // 班课表头
      studentHeaderClassCourse: [
        { prop: "grade", label: "年级" },
        { prop: "name", label: "姓名" },
        { prop: "name", label: "补习科目" },
        { prop: "fee", label: "实际缴费" },
        { prop: "aturn", label: "A辅转入" },
        { prop: "bturn", label: "B辅转入" },
        { prop: "oneturn", label: "一对一转入" },
        { prop: "classturn", label: "班课转入" },
        { prop: "total", label: "合计" },
        { prop: "reducefee", label: "优惠/减免" },
        { prop: "classlast", label: "剩余课时" },
        { prop: "countlast", label: "剩余课次" },
        { prop: "feeover", label: "余额" },
        { prop: "remark", label: "备注" }
      ],
      // 添加费用表单
      form: {
        feeId: '',
        standardId: '',
        studentid: '',
        studentname: '',
        grade: '',
        coursetype: '',
        coursename: '',
        fee: '',
        paytype: '',
        adviser: '',
        aturn: '',
        bturn: '',
        cTurn: '',
        oneturn: '',
        classturn: '',
        total: '',
        reducefee: '',
        daycount: '',
        daylast: '',
        feefact: '',
        feeover: '',
        gitclass: '',
        totalclass: '',
        remark: '',
        classlast: '',
        countlast: '',
      },
      // 转出费用
      formTransfer: {
        to: '',
        data: {}
      },
      // 收费标准表单
      formStandard: {
        standardName: '',
        type: '',
        monthCost: undefined,
        classTimes: undefined,
        dayCost: undefined,
        classCount: undefined,
        hourCost: undefined
      },
      // 添加费用表单规则
      rules: {
        studentid: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 3, max: 10, message: '学号必须为数字,长度在3到10个字符', trigger: 'blur' },
        ],
        // name: [
        //   { required: true, min: 2, max: 10, message: '请输入姓名，长度在2到10之间', trigger: 'blur' }
        // ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' },
        ],
        coursename: [
          { message: '课程不支持特殊字符', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/ },
          { required: true, min: 2, max: 10, message: '请输入课程名，长度在2到10之间', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        paytype: [
          { required: true, message: '请选择类别', trigger: 'change' },
        ],
        aturn: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        bturn: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        oneturn: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        classturn: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        total: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ],
        reducefee: [
          { pattern: /^[+]?(\d+)$|^[+]?(\d+\.\d+)$/, message: '输入值需大于零',trigger: 'blur'}
        ]
      },
      // 获取后台接口数据
      list: [],
      // 数据条数
      total: 100,
      // 收费标准数据
      charges: {
        A: [],
        B: [],
        C: [],
        one2one: [],
        classCourse: []
      },
      // 选中的课程类别
      activeTag: 'A',
      // 收费标准表格高度
      tableHeight: 300,
      // 设置表格可编辑
      disabled: true,
      // 收费标准table_header
      standardHeaderABC: [
        { prop: "standardName", label: "类型" },
        { prop: "monthCost", label: "收费/月" },
        { prop: "classCount", label: "预计上课" },
        { prop: "dayCost", label: "每天费用" },
      ],
      standardHeader121: [
        { prop: "standardName", label: "类型" },
        { prop: "hourCost", label: "收费/h" },
      ],
      standardHeaderCourse: [
        { prop: "standardName", label: "类型" },
        { prop: "monthCost", label: "收费标准" },
        { prop: "classCount", label: "课次" },
        { prop: "classTimes", label: "课时" },
        { prop: "hourCost", label: "课时费/h" },
      ]
    }
  },
  created() {
    this.getList()
    this.getStandard()
  },
  methods: {
    // 获取后端传过来的数据
    getList() {
    },
    getListByName(){
      apiGetStudentFeeList({
        studentName: this.queryInfo.name,
        courseType: this.activeName,
        currentPage: this.queryInfo.pageNumber})
      .then(res => {
        console.log(res);
        if (res.total > 0) {
          handleAlert()
          this.list = res.records;
        }
      })
    },
    // 获取收费标准
    getStandard() {
      apiGetStandardList({page: this.standardInfo.pageNumber, type: this.activeName})
      .then(res => {
        console.log(res);
        if (res.records.length > 0) {
          this.charges = {
            A: [],
            B: [],
            C: [],
            one2one: [],
            classCourse: []
          }
          for (let item of res.records) {
            if (item.type === 'A辅') {
              this.charges.A.push(item)
            } else if (item.type === 'B辅') {
              this.charges.B.push(item)
            } else if (item.type === 'C辅') {
              this.charges.C.push(item)
            } else if (item.type === '一对一') {
              this.charges.one2one.push(item)
            } else if (item.type === '班课') {
              this.charges.classCourse.push(item)
            }
          }
        }
      })
    },
    // 分页获取页码
    handleCurrentChange(e) {
      this.queryInfo.pageNumber = e
      this.getList(this.activeName)
    },
    // 收费标准分页
    handlePageChange(e) {
      this.standardInfo.pageNumber = e
      this.getStandard()
    },
    //
    // 确定提交
    upload() {
      if (this.standardTitle === '添加收费标准') {
        console.log(this.formStandard);
        // 调用添加收费标准接口
        this.standardDialogVisible = false;
        apiAddStandard(this.formStandard)
          .then(res => {
            console.log(res);
            if (res === 1) {
              handleAlert()
              this.getStandard()
            } else {
              handleAlert('添加失败', 'warning')
            }
          })
      }
      if (this.standardTitle === '修改收费标准') {
        console.log(this.formStandard);

        // 调用修改收费标准接口
        apiUpdateStandard(this.formStandard)
          .then(res => {
            console.log(res);
          })
        this.standardDialogVisible = false;
        handleAlert()
      }

      if (this.title === '添加费用') {
        // 表单校验
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            // 调用添加费用接口
            console.log("添加费用")
            console.log(this.form);
            apiAddStudentFee(this.form)
              .then(res => {
              })

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else if (this.title === '修改费用') {
        // 表单校验
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.ratesDialogVisible = false;
            // 调用修改用户接口

            this.dialogVisible = false
            handleAlert()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      } else {// 转出费用
        this.transferVisible = false;
        // 调用转出费用接口
        apiTurnStudentFee()
      }
    },
    // 关闭弹框
    onclose() {
      this.dialogVisible = false;
      this.ratesDialogVisible = false;
      this.transferVisible = false;
      handleAlert('操作已取消', 'info')
    },
    standardClose() {
      this.standardDialogVisible = false;
      handleAlert('操作已取消', 'info')
    },
    // 收费标准
    addRates() {
      this.getStandard();
      this.ratesDialogVisible = true
    },

    // 增加用户弹窗
    addFinance() {
      this.title = '添加费用'
      this.dialogVisible = true
    },

    // 修改费用弹框
    showEditDialog(data) {
      this.title = '修改费用'
      this.dialogVisible = true
      this.form = data
      // console.log(id)
    },
    // 修改收费标准弹窗
    showStandardEditDialog(data) {
      this.standardTitle = '修改收费标准';
      this.standardDialogVisible = true;
      this.formStandard = data
    },
    //转出费用弹窗
    showTransferDialog(data) {
      this.transferVisible = true;
      // 将选中的数据赋给data
      this.formTransfer.data = data;
    },
    // 根据id删除用户信息
    removeUserById(id) {
      const res = handleConfirm('此操作将永久删除该费用,是否继续?', 'warning', '提示')
        .then(() => {
          // 调用接口完成删除用户操作
          console.log(id);
          handleAlert()
        })
        .catch(() => {
          handleAlert('已取消删除', 'info')
        })
      console.log(res)
    },
    // 把form中的数据重置
    onreset() {
      const form = {
        type: '',
        standardId: '',
        studentid: '',
        name: '',
        grade: '',
        coursename: '',
        fee: '',
        paytype: '',
        adviser: '',
        aturn: '',
        bturn: '',
        oneturn: '',
        classturn: '',
        total: '',
        reducefee: '',
        daycount: '',
        daylast: '',
        cost: '',
        feeover: '',
        gitclass: '',
        totalclass: '',
        remark: '',
        classlast: '',
        countlast: '',
      }
      this.form = form;
      const formStandard = {
        standardName: '',
        type: '',
        monthCost: undefined,
        classTimes: undefined,
        dayCost: undefined,
        classCount: undefined,
        hourCost: undefined
      }
      this.formStandard = formStandard;
    },
    /**
    * @Description: tab标签点击事件,修改活跃tag
    * @author oldMe
    * @date 2021/4/22
    */
    tabClick(tab) {
      const name = tab.$options.propsData.name;
      if (name === 'A辅') {
        this.activeTag = 'A'
      } else if (name === 'B辅') {
        this.activeTag = 'B'
      } else if (name === 'C辅') {
        this.activeTag = 'C'
      } else if (name === '一对一') {
        this.activeTag = 'one2one'
      } else {
        this.activeTag = 'classCourse'
      }
      this.getStandard();
    },
    /**
    * @Description: 增加新的收费标准
    * @author oldMe
    * @date 2021/4/22
    */
    addNewStandard() {
      // this.charges[this.activeTag].push({})
      this.standardTitle = '添加收费标准'
      this.standardDialogVisible = true;
    },

    /**
    * @Description: 删除收费标准
    * @author oldMe
    * @date 2021/4/22
    */
    deleteStandard(row) {
      // row 包含index和行信息row
      handleConfirm('此操作将永久删除该收费标准信息, 是否继续?', 'warning', '提示')
        .then(() => {
          console.log(row);
          const standardId = row.standardid + '';
          // 调用收费标准删除接口
          apiRemoveStandard(standardId)
            .then(res => {
              console.log(res);
              handleAlert('删除成功', 'success')
              this.getStandard()
            })

        }).catch(err => {
        handleAlert('已取消删除','info')
        console.log(err);
      })
    },
  },
  mounted() {
  },
  watch: {
    activeName: {
      handler(val) {
        this.getList(this.activeName)
        // console.log(val)
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

  .main {
    border: 1px solid rgb(226, 219, 219);
    overflow: hidden;
  }
}

.content {
  display: flex;
  flex-direction: row;

  li {
    flex: 1;
    border: 1px solid rgb(226, 219, 219);
    display: flex;
    flex-direction: column;
    height: 50px;

    input {
      border: 0;
      text-align: center;
      color: rgb(111, 109, 109);
      border-top: 1px solid rgb(226, 219, 219);
    }
  }
}

.el-row {
  margin-bottom: 0px;

  .el-form-item {
    margin-bottom: 0px;
  }
}

.bottom {
  justify-content: center;
}

.el-table {
  margin-top: 0px;
}

/*  .box-card {
    width: 480px;
} */
</style>
