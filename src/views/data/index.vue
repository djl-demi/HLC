<template>
  <div id="dataScreen" class="dataScreen">
    <div class="top">
      <a-row>
        <a-col :span="8">
          <div class="temperature"><img :src="weather_img" class="weather_img" />温度：{{ weather_temp }}</div>
        </a-col>

        <a-col :span="8">
          <div class="title">{{ title }}重力储能信息化平台</div>
        </a-col>
        <a-col :span="8">
          <div class="time">{{ realTime | getCurrentTime(this) }}</div>
        </a-col>
      </a-row>
    </div>
    <div>
      <div :is="template"></div>
    </div>
  </div>
</template>

<script>
import TyDataCenter from "./date-center.vue"
import TyGisCenter from "./gis-center.vue"
export default {
  name: "dataScreen",
  data() {
    return {
      realTime: new Date(),
      weather_temp: "17°C/24°C",
      weather_img: "https://image.jsyinghuan.com/map/cloud.png",
      title: "泗阳",
      dataCenterClass: "data-center-select",
      gisCenterClass: "gis-center",
      template: "TyGisCenter"
    }
  },
  components: {
    TyDataCenter,
    TyGisCenter
  },
  filters: {
    // 获取当前实时时间
    getCurrentTime(date, vm) {
      //当前时间格式化处理
      var currentTime = ""
      //   var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
      currentTime += vm.setZero(date.getFullYear()) + "-" //获取年份
      currentTime += vm.setZero(date.getMonth() + 1) + "-" //获取月份
      currentTime += vm.setZero(date.getDate()) + "" //获取日
      //   currentTime += "    " + weekDay[date.getDay()] //获取星期
      currentTime += "    " + vm.setZero(date.getHours()) + ":" //获取时
      currentTime += "" + vm.setZero(date.getMinutes()) + ":" //获取分
      currentTime += vm.setZero(date.getSeconds()) //获取秒
      return currentTime
    }
  },
  // VUE 销毁
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除当前日期定时器
    }
  },
  mounted() {
    this.$message.info("为了更好的体验大屏效果，建议F11全屏查看")
    const user = JSON.parse(localStorage.getItem("userInfo"))
    this.title = user.area_name
    this.getLocalWeather(user.areaid)
    // 时间定时器
    var _this = this
    this.timer = setInterval(() => {
      _this.realTime = new Date() // 修改日期数据
    }, 1000)
  },
  methods: {
    // 切换页面
    toggleData() {
      this.dataCenterClass = "data-center-select"
      this.gisCenterClass = "gis-center"
      this.template = "TyDataCenter"
    },
    // 切换gis
    toggleGis() {
      this.dataCenterClass = "data-center"
      this.gisCenterClass = "gis-center-select"
      this.template = "TyGisCenter"
    },
    //设置小于10的数字在加0
    setZero(a) {
      return a < 10 ? "0" + a : a
    },
    // 获取天气和地区信息
    getLocalWeather(areaid = "") {
      this.$api.getWeather().then(
        res => {
          if (res.data) {
            this.weather_temp = res.data.daytemp + "°C/" + res.data.nighttemp + "°C"
            this.weather_img = "https://image.58xiaoxiang.top/map/"
            switch (res.data.weatherCode) {
              case 1:
                this.weather_img += "sun.png"
                break
              case 2:
                this.weather_img += "cloud.png"
                break
              case 3:
                this.weather_img += "rain.png"
                break
              case 4:
                this.weather_img += "snow.png"
                break
              default:
                this.weather_img += "sun.png"
            }

            this.title = res.data.district
          } else {
            this.title = ""
          }
        },
        err => {}
      )
    }
  }
}
</script>

<style scoped>
.dataScreen {
  background-image: url(../../assets/data/index/background.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 100%;
  height: auto;
  min-width: 1290px;
  /* min-height: 800px; */
}

.top {
  height: 90px;
  background-image: url(../../assets/data/toutu.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  color: #ffe374;
  text-align: center;
}

.weather {
  height: 40px;
  line-height: 40px;
  color: #6bddff;
  font-size: 20px;
}

.weather_img {
  width: 40px;
  height: 40px;
}

.title {
  font-size: 40px;
  font-weight: 500;
  height: 70px;
  line-height: 70px;
  background: linear-gradient(1deg, #00dafc 0.1220703125%, #8dedff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.data-center {
  color: white;
  font-size: 28px;
  margin: 20px auto;
  height: 52px;
  line-height: 52px;
  background-image: url(../../assets/data/index/select-left.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.data-center-select {
  font-size: 28px;
  margin: 20px auto;
  height: 52px;
  line-height: 52px;
  background-image: url(../../assets/data/index/selected-left.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.gis-center {
  color: white;
  font-size: 28px;
  margin: 20px auto;
  height: 52px;
  line-height: 52px;
  background-image: url(../../assets/data/index/select-right.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.gis-center-select {
  font-size: 28px;
  margin: 20px auto;
  height: 52px;
  line-height: 52px;
  background-image: url(../../assets/data/index/selected-right.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.temperature {
  font-size: 24px;
  line-height: 70px;
  color: #00e4ff;
  overflow: hidden;
  margin-left: 50px;
}

.time {
  font-size: 24px;
  line-height: 70px;
  color: #00e4ff;
  overflow: hidden;
  margin-right: 50px;
}

@media only screen and (max-width: 1400px) {
  .title {
    font-size: 32px;
    font-weight: 500;
    height: 70px;
    line-height: 70px;
    background: linear-gradient(1deg, #00dafc 0.1220703125%, #8dedff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .data-center {
    color: white;
    font-size: 20px;
    margin: 20px auto;
    height: 52px;
    line-height: 52px;
    background-image: url(../../assets/data/index/select-left.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .data-center-select {
    font-size: 20px;
    margin: 20px auto;
    height: 52px;
    line-height: 52px;
    background-image: url(../../assets/data/index/selected-left.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .gis-center {
    color: white;
    font-size: 20px;
    margin: 20px auto;
    height: 52px;
    line-height: 52px;
    background-image: url(../../assets/data/index/select-right.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .gis-center-select {
    font-size: 20px;
    margin: 20px auto;
    height: 52px;
    line-height: 52px;
    background-image: url(../../assets/data/index/selected-right.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .temperature {
    font-size: 18px;
    line-height: 100px;
    color: #00e4ff;
    overflow: hidden;
  }

  .time {
    font-size: 18px;
    line-height: 100px;
    color: #00e4ff;
    overflow: hidden;
  }
}
</style>
