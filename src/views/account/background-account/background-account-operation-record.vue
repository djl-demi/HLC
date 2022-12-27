<template>
  <div>
    <TyAccountOperationRecord ref="TyAccountOperationRecord" :dataSource="dataSource" :total="total" @pageChange="getTableList"></TyAccountOperationRecord>
  </div>
</template>

<script>
import TyAccountOperationRecord from "components/ty-account/ty-account-operation-record.vue"
export default {
  name: "BackgroundAccountOperationRecord",
  components: { TyAccountOperationRecord },
  data() {
    return {
      dataSource: [],
      total: 1
    }
  },
  created() {
    this.getTableList({ account: this.$route.query.account, page: 1 })
  },
  methods: {
    getTableList(data) {
      this.$api.getAccountOperationRecord(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = this.$utils.createUUID()
          item.result = item.result ? "成功" : "失败"
          return item
        })
        this.total = res.data.total
      })
    }
  }
}
</script>

<style></style>
