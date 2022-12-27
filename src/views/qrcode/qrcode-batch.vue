<template>
  <div class="BarCodeManagement">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="fl mb10" size="middle">
          <div>
            <span>批次号：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <div>
            <span>是否导出：</span>
            <div class="dib"><a-select v-model="filter.isExport" :options="options" placeholder="请选择是否导出" style="width: 213px;" allowClear /></div>
          </div>
          <div>
            <span>导出时间：</span>
            <div class="dib"><a-range-picker v-model="dateString" @change="onChange" style="width: 213px;" /></div>
          </div>
          <!-- </div><a-date-picker v-model="filter.exportTime" placeholder="请选择出库时间" class="w100b" allowClear /> -->
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" icon="plus" @click="operation('add')">新增</a-button>
        </a-space>
      </div>

      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-space class="w100b">
            <a-button type="primary" :disabled="!hasSelected" :loading="delLoading" @click="exportQrcode">导出</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column key="batch_num" title="批次号" align="center" :width="150" fixed="left" :ellipsis="true">
              <template slot-scope="text, record">
                <span>
                  <a-button type="link" @click="operation('qcodelist', record)">{{ record.batch_num }}</a-button>
                </span>
              </template>
            </a-table-column>
            <a-table-column title="二维码数量" data-index="qr_no_num" align="center" :ellipsis="true" />
            <a-table-column title="垃圾袋数量" data-index="bag_number" align="center" :ellipsis="true" />
            <a-table-column title="垃圾袋类型" data-index="type" align="center" :ellipsis="true" />
            <a-table-column title="是否导出" data-index="is_export_text" align="center" :ellipsis="true" />
            <a-table-column title="导出时间" data-index="export_time" align="center" :ellipsis="true" />
            <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="operationTitle" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="400">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="qr_no_num" label="编码数量" prop="qr_no_num" has-feedback>
          <a-input-number v-model="form.qr_no_num" placeholder="请输入编码数量" class="w60b" allowClear />
        </a-form-model-item>
        <a-form-model-item label="垃圾袋类型">
          可回收垃圾袋
        </a-form-model-item>
        <a-form-model-item ref="bag_number" label="垃圾袋数量" prop="bag_number">
          <a-input-number v-model="form.bag_number" placeholder="请输入垃圾袋数量" class="w60b" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "BarCodeManagement",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        batchNo: "",
        isExport: undefined
      },
      dateString: [],
      report_time_start: "",
      report_time_end: "",
      options: [
        { value: 2, label: "是" },
        { value: 1, label: "否" }
      ],
      operationTitle: "新增",

      form: {
        qr_no_num: 0,
        bag_number: 0
      },
      operationVisible: false, // 新增/编辑对话框显示隐藏
      operationLoading: false, // 新增/编辑对话框加载状态
      rules: {
        qr_no_num: [{ required: true, message: "请输入二维码数量", trigger: "blur" }],
        bag_number: [{ required: true, message: "请输入垃圾袋数量", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getTableList(1)
  },

  methods: {
    // 搜索表格内容
    getTableList(page) {
      if (page) this.page = page
      console.log("this.filter", this.filter)
      this.filter.page = this.page
      this.tableLoading = true
      let data = {
        is_batch: 1,
        batch_num: this.filter.batchNo,
        is_export: this.filter.isExport == undefined ? "" : this.filter.isExport,
        report_time_start: this.report_time_start,
        report_time_end: this.report_time_end
      }
      this.$api.qrcodeList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.batch_num
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    onChange(date, dateString) {
      this.report_time_start = dateString[0]
      this.report_time_end = dateString[1]
    },
    // 批量导出
    exportQrcode() {
      let batch_nums = this.selectedRowKeys.length > 0 ? this.selectedRowKeys.join(",") : ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}admin/v1/qrcode/export?token=${token}&batch_nums=${batch_nums}`)
    },
    // 新增
    operation(type, item) {
      this.clearOperation()
      if (type === "qcodelist") {
        // console.log('item', item)
        this.$router.push({ name: "QRCodeBatchDetail", query: { no: item.batch_num } })
      }
      this.type = type
      this.operationVisible = true
      this.$validator.resetFields(this)
    },

    // 新增二维码批次
    operationOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.createBatchQrcode(this.form).then(res => {
            this.getTableList()
            this.$message.success(res.msg)
            this.operationVisible = false
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },

    // 清除新增/编辑数据缓存
    clearOperation() {
      this.form = {
        qr_no_num: 0,
        bag_num: 0
      }
    }
  }
}
</script>

<style scoped></style>
