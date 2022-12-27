<template>
  <div id="CreditManagement">
    上报心跳
  </div>
</template>

<script>
export default {
  name: "CreditManagement",
  data() {
    return {
      user_id: 0,
      user_name: "",
      phone: "",
      plot_name: "",
      modelTitle: "编辑积分",
      visible: false,
      confirmLoading: false,
      rules: {
        integral: [{ required: true, message: "请输入剩余积分", trigger: "blur" }]
        // reason: [{ required: true, message: "请输入原因", trigger: "blur" }]
      },
      total_integrals: [],
      form: {
        total_integral: "",
        exchange_integrals: "",
        integral: "",
        reason: ""
      },
      list: [],
      visibleCredit: false,
      confirmCreditLoading: false,
      dataSource: [], //小区管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      current: 1,
      total_record: 0
    }
  },
  created() {
    //获取列表
    // this.getTableList()
  },
  methods: {
    //导出
    trackExport() {
      let user_name = this.user_name || ""
      let phone = this.phone || ""
      let plot_name = this.plot_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/user/export?token=${token}&plot_name=${plot_name}&user_name=${user_name}&phone=${phone}`)
    },
    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        user_name: this.user_name || "",
        phone: this.phone || "",
        plot_name: this.plot_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getCustomerInformationList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 显示概览
    showTotal(user_id) {
      user_id = user_id ? (this.user_id = user_id) : this.user_id
      this.visibleCredit = true
      // this.current = res.data.detail.last_page
      this.$api.exchangeCustomerInfo({ user_id: user_id, page: this.current }).then(res => {
        this.total_integrals = res.data.detail.data
        this.total_record = res.data.detail.total
      })
    },
    //  显示碓换详情
    showExchange(key) {
      this.$router.push({
        name: "CreditExchange",
        query: { id: key },
        params: {}
      })
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    // 修改
    handleOk() {
      this.$api.updateintegral(this.form).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.visible = false
          this.getTableList()
        }
      })
    },
    closeCreditForm() {
      this.visibleCredit = false
    },
    // 新增/编辑
    option(type, text, key = "") {
      let oneData = []
      if (key) {
        oneData = this.dataSource.filter(item => {
          return item.id === key
        })
      }

      if (type == "edit") {
        this.visible = true
        this.form.total_integral = text.total_integral || 0
        this.form.exchange_integral2 = text.exchange_integral || 0
        this.form.integral = text.integral || 0
        this.form.reason = text.reason || ""
        this.form.user_id = text.id
      }
      //   this.$router.push({
      //     name: type === "add" ? "CommunityManagementOperationAdd" : "CommunityManagementOperationEdit",
      //     query: { type, id: key },
      //     params: { data: oneData[0] }
      //   })
    }
  }
}
</script>

<style scoped lang="less">
// #CommunityManagement {
//   padding: 30px;
// }
</style>
