<template>
  <div id="TyAccountOperationRecord">
    <a-space class="facility-title">
      <div class="facility-title-box"></div>
      <div class="facility-title-text">操作记录</div>
    </a-space>
    <div class="oh w100b">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false">
          <a-table-column title="时间" data-index="update_time" align="center" />
          <a-table-column title="操作" data-index="behavior" align="center" />
          <a-table-column title="状态" data-index="result" align="center" />
          <a-table-column title="失败原因" data-index="fail_reason" align="center" />
          <a-table-column title="ip地址" data-index="ip" align="center" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  name: "TyAccountOperationRecord",
  props: {
    dataSource: Array,
    total: Number
  },
  data() {
    return {
      page: 1
    }
  },
  created() {
    // this.getTableList(this.$route.query.account)
  },
  methods: {
    getTableList() {
      this.$emit("pageChange", { account: this.$route.query.account, page: this.page })
      //   this.$api.getAccountOperationRecord({ account, page: this.page }).then(res => {
      //     this.dataSource = res.data.data.map(item => {
      //       item.key = this.$utils.createUUID()
      //       item.result = item.result ? "成功" : "失败"
      //       return item
      //     })
      //     this.total = res.data.total
      //   })
    }
  }
}
</script>

<style></style>
