<template>
  <div id="AnswerRecord">
    充放任务执行--任务异常处理
  </div>
</template>

<script>
export default {
  name: "AnswerRecord",
  data() {
    return {}
  },
  created() {
    // this.getTableList()
  },
  methods: {
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },
    // 获取物品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        phone: this.phone || "",
        start_time: this.start_time || "",
        end_time: this.end_time || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getAnswerRecordlist(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.pic = item.pic ? this.$com.showUpload() + item.pic : ""
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    viewDetail(id) {
      this.$router.push({ name: "AnswerRecordDetail", query: { id: id } })
    }
  }
}
</script>

<style lang="less">
#AnswerRecord {
}
.audit {
  margin: 10px 0 0 20px;
  font-size: 16px;
}
.ant-modal-footer {
  border-top: none;
}
</style>
