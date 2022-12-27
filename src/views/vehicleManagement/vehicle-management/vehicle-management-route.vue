<template>
  <div id="VehicleManagementRoute">
    <TyTrackMap carrier="vehicle" :lineData="lineData" :markerData="waterData" @search="search"></TyTrackMap>
  </div>
</template>

<script>
import TyTrackMap from "@/components/ty-track-map/ty-track-map.vue"
export default {
  name: "VehicleManagementRoute",
  components: { TyTrackMap },
  provide() {
    return {
      pageType: "vehicle-management",
      dataId: () => this.dataId
    }
  },
  data() {
    return {
      dataId: -1,
      waterData: [], // 加水点数据
      lineData: {} // 轨迹原始数据
    }
  },
  created() {
    if (this.$route.query.id !== "") {
      this.search()
    }
  },
  mounted() {},
  methods: {
    search(time) {
      let data = {
        id: this.$route.query.id,
        start_time: time
          ? time.start_time
          : this.$moment()
              .subtract(1, "days")
              .format("YYYY-MM-DD HH:mm:ss"),
        end_time: time ? time.over_time : this.$moment().format("YYYY-MM-DD HH:mm:ss")
      }
      this.$api.getVehicleTrack(data).then(res => {
        this.lineData = res.data
      })
      this.dataId = this.$route.query.id
    }
  }
}
</script>

<style lang="less">
#VehicleManagementRoute {
  .map {
    width: 100%;
    height: 500px;
  }
}
</style>
