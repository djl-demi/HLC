<template>
  <div id="DataScreenRecyclableLaunch">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="ctrl-bar">
          <a-upload name="file" :action="$com.importRecyclableLaunch()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/小区回收物投放量以及注册率模拟数据导入模板.xlsx" download="小区回收物投放量以及注册率模拟数据导入模板.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="name" title="小区名称" data-index="name" align="center" :ellipsis="true" />
            <a-table-column key="recycleWeight" title="可回收物投放量（kg）" data-index="recycleWeight" align="center" :ellipsis="true" />
            <a-table-column key="allWeight" title="回收垃圾量（kg）" data-index="allWeight" align="center" :ellipsis="true" />
            <a-table-column key="rate" title="注册率" data-index="rate" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span type="danger" size="small">{{ record.rate }}%</span>
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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="name" label="小区名称：" prop="name" has-feedback>
          <a-input class="w80b" disabled v-model="form.name" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="recycleWeight" label="可回收物投放量：" prop="recycleWeight" has-feedback>
          <a-input class="w80b" :maxLength="maxLength" @change="changeRecycleWeight" v-model="form.recycleWeight" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="allWeight" label="回收垃圾量：" prop="allWeight" has-feedback>
          <a-input class="w80b" :maxLength="maxLength" @change="changeAllWeight" v-model="form.allWeight" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="rate" label="注册率：" prop="rate" has-feedback>
          <a-input-number class="w80b" v-model="form.rate" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import utils from "@/utils/utils"
export default {
  name: "DataScreenRecyclableLaunch",
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
      tyepOptions: [{}],
      //弹窗相关
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        name: "",
        recycleWeight: "",
        rate: 0,
        allWeight: ""
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
    changeRecycleWeight(e) {
      if (String(this.form.recycleWeight).includes(".")) {
        let numDian = this.form.recycleWeight.toString().split(".")[1].length
        if (numDian > 2) {
          let dotIndex = this.form.recycleWeight.indexOf(".")
          this.form.recycleWeight = this.form.recycleWeight.substring(0, dotIndex + 3)
        }
      }
      if (Number(this.form.recycleWeight) > Number(this.maxValue)) {
        this.$message.error("已超过最大值，请重新输入!")
      }
    },
    changeAllWeight(e) {
      if (String(this.form.allWeight).includes(".")) {
        let numDian = this.form.allWeight.toString().split(".")[1].length
        if (numDian > 2) {
          let dotIndex = this.form.allWeight.indexOf(".")
          this.form.allWeight = this.form.allWeight.substring(0, dotIndex + 3)
        }
      }
      if (Number(this.form.allWeight) > Number(this.maxValue)) {
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
            .delCommunitySimulate({ id: that.selectedRowKeys })
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
      this.$api.getCommunitySimulate(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 下载
    downloadBtn() {
      this.$utils.download("api/bid/communitySimulate/importUpload", {}, `回收量变化情况模板_${new Date().getTime()}.xlsx`)
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
      this.$api.putCommunitySimulate(this.form, this.id).then(res => {
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
