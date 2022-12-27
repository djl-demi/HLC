<template>
  <div id="InspectionAudit">
    充放任务准备--异常处理
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "InspectionAudit",
  data() {
    return {
      user_name: "",
      phone: "",
      plot_name: "",
      state: undefined,
      optionType: [
        // { value: "", label: "全部" },
        { value: 0, label: "待审核" },
        { value: 1, label: "通过" },
        { value: 2, label: "不通过" }
      ],
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      loading: false,
      visible: false,
      id: 0,

      picture: "",
      previewVisible: false
    }
  },
  created() {
    // this.getTableList()
  },
  methods: {
    // 获取物品列表

    getTableList(page) {
      if (page) this.page = page
      let newState = ""

      if (this.state != undefined) {
        newState = this.state
      }
      const data = {
        user_name: this.user_name || "",
        phone: this.phone || "",
        plot_name: this.plot_name || "",
        state: newState,
        page: this.page
      }
      console.log(data, "data")

      this.tableLoading = true
      this.$api.getInspectionList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.pic = item.pic ? this.$com.showUpload() + item.pic : ""
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 查看图片
    showPicture(pic = "") {
      console.log(pic, "picture_url")
      this.picture = pic
      this.previewVisible = true
    },
    // 关闭图片
    handlePicCancel() {
      this.previewVisible = false
    },
    //导出
    trackExport() {
      let user_name = this.user_name || ""
      let phone = this.phone || ""
      let plot_name = this.plot_name || ""
      let state = this.state || ""

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/inspection/export?token=${token}&user_name=${user_name}&plot_name=${plot_name}&phone=${phone}&state=${state}`)
    },
    //审核
    check(id, user_name) {
      this.visible = true
      this.id = id
      // this.user_name = user_name
    },

    handleOk(e) {
      this.loading = true
      this.$api
        .putInspectionAudit({ id: this.id, state: 1 })
        .then(res => {
          this.getTableList()
          this.$message.success(res.msg)
          this.loading = false
          this.visible = false
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.loading = false
          this.visible = false
        })
    },
    handleCancel(e) {
      this.loading = true
      this.$api
        .putInspectionAudit({ id: this.id, state: 2 })
        .then(res => {
          this.getTableList()
          this.$message.success(res.msg)
          this.loading = false
          this.visible = false
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.loading = false
          this.visible = false
        })
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
#InspectionAudit {
  .img {
    height: 24px;
  }
  .upImg {
    width: 100px;
    height: 100px;
  }
}
.audit {
  margin: 10px 0 0 20px;
  font-size: 16px;
}
.ant-modal-footer {
  border-top: none;
}
</style>
