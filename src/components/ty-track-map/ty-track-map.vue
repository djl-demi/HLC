<template>
  <div id="TyTrackMap">
    <TyTrackSetting v-if="settingShow" @settingChange="settingChange" ref="TyTrackSetting" @switch="switchChange" @search="search"></TyTrackSetting>
    <div class="map-box">
      <div id="trackMapContainer"></div>
      <TyTrackInfo v-show="setting.showDetail" :screenHeight="screenHeight" :infoData="infoData" class="track-info"></TyTrackInfo>
    </div>
  </div>
</template>

<script>
import AMap from "AMap"
import TyTrackInfo from "@/components/ty-track-map/ty-track-info.vue"
import TyTrackSetting from "@/components/ty-track-map/ty-track-setting.vue"
export default {
  name: "TyTrackMap",
  components: { TyTrackInfo, TyTrackSetting },
  props: {
    // 顶部设置显示隐藏
    settingShow: {
      default: true,
      type: Boolean
    },
    lineData: Object // 轨迹数据
  },
  inject: ["pageType"],
  data() {
    return {
      map: Object,
      marker: {},
      polyline: Object,
      polygon: Object,
      passedPolyline: Object,
      lineArr: [], // 轨迹经纬度
      pointIndex: 1, // 同步返回的坐标点序号
      infoData: {}, // 给信息组件的数据
      screenHeight: document.documentElement.clientHeight, // 地图高度
      setting: { showDetail: true, loopPlay: true, autoPlay: true, speed: 1000 },
      currentAutoPlay: true,
      show_facility: {}
    }
  },
  created() {
    // 将本地设置取出赋值
    let setting = JSON.parse(localStorage.getItem("TrackSet"))
    if (setting) {
      this.setting = setting
      this.currentAutoPlay = this.setting.autoPlay || true // 赋值自动播放设置
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

    // 初始化地图
    this.map = new AMap.Map("trackMapContainer", {
      resizeEnable: true,
      mapStyle: this.$store.state.menuTheme === "dark" ? "amap://styles/grey" : "amap://styles/whitesmoke",
      zoom: 16
    })
  },
  beforeDestroy() {
    clearTimeout() // 清除延时器
    this.map.destroy() // 销毁地图实例,否则切换到其他有地图的组件时,会有残留功能
  },
  methods: {
    // 计算地图可用高度
    getHeight(value) {
      let trackMapContainer = document.getElementById("trackMapContainer")
      let height = Number(value) - 160
      trackMapContainer.style.height = (height - 160 < 400 ? 500 : height) + "px"
    },

    // 绘制对象路线并开始移动
    startMove() {
      this.pointIndex = 0
      this.map.clearMap()
      this.drawMarker() // 绘制起点终点
      this.drawPolyline() // 绘制轨迹
      this.drawPassedPolyline() // 绘制已走过的轨迹
      this.map.setFitView() // 地图自适应

      // 移动时触发
      this.marker.on("moving", e => {
        this.passedPolyline.setPath(e.passedPath) // 赋值经纬度 绘制已经移动的路线
      })

      // 移动到某个点时触发, 获取当前点的经纬度
      this.marker.on("moveend", () => {
        if (this.setting.showDetail) this.setInfoData(this.lineData, this.pointIndex) // 如果显示详情 就赋值最新数据
        this.pointIndex++
      })

      // 执行完一次移动动画时触发
      this.marker.on("movealong", () => {
        if (this.setting.loopPlay) {
          this.repeatMove() // 如果是循环播放,再次进行播放
        } else {
          this.passed()
          this.marker.setPosition(this.lineArr[0])
          this.$refs.TyTrackSetting.play = false
        }
      })
      if (this.currentAutoPlay) {
        this.marker.moveAlong(this.$utils.deepCopy(this.lineArr), this.setting.speed)
      }
    },

    // 绘制Marker
    drawMarker() {
      let marker = {
        map: this.map,
        position: this.lineArr[0]
      }
      marker = Object.assign(marker, {
        icon: require("@/assets/icons/car.png"),
        offset: new AMap.Pixel(-16, -15),
        autoRotation: true,
        angle: 0
      })
      this.marker = new AMap.Marker(marker)
      let start_marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
        position: this.lineArr[0]
      })

      let over_marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        position: this.lineArr[this.lineArr.length - 1]
      })

      this.map.add(start_marker)
      this.map.add(over_marker)
    },

    // 绘制轨迹线
    drawPolyline() {
      let MapGroups = []
      // 处理出不同情况的路线
      let allPath = []
      let is_out = this.lineData.vehicle_card_info[0].is_out // 当前轨迹点状态
      let arr = [] // 当前轨迹点路线
      this.lineData.vehicle_card_info.forEach((item, index) => {
        if (item.is_out === is_out) {
          arr.push(item.location)
        } else {
          if (arr.length > 0) {
            // 说明之前的循环有其他状态的点 这时要把这些点创建出一条路线
            arr.push(item.location)
            allPath.push({
              type: is_out,
              path: arr
            })
          }
          // // 继续循环 创建新的路线
          is_out = item.is_out
          arr = []
          arr.push(item.location)
        }
        if (index === this.lineData.vehicle_card_info.length - 1) {
          allPath.push({
            type: is_out,
            path: this.$utils.deepCopy(arr)
          })
        }
      })
      allPath.forEach(item => {
        MapGroups.push(
          new AMap.Polyline({
            path: item.path,
            showDir: true,
            strokeColor: "#28F",
            lineJoin: "round",
            strokeWeight: 6,
            extData: { lineName: "polyline" }
          })
        )
      })
      new AMap.OverlayGroup(MapGroups).setMap(this.map)
    },

    // 绘制已走过的轨迹线
    drawPassedPolyline() {
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5",
        strokeWeight: 6,
        lineJoin: "round",
        strokeOpacity: 0.5,
        extData: { lineName: "passedPolyline" } // 自定义属性,获取该路线对象时需要用的
      })
    },

    // 重置已经走过的路线
    passed() {
      this.marker.setPosition(this.lineArr[0])
      this.pointIndex = 1 // 重置轨迹点序号
      this.setInfoData(this.lineData, 0) // 重置左边信息
      // 清除地图上已走过的路线经纬度
      const Polyline = this.map.getAllOverlays("Polyline")
      Polyline.forEach(item => {
        if (item.getExtData().lineName === "passedPolyline") {
          item.setPath([])
        }
      })
    },

    // 循环播放
    repeatMove() {
      this.passed()
      // 延时开始, 直接开始会出现bug
      setTimeout(() => {
        this.marker.moveAlong(this.lineArr, this.setting.speed)
      }, 100)
    },

    // 修改设置
    settingChange(e, play) {
      if (play && this.setting.speed !== e.speed) this.repeatMove() // 如果修改了速度 重新播放
      this.setting = e
    },

    // 开始/暂停
    switchChange(e) {
      // getAnchor  判断一下是否存在该属性  如果有该属性才有marker 防止进入页面没有轨迹数据时点击开始/暂停出现bug
      if (this.marker.getAnchor) {
        if (e) {
          // 如果开着自动播放,就调用继续播放的方法,如果没开就将它设置为true,并调用开始播放的方法
          if (this.currentAutoPlay) {
            this.marker.resumeMove()
          } else {
            this.currentAutoPlay = true
            this.marker.moveAlong(this.$utils.deepCopy(this.lineArr), this.setting.speed)
          }
        } else {
          this.marker.pauseMove()
        }
      } else {
        this.$message.info("当前时间段暂无轨迹信息")
      }
    },

    // 查询
    search(time) {
      this.$emit("search", time)
    },

    // 赋值左侧数据
    setInfoData(data, index) {
      this.infoData = {
        license_plate_number: data.license_plate_number || "",
        job_type_name: data.job_type_name || "",
        vehicle_name: data.vehicle_name || "",
        load_capacity: data.load_capacity || "",
        total_distance: data.total_distance || ""
      }
      if (data.vehicle_card_info.length > 0) {
        this.infoData.distance = data.vehicle_card_info[index].distance || ""
        this.infoData.direction = data.vehicle_card_info[index].direction || ""
        this.infoData.speed = data.vehicle_card_info[index].speed || 0
        this.infoData.address = data.vehicle_card_info[index].address || ""
        this.infoData.type_time = data.vehicle_card_info[index].type_time || ""
        this.infoData.state_text = data.vehicle_card_info[index].state_text || ""
      }
    }
  },

  watch: {
    // 轨迹数据
    lineData: {
      handler(val) {
        this.setInfoData(val, 0) // 显示左边信息
        if (val.vehicle_card_info.length > 0) {
          this.lineArr = val.vehicle_card_info.map(item => {
            item.location = [+item.lon, +item.lat]
            return item.location
          })
          this.startMove() // 绘制对象路线并开始移动
        } else {
          this.$message.info("当前时间段暂无轨迹信息")
          if (this.map) this.map.clearMap()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
#TyTrackMap {
  overflow: hidden;
  #trackMapContainer {
    width: 100%;
  }
  .map-box {
    position: relative;
    .track-info {
      position: absolute;
      top: 15px;
      left: 15px;
    }
    .track-table {
      position: absolute;
      bottom: 0px;
      width: 100%;
    }
  }
}
</style>
