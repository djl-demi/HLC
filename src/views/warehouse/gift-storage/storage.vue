<template>
  <div id="Delivery">
    <!-- 出库 -->
    <TyReturn></TyReturn>
    <a-col ref="ruleForm">
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
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">礼品清单:</div>
      </a-space>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="data.stock_in_detail" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="gift_name" title="礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="remain_number" title="当前库存" data-index="remain_number" align="center" :ellipsis="true" />
          <a-table-column key="apply_number" title="申请入库" data-index="apply_number" align="center" :ellipsis="true" />
          <a-table-column key="number" title="实际入库" data-index="number" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number id="inputNumber" :min="0" v-model="record.number"></a-input-number>
            </template>
          </a-table-column>
          <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
        </a-table>
      </a-space>
    </a-col>
    <a-space class="flex-center mt20">
      <a-button @click="resetForm">
        取消
      </a-button>
      <a-button type="primary" style="margin-left: 100px;" @click="onSubmit">
        保存
      </a-button>
    </a-space>
  </div>
</template>

<script>
import utils from "@/utils/utils"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  props: {
    query: Object,
    params: Object
  },
  name: "Delivery",
  data() {
    return {
      data: {},
      tableLoading: false, //表格
      page: 1,
      total: 0
    }
  },
  created() {
    this.viewShow()
  },
  methods: {
    //出库详情展示
    viewShow() {
      this.id = this.query.id || ""
      this.$api.viewGiftStorage({ activity_id: this.id }).then(res => {
        this.data = res.data
        res.data.stock_in_detail.map(item => {
          return item
        })
      })
    },
    resetForm() {
      this.$router.go(-1)
    },

    // 保存
    onSubmit: utils.debounce(function() {
      this.tableLoading = true
      const data = {
        activity_id: this.id.toString() || "",
        stock_detail: this.data.stock_in_detail || ""
      }
      this.$api.editGiftStockIn(data).then(res => {
        if (res.code === 200) {
          this.tableLoading = false
          this.$message.success(res.msg)
        } else {
          this.$message.info(res.msg)
        }
        setTimeout(() => {
          this.$router.push({ name: "GiftStorage" })
        }, 1000)
      })
    }, 1000)
  }
}
</script>

<style lang="less">
// #Delivery {
// }
</style>
