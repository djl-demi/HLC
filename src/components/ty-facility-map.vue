<template>
  <div id="container"></div>
</template>

<script>
import AMap from "AMap"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "TyFacilityMap",
  props: {
    address: String, // 详细地址
    searchAddress: String, // 地址模糊查询
    locationArr: Array // 经纬度
  },

  data() {
    return {
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      map: undefined, // 高德地图实例
      addressNum: 1, // address触发次数
      marker: undefined // 点拖拽
    }
  },

  created() {},

  mounted() {
    const that = this
    // 定义窗口大小变更通知事件
    window.onresize = () => {
      this.screenHeight = document.documentElement.clientHeight
      this.getHeight(this.screenHeight)
    }
    // 计算地图可用高度
    this.getHeight(this.screenHeight)

    // 初始化地图
    this.map = new AMap.Map("container", { resizeEnable: true, mapStyle: "amap://styles/whitesmoke" })

    if (this.$route.query.type === "add") {
      const locationArr = [this.map.getCenter().lng, this.map.getCenter().lat]
      that.$emit("inputChange", locationArr.join(","))
      this.newMarket(locationArr)
    }
  },

  methods: {
    // 计算地图可用高度
    getHeight(value) {
      let container = document.getElementById("container")
      container.style.height = Number(value) - 300 + "px"
    },

    // 经纬度 => 详细地址
    getAddress(position) {
      // console.log("经纬度 => 详细地址: ", position)
      const that = this
      // 通过经纬度查询具体位置
      AMap.plugin("AMap.Geocoder", function() {
        let geocoder = new AMap.Geocoder()
        geocoder.getAddress(position, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 向父组件传回详细地址, 经纬度
            that.$emit("draggableChange", result.regeocode.formattedAddress, position.join(","))
            that.getVagueAddress(result.regeocode.formattedAddress) // 输入框再拿地址模糊查询一下
            // that.map.setFitView()
          } else {
            that.$message.info("查询地址失败,请手动输入地址")
          }
        })
      })
    },

    // 详细地址 => 经纬度
    getLocation(address) {
      // console.log("详细地址 => 经纬度: ", address)
      const that = this
      AMap.plugin("AMap.Geocoder", function() {
        let geocoder = new AMap.Geocoder()
        geocoder.getLocation(address, function(status, result) {
          if (status === "complete" && result.geocodes.length) {
            const name = {
              province_name: result.geocodes[0].addressComponent.province,
              city_name: result.geocodes[0].addressComponent.city,
              area_name: result.geocodes[0].addressComponent.district
            }
            const lnglat = result.geocodes[0].location
            const location = `${lnglat.lng.toString()},${lnglat.lat.toString()}`
            // locationArr 长度为0是新增状态, 就不需要判断是不是第一次触发详细地址变动
            // 编辑状态进入会触发详细地址变动,但是这次变动不需要修改点的经纬度,只需要返回当前地址的省市区 用于和三级联动的省市区做比较即可
            if (that.locationArr.length !== 0 && that.addressNum === 1) {
              that.$emit("inputChange", "", name)
              that.addressNum++
            } else {
              that.$emit("inputChange", location, name)
              if (that.marker) {
                that.marker.setCenter(lnglat)
              } else {
                that.newMarket([that.map.getCenter().lng, that.map.getCenter().lat])
              }
              that.map.setFitView()
            }
          } else {
            that.$message.info("查询定位失败,请修改地址")
          }
        })
      })
    },

    // 详细地址 模糊查询
    getVagueAddress(vagueAddress) {
      AMap.plugin("AMap.Autocomplete", () => {
        let autoComplete = new AMap.Autocomplete({ city: "全国" })
        autoComplete.search(vagueAddress, (status, result) => {
          if (result.tips) {
            const dataSource = result.tips.map(item => {
              // 整合地址信息,改为组件支持的字段名
              item.text = `${item.district}${item.address}${item.name}`
              item.value = `${item.district}${item.address}${item.name}`
              return item
            })
            this.$emit("addressList", dataSource)
          } else {
            this.$emit("addressList", [])
          }
        })
      })
    },

    // 生成点 并给点绑定拖拽事件
    newMarket(position) {
      this.marker = new AMap.CircleMarker({
        center: position,
        radius: 12,
        fillColor: "#31C27C",
        // fillOpacity: 1,
        strokeColor: "31C27C",
        strokeWeight: 0,
        strokeOpacity: 0.2,
        draggable: true, // 设置是否可以拖拽
        cursor: "move",
        raiseOnDrag: true // 设置拖拽效果
      })

      // 监听点的拖拽事件
      let that = this
      this.marker.on("dragend", function(e) {
        const position = [e.lnglat.lng, e.lnglat.lat]
        that.$emit("draggableChange", position.join(","))
      })

      this.marker.setMap(this.map)
      this.map.setFitView()
    }
  },

  watch: {
    // 编辑状态刚进入时 通过存储的经纬度显示标记点
    locationArr: {
      handler(val) {
        if (val.length > 0) this.newMarket(val)
      }
    },

    // 父组件选择的地址详情
    address: {
      handler(val) {
        this.getLocation(val)
      },
      deep: true
    },

    // 父组件输入了地址详情进行模糊查询
    searchAddress: {
      handler(val) {
        this.getVagueAddress(val)
      },
      deep: true
    },

    // 监听屏幕高度变化,实时更新地图高度
    screenHeight: {
      handler(value) {
        this.getHeight(value)
      },
      deep: true
    }
  }
}
</script>

<style>
#container {
  width: 100%;
}
</style>
