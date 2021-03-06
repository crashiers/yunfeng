<template>
  <div class="app-container">
    <!--搜索模块-->
    <div class="filter-container">
      <el-input
        v-model="filters.keyWord"
        placeholder="请输入关键词"
        style="width: 200px;"
        class="filter-item el-input--small"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item el-button--small"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item el-button--small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item el-button--small"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
    </div>

    <!--主列表模块-->
    <lgTable
      columns-type="index"
      columns-label="序号"
      :list="list"
      :total-list="total"
      :lg-thead="tableAttr.thead"
      :lg-buttons="tableAttr.buttons"
      @operationEvent0="operationEvent0"
      @operationEvent1="operationEvent1"
      @operationEvent2="operationEvent2"
      @operationEvent3="operationEvent3"
      @initListQuery="initListQuery"
      @getListByPagination="getListByPagination"
    />
    <!--编辑新增弹出框-->
    <lgDialog
      :title="textMap[dialogTitle]"
      :visible="dialogFormVisible"
      width="500px"
      :show-form="true"
      form-ref="dataForm"
      :form-rules="rules"
      label-width="70px"
      :value="templateForm"
      @on-submit="dialogTitle === 'create' ? createData() : updateData()"
      @on-close="onClose"
    >
      <template slot="form">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="templateForm.name" />
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="templateForm.nick" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="templateForm.status" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </template>
    </lgDialog>
  </div>
</template>

<script>
import { list, createOrUpdate, remove } from '@/api/common'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import lgTable from '@/views/components/lgTable'
import lgDialog from '@/views/components/lgDialog'

// 默认表单
const defaultForm = {
  id: null
}
export default {
  components: { lgTable, lgDialog },
  directives: { waves },
  data() {
    return {
      // 公共接口地址
      apiUri: 'user',
      // 表格列表
      list: [],
      // 表格总条数
      total: 0,
      // 页数、条数
      listQuery: {
        current: 1,
        pageSize: 10
      },
      // 过滤条件
      filters: {
        keyWord: ''
      },
      statusOptions: [{
        key: 0,
        display_name: '禁用'
      },
      {
        key: 1,
        display_name: '启用'
      }],
      // 表格属性
      tableAttr: {
        // 表头
        thead: [
          {
            label: 'name',
            text: '用户名',
            width: 100
          }
        ],
        // 操作按钮
        buttons: {
          status: true, // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
          width: 300, // 表格操作列的宽度
          operation: { // 操作按钮配置
            0: [{
              name: 'editor',
              text: '编辑',
              id: 0,
              type: 'primary'
            },
            {
              name: 'enable',
              text: '启用',
              id: 1,
              type: 'success'
            },
            {
              name: 'delete',
              text: '删除',
              id: 3,
              type: 'danger'
            }],
            1: [{
              name: 'editor',
              text: '编辑',
              id: 0,
              type: 'primary'
            }, {
              name: 'disable',
              text: '禁用',
              id: 2,
              type: ''
            },
            {
              name: 'delete',
              text: '删除',
              id: 3,
              type: 'danger'
            }]
          }
        }
      },
      // 弹窗显示隐藏
      dialogFormVisible: false,
      // 弹窗提示语
      dialogTitle: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 表单
      templateForm: Object.assign({}, defaultForm),
      // 表单校验
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    // 初始化页数与条数
    initListQuery(listQuery) {
      this.listQuery = listQuery
    },
    // 分页操作
    getListByPagination(listQuery) {
      this.listQuery = listQuery
      this.getList()
    },
    // 过滤列表
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 获取列表
    getList() {
      const params = Object.assign({}, this.listQuery, this.filters)
      list(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.list = res.list
          this.total = res.total
        }
      })
    },
    // 编辑
    operationEvent0(row) {
      this.templateForm = Object.assign({}, row) // copy obj
      this.dialogTitle = 'update'
      this.dialogFormVisible = true
    },
    // 启用
    operationEvent1(row) {
      const params = {
        id: row.id,
        status: 1
      }
      createOrUpdate(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '启用成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 禁用
    operationEvent2(row) {
      const params = {
        id: row.id,
        status: 0
      }
      createOrUpdate(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '禁用成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 删除
    operationEvent3(row) {
      remove(row.id).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 添加
    handleCreate() {
      this.resetForm()
      this.dialogTitle = 'create'
      this.dialogFormVisible = true
    },
    // 添加提交
    createData() {
      const data = Object.assign({}, this.templateForm)
      createOrUpdate(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 编辑提交
    updateData() {
      const data = Object.assign({}, this.templateForm)
      createOrUpdate(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 关闭弹窗
    onClose() {
      this.dialogFormVisible = false
    },
    // 清空弹框表单
    resetForm() {
      this.templateForm = Object.assign({}, defaultForm)
    },
    // 导出表单
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = []
        const filterVal = []
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 导出表单数据格式处理
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

