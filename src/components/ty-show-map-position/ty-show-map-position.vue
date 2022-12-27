<template>
  <div id="TyShowMapPosition">
    <div>
      <div id="container" :style="{ height: height, width: '100%' }"></div>
      <div class="info" v-if="infoShow && showDetail">
        <a-card title="垃圾桶信息" :bordered="false" :hoverable="true">
          <a-icon slot="extra" type="close" @click="showDetail = false" />
          <p>名称：{{ details.canName }}</p>
          <p>编号：{{ details.canNumber }}</p>
          <p>状态：{{ details.isOpen }}</p>
          <p>所属：{{ details.plotName }}</p>
          <p>定位地址：{{ details.location }}</p>
        </a-card>
      </div>
      <!-- 右上角地址搜索框 -->
      <a-auto-complete
        v-if="searchShow"
        v-model="searchAddress"
        :data-source="addressData"
        class="addressSearch"
        @select="addressSelect"
        @search="addressSearch"
        allowClear
        placeholder="请输入地址详情"
      />
    </div>
  </div>
</template>

<script>
import AMap from "AMap"
export default {
  name: "TyShowMapPosition",
  props: {
    height: {
      type: String,
      default: "600px"
    },
    searchShow: {
      type: Boolean,
      default: true
    },
    infoShow: {
      type: Boolean,
      default: true
    },
    details: {
      type: Object
    },
    position: {
      type: Array,
      default: () => {
        return []
      }
    } // 位置
  },
  data() {
    return {
      map: undefined,
      marker: undefined,
      geocoder: undefined,
      showDetail: false,
      autoComplete: undefined,
      searchAddress: "",
      addressData: []
    }
  },
  mounted() {
    // 实例化地图
    console.log(this.position)
    this.map = new AMap.Map("container", {
      resizeEnable: true,
      center: this.position.length > 0 ? this.position : [116.397428, 39.90923],
      zoom: 13,
      mapStyle: "amap://styles/whitesmoke"
    })

    // 监听点击地图事件,用于隐藏详情窗
    let that = this
    this.map.on("click", function(e) {
      that.showDetail = false
    })

    AMap.plugin("AMap.Geocoder", () => {
      this.geocoder = new AMap.Geocoder()
    })
    if (this.position.length > 0) this.init()
  },
  methods: {
    init() {
      console.log("初始化点", this.position)
      // 实例化点标记
      this.marker = new AMap.Marker({
        icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: this.position,
        offset: new AMap.Pixel(-13, -30)
      })
      this.map.setCenter(this.position) //设置地图中心点

      // 地址搜索
      if (this.searchShow) {
        AMap.plugin("AMap.Autocomplete", () => {
          this.autoComplete = new AMap.Autocomplete({ city: "全国" })
        })
      }

      // 点击标记显示详情
      let that = this
      this.marker.on("click", function(event) {
        that.showDetail = true
      })
      this.marker.setMap(this.map)
    },

    // 选择地址
    addressSelect(address) {
      this.geocoder.getLocation(address, (status, result) => {
        if (status === "complete" && result.geocodes.length) {
          const lnglat = result.geocodes[0].location
          const position = new AMap.LngLat(lnglat.lng, lnglat.lat)
          this.map.setCenter(position)
          this.map.setZoom(16)
        }
      })
    },
    // 详细地址查询
    addressSearch(e) {
      this.autoComplete.search(e, (status, result) => {
        if (result.tips) {
          this.addressData = result.tips.map(item => {
            // 整合地址信息,改为组件支持的字段名
            item.text = `${item.district}${item.address}${item.name}`
            item.value = `${item.district}${item.address}${item.name}`
            return item
          })
          console.log(this.addressData, "this.addressData")
        }
      })
    }
  },
  watch: {
    position: {
      handler(e) {
        console.log(e, "e")
        this.init()
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
#TyShowMapPosition {
  position: relative;
  .addressSearch {
    position: absolute;
    z-index: 9;
    width: 250px;
    right: 20px;
    top: 20px;
  }
  .info {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 300px;
    min-height: 200px;
    z-index: 1;
    .ant-card-body {
      width: 100%;
    }
  }
}
</style>
