<template>
  <div id="BackgroundAccount" ref="BackgroundAccount">
    <!-- :AccountSearch="BackgroundAccountSearch"
      :AccountAdd="BackgroundAccountAdd"
      :AccountEdit="BackgroundAccountEdit"
      :AccountIsNormal="BackgroundAccountIsNormal"
      :AccountPermission="BackgroundAccountPermission"
      :AccountOperationRecord="BackgroundAccountOperationRecord"
      :AccountRecord="BackgroundAccountRecord"
      :AccountResetPwd="BackgroundAccountResetPwd" -->
    <TyAccount
      ref="TyAccount"
      :total="total"
      :dataSource="dataSource"
      :accountRecordTotal="accountRecordTotal"
      :accountRecordDataSource="accountRecordDataSource"
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
  name: "BackgroundAccount",
  components: { TyAccount },
  data() {
    return {
      dataSource: [],
      total: 1,
      accountRecordTotal: 1,
      accountRecordDataSource: [] // 账号记录表格数据
    }
  },
  computed: {
    // BackgroundAccountSearch() {
    //   return this.$com.getPermission(this.$route.matched, "")
    // },
    // BackgroundAccountAdd() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountAdd")
    // },
    // BackgroundAccountEdit() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountEdit")
    // },
    // BackgroundAccountIsNormal() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountIsNormal")
    // },
    // BackgroundAccountPermission() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountPermission")
    // },
    // BackgroundAccountOperationRecord() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountOperationRecord")
    // },
    // BackgroundAccountRecord() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountRecord")
    // },
    // BackgroundAccountResetPwd() {
    //   return this.$com.getPermission(this.$route.matched, "BackgroundAccountResetPwd")
    // }
  },
  methods: {
    // 搜索
    search() {
      const data = {
        account: this.$refs.TyAccount.account,
        admin_type: this.$refs.TyAccount.admin_type === 0 || this.$refs.TyAccount.admin_type === 1 ? this.$refs.TyAccount.admin_type : "",
        position: this.$refs.TyAccount.position,
        page: this.$refs.TyAccount.page || 1
      }
      this.$refs.TyAccount.tableLoading = true
      this.$api
        .getAccountList(data)
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            item.admin_type = item.admin_type === 1 ? true : false
            return item
          })
          console.log(this.dataSource, "this.dataSource")
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
          name: "BackgroundAccountOperationAdd",
          query: { type, id: "" }
        })
      }
      if (type === "edit") {
        this.$router.push({
          name: "BackgroundAccountOperationEdit",
          query: { type, id: record.id }
        })
      }
      if (type === "permission") {
        this.$router.push({
          name: "BackgroundAccountPermission",
          query: { id: record.admin_position_id }
        })
      }
      if (type === "operationRecord") {
        this.$router.push({
          name: "BackgroundAccountOperationRecord",
          query: { account: record.account }
        })
      }
      if (type === "accountRecord") {
        this.$refs.TyAccount.currentAccount = record.account
        this.$refs.TyAccount.accountRecordPage = 1
        this.$refs.TyAccount.visibleAccountRecord = true
        this.getAccountRecordList({ account_id: record.id, platform: 1, page: 1 })
      }
      // 删除
      if (type === "del") {
        let that = this
        that.$confirm({
          title: "提示",
          content: "是否要删除该账号" + record.account + "(" + record.name + ")？",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            // 确认重置
            that.$api
              .delAccount({ id: record.id })
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
      // if (type === "resetPwd") {
      //   let that = this
      //   that.$confirm({
      //     title: "提示",
      //     content: "是否恢复账号" + record.account + "(" + record.name + ")的密码为a12345678？",
      //     okText: "确定",
      //     cancelText: "取消",
      //     onOk() {
      //       // 确认重置
      //       that.$api
      //         .resetAcountPwd({ account_id: record.id })
      //         .then((res) => {
      //           that.$message.success({ content: res.msg })
      //           this.search()
      //         })
      //         .catch((err) => {
      //           that.$message.error({ content: err.msg })
      //         })
      //     },
      //   })
      // }
    },

    // 获取账号记录列表
    getAccountRecordList(data) {
      this.$api.getAccountRecordList(data).then(res => {
        this.$refs.TyAccount.accountRecordTableLoading = false
        this.accountRecordDataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.accountRecordTotal = res.data.total
      })
    },

    // 切换开关
    switchChange(record) {
      this.$api
        .ChangeAccountState({ id: record.key, admin_type: record.admin_type ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.admin_type = !record.admin_type
        })
    }
  }
}
</script>
