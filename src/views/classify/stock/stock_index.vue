<template>
  <div class="Stock">
    升降梯
    <!-- <a-space direction="vertical" size="large" style="width: 100%">
      <div style="margin-bottom:24px">
        <a-tabs default-active-key="realtime">
          <a-tab-pane key="realtime">
            <span slot="tab">
              <span style="font-size: 16px;vertical-align: middle;">实时库存</span>
            </span>
            <TyRealTimeStock ref="TyRealTimeStock"></TyRealTimeStock>
          </a-tab-pane>
          <a-tab-pane key="history" force-render>
            <span slot="tab">
              <span style="font-size: 16px;vertical-align: middle;">历史库存</span>
            </span>
            <TyHistoryStock ref="TyHistoryStock"></TyHistoryStock>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-space> -->
  </div>
</template>

<script>
// import TyRealTimeStock from "./inventory-management.vue"
// import TyHistoryStock from "./history_stock.vue"
export default {
  name: "Stock",
  data() {
    return {}
  },
  components: {
    // TyRealTimeStock,
    // TyHistoryStock
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
