<template>
  <div id="ImportData">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="ctrl-bar">
          <a-button icon="upload" @click="importTable">导入</a-button>
          <a href="/自定义回收量导入模板.xlsx" download="自定义回收量导入模板.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="站点名称" data-index="garbage_house" align="center" :ellipsis="true" />
            <a-table-column title="月份" data-index="month" align="center" :ellipsis="true" />
            <a-table-column title="塑料" data-index="plastic" align="center" :ellipsis="true" />
            <a-table-column title="金属" data-index="metal" align="center" :ellipsis="true" />
            <a-table-column title="纸类" data-index="paper" align="center" :ellipsis="true" />
            <a-table-column title="玻璃" data-index="glass" align="center" :ellipsis="true" />
            <a-table-column title="织物" data-index="textile" align="center" :ellipsis="true" />
            <a-table-column title="数码" data-index="digitals" align="center" :ellipsis="true" />
            <a-table-column title="电器" data-index="electrics" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" fixed="right" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList(page)" />
          </div>
        </a-space>
      </div>
    </a-space>
    <!-- 编辑弹窗   -->
    <a-modal title="编辑" :visible="editVisible" :confirm-loading="editLoading" :maskClosable="false" destroyOnClose @ok="editHandleOk" @cancel="editHandleCancel">
      <a-form-model ref="ruleForm" :model="editForm" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="weight" label="站点名称：" prop="weight" has-feedback>
          <a-input class="w80b" disabled v-model="editForm.garbage_house" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="month" label="月份：" prop="month" has-feedback>
          <a-select v-model="editForm.month" :options="$com.monthList()" placeholder="请选择月份" class="w80b"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="weight" label="塑料：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.plastic" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="金属：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.metal" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="纸类：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.paper" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="玻璃：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.glass" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="织物：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.textile" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="数码：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.digitals" placeholder="请输入" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="电器：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="editForm.electrics" placeholder="请输入" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 导入 -->
    <a-modal title="导入" :visible="visible" :confirm-loading="loading" @cancel="handleCancel">
      <a-form-model ref="form" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="garbage_house_id" label="站点名称" prop="garbage_house_id" has-feedback>
          <a-select v-model="form.garbage_house_id" :options="garbagehouseOptions" placeholder="请选择站点" class="w200" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="file" label="上传数据" prop="file" has-feedback>
          <a-upload name="file" :action="$com.importRecycleData(form.garbage_house_id)" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button type="primary">选择Excel文件</a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "ImportData",
  data() {
    return {
      selectedRowKeys: [],
      delLoading: false,
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      tableLoading: false,
      page: 1,
      total: 0,

      dataSource: [],
      garbagehouseOptions: [],
      form: {
        garbage_house_id: undefined,
        file: undefined
      },

      visible: false,
      loading: false,

      editVisible: false,
      editLoading: false,
      editForm: {
        garbage_house_id: undefined,
        month: undefined,
        plastic: 0,
        glass: 0,
        paper: 0,
        metal: 0,
        textile: 0,
        electrics: 0,
        digitals: 0
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    this.getTableList(1)
    this.getGarbagehouseList()
  },
  methods: {
    //   站点下拉
    getGarbagehouseList() {
      this.$api.getGarbagehouseList().then(res => {
        this.garbagehouseOptions = res.data.map(item => {
          item.label = item.house_name
          item.value = item.id
          return item
        })
      })
    },
    getTableList(page) {
      let data = {
        page
      }
      this.tableLoading = true
      this.$api
        .getRecycleList(data)
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })
          this.tableLoading = false
          this.total = res.data.total
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 表格删除
    deleteListData() {
      let that = this
      let _page = that.selectedRowKeys.length === that.dataSource.length && that.page > 1 ? that.page - 1 : that.page
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delRecycleData({ ids: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              that.getTableList(_page)
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    importTable() {
      this.visible = true
      this.form = {
        garbage_house_id: undefined,
        file: undefined
      }
    },
    //上传文件 导入
    uploadFile(info) {
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 文件上传成功！`)
        this.getTableList()
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.msg)
          return info.file.response.msg
        }
      }
      if (this.form.garbage_house_id == undefined) {
        this.$message.error("请先选择站点")
        return false
      }
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    // 编辑
    edit(e) {
      this.editForm = {}
      this.editForm = this.$utils.deepCopy(e)
      this.$validator.resetFields(this)
      this.editVisible = true
    },
    // 弹窗确定
    editHandleOk: utils.debounce(function() {
      this.$api.putRecycleData(this.editForm, this.id).then(res => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.editVisible = false
          this.getTableList()
          this.editForm = {}
        } else {
          this.$message.info(res.msg)
        }
      })
    }, 1000),
    // 弹窗取消
    editHandleCancel() {
      this.editVisible = false
    }
  }
}
</script>

<style lang="less">
// #ImportData {
// }
</style>
