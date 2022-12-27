<template>
  <div id="MintpassRubbishPosition">
    <TyReturn></TyReturn>
    <TyShowMapPosition :height="height" :details="details" :position="position"></TyShowMapPosition>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
import TyShowMapPosition from "@/components/ty-show-map-position/ty-show-map-position"
export default {
  name: "MintpassRubbishPosition",
  components: { TyReturn, TyShowMapPosition },
  data() {
    return {
      height: "",
      details: {}, // 详情数据
      position: [], // 定位点经纬度
      screenHeight: document.documentElement.clientHeight // 地图高度
    }
  },
  mounted() {
    // 设置地图可用高度
    this.getHeight(this.screenHeight)

    // 定义窗口大小变更通知事件
    window.onresize = () => {
      this.screenHeight = document.documentElement.clientHeight
      this.getHeight(this.screenHeight)
    }
    console.log(this.$route.query, "query")
    this.getMintpassRubbishLocation()
  },
  methods: {
    // 计算地图可用高度
    getHeight(value) {
      let height = Number(value) - 220
      this.height = (height < 400 ? 500 : height) + "px"
    },

    // 获取定位详情
    getMintpassRubbishLocation() {
      this.$api.getMintpassRubbishLocation({ id: this.$route.query.id || 0 }).then(res => {
        console.log(res, "res详情")
        this.details.canName = res.data.canName || ""
        this.details.canNumber = res.data.canNumber || ""
        this.details.isOpen = res.data.isOpen === 1 ? "正常" : "停止"
        this.details.plotName = res.data.plotName || ""
        this.details.location = res.data.location || ""
        this.position = [res.data.longitude, res.data.latitude]
      })
    }
  }
}
</script>

<style></style>
