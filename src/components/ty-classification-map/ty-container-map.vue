<template>
  <!-- 地图组件：点定位、点交互 -->
  <div id="map-container">
    <div class="search">
      <a-input-group compact>
        <a-select v-model="ftype" :options="sreachTypeOptions" style="width: 30%"> </a-select>
        <a-input-search style="width: 70%" v-model="search_txt" placeholder="请输入查询信息" enter-button @search="onSearch(0)" />
      </a-input-group>
    </div>
    <div class="search_result" v-if="showSreachPanel">
      <a-card :loading="detailLoading" :bordered="false" :hoverable="true">
        <div class="search_result_note">共查询到{{ searchount }}个{{ TypeName }}信息</div>
        <a-divider />
        <div class="search_list">
          <a-list size="small" :bordered="false" :data-source="searchResult">
            <a-list-item slot="renderItem" slot-scope="item" @click="locate(item)">
              <a-row style="width:100%">
                <a-col :span="4" style="width:15%">
                  <div class="height-60"><img class="avater" :src="item.iconPic" /></div>
                </a-col>
                <a-col :span="16">
                  <div class="name height-60">{{ item.name }}</div>
                </a-col>
                <a-col :span="4" style="width:15%">
                  <div class="location height-60"><a-icon type="environment" :style="{ color: 'lightblue' }" /></div>
                </a-col>
              </a-row>
            </a-list-item>
          </a-list>
        </div>
        <template>
          <div class="pagecss">
            <a-pagination size="small" :showLessItems="true" :total="total" v-model="page" :default-current="1" @change="onSearch()" />
          </div>
        </template>
      </a-card>
    </div>
    <div class="info" v-if="showPanel">
      <a-card :title="panelTitle" :loading="detailLoading" :bordered="false" :hoverable="true">
        <a-icon v-if="activityId > 0" @click="showActivity(activityId, activityType)" slot="extra" type="gift" style="margin-right:20px" />
        <a-icon slot="extra" type="close" @click="showPanel = false" />
        <p v-for="(item, index) in pannelInfo" v-bind:key="index" :title="item.value" style="height:20px; overflow:hidden">{{ item.label }}：{{ item.value }}</p>
        <p>
          <a-button v-if="clickType == 5" type="primary" style="width:100%" @click="viewTrack">{{ buttonTxt }}</a-button>
        </p>
      </a-card>
    </div>
    <!-- <div class="select">
      <a-select show-search placeholder="请选择地点" :options="markerData" class="w300" :filter-option="$com.filterOption" @change="markerChange" allowClear>
        <a-icon slot="suffixIcon" type="search" />
      </a-select>
    </div> -->
    <!-- map容器 -->
    <div id="container"></div>
    <TyMapLegend></TyMapLegend>
  </div>
</template>

<script>
import AMap from "AMap"
import TyMapLegend from "../../components/ty-classification-map/ty-map-legend.vue"
export default {
  name: "map-container",
  data() {
    return {
      ftype: 1,
      TypeName: "",
      search_txt: "",
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      map: undefined, // 高德地图实例
      showPanel: false,
      detailLoading: false, // 详情窗加载状态
      buttonTxt: "播放轨迹",
      showVehicleTrack: false, // 是否显示车辆轨迹
      data: [],
      pannelInfo: [],
      clickType: "",
      panelTitle: "",
      activityId: 0,
      activityType: 0,
      cluster: null,
      gridSize: 60,
      points: [],
      content: "",
      count: 0,
      markers: [],
      sreachTypeOptions: [
        { label: "居民小区", value: 1 },
        { label: "事业单位", value: 2 },
        { label: "智能桶", value: 3 },
        { label: "环保屋", value: 4 },
        { label: "车辆", value: 5 },
        { label: "处理厂", value: 6 },
        { label: "分拣中心", value: 7 },
        { label: "仓库", value: 8 },
        { label: "人员", value: 9 },
        { label: "活动", value: 10 }
      ],
      // defaultType: 1,
      searchResult: [],
      searchount: 0,
      showSreachPanel: false,
      total: 0,
      page: 1
    }
  },
  components: {
    TyMapLegend
  },
  props: {
    markerData: Array
  },
  watch: {
    markerData: {
      handler(val) {
        this.showPanel = false
        this.markerData = val
        // console.log("监测this.markerData", this.markerData)
        this.init()
      }
    }
  },
  mounted() {
    this.getHeight(this.screenHeight)
    this.init()

    // 定义窗口大小变更通知事件
    window.onresize = () => {
      this.screenHeight = document.documentElement.clientHeight
      this.getHeight(this.screenHeight)
    }
  },
  methods: {
    viewTrack() {
      if (this.buttonTxt == "播放轨迹") {
        this.buttonTxt = "暂停轨迹"
        // 播放操作
        this.startMove(this.data)
      } else if (this.buttonTxt == "暂停轨迹") {
        this.buttonTxt = "继续轨迹"
        // 暂停操作
        this.marker.pauseMove()
      } else if (this.buttonTxt == "继续轨迹") {
        this.buttonTxt = "暂停轨迹"
        this.marker.resumeMove()
      }
    },
    // 选择标识点
    markerChange(value, option) {
      if (value) {
        this.map.setCenter(option.data.props.location) //设置地图中心点
        this.map.setZoom(17) //设置地图层级
      } else {
        this.map.setZoom(12) //设置地图层级
      }
    },
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
    renderMarker(context) {
      this.content =
        '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>'
      var offset = new AMap.Pixel(-9, -9)
      context.marker.setContent(this.content)
      context.marker.setOffset(offset)
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
        let marker = this.markerPoint(this.points[i]["lnglat"][0], this.points[i]["lnglat"][1], this.points[i]["type"])
        marker.setExtData({ id: only }) // 给实例绑定它的id
        let info = this.points[i]["name"]
        let infoWindow = this.floatInfoWindow(info)
        marker.on("mouseover", event => infoWindow.open(this.map, marker.getPosition()))
        marker.on("mouseout", event => infoWindow.close())
        marker.on("click", event => this.showPanelWindow(only))
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

    // 初始化高德地图
    init() {
      const that = this
      this.map = new AMap.Map("container", { resizeEnable: true, zoom: 14, mapStyle: "amap://styles/whitesmoke" })

      this.points = []
      this.markerData.map(item => {
        if (item.latitude && item.longitude) {
          this.points.push({
            lnglat: [item.longitude, item.latitude],
            type: item.type,
            only: item.only,
            name: item.type == 5 ? item.license_plate_number : item.name
          })
        }
        // console.log(item.longitude, item.latitude)
      })

      this.count = this.points.length
      this.addCluster()

      // 监听点击地图事件,用于隐藏详情窗
      this.map.on("click", function(e) {
        that.showSreachPanel = false
        that.showPanel = false
      })
      // let overlayGroups = []
      /*
      this.markerData.forEach(item => {
        if (item.latitude && item.longitude) {
          // 创建点标识
          let marker = this.markerPoint(item.longitude, item.latitude, item.type)
          marker.setExtData({ id: item.only }) // 给实例绑定它的id
          // console.log("marker", marker)
          // 创建信息窗体信息
          let info = item.type == 5 ? item.license_plate_number : item.name
          let infoWindow = this.floatInfoWindow(info)
          marker.on("mouseover", event => infoWindow.open(this.map, marker.getPosition()))
          marker.on("mouseout", event => infoWindow.close())
          marker.on("click", event => this.showPanelWindow(item.only))
          overlayGroups.push(marker)
        }
      })
      */
      // new AMap.OverlayGroup(overlayGroups).setMap(this.map)

      this.map.setFitView()
    },
    // 计算地图可用高度
    getHeight(value) {
      let container = document.getElementById("container")
      container.style.height = Number(value) - 150 + "px"
    },
    // 标识点实例
    markerPoint(longitude = "", latitude = "", type) {
      let icon = ""
      switch (type) {
        case 1:
          icon = require("@/assets/icons/jumingxiaoqu.png")
          break
        case 2:
          icon = require("@/assets/icons/shiyedanwei.png")
          break
        case 3:
          icon = require("@/assets/icons/zhinengtong.png")
          break
        case 4:
          icon = require("@/assets/icons/huanbaowu.png")
          break
        case 5:
          icon = require("@/assets/icons/cheliang.png")
          break
        case 6:
          icon = require("@/assets/icons/chulichang.png")
          break
        case 7:
          icon = require("@/assets/icons/fenjianzhongxin.png")
          break
        case 8:
          icon = require("@/assets/icons/cangku.png")
          break
        case 9:
          icon = require("@/assets/icons/renyuan.png")
          break
        case 10:
          icon = require("@/assets/icons/huodong.png")
          break
        default:
          icon = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png"
      }
      return new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude),
        icon: icon,
        offset: new AMap.Pixel(-13, -30)
      })
    },
    // 浮动的信息窗口
    floatInfoWindow(name = "") {
      return new AMap.InfoWindow({
        isCustom: true, // 自定义窗体
        offset: new AMap.Pixel(40, -40),
        closeWhenClickMap: true, // 鼠标点击地图后关闭窗体
        content: `<div class="bgc-white p10"><span>${name}</span></div>`
      })
    },
    // 面板窗口
    showPanelWindow(only = "") {
      console.log("only", only)
      this.showPanel = true
      this.showSreachPanel = false
      let markerType = Number(only.split("_")[0])
      // 如果是车辆还需要显示轨迹
      this.showVehicleTrack = true
      if (markerType == 5) {
        this.buttonTxt = "播放轨迹"
        this.showVehicleTrack = true
        this.map.clearMap()
        this.init()
        // 请求接口获取轨迹
        this.getVehicleTrackPoints(only)
      }
      this.detailLoading = true
      this.$api.getCommunityChartDetail({ only }).then(res => {
        if (res.data) {
          this.showPanelTable(res.data, markerType)
        }
        this.detailLoading = false
      })
    },
    // 搜索
    onSearch(value) {
      this.page = value == 0 ? 1 : this.page
      console.log("page", this.page)
      let data = {
        type: this.ftype == undefined ? "" : this.ftype,
        name: this.search_txt,
        page: this.page || 1
      }
      this.$api.getChartMarkersList(data).then(res => {
        console.log("res", res)
        let dataSource = []
        let TypeName = ""
        dataSource = res.data.data.map(item => {
          item.key = item.id
          let icon = ""
          switch (item.type) {
            case 1:
              icon = require("@/assets/icons/jumingxiaoqu_icon.png")
              TypeName = "居民小区"
              break
            case 2:
              icon = require("@/assets/icons/shiyedanwei_icon.png")
              TypeName = "事业单位"
              break
            case 3:
              icon = require("@/assets/icons/zhinengtong_icon.png")
              TypeName = "智能桶"
              break
            case 4:
              icon = require("@/assets/icons/huanbaowu_icon.png")
              TypeName = "环保屋"
              break
            case 5:
              icon = require("@/assets/icons/cheliang_icon.png")
              TypeName = "车辆"
              break
            case 6:
              icon = require("@/assets/icons/chulichang_icon.png")
              TypeName = "处理厂"
              break
            case 7:
              icon = require("@/assets/icons/fenjianzhongxin_icon.png")
              TypeName = "分拣中心"
              break
            case 8:
              icon = require("@/assets/icons/cangku_icon.png")
              TypeName = "仓库"
              break
            case 9:
              icon = require("@/assets/icons/renyuan_icon.png")
              TypeName = "人员"
              break
            case 10:
              icon = require("@/assets/icons/huodong_icon.png")
              TypeName = "活动"
              break
            default:
              icon = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png"
          }

          item.iconPic = icon
          return item
        })
        this.TypeName = TypeName
        this.searchResult = dataSource
        // console.log("dataSource", dataSource)
        this.$bus.$emit("showFacility", { type: this.ftype, keyword: this.search_txt })
        this.total = this.searchount = res.data.total || 0
      })

      this.showSreachPanel = true
      this.showPanel = false
    },
    // 展示面板表格
    showPanelTable(data = [], type = "") {
      this.pannelInfo = []
      this.activityId = 0
      switch (type) {
        case 3:
          this.panelTitle = "智能桶信息"
          this.pannelInfo.push({ label: "名称", value: data.can_name || "" })
          this.pannelInfo.push({ label: "编号", value: data.can_number || "" })
          this.pannelInfo.push({ label: "状态", value: data.is_open_text || "" })
          this.pannelInfo.push({ label: "所属", value: data.plot_type || "" })
          this.pannelInfo.push({ label: "位置", value: data.address || "" })
          break
        case 4:
          this.panelTitle = "环保屋信息"
          this.pannelInfo.push({ label: "名称", value: data.house_name || "" })
          this.pannelInfo.push({ label: "编号", value: data.house_no || "" })
          this.pannelInfo.push({ label: "状态", value: data.state_text || "" })
          this.pannelInfo.push({ label: "营业时间", value: data.work_week || "" })
          this.pannelInfo.push({ label: "地址", value: data.address || "" })
          break
        case 5:
          this.panelTitle = "车辆信息"
          this.pannelInfo.push({ label: "车辆状态", value: "正在作业" })
          this.pannelInfo.push({ label: "车牌", value: data.license_plate_number || "" })
          this.pannelInfo.push({ label: "类型", value: data.vehicle_name || "" })
          this.pannelInfo.push({ label: "载重", value: data.load_capacity || "" })
          this.pannelInfo.push({ label: "所属", value: data.belong || "" })
          break
        case 6:
          this.panelTitle = "处理厂"
          this.pannelInfo.push({ label: "名称", value: data.merchant_name || "" })
          this.pannelInfo.push({ label: "地址", value: data.address || "" })
          this.pannelInfo.push({ label: "联系人", value: data.contacts || "" })
          this.pannelInfo.push({ label: "联系电话", value: data.phone || "" })
          break
        case 7:
          this.panelTitle = "分拣中心"
          this.pannelInfo.push({ label: "名称", value: data.site_name || "" })
          this.pannelInfo.push({ label: "编号", value: data.site_no || "" })
          this.pannelInfo.push({ label: "状态", value: data.status_name || "" })
          this.pannelInfo.push({ label: "营业时间", value: data.open_time || "" })
          this.pannelInfo.push({ label: "地址", value: data.site_address || "" })
          break
        case 8:
          this.panelTitle = "仓库"
          this.pannelInfo.push({ label: "名称", value: data.name || "" })
          this.pannelInfo.push({ label: "电话", value: data.account_phone || "" })
          this.pannelInfo.push({ label: "地址", value: data.address || "" })
          break
        case 9:
          this.panelTitle = "人员"
          this.pannelInfo.push({ label: "姓名", value: data.account_name || "" })
          this.pannelInfo.push({ label: "电话", value: data.account || "" })
          this.pannelInfo.push({ label: "地址", value: data.address || "" })
          break
        case 10:
          this.panelTitle = data.activity_name
          this.activityId = data.id
          this.activityType = data.activity_type
          this.pannelInfo.push({ label: "状态", value: data.state_name || "" })
          this.pannelInfo.push({ label: "负责人", value: data.site_account_name || "" })
          this.pannelInfo.push({ label: "审核人", value: data.examine_name || "" })
          this.pannelInfo.push({ label: "开始时间", value: data.start_time || "" })
          this.pannelInfo.push({ label: "结束时间", value: data.end_time || "" })
          this.pannelInfo.push({ label: "地址", value: data.address || "" })
          break
        default:
          var registration_rate = 0
          if (data.project_id == 30) {
            registration_rate = "100%"
          } else {
            if (data.registration_rate > 0) {
              registration_rate = 100 * data.registration_rate + "%"
            }
          }
          this.panelTitle = type == 1 ? "小区信息" : "事业单位信息"
          this.pannelInfo.push({ label: "名称", value: data.plot_name || "" })
          this.pannelInfo.push({ label: "地址", value: data.province_name + data.city_name + data.area_name + data.street + (data.community == null ? "" : data.community) })
          this.pannelInfo.push({ label: "小区户数", value: data.total_number || "" })
          this.pannelInfo.push({ label: "入住户数", value: data.at_number || "" })
          this.pannelInfo.push({ label: "注册用户数", value: data.user_number || "" })
          this.pannelInfo.push({ label: "知晓率", value: registration_rate })
          this.pannelInfo.push({ label: "活动总数（本月）", value: data.activity_number || "" })
          this.pannelInfo.push({ label: "回收总量（本月）", value: data.total_recovery || "" })
      }
      this.clickType = type

      // console.log("info", this.pannelInfo)
    },
    // 车辆轨迹起始点
    drawMarker(data) {
      let marker = {
        map: this.map,
        position: data[0]
      }
      marker = Object.assign(marker, {
        // icon: require("@/assets/icons/car.png"),
        icon: new AMap.Icon({
          size: new AMap.Size(60, 30),
          image: require("@/assets/icons/car.png"),
          imageSize: new AMap.Size(60, 30)
        }),
        offset: new AMap.Pixel(-16, -15),
        autoRotation: true,
        angle: 0
      })
      this.marker = new AMap.Marker(marker)

      let start_marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
        position: data[0]
      })

      let over_marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        position: data[data.length - 1]
      })

      // console.log(this.map)
      this.map.add(start_marker)
      this.map.add(over_marker)
    },
    // 画路径轨迹
    drawSimplePolyline(data) {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.$utils.deepCopy(data),
        showDir: true,
        lineJoin: "round",
        strokeColor: "#28F",
        strokeWeight: 6,
        extData: { lineName: "polyline" }
      })
    },
    // 绘制对象路线并开始移动
    startMove(data) {
      // console.log("data", data)
      this.map.clearMap()
      this.drawMarker(data) // 绘制Marker
      this.drawSimplePolyline(data) // 绘制轨迹

      this.drawPassedPolyline(data) // 绘制已走过的轨迹
      // 移动时触发
      this.marker.on("moving", e => {
        this.passedPolyline.setPath(e.passedPath) // 赋值经纬度 绘制已经移动的路线
      })
      this.marker.moveAlong(this.$utils.deepCopy(data), 500)

      this.map.setFitView() // 地图自适应
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
    // 获取车辆轨迹点
    getVehicleTrackPoints(only = "") {
      this.detailLoading = true
      this.$api.getVehicleTrackPoints({ only }).then(res => {
        this.data = []
        res.data.vehicle_card_info.map(item => {
          this.data.push([item.lon, item.lat])
        })
        // 绘制轨迹图
        this.drawMarker(this.data)
        this.drawSimplePolyline(this.data)
        this.detailLoading = false
      })
    },
    // 定位
    locate(item) {
      console.log("定位", item)
      let that = this
      that.$api.getCommunityChartDetail({ only: item.only }).then(res => {
        if (res.data) {
          that.showPanel = true
          that.showSreachPanel = false
          that.showPanelTable(res.data, item.type)
          that.map.setZoomAndCenter(18, [item.longitude, item.latitude])
        }
        that.detailLoading = false
      })
    },
    // 查看活动
    showActivity(id, activityType) {
      if (id) {
        if (activityType == 3) {
          this.$router.push({ name: "OnsiteRecyclingActivityDetail", query: { id: id, type: "detail", activityType: activityType } })
        } else if (activityType == 1 || activityType == 2) {
          this.$router.push({ name: "PromotionalActivityDetail", query: { id: id, type: "detail", activityType: activityType } })
        } else {
          this.$router.push({ name: "TimedFixedPointActivityDetail", query: { id: id } })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#map-container {
  /deep/ .amap-icon img {
    width: 32px;
    height: 47px;
  }
  .info {
    position: absolute;
    top: 147px;
    left: 275px;
    width: 330px;
    min-height: 200px;
    z-index: 1;
    .ant-card-body {
      width: 100%;
    }
  }
  .select {
    position: absolute;
    top: 105px;
    right: 40px;
    z-index: 1;
  }
  .ant-select-open .ant-select-arrow-icon svg {
    transform: none;
  }
  .search {
    position: absolute;
    top: 105px;
    left: 275px;
    z-index: 1;
    width: 331px;
  }
  .search_result_note {
    line-height: 20px;
    color: #999;
  }
  .ant-divider-horizontal {
    margin: 12px 0;
  }
  .search_result {
    position: absolute;
    top: 142px;
    left: 275px;
    width: 330px;
    min-height: 200px;
    z-index: 1;
    .ant-card-body {
      width: 100%;
    }
  }
  .name {
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
  }
  .location {
    height: 30px;
    line-height: 30px;
    text-align: right;
  }
  .search_list {
    height: 300px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }

  .avater {
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
  }

  .pagecss {
    height: 40px;
    line-height: 40px;
    padding-top: 15px;
  }
}
</style>
