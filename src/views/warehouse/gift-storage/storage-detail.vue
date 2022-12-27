<template>
  <div id="DeliveryDetail">
    <!-- 出库详情 -->
    <TyReturn></TyReturn>

    <a-col>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">基本信息:</div>
      </a-space>
      <a-space>
        <a-descriptions layout="horizontal" class="mlr30">
          <a-descriptions-item label="入库编号">{{ data.activity_no }} </a-descriptions-item>
          <a-descriptions-item label="入库状态">{{ data.state_text }} </a-descriptions-item>
          <a-descriptions-item label="仓库">{{ data.warehouse }} </a-descriptions-item>
          <a-descriptions-item label="入库来源">{{ data.source_name }} </a-descriptions-item>
          <a-descriptions-item label="申请人">{{ data.create_name }} </a-descriptions-item>
          <a-descriptions-item label="申请时间">{{ data.create_time }}</a-descriptions-item>
          <a-descriptions-item label="操作人">{{ data.operator_name }} </a-descriptions-item>
          <a-descriptions-item label="入库时间">{{ data.stock_in_time }} </a-descriptions-item>
        </a-descriptions>
      </a-space>
    </a-col>
    <a-col>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">礼品清单:</div>
      </a-space>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="data.stock_in_detail" :pagination="false" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="gift_name" title="礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="remain_number" title="当前库存" data-index="remain_number" align="center" :ellipsis="true" />
          <a-table-column key="apply_number" title="申请入库" data-index="apply_number" align="center" :ellipsis="true" />
          <a-table-column key="number" title="实际入库" data-index="number" align="center" :ellipsis="true" />
          <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
        </a-table>
        <!-- <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div> -->
      </a-space>
    </a-col>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  name: "DeliveryDetail",
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      data: {},
      tableLoading: false, //表格
      page: 1,
      total: 0
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    //出库详情展示
    getTableList() {
      this.id = this.query.id || ""
      let that = this
      this.$api.viewGiftStorage({ activity_id: this.id }).then(res => {
        res.data.status === 1 ? "待入库" : "已入库"
        this.data = res.data
        console.log(that.data.state_text, "state_text")
        if (that.data.state_text == "待入库") {
          that.data.stock_in_detail.map(item => {
            item.number = 0
            return item
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
// #DeliveryDetail {
// }
</style>
