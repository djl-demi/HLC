<template>
  <div id="DataScreenRecoveryChange">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="ctrl-bar">
          <a-upload name="file" :action="$com.importRecoveryChange()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/回收量变化情况模拟数据导入模版.xlsx" download="回收量变化情况模拟数据导入模版.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="rate" title="同比" data-index="rate" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.rate }}%</span>
              </template>
            </a-table-column>
            <a-table-column key="ratio" title="环比" data-index="ratio" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.ratio }}%</span>
              </template>
            </a-table-column>
            <a-table-column key="goodsType" title="物品" data-index="goodsType" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ { 1: "可回收物 ", 2: "有害垃圾" }[record.goodsType] }}</span>
              </template>
            </a-table-column>
            <a-table-column key="type" title="类型" data-index="type" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ { 1: "今日 ", 2: "本周", 3: "本月" }[record.type] }}</span>
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
        <a-form-model-item ref="type" label="类型：" prop="type" has-feedback>
          <a-select v-model="form.type" :options="tyepOptions" placeholder="请选择" class="w80b"> </a-select>
        </a-form-model-item>
        <a-form-model-item ref="rate" label="同比：" prop="rate" has-feedback>
          <a-input-number class="w80b" v-model="form.rate" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="ratio" label="环比：" prop="ratio" has-feedback>
          <a-input-number class="w80b" v-model="form.ratio" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="goodsType" label="物品类型：" prop="goodsType" has-feedback>
          <a-select v-model="form.goodsType" :options="goodsOptions" placeholder="请选择" class="w80b"> </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "DataScreenRecoveryChange",
  components: {},
  data() {
    return {
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
        { value: 3, label: "本月" }
      ],
      goodsOptions: [
        { value: 1, label: "可回收物" },
        { value: 2, label: "有害垃圾" }
      ],
      //弹窗相关
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        type: undefined,
        goodsType: undefined,
        rate: 0,
        ratio: 0
      },
      id: "",
      rules: {}
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
            .delRecycleSimulate({ id: that.selectedRowKeys })
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
    // 获取列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page
      }
      this.tableLoading = true
      this.$api.getRecycleSimulate(data).then(res => {
        const dataSource = res.data.data.map(item => {
          // item.type = item.type == 1 ? "今日" : item.type == 2 ? "本周" : "本月"
          // item.goodsType = item.goodsType == 1 ? "可回收物" : "有害垃圾"
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
      console.log(e, "bbbbb")
      this.form = {}
      this.form = this.$utils.deepCopy(e)
      this.$validator.resetFields(this)
      this.visible = true
    },
    // 弹窗确定
    handleOk: utils.debounce(function() {
      this.$api.putRecycleSimulate(this.form, this.id).then(res => {
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
