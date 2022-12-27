<template>
  <div id="ExchangeDetails">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
    </a-space>
    <a-space class="fr">
      <a-button icon="export" @click="recordExport">导出</a-button>
    </a-space>
    <div class="line"></div>
    <a-col>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">兑换记录:</div>
      </a-space>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="exchangeData" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="create_time" title="兑换时间" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="type_text" title="兑换类型" data-index="type_text" align="center" :ellipsis="true" />
          <a-table-column key="merchandise_name" title="兑换物品" data-index="merchandise_name" align="center" :ellipsis="true" />
          <a-table-column key="unit_integral" title="单价" data-index="unit_integral" align="center" :ellipsis="true" />
          <a-table-column key="num" title="兑换数量" data-index="num" align="center" :ellipsis="true" />
          <a-table-column key="integral" title="支付积分" data-index="integral" align="center" :ellipsis="true" />
          <a-table-column key="state_text" title="状态" data-index="state_text" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="exchangeTotal" @change="exchangeCustomerInfo()" />
        </div>
      </a-space>
    </a-col>
  </div>
</template>

<script>
export default {
  name: "ExchangeDetails",
  data() {
    return {
      data: [],
      exchangeData: [], //兑换记录表格
      tableLoading: false,
      // tableLoading2: false,
      exchangeTotal: 1,
      page: 1
    }
  },
  props: {
    query: Object,
    params: Object
  },
  created() {
    this.id = this.query.id || ""
    this.$api.viewCustomerInformation({ id: this.id }).then(res => {
      this.data = res.data
    })
    this.exchangeList()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    exchangeList(page) {
      this.tableLoading = true
      this.$api.exchangeCustomerInfo({ user_id: this.id, page: this.page }).then(res => {
        res.data.integral_exchange.data.map(item => {
          item.exchange_detail.map(iitem => {
            iitem.state_text = item.state_text
            this.exchangeData.push(iitem)
          })

          return item
        })

        this.tableLoading = false
        this.orderTotal = res.data.exchange.total
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
