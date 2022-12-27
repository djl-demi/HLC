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
          <a-descriptions-item label="出库编号">{{ data.activity_no }} </a-descriptions-item>
          <a-descriptions-item label="出库状态">{{ data.state_text }} </a-descriptions-item>
          <a-descriptions-item label="仓库">{{ data.warehouse }} </a-descriptions-item>
          <a-descriptions-item label="出库去向">{{ data.activity_description }} </a-descriptions-item>
          <a-descriptions-item label="申请人">{{ data.operator_name }} </a-descriptions-item>
          <a-descriptions-item label="申请时间">{{ data.create_time }}</a-descriptions-item>
          <a-descriptions-item label="操作人">{{ data.operator_name }} </a-descriptions-item>
          <a-descriptions-item label="出库时间">{{ data.stock_time }} </a-descriptions-item>
        </a-descriptions>
      </a-space>

      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">礼品清单:</div>
      </a-space>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="data.stock_detail" :pagination="false" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="gift_name" title="礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="remain_number" title="当前库存" data-index="remain_number" align="center" :ellipsis="true" />
          <a-table-column key="apply_number" title="申请数量" data-index="apply_number" align="center" :ellipsis="true" />
          <a-table-column key="number" title="出库数量" data-index="number" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number id="inputNumber" v-model="record.number" :min="0"></a-input-number>
            </template>
          </a-table-column>
          <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
        </a-table>
      </a-space>
    </a-col>
    <a-space class="flex-center mt20">
      <a-button @click="resetForm"> 取消 </a-button>
      <a-button type="primary" style="margin-left: 100px" @click="onSubmit"> 保存 </a-button>
    </a-space>
  </div>
</template>

<script>
import utils from "@/utils/utils"
import TyReturn from "@/components/ty-return/ty-return.vue"
import { log } from "@antv/g2plot/lib/utils"
export default {
  components: { TyReturn },
  props: {
    query: Object,
    params: Object
  },
  name: "Delivery",
  data() {
    return {
      data: [],
      value: "",

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
      this.no = this.query.no || ""
      this.$api.viewGiftDelivery({ stock_no: this.no }).then(res => {
        this.data = res.data
        this.activityId = this.data.id // 活动id
        res.data.stock_detail.map(item => {
          return item
        })
      })
    },
    resetForm() {
      this.$router.go(-1)
    },
    // 保存
    // onSubmit() {
    onSubmit: utils.debounce(function() {
      const flag = this.data.stock_detail.every(item => {
        if (item.number > item.remain_number) {
          this.$message.error("出库失败，当前出库数量大于库存数量，请重新输入出库数量！")
          return false
        } else {
          return true
        }
      })
      if (flag == true) {
        this.tableLoading = true
        const data = {
          activity_id: this.activityId || "",
          stock_detail: this.data.stock_detail || ""
        }
        this.$api.editGiftDelivery(data).then(res => {
          if (res.code === 200) {
            this.tableLoading = false
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "GiftDelivery" })
          }, 1000)
        })
      }
    }, 1000)
    // },
  }
}
</script>

<style lang="less">
// #Delivery {
// }
</style>
