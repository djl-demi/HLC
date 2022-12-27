<template>
  <div id="QandADetail">
    充放任务执行--任务执行反馈
  </div>
</template>

<script>
export default {
  name: "QandADetail",
  data() {
    return {
      data: {},
      visible: false,
      title: "选择题",
      tableLoading: false,
      dataSource: [],
      type: undefined
    }
  },
  props: {
    query: Object,
    params: Object
  },
  created() {
    // this.getTableList()
  },
  methods: {
    getTableList() {
      this.$api.viewClassification({ id: this.query.id }).then(res => {
        this.data = res.data
        this.data.classification_detail.map(item => {
          item.key = item.uuid
          return item
        })
      })
    },
    back() {
      this.$router.go(-1)
    },
    view(record) {
      this.visible = true
      this.title = record.type_text
      this.tableLoading = true
      this.$api.getQuestion({ uuid: record.uuid }).then(res => {
        this.dataSource = res.data.map(item => {
          this.type = item.type
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    handleClose() {
      this.visible = false
    },
    trackExport(record) {
      let uuid = record.uuid
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/classification/getquestionexport?token=${token}&uuid=${uuid}`)
    }
  }
}
</script>

<style lang="less" scope>
#QandADetail {
  .line {
    width: 100%;
    height: 1px;
    background: #bdbdbd;
  }
}
.ant-modal {
  width: 700px !important;
}
</style>
