<template>
  <div id="ExchangeDetails">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
      <a-button type="primary" @click="popModal('add')">新增</a-button>
    </a-space>
    <div class="line"></div>
    <a-col>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="list" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="type" title="主卡/副卡" data-index="type" align="center" :ellipsis="true" />
          <a-table-column key="number" title="卡号" data-index="number" align="center" :ellipsis="true" />
          <a-table-column key="subCard" title="对应主卡卡号" data-index="subCard" align="center" :ellipsis="true" />
          <a-table-column key="operator" title="加油工" data-index="operator" align="center" :ellipsis="true" />
          <a-table-column title="操作" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="popModal('edit', record)">编辑</a-button><a-button type="link" size="small" @click="del(record)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="exchangePage" :page-size="10" show-quick-jumper :default-current="1" :total="exchangeTotal" @change="getOilData()" />
        </div>
      </a-space>
    </a-col>
    <!-- 编辑弹窗   -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="total_integral" label="主卡/副卡" prop="total_integral" has-feedback style="">
          <a-radio-group v-model="oilCardType">
            <a-radio :value="0" :disabled="editType === 'edit' && !!oilCardType">主卡</a-radio>
            <a-radio :value="1" v-if="(editType === 'edit' && !!oilCardType) || editType === 'add'">副卡</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="integral" label="主卡" prop="integral" has-feedback>
          <a-select v-if="oilCardType" v-model="masterCard" :disabled="editType === 'edit' && !!oilCardType" placeholder="请选择主卡" :options="masterOilCardList" allowClear class="cardNumber" />
          <a-input v-else v-model="form.number" placeholder="请输入卡号" allowClear class="cardNumber" />
        </a-form-model-item>
        <a-form-model-item v-if="oilCardType" ref="number" label="副卡" prop="number" has-feedback>
          <a-input id="inputNumber" v-model="form.number" placeholder="请输入卡号" allowClear class="cardNumber" />
        </a-form-model-item>
        <a-form-model-item ref="reason" label="加油工：" prop="reason" has-feedback>
          <a-select v-model="form.operatorId" :options="workerList" placeholder="请选择加油工" allowClear class="cardNumber" />
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
      pageNum: 1,
      modelTitle: "",
      editType: undefined,
      masterCard: undefined,
      oilCardType: 0,
      visible: false,
      confirmLoading: false,
      data: [],
      exchangeData: [], //兑换记录表格
      tableLoading: false,
      // tableLoading2: false,
      exchangeTotal: 0,
      exchangePage: 1,
      list: [],
      masterOilCardList: [],
      form: {
        oilCardId: undefined,
        number: undefined,
        operatorId: undefined
      },
      rules: {
        integral: [{ required: true, message: "请输入剩余积分", trigger: "blur" }],
        reason: [{ required: true, message: "请输入原因", trigger: "blur" }]
      },
      worker: undefined,
      workerList: []
    }
  },
  props: {
    query: Object,
    params: Object
  },
  created() {
    this.id = this.query.id || ""
    this.getMastOilCard()
    this.getOilData()
    this.getOperator()

    // this.$api.viewCustomerInformation({ id: this.id }).then(res => {
    //   this.data = res.data
    // })
    // this.exchangeList()
  },
  watch: {
    oilCardType: function(val) {}
  },
  methods: {
    getOilData(exchangePage) {
      if (exchangePage) this.exchangePage = exchangePage
      this.tableLoading = true
      this.$api
        .getOilData({ pageNum: this.exchangePage })
        .then(res => {
          this.tableLoading = false
          this.list = res.data.data
          this.exchangeTotal = res.data.total
        })
        .catch(e => {
          this.tableLoading = false
        })
    },
    async getMastOilCard() {
      this.masterOilCardList = []
      let res = await this.$api.getMastOilCard()
      res &&
        res.data.forEach(e => {
          this.masterOilCardList.push({ value: e.id, label: e.number })
        })
    },
    getOperator() {
      this.$api.getOperator().then(res => {
        res.data.forEach(e => {
          this.workerList.push({ value: e.id, label: e.accountName })
        })
      })
    },
    // 编辑
    edit(record) {
      console.log(this.form.number)
    },
    // 删除加油卡
    del(item) {
      let that = this
      that.$confirm({
        content: `确定删除该加油卡吗？`,
        onOk() {
          that.$api.delOilCard({ id: item.id }).then(res => {
            that.getMastOilCard()
            that.$message.success(res.msg)
            that.getOilData(1)
          })
        }
      })
    },
    async popModal(type, record) {
      this.masterCard = undefined
      if (type === "add") {
        await this.getMastOilCard()
        this.editType = "add"
        this.modelTitle = "新增"
        this.oilCardType = 0
        this.visible = true
        Object.keys(this.form).forEach(key => {
          this.form[key] = undefined
        })
      } else if (type === "edit") {
        this.masterOilCardList.forEach(e => {
          if (record.type === "副卡" && e.value === record.oilCardId) {
            this.masterCard = record.oilCardId // 显示副卡的主卡
          }
          if (record.type === "主卡" && e.value === record.id) {
            this.masterCard = record.id // 显示副卡的主卡
          }
        })
        this.form.number = record.number
        this.visible = true
        this.editType = "edit"
        this.modelTitle = "编辑"
        this.form.id = record.id
        this.form.oilCardId = record.type === "主卡" ? 0 : record.id
        this.oilCardType = record.type === "主卡" ? 0 : 1
        this.form.operatorId = undefined
        this.workerList.forEach(e => {
          if (e.label === record.operator) {
            this.form.operatorId = e.value
          }
        })
      }
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    // 修改
    handleOk() {
      if (this.editType === "edit") {
        this.$api.alterOilCard(this.form).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.visible = false
            this.getOilData()
          }
        })
      } else if (this.editType === "add") {
        this.form.oilCardId = this.oilCardType === 0 ? 0 : this.masterCard
        this.$api.addOilCard(this.form).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.visible = false
            this.getOilData()
          }
        })
      }
    },
    back() {
      this.$router.go(-1)
    },
    // 获取兑换记录
    recordExport() {}
  }
}
</script>

<style lang="less">
form .cardNumber {
  width: 250px;
}
</style>
