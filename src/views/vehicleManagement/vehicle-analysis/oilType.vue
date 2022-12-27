<template>
  <div id="ExchangeDetails">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
      <a-button type="primary" @click="popModal('add')">新增</a-button>
    </a-space>
    <div class="line"></div>
    <a-col>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="getOilList" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="type" title="品类" data-index="type" align="center" :ellipsis="true" />
          <a-table-column key="number" title="油型" data-index="number" align="center" :ellipsis="true" />
          <a-table-column title="操作" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="popModal('edit', record)">编辑</a-button><a-button type="link" size="small" @click="popModal('del', record)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="exchangePage" :page-size="10" show-quick-jumper :default-current="1" :total="exchangeTotal" @change="getOilTypeData()" />
        </div>
      </a-space>
    </a-col>
    <!-- 编辑弹窗   -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="total_integral" label="品类：" prop="total_integral" has-feedback>
          <a-radio-group v-model="form.type">
            <a-radio :value="key + 1" v-for="(item, key) in oilTypeList" :key="key">{{ item.typeName }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="integral" label="油型" prop="integral" has-feedback>
          <a-select v-model="oilType" class="item" :options="oilTypeList[form.type - 1].list" :placeholder="'请选择' + oilTypeList[form.type - 1].typeName + '油型'" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "ExchangeDetails",
  data() {
    return {
      modelTitle: "",
      visible: false,
      confirmLoading: false,
      data: [],
      getOilList: [], //兑换记录表格
      tableLoading: false,
      // tableLoading2: false,
      exchangePage: 1,
      exchangeTotal: 0,
      pageNum: 1,
      oilType: undefined,
      oilTypeList: [
        { typeName: "汽油", list: [] },
        { typeName: "柴油", list: [] }
      ],
      form: {
        type: 1,
        total_integral: "",
        exchange_integrals: "",
        integral: "",
        reason: ""
      }
    }
  },
  props: {
    query: Object,
    params: Object
  },
  created() {
    this.id = this.query.id || ""
    this.getTableList()
    this.getOilType(1)
    this.getOilType(2)
    // this.$api.viewCustomerInformation({ id: this.id }).then(res => {
    //   this.data = res.data
    // })
    // this.exchangeList()
  },
  watch: {
    "form.type": function(val) {
      this.oilType = undefined
    }
  },
  methods: {
    // 编辑
    edit(record) {
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.viewICManagement({ id: record.id }).then(res => {
        this.form.card_number = res.data.card_number
        this.form.user_name = res.data.user_name
        this.form.phone = res.data.phone
        this.form.state = res.data.state_text === "正常" ? 1 : 0
        this.form.id = res.data.id
        this.$api.getUserInfoDetail({ user_name: this.form.user_name }).then(res => {
          if (res.data.length > 0) {
            this.userNameData = res.data
            this.form.user_name_id = res.data[0].id
          } else {
            this.userNameData = []
            this.form.user_name_id = undefined
          }
        })
      })
    },
    // 修改
    handleOk() {
      if (this.editType === "edit") {
        this.$api.alterOilType({ id: this.form.id, oilTypeId: this.oilType }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.visible = false
            this.getTableList()
          }
        })
      } else {
        this.$api.addOilType({ oilTypeId: this.oilType }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.visible = false
            this.getTableList()
          }
        })
      }
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    popModal(type, record) {
      let _this = this
      this.editType = type
      this.form.id = record && record.id
      if (type === "add") {
        this.modelTitle = "新增"
        this.visible = true
      } else if (type === "edit") {
        this.modelTitle = "编辑"
        this.form.type = record.type === "汽油" ? 1 : 2
        this.oilType = undefined
        this.oilTypeList[this.form.type - 1].list.forEach(e => {
          if (e.label === record.number) {
            this.oilType = e.value
          }
        })

        this.visible = true
      } else if (type === "del") {
        this.$confirm({
          title: "请确认",
          content: "确定删除该内容吗?",
          onOk() {
            _this.$api.deleteOilType({ id: _this.form.id }).then(res => {
              _this.$message.info(res.msg)
              _this.visible = false
              _this.getTableList()
            })
          },
          onCancel() {
            _this.$message.info("已取消")
          }
        })
      }
    },
    back() {
      this.$router.go(-1)
    },
    getTableList() {
      this.tableLoading = true
      this.$api.getOilTypeData({ pageNum: this.pageNum }).then(res => {
        this.getOilList = res.data.data
        this.tableLoading = false
        this.exchangeTotal = res.data.total
      })
    },
    getOilType(key) {
      this.$api.getOilType({ type: key }).then(res => {
        this.oilTypeList[key - 1].list = []
        res.data.filter(e => {
          this.oilTypeList[key - 1].list.push({ label: e.number, value: e.id })
        })
      })
    },
    // 获取兑换记录
    recordExport() {}
  }
}
</script>

<style lang="less">
#ExchangeDetails {
  .line {
    width: 100%;
    height: 1px;
    background: #bdbdbd;
  }
}
form .item {
  width: 200px;
}
</style>
