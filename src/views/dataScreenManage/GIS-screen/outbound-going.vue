<template>
  <div id="GISScreenOutboundGoing">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="ctrl-bar">
          <a-upload name="file" :action="$com.importOutboundGoing()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/可回收物出库情况模拟数据导入模版.xlsx" download="可回收物出库情况模拟数据导入模版.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="name" title="出库终点名称" data-index="name" align="center" :ellipsis="true" />
            <a-table-column key="goodsType" title="物品类型" data-index="goodsType" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ { 1: "可回收物 ", 2: "金属" }[record.goodsType] }}</span>
              </template>
            </a-table-column>
            <a-table-column key="type" title="类型" data-index="type" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ { 1: "今日 ", 2: "本周", 3: "本月", 4: "全年" }[record.type] }}</span>
              </template>
            </a-table-column>
            <a-table-column key="weight" title="物品重量（kg）" data-index="weight" align="center" :ellipsis="true" />
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
        <a-form-model-item ref="name" label="出库终点名称：" prop="name" has-feedback>
          <a-input class="w80b" disabled v-model="form.name" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="goodsType" label="物品类型：" prop="goodsType" has-feedback>
          <a-select class="w80b" v-model="form.goodsType" :options="goodsOptions" placeholder="请选择"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="type" label="类型：" prop="type" has-feedback>
          <a-select v-model="form.type" :options="tyepOptions" placeholder="请选择" class="w80b"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="weight" label="物品重量：" prop="weight" has-feedback>
          <a-input class="w80b" :maxLength="maxLength" @change="changeWeight" v-model="form.weight" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "GISScreenOutboundGoing",
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
      tyepOptions: [
        { value: 1, label: "今日" },
        { value: 2, label: "本周" },
        { value: 3, label: "本月" },
        { value: 4, label: "全年" }
      ],
      goodsOptions: [
        { value: 1, label: "可回收物" },
        { value: 2, label: "金属" }
      ],
      //弹窗相关
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        recycleDate: "",
        recycleCount: ""
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
    // 获取列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page
      }
      this.tableLoading = true
      this.$api.getRecycleOutSimulate(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
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
            .delRecycleOutSimulate({ id: that.selectedRowKeys })
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
    // 下载
    downloadBtn() {
      this.$utils.download("api/bid/recycleOutSimulate/importUpload", {}, `可回收物出库情况和去向模板_${new Date().getTime()}.xlsx`)
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
      this.$api.putRecycleOutSimulate(this.form, this.id).then(res => {
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
