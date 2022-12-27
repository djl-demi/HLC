<template>
  <div id="BgPermissionView">
    <TyReturn></TyReturn>
    <TyPermission :sourceData="sourceData"></TyPermission>
  </div>
</template>
<script>
import TyPermission from "@/components/ty-permission/ty-permission.vue"
import TyReturn from "@/components/ty-return/ty-return.vue"

export default {
  name: "BgPermissionView",
  components: {
    TyPermission,
    TyReturn
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

      this.$api.viewPositionPermission(data).then(res => {
        this.sourceData = res.data.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
      })

      // ;(this.$route.query.system === "background" ? this.$api.viewBgPermission({ id: this.$route.query.id }) : this.$api.viewAppBgPermission({ id: this.$route.query.id })).then((res) => {
      //   // console.log("res.data", res.data)
      //   this.sourceData = res.data.map((item) => {
      //     item.key = this.$utils.createUUID()
      //     return item
      //   })
      // })
    }
  }
}
</script>
<style lang="less"></style>
