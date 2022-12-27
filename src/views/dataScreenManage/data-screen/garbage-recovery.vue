<template>
  <div id="DataScreenGarbageRecovery">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="ctrl-bar">
          <a-upload name="file" :action="$com.importGarbageRecovery()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/垃圾月度回收模拟数据导入模版.xlsx" download="垃圾月度回收模拟数据导入模版.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="month" title="月份" data-index="month" align="center" :ellipsis="true" />
            <a-table-column key="weight" title="回收总量（t）" data-index="weight" align="center" :ellipsis="true" />
            <a-table-column key="recycleRate" title="回收率" data-index="recycleRate" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.recycleRate }}%</span>
              </template>
            </a-table-column>
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
    <!-- 编辑弹窗   -->
    <a-modal title="编辑" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="month" label="月份：" prop="month" has-feedback>
          <a-select v-model="form.month" :options="$com.monthList()" placeholder="请选择月份" class="w80b"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="weight" label="回收总量：" prop="weight" has-feedback>
          <a-input class="w80b" v-model="form.weight" :maxLength="maxLength" placeholder="请输入回收总量" @change="changeWeight" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="recycleRate" label="回收率：" prop="recycleRate" has-feedback>
          <a-input-number class="w80b" v-model="form.recycleRate" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "DataScreenGarbageRecovery",
  components: {},
  data() {
    return {
      maxLength: 13,
      maxValue: "9999999999.99", //输入框能输入的最大值，用来检验
      selectedRowKeys: [],
      delLoading: false,
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      //弹窗相关
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        month: "",
        recycleRate: "",
        weight: ""
      },
      id: "",
      rules: {
        user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    changeWeight(e) {
      if (String(this.form.weight).includes(".")) {
        let numDian = this.form.weight.toString().split(".")[1].length
        if (numDian > 2) {
          let dotIndex = this.form.weight.indexOf(".")
          this.form.weight = this.form.weight.substring(0, dotIndex + 3)
        }
      }
      if (Number(this.form.weight) > Number(this.maxValue)) {
        this.$message.error("已超过最大值，请重新输入!")
      }
    },
    // 删除
    deleteListData() {
      let that = this
      let _page = that.selectedRowKeys.length === that.dataSource.length && that.page > 1 ? that.page - 1 : that.page
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delTrashRecycleSimulate({ id: that.selectedRowKeys })
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
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取居民信息列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page
      }
      this.tableLoading = true
      this.$api.getTrashRecycleSimulate(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },

    //上传文件 导入
    uploadFile(info) {
      if (info.file.status === "done") {
        this.getTableList()
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.msg)
          return info.file.response.msg
        }
      }
    },

    // 编辑
    edit(e) {
      this.form = {}
      this.form = this.$utils.deepCopy(e)
      this.$validator.resetFields(this)
      this.visible = true
    },
    // 弹窗确定
    handleOk: utils.debounce(function() {
      this.$api.putTrashRecycleSimulate(this.form, this.id).then(res => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.visible = false
          this.getTableList()
          this.form = {}
        } else {
          this.$message.info(res.msg)
        }
      })
    }, 1000),
    // 弹窗取消
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less"></style>
