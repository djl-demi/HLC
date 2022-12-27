<template>
  <div>
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
    </a-space>
    <div class="line mtb10 "></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {},
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.line {
  width: 100%;
  height: 1px;
  background: #bdbdbd;
}
</style>
