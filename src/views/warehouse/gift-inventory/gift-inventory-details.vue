<template>
  <div id="GiftInventoryDetails">
    <!-- 礼品库存详情 -->
    <TyReturn></TyReturn>
    <a-space>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <!-- <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button> -->
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="warehouse_name" title="仓库" data-index="warehouse_name" align="center" :ellipsis="true" />
            <a-table-column key="gift_name" title="礼品" data-index="gift_name" align="center" :ellipsis="true" />
            <a-table-column key="number" title="数量" data-index="number" align="center" :ellipsis="true" />
            <a-table-column key="state_name" title="操作" data-index="state_name" align="center" :ellipsis="true" />
            <a-table-column key="operation_name" title="操作人" data-index="operation_name" align="center" :ellipsis="true" />
            <a-table-column key="create_time" title="操作时间" data-index="create_time" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  name: "GiftInventoryDetails",
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      dataSource: [],
      tableLoading: false,
      total: 0,
      page: 1
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 获取礼品库存详情
    getTableList(page) {
      if (page) this.page = page
      this.type = this.query.btnValue || ""
      this.tableLoading = true
      const data = {
        gift_id: this.query.gift_id,
        page: this.page
      }
      // 实时
      if (this.type == 1) {
        this.$api.getStockRecord(data).then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = this.$utils.createUUID()
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      }

      // 历史
      if (this.type == 2) {
        this.$api.getHistoryRecord(data).then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = this.$utils.createUUID()
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      }
    }
  }
}
</script>

<style lang="less">
// #GiftInventoryDetails {
// }
</style>
