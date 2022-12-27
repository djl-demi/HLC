<template>
  <div>
    <TyReturn></TyReturn>
    <TyPermission :sourceData="sourceData"></TyPermission>
  </div>
</template>

<script>
import TyPermission from "@/components/ty-permission/ty-permission.vue"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "BackgroundAccountPermission",
  components: { TyPermission, TyReturn },
  data() {
    return {
      sourceData: []
    }
  },
  created() {
    this.getTableList(this.$route.query.id)
  },
  methods: {
    getTableList(id) {
      this.$api.viewPositionPermission({ id, sys: 1 }).then(res => {
        this.sourceData = res.data.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
      })
    }
  }
}
</script>

<style></style>
