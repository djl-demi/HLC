<template>
  <div id="ExchangeDetails">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
      <a-button type="primary" @click="popModal('add')">新增</a-button>
    </a-space>
    <div class="line"></div>
    <a-col>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="exchangeData" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="create_time" title="品类" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="type_text" title="油型" data-index="type_text" align="center" :ellipsis="true" />
          <a-table-column title="操作" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button><a-button type="link" size="small" @click="del(record)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="exchangePage" :page-size="5" show-quick-jumper :default-current="1" :total="exchangeTotal" @change="exchangeCustomerInfo()" />
        </div>
      </a-space>
    </a-col>
    <!-- 编辑弹窗   -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="total_integral" label="品类：" prop="total_integral" has-feedback>
          <a-radio-group v-model="form.card_type">
            <a-radio :value="0">汽油</a-radio>
            <a-radio :value="1">柴油</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="integral" label="油型" prop="integral" has-feedback>
          <a-select v-model="oilType" style="width:213px" :options="oilTypeList" placeholder="请选择加油工" allowClear />
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
      exchangeData: [{ create_time: "2021-01-10" }], //兑换记录表格
      tableLoading: false,
      // tableLoading2: false,
      exchangeTotal: 1,
      exchangePage: 1,
      oilType: undefined,
      oilTypeList: [],
      form: {
        card_type: 1,
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
    // this.$api.viewCustomerInformation({ id: this.id }).then(res => {
    //   this.data = res.data
    // })
    // this.exchangeList()
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
      this.$api.updateintegral(this.form).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.visible = false
          this.getTableList()
        }
      })
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    popModal(type) {
      if (type === "add") {
        this.modelTitle = "新增"
        this.visible = true
      }
    },
    back() {
      this.$router.go(-1)
    },
    exchangeList() {
      this.tableLoading = true
      this.$api.exchangeCustomerInfo({ user_id: this.id, page: this.orderPage }).then(res => {
        res.data.integral_exchange.data.map(item => {
          item.exchange_detail.map(iitem => {
            iitem.state_text = item.state_text
            this.exchangeData.push(iitem)
          })
          return item
        })

        this.tableLoading = false
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
</style>
