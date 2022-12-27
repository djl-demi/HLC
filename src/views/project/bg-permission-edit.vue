<template>
  <div id="BgPermissionEdit">
    <TyPermission :sourceData="sourceData" :checked="true" @sureSubmit="sureSubmit" @cancel="cancel"></TyPermission>
  </div>
</template>
<script>
import TyPermission from "@/components/ty-permission/ty-permission.vue"
export default {
  name: "BgPermissionEdit",
  components: {
    TyPermission
  },
  data() {
    return {
      sourceData: []
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 获取数据
    getTableList() {
      let data
      if (this.$route.query.system === "background") {
        data = {
          id: this.$route.query.id,
          sys: 1
        }
      } else {
        data = {
          id: this.$route.query.id,
          sys: 2
        }
      }

      this.$api.viewEditPermission(data).then(res => {
        this.sourceData = res.data.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
      })

      // ;(this.$route.query.system === "background" ? this.$api.editBgPermission({ id: this.$route.query.id }) : this.$api.editAppBgPermission({ id: this.$route.query.id })).then(res => {
      //   this.sourceData = res.data.map(item => {
      //     item.key = this.$utils.createUUID()
      //     return item
      //   })
      // })
    },

    // 保存
    sureSubmit() {
      const menus_permission_ids = []
      this.sourceData.map(item => {
        if (item.checked1 === true) {
          menus_permission_ids.push(item.system_id)
        }
        if (item.checked2 === true) {
          menus_permission_ids.push(item.one_module_id)
        }
        if (item.checked3 === true) {
          menus_permission_ids.push(item.two_module_id)
        }
        if (item.checked4 === true) {
          menus_permission_ids.push(item.operation_id)
        }
      })

      let data
      if (this.$route.query.system === "background") {
        data = {
          sys: 1,
          position_id: this.$route.query.id,
          permission: menus_permission_ids
        }
      } else {
        data = {
          sys: 2,
          position_id: this.$route.query.id,
          permission: menus_permission_ids
        }
      }

      this.$api.putPermission(data).then(res => {
        if (res.code === 200) {
          this.$message.success({ content: res.msg })
          this.$router.go(-1)
        }
      })

      // ;(this.$route.query.system === "background"
      //   ? this.$api.putBgPermission({ id: this.$route.query.id, menus_permission_ids: menus_permission_ids })
      //   : this.$api.putAppBgPermission({ id: this.$route.query.id, menus_permission_ids: menus_permission_ids })
      // ).then(res => {
      //   if (res.code === 200) {
      //     this.$message.success({ content: res.msg })
      //     this.$router.go(-1)
      //   }
      // })
    },

    // 取消
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less"></style>
