<template>
  <!-- 分类一张图 -->
  <div id="classify-map">
    <TyClassifyMap :markerData="markerData"></TyClassifyMap>
  </div>
</template>

<script>
import TyClassifyMap from "../../components/ty-classification-map/ty-container-map.vue"
export default {
  name: "classify-map",
  data() {
    return {
      markerData: [],
      filterType: "1",
      keyword: "",
      resdata: ""
    }
  },
  components: {
    TyClassifyMap
  },
  created() {
    this.resdata = this.res1
    this.markerList()
  },
  mounted() {
    // 筛选图层设施
    this.$bus.$on("showFacility", data => {
      console.log("筛选过滤", data)
      this.filterType = data.type
      this.keyword = data.keyword
      this.markerList()
    })
  },
  methods: {
    markerList() {
      let data = {
        type: this.filterType,
        name: this.keyword
      }
      this.$api.getCommunityChart(data).then(res => {
        this.markerData = res.data.map(item => {
          item.value = item.only
          item.label = item.name
          item.location = [item.longitude, item.latitude]
          return item
        })
      })
    }
  }
}
</script>

<style></style>
