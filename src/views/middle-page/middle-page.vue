<template>
  <div id="MiddlePage">
    <div v-if="errorPage" class="errorPage">
      <img src="@/assets/error_page.png" alt="" />
      <div class="text">Ooops! ! ! 链接已失效! o(╥﹏╥)o</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MiddlePage",
  data() {
    return {
      errorPage: false
    }
  },

  beforeCreate() {
    this.$api
      .unionLogin({ token: this.$utils.getQueryVariable("token") || "", type: this.$utils.getQueryVariable("type") || "" })
      .then(res => {
        this.$com.loginSet.call(this, res.data)
      })
      .catch(err => {
        this.errorPage = true
      })
  }
}
</script>

<style lang="less">
#MiddlePage {
  height: 100%;
  width: 100%;
  .errorPage {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    img {
      width: 500px;
    }
    .text {
      font-size: 36px;
      color: #85ce36;
      margin-top: 60px;
    }
  }
}
</style>
