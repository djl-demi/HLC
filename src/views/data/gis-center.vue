<template>
  <!-- Gis中心 -->
  <div class="gisCenter">
    <!-- <div id="container"></div> -->
    <div class="map_legend">
      <!-- <TyLegend :facilityType="facilityType" @getFacilityType="getFacilityType"></TyLegend> -->
    </div>
     <div class="facilities_summary ">
      <TyLatestCategoriesRecycle></TyLatestCategoriesRecycle>
    </div>

    <div class="latest_categories_recycle">
      <TyChukuPie></TyChukuPie>
    </div>
    <div class="chuku_pie_chart">
      <TyFacilitesStatictis></TyFacilitesStatictis>
    </div>

    <div class="chuku_trace_chart">
      <TyChukuTrace></TyChukuTrace>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import TyFacilitesStatictis from "../../components/ty-data/facilities_statictis.vue"
import TyLatestCategoriesRecycle from "../../components/ty-data/latestcatrgory_recycle.vue"
import TyChukuPie from "../../components/ty-data/chuku_pie.vue"
import TyChukuTrace from "../../components/ty-data/trace_category.vue"
// import TyLegend from "../../components/ty-data/maplegend.vue"
import AMap from "AMap"
export default {
  name: "gisCenter",
  data() {
    return {
      map: {},
      markers: [],
      carMarker: {},
      infoWindow: {},
      markerIcon: [
        require("../../assets/data/index/plot_marker.png"),
        require("../../assets/data/index/gov_marker.png"),
        require("../../assets/data/index/wisdom_trash_marker.png"),
        require("../../assets/data/index/recycleroom_marker.png"),
        require("../../assets/data/index/vehicle_marker.png"),
        require("../../assets/data/index/dealfact_marker.png"),
        require("../../assets/data/index/sort_marker.png")
      ],
      facilityType: 0,
      overlayGroups: [],
      template: "",
      passedPolyline: Object,
      marker: Object,
      line: [],
      points: [],
      count: 0
    }
  },
  components: {
    TyFacilitesStatictis,
    TyLatestCategoriesRecycle,
    TyChukuPie,
    TyChukuTrace,
    // TyLegend
  },
  mounted() {
    // 默认全部设施
    // this.getGisFacilitesMarker(0)
  },
  methods: {
    // 过滤设施类别
    getFacilityType(val) {
      this.getGisFacilitesMarker(val)
    },
    // 获取设施的点
    getGisFacilitesMarker(type = 0) {
      let data = {
        type: type
      }
      this.markers = []
      this.$api.getGisFacilitesMarker(data).then(res => {
        this.markers = res.data
        // this.initMap()
      })
    },
    initMap() {
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        mapStyle: "amap://styles/darkblue",
        zooms: [4, 20],
        pitch: 60,
        skyColor: "#060a52",
        rotation: -0.7908261543741522,
        viewMode: "3D", //开启3D视图,默认为关闭
        buildingAnimation: true //楼块出现是否带动画
      })

      var positions = this.getPosition(this.markers)
      // for (var i = 0; i < positions.length; i++) {
      //   this.marker = new AMap.Marker({
      //     map: this.map,
      //     position: positions[i].location,
      //     icon: new AMap.Icon({
      //       size: new AMap.Size(30, 44), //图标大小
      //       imageSize: new AMap.Size(30, 44),
      //       image: this.markerIcon[positions[i].type - 1]
      //     }),
      //     offset: new AMap.Pixel(-5, -44)
      //   })
      //   this.overlayGroups.push(this.marker)
      //   // 窗口
      //   this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(12, -30), isCustom: false })

      //   this.marker.onlyid = positions[i].only
      //   this.marker.type = positions[i].type
      //   this.marker.on("click", this.markerClick)
      // }

      this.points = []
      positions.map(item => {
        if (item.location.length > 0) {
          this.points.push({
            lnglat: [item.location[1], item.location[0]],
            type: item.type,
            only: item.only
          })
        }
      })

      this.count = this.points.length
      this.addCluster()
      this.map.setFitView()
    },
    // 聚合
    renderClusterMarker(context) {
      var factor = Math.pow(context.count / this.count, 1 / 18)
      var div = document.createElement("div")
      var Hue = 180 - factor * 180
      var bgColor = "hsla(" + Hue + ",100%,50%,0.7)"
      var fontColor = "hsla(" + Hue + ",100%,20%,1)"
      var borderColor = "hsla(" + Hue + ",100%,40%,1)"
      var shadowColor = "hsla(" + Hue + ",100%,50%,1)"
      div.style.backgroundColor = bgColor
      var size = Math.round(30 + Math.pow(context.count / this.count, 1 / 5) * 20)
      div.style.width = div.style.height = size + "px"
      div.style.border = "solid 1px " + borderColor
      div.style.borderRadius = size / 2 + "px"
      div.style.boxShadow = "0 0 1px " + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + "px"
      div.style.color = "#FFF" //fontColor
      div.style.fontSize = "14px"
      div.style.textAlign = "center"
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    addCluster() {
      if (this.cluster) {
        this.cluster.clearMarkers()
        this.cluster.setMap(null)
      }
      let overlayGroups = []
      this.markers = []
      for (var i = 0; i < this.points.length; i += 1) {
        let only = this.points[i]["only"]
        let marker = this.markerPoint(this.points[i]["lnglat"][1], this.points[i]["lnglat"][0], this.points[i]["type"])
        marker.setExtData({ id: only }) // 给实例绑定它的id
        this.infoWindow = this.floatInfoWindow()
        marker.onlyid = this.points[i].only
        marker.type = this.points[i].type
        marker.on("click", this.markerClick)
        overlayGroups.push(marker)
        this.markers.push(marker)
      }
      new AMap.OverlayGroup(overlayGroups).setMap(this.map)

      this.cluster = new AMap.MarkerClusterer(this.map, this.markers, {
        gridSize: 60,
        maxZoom: 16,
        renderClusterMarker: this.renderClusterMarker
      })
    },
    // 标识点实例
    markerPoint(longitude = "", latitude = "", type) {
      return new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude),
        icon: new AMap.Icon({
          size: new AMap.Size(30, 44), //图标大小
          imageSize: new AMap.Size(30, 44),
          image: this.markerIcon[type - 1]
        }),
        offset: new AMap.Pixel(-5, -44)
      })
    },
    // 浮动的信息窗口
    floatInfoWindow() {
      return new AMap.InfoWindow({ offset: new AMap.Pixel(12, -30), isCustom: false })
    },
    // 绘制Marker
    drawMarker() {
      let marker = {
        map: this.map,
        position: this.line[0]
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
        position: this.line[0]
      })

      let over_marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        position: this.line[this.line.length - 1]
      })

      this.map.add(start_marker)
      this.map.add(over_marker)
    },
    // 画基本的轨迹
    drawSimplePolyline() {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.line,
        showDir: true,
        lineJoin: "round",
        strokeColor: "#28F",
        strokeWeight: 6,
        extData: { lineName: "polyline" }
      })
    },

    // 绘制已走过的轨迹线
    drawPassedPolyline() {
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        lineJoin: "round",
        strokeColor: "#AF5",
        strokeWeight: 6,
        strokeOpacity: 0.5,
        extData: { lineName: "passedPolyline" } // 自定义属性,获取该路线对象时需要用的
      })
    },
    // 绘制对象路线并开始移动
    startMove() {
      this.infoWindow.close()
      // this.pointIndex = 0
      this.map.clearMap()
      this.drawMarker() // 绘制起点终点
      this.drawSimplePolyline() // 绘制轨迹
      this.drawPassedPolyline() // 绘制已走过的轨迹
      this.map.setFitView() // 地图自适应

      // 移动时触发
      this.marker.on("moving", e => {
        this.passedPolyline.setPath(e.passedPath) // 赋值经纬度 绘制已经移动的路线
      })

      // 执行完一次移动动画时触发
      this.marker.on("movealong", () => {
        console.log("movealong")
        // this.repeatMove() // 如果是循环播放,再次进行播放
      })

      this.marker.moveAlong(this.line, 5000)
      // // 执行完一次移动动画时触发
      // this.marker.on("movealong", () => {
      //   if (this.setting.loopPlay) {
      //     this.repeatMove() // 如果是循环播放,再次进行播放
      //   } else {
      //     this.passed()
      //     this.marker.setPosition(this.lineArr[0])
      //     this.$refs.TyTrackSetting.play = false
      //   }
      // })
      // if (this.currentAutoPlay) {
      //   this.marker.moveAlong(this.$utils.deepCopy(this.lineArr), this.setting.speed)
      // }
    },
    // 重置已经走过的路线
    // passed() {
    //   this.marker.setPosition(this.lineArr[0])
    //   this.pointIndex = 1 // 重置轨迹点序号
    //   this.setInfoData(this.lineData, 0) // 重置左边信息
    //   // 清除地图上已走过的路线经纬度
    //   const Polyline = this.map.getAllOverlays("Polyline")
    //   Polyline.forEach(item => {
    //     if (item.getExtData().lineName === "passedPolyline") {
    //       item.setPath([])
    //     }
    //   })
    // },
    // 循环播放
    repeatMove() {
      //   this.passed()
      // 延时开始, 直接开始会出现bug
      setTimeout(() => {
        this.marker.moveAlong(this.line, 5000)
      }, 100)
    },
    // 坐标窗体
    markerClick(e) {
      let data = {
        only: e.target.onlyid
      }
      let that = this
      that.$api.getGisFacilitesMarkerDetail(data).then(res => {
        var info = res.data
        switch (e.target.type) {
          case 1:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">小区信息</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">名称：` +
              info.plot_name +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.address +
              `">地址：` +
              info.address +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">小区户数：` +
              info.total_number +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">入住户数：` +
              info.at_number +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">注册用户数：` +
              info.user_number +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">知晓率：` +
              info.registration_rate +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">活动总数（本月）：` +
              info.activity_number +
              `</div><div style="line-height:30px; height:30px;color:white; margin-left:10px">回收总量（本月）：` +
              info.total_recovery +
              `</div></div>`

            break
          case 2:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">事业单位</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">名称：` +
              info.community +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.address +
              `">地址：` +
              info.address +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">小区户数：` +
              info.total_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">入住户数：` +
              info.at_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">注册用户数：` +
              info.user_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">知晓率：` +
              info.registration_rate +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">活动总数（本月）` +
              info.activity_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">回收总量（本月）` +
              info.total_recovery +
              `</div></div>`
            break

          case 3:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">智能垃圾桶</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">名称：` +
              info.can_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">编号：` +
              info.can_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">状态：` +
              info.is_open_text +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.address +
              `">位置：` +
              info.address +
              `</div></div>`
            break

          case 4:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">环保屋信息</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">名称：` +
              info.house_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">编号：` +
              info.house_no +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">状态：` +
              info.state_text +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">营业时间：` +
              info.work_week +
              " " +
              info.work_time +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.address +
              `">地址：` +
              info.address +
              `</div></div>`
            break

          case 5:
            // 车辆
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">车辆信息</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">车辆状态：` +
              info.state_text +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">车牌：` +
              info.license_plate_number +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">类型：` +
              info.vehicle_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">数量：` +
              info.load_capacity +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">所属：` +
              info.belong +
              `</div><div height:35px;color:white; margin-left:10px"><button @click="play" style="background:#31C27C; border: none; margin: 5px auto; width:80%; height:25px; color:white">播放轨迹</button></div></div>`
            that.line = []
            that.$utils.deepCopy(res.data.location.vehicle_card_info).map(item => {
              that.line.push([Number(item.lon), Number(item.lat)])
            })
            // 路径
            that.drawSimplePolyline()
            break

          case 6:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">处理厂信息</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">名称：` +
              info.merchant_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.address +
              `">地址：` +
              info.address +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">联系人：` +
              info.contacts +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">联系电话：` +
              info.phone +
              `</div></div>`
            break

          case 7:
            that.template =
              `<div style="background:rgba(11,26,67,0.4);"><div style="line-height:35px; height:35px; font-size:16px; color:white; margin-left:10px; border-bottom: dotted 1px">分拣中心信息</div><div style="line-height:25px; height:25px; color:white; margin-left:10px">名称：` +
              info.site_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">编号：` +
              info.site_no +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">状态：` +
              info.status_name +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px">营业时间：` +
              info.open_time +
              `</div><div style="line-height:25px; height:25px;color:white; margin-left:10px; overflow:hidden" title="` +
              info.site_address +
              `">地址：` +
              info.site_address +
              `</div></div>`
            break
          default:
            break
        }

        // that.infoWindow.setContent(e.target.content)
        const windComponent = Vue.extend({
          template: that.template,
          data: function() {
            return {}
          },
          methods: {
            play() {
              // 开始播放
              that.startMove()
            }
          }
        })

        // 挂载
        const extendWindow = new windComponent().$mount()
        that.infoWindow.setContent(extendWindow.$el)
        // this.infoWindow.setContent(e.target.content)
        that.infoWindow.open(that.map, e.target.getPosition())
      })
    },
    // 整理坐标
    getPosition(locations) {
      let positions = []
      locations.forEach(ele => {
        if (ele.longitude && ele.latitude) {
          positions.push({
            name: ele.name,
            type: ele.type,
            only: ele.only,
            location: [Number(ele.longitude), Number(ele.latitude)],
            detail: ele
          })
        }
      })
      return positions
    }
  }
}
</script>

<style scoped lang="less">
.gisCenter {
  height: 100%;
}

#container {
  height: 100%;
}

.facilities_summary {
  position: absolute;
  top: 130px;
  left: 10px;
}

.latest_categories_recycle {
  position: absolute;
  top: 590px;
  left: 10px;
}

.chuku_pie_chart {
  position: absolute;
  top: 130px;
  right: 10px;
}

.chuku_trace_chart {
  position: absolute;
  top: 590px;
  right: 10px;
}

.form_content {
  width: 228px;
  height: 153px;
  background-image: url(../../assets/data/index/windowform_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.map_legend {
  position: absolute;
  right: 530px;
  top: 720px;
  z-index: 999;
}

/deep/ .amap-info-content {
  background-color: #0b1a43;
}
</style>
