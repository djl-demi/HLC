<template>
  <div id="AppAccount">
    <!-- :AccountSearch="AppAccountSearch"
      :AccountAdd="AppAccountAdd"
      :AccountEdit="AppAccountEdit"
      :AccountIsNormal="AppAccountIsNormal"
      :AccountPermission="AppAccountPermission"
      :AccountOperationRecord="AppAccountOperationRecord"
      :AccountRecord="AppAccountRecord"
      :AccountResetPwd="AppAccountResetPwd"
      :AccountDel="AccountDel" -->
    <TyAccount
      ref="TyAccount"
      :total="total"
      :dataSource="dataSource"
      :accountRecordTotal="accountRecordTotal"
      :accountRecordDataSource="accountRecordDataSource"
      :isApp="true"
      :isDel="true"
      @search="search"
      @operation="operation"
      @getAccountRecordList="getAccountRecordList"
      @switchChange="switchChange"
    ></TyAccount>
  </div>
</template>

<script>
import TyAccount from "components/ty-account/ty-account.vue"
export default {
  name: "AppAccount",
  components: { TyAccount },
  data() {
    return {
      dataSource: [],
      total: 1,
      accountRecordTotal: 1,
      accountRecordDataSource: []
    }
  },
  computed: {
    // AppAccountSearch() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountSearch")
    // },
    // AppAccountAdd() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountAdd")
    // },
    // AppAccountEdit() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountEdit")
    // },
    // AppAccountIsNormal() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountIsNormal")
    // },
    // AppAccountPermission() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountPermission")
    // },
    // AppAccountOperationRecord() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountOperationRecord")
    // },
    // AppAccountRecord() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountRecord")
    // },
    // AppAccountResetPwd() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountResetPwd")
    // },
    // AccountDel() {
    //   return this.$com.getPermission(this.$route.matched, "AppAccountDel")
    // }
  },
  methods: {
    // 搜索
    search() {
      const data = {
        account: this.$refs.TyAccount.account,
        account_type: this.$refs.TyAccount.admin_type === 0 || this.$refs.TyAccount.admin_type === 1 ? this.$refs.TyAccount.admin_type : "",
        position: this.$refs.TyAccount.position,
        page: this.$refs.TyAccount.page || 1
      }
      this.$refs.TyAccount.tableLoading = true
      this.$api
        .getAppAccountList(data)
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            item.admin_type = item.account_type === 1 ? true : false
            return item
          })
          this.$refs.TyAccount.tableLoading = false
          this.total = res.data.total
        })
        .catch(err => {
          this.$refs.TyAccount.tableLoading = false
        })
    },

    // 操作
    operation(type, record) {
      if (type === "add") {
        this.$router.push({
          name: "AppAccountOperationAdd",
          query: { type, id: "" }
        })
      }
      if (type === "edit") {
        this.$router.push({
          name: "AppAccountOperationEdit",
          query: { type, id: record.id }
        })
      }
      if (type === "permission") {
        this.$router.push({
          name: "AppAccountPermission",
          query: { id: record.position_id }
        })
      }
      if (type === "operationRecord") {
        this.$router.push({
          name: "AppAccountOperationRecord",
          query: { account: record.account }
        })
      }
      if (type === "accountRecord") {
        this.$refs.TyAccount.currentAccountId = record.id
        this.$refs.TyAccount.accountRecordPage = 1
        this.$refs.TyAccount.visibleAccountRecord = true
        this.getAccountRecordList({ id: record.id, page: 1 })
      }
      if (type === "resetPwd") {
        let that = this
        that.$confirm({
          title: "提示",
          content: "是否恢复账号" + record.account + "(" + record.name + ")的密码为a12345678？",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            // 确认重置
            that.$api
              .resetAppAccountPwd({ id: record.id })
              .then(res => {
                that.$message.success({ content: res.msg })
              })
              .catch(err => {
                that.$message.error({ content: err.msg })
              })
          }
        })
      }
      if (type === "del") {
        let that = this
        that.$confirm({
          title: "提示",
          content: `确定删除账号${record.account}？`,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            // 确认删除
            that.$api
              .delAppAccount({ id: record.id })
              .then(res => {
                that.$message.success({ content: res.msg })
                that.search()
              })
              .catch(err => {
                that.$message.error({ content: err.msg })
              })
          }
        })
      }
    },

    // 获取账号记录列表
    getAccountRecordList(data) {
      this.$api.getAppAccountRecord(data).then(res => {
        this.$refs.TyAccount.accountRecordTableLoading = false
        this.accountRecordDataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.accountRecordTotal = res.data.total
      })
    },

    // 切换开关
    switchChange(record, state) {
      console.log("state", state)
      this.$api
        .ChangeAppAccountState({ id: record.key, type: state })
        .then(res => {
          this.$message.success({ content: res.msg })
        })
        .catch(err => {
          record.state = !record.state
        })
    }
  }
}
</script>
