<template>
  <!-- 数据大屏 -->
  <div id="dataCenter">
    <div class="head">
      <div class="toutu"></div>
      <div class="head_title">
        <a-row>
          <a-col :span="8">
            <div class="weather"><img :src="weather_img" class="weather_img" /> {{ weather_temp }}</div>
          </a-col>
          <a-col :span="8">
            <div class="title">重力储能数据展示</div>
          </a-col>
          <a-col :span="8">
            <div class="timer">{{ currentTime | getCurrentTime(this) }}</div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- <div class="main">
      <a-row>
        <a-col :span="7">
          <div class="row1-left-up">
            <div class="section_name">居民统计</div>
            <div class="row1-left-up-content">
              <a-row>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/1.png" class="icon_label" />居民户数</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/2.png" class="icon_label" />参与数</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/3.png" class="icon_label" />总注册户数</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ households }}</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ participants }}</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ total_households }}</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/4.png" class="icon_label" />总注册户数</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/5.png" class="icon_label" />参与率</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-label"><img src="../../assets/data/6.png" class="icon_label" />分类准确率</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ register_households }}</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ participants_rate }}</div>
                </a-col>
                <a-col :span="8">
                  <div class="row1-left-up-result">{{ accuracy_rate }}</div>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="row1-left-down">
            <div class="section_name2">垃圾月度回收情况</div>
            <div class="filter-month">
              <a-dropdown :trigger="['click']" style="width:40px">
                <a class="ant-dropdown-link">月份：{{ month }}月<a-icon :type="dropIcon" class="icon—drop" /> </a>
                <a-menu slot="overlay" @click="showDropList">
                  <a-menu-item key="1">
                    <a href="javascript:;">1月</a>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a href="javascript:;">2月</a>
                  </a-menu-item>
                  <a-menu-item key="3">
                    <a href="javascript:;">3月</a>
                  </a-menu-item>
                  <a-menu-item key="4">
                    <a href="javascript:;">4月</a>
                  </a-menu-item>
                  <a-menu-item key="5">
                    <a href="javascript:;">5月</a>
                  </a-menu-item>
                  <a-menu-item key="6">
                    <a href="javascript:;">6月</a>
                  </a-menu-item>
                  <a-menu-item key="7">
                    <a href="javascript:;">7月</a>
                  </a-menu-item>
                  <a-menu-item key="8">
                    <a href="javascript:;">8月</a>
                  </a-menu-item>
                  <a-menu-item key="9">
                    <a href="javascript:;">9月</a>
                  </a-menu-item>
                  <a-menu-item key="10">
                    <a href="javascript:;">10月</a>
                  </a-menu-item>
                  <a-menu-item key="11">
                    <a href="javascript:;">11月</a>
                  </a-menu-item>
                  <a-menu-item key="12">
                    <a href="javascript:;">12月</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div>
              <div class="row1-left-down-left">
                <div>
                  <img src="../../assets/data/71.png" class="yueduhuishou" />
                </div>
                <div class="row1-left-up-result">{{ total_recovery }} kg</div>
                <div class="row1-left-up-label">垃圾月度回收总量</div>
              </div>
              <div class="row1-left-down-center"></div>
              <div class="row1-left-down-right">
                <div class="row1-left-down-img">
                  <a-progress type="circle" :percent="total_recovery_percent" :width="80" :strokeWidth="18" :strokeColor="strokeColor">
                    <template #format="percent">
                      <span style="color: white">{{ percent }}%</span>
                    </template>
                  </a-progress>
                </div>
                <div class="row1-left-up-label">垃圾月度资源回收率</div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="10">
          <div class="row1-center">
            <div class="mapSite" id="mapSite"></div>
          </div>
        </a-col>
        <a-col :span="7">
          <div class="row1-right">
            <div class="section_name">小区综合排名展示</div>
            <tyMarquee :showType="showType"></tyMarquee>
          </div>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="7">
          <div class="row2-left">
            <div class="section_name2">回收垃圾量统计</div>
            <div id="selectedData">
              <div style="float:left; margin-left:50px">单位：kg</div>
              <ul>
                <li @click="viewToday" v-bind:class="{ active: isActive }">
                  今日
                </li>
                <li @click="viewWeek" v-bind:class="{ active: isActive2 }">
                  本周
                </li>
                <li @click="viewMonth" v-bind:class="{ active: isActive3 }">
                  本月
                </li>
                <li @click="viewYear" v-bind:class="{ active: isActive4 }">
                  全年
                </li>
              </ul>
            </div>
            <div>
              <div id="pie_container">
                <div v-if="recycleTotal.length == 0">
                  <div>
                    <img class="empty" src="@/assets/icons/empty.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="10">
          <div class="row2-center-up">
            <div class="section_name3">每日居民投放次数情况</div>
            <div id="line_container" class="line_container">
              <div v-if="dayLaunch.length == 0">
                <img class="empty2" src="@/assets/icons/empty.png" />
              </div>
            </div>
          </div>
          <div class="row2-center-down">
            <a-row>
              <a-col :span="12">
                <div class="row2-center-down1">
                  <div class="section_name3">正常运营设施统计</div>
                  <div>
                    <div class="row2-center-down1-left">
                      <div class="row2-center-down1-image"><img src="../../assets/data/9.png" class="row2-center-down1-img" /></div>
                      <div class="row2-center-down1-label">环保屋</div>
                      <div class="row2-center-down1-result">{{ serverSite }}</div>
                    </div>
                    <div class="row2-center-down1-center">
                      <div class="row2-center-down1-image"><img src="../../assets/data/xiaoqu2.png" class="row2-center-down1-img" /></div>
                      <div class="row2-center-down1-label">小区数</div>
                      <div class="row2-center-down1-result">{{ communityNumber }}</div>
                    </div>
                    <div class="row2-center-down1-right">
                      <div class="row2-center-down1-image"><img src="../../assets/data/10.png" class="row2-center-down1-img" /></div>
                      <div class="row2-center-down1-label">分拣站数量</div>
                      <div class="row2-center-down1-result">{{ icNumber }}</div>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="row2-center-down2">
                  <div class="section_name3">可回收物投放量展示</div>
                  <div class="reyleData">
                    <div style="padding:0 10px"><tyMarqueeTable></tyMarqueeTable></div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="7">
          <div class="row2-right"><div class="section_name2">居民投放数据展示</div></div>
          <div style="margin-top:-420px"><tyMarquee :showType="showTypeUser"></tyMarquee></div>
        </a-col>
      </a-row>
    </div>
    <div class="main"></div>
    <div class="float_button" @click="back">返回</div> -->
  </div>
</template>

<script>
import AMap from "AMap"
import { Pie, Line } from "@antv/g2plot"
// import tyMarquee from "../../components/ty-marquee.vue"
// import tyMarqueeTable from "../../components/ty-marquee-table.vue"
export default {
  name: "dataCenter",
  data() {
    return {
      title: "崇川区",
      currentTime: new Date(),
      weather_temp: "17°C/24°C",
      weather_img: "https://image.58xiaoxiang.top/map/cloud.png",
      households: 10000,
      participants: 567,
      total_households: 98123,
      register_households: 43566,
      participants_rate: "40.72%",
      accuracy_rate: "90.4%",
      dropIcon: "down",
      month: new Date().getMonth() + 1,
      total_recovery: 0,
      total_recovery_percent: 0,
      serverSite: 91,
      icNumber: 4962,
      communityNumber: 61,
      bordered: false,
      pagination: false,
      showType: "custom",
      showTypeUser: "common",
      showTypeCommunity: "community",
      columns: [
        {
          title: "小区名称",
          dataIndex: "community_name",
          key: "community_name",
          align: "center"
        },
        {
          title: "可回收物投放量（kg）",
          dataIndex: "recycle_weight",
          key: "recycle_weight",
          align: "center"
        }
      ],
      strokeColor: "#B448EB",
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false,
      piePlot: Object,
      communityStations: [],
      dayLaunch: [],
      recycleTotal: [],
      emptyIcon: ""
    }
  },
  components: {
    // tyMarquee,
    // tyMarqueeTable
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
  created() {},
  watch: {
    // 父组件选择的地址详情
    // communityStations: {
    //   handler(val) {
    //     this.createMap()
    //   }
    // }
  },
  mounted() {
    // this.getSumModule()
    // this.getMonthRecycle()
    // this.getPlotLocation()
    // this.userInfo()
    // this.getRecyclingSum(1, 1)
    // this.getTwoWeekStockRecoed()
    // this.getLocalWeather() // 获取天气
    // 时间定时器
    var _this = this
    this.timer = setInterval(() => {
      _this.currentTime = new Date() // 修改日期数据
    }, 1000)
  },
  methods: {
    // 返回上一页
    back() {
      history.back()
    },
    // 获取居民统计和设施统计
    getSumModule() {
      this.$api.sumModule().then(res => {
        this.households = res.data.checkInNum
        this.participants = res.data.participants
        this.total_households = res.data.residentNum
        this.register_households = res.data.registerNum
        this.participants_rate = res.data.participantsPercent
        this.accuracy_rate = res.data.accuratePercent

        this.serverSite = res.data.garbageHouseCount
        this.icNumber = res.data.stateCount
        this.communityNumber = res.data.plotCount
      })
    },
    // 小区
    getPlotLocation() {
      this.$api.getPlotLocation().then(res => {
        this.communityStations = res.data
      })
    },
    // 月度回收统计
    getMonthRecycle(month = "") {
      month = month ? month : new Date().getMonth() + 1
      this.$api.getMonthRecycle({ month }).then(res => {
        this.total_recovery = res.data != null ? res.data.monthWeight : 0
        this.total_recovery_percent = res.data != null ? res.data.monthWeightRecyclePercent : 0
      })
    },
    // 居民每日投放次数统计
    getTwoWeekStockRecoed() {
      this.$api.getTwoWeekStockRecoed().then(res => {
        this.dayLaunch = []
        res.data.map(item => {
          this.dayLaunch.push({
            Date: item.date,
            scales: item.scales
          })
        })

        this.getLineChart()
      })
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
            this.createMap(res.data.district)
          } else {
            this.title = ""
            this.createMap("中国")
          }
        },
        err => {}
      )
    },
    //设置小于10的数字在加0
    setZero(a) {
      return a < 10 ? "0" + a : a
    },
    // 获取用户信息
    userInfo() {
      this.$api.residentStatistics({}).then(res => {
        this.households = res.data.residentNum || 0
        this.participants = res.data.participants || 0
        this.register_households = res.data.registerNum || 0
        this.participants_rate = res.data.participantsPercent || 0
      })
    },
    getPie(data) {
      this.piePlot = new Pie("pie_container", {
        appendPadding: 10,
        data,
        angleField: "value",
        // colorField: "type",
        radius: 0.9,
        label: {
          type: "inner",
          offset: "-30%",
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: "center"
          }
        },
        legend: {
          itemName: {
            style: {
              fill: "white"
            }
          }
        },
        // color: ["#02A6EF", "#D9001B", "#03B615", "#AAAAAA"],
        colorField: "type", // 部分图表使用 seriesField
        color: ({ type }) => {
          if (type === "可回收物") {
            return "#02A6EF"
          }
          if (type === "有害垃圾") {
            return "#D9001B"
          }
          if (type === "厨余垃圾") {
            return "#03B615"
          }
          if (type === "其他") {
            return "#AAAAAA"
          }
          return "#02A6EF"
        },
        interactions: [{ type: "element-active" }]
      })

      this.piePlot.render()
    },
    getLineChart() {
      var data = this.dayLaunch
      // console.log("dayLaunch", this.dayLaunch)
      if (data.length > 0) {
        const line = new Line("line_container", {
          data,
          padding: "auto",
          xField: "Date",
          yField: "scales",
          xAxis: {
            tickCount: 14,
            label: {
              style: {
                fill: "white"
              }
            }
          },
          yAxis: {
            tickCount: 5, // 期望坐标轴数量
            label: {
              style: {
                fill: "white"
              }
            },
            grid: {
              line: {
                style: {
                  stroke: "#37E9EB",
                  lineWidth: 0.3,
                  opacity: 0.3
                }
              }
            }
          },
          point: {
            size: 5,
            shape: "diamond",
            style: {
              fill: "white",
              stroke: "#5B8FF9",
              lineWidth: 2
            }
          },
          label: {
            position: "top",
            offsetY: 10,
            style: {
              stroke: "#FFFFFF",
              fill: "#FFFFFF",
              lineWidth: 0,
              lineOpacity: 0
            }
          }
        })

        line.render()
      }
    },
    // 垃圾回收量统计
    getRecyclingSum(type = "", flag = 0) {
      let data = {
        type: type
      }
      this.$api.getRecyclingSum(data).then(res => {
        var data = []
        res.data.map(item => {
          data.push({
            type: item.type,
            value: item.value || 0
          })
        })

        this.recycleTotal = data

        if (!flag) {
          this.piePlot.destroy()
        }
        this.getPie(data)
      })
    },
    // 今日
    viewToday() {
      this.isActive = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.getRecyclingSum(1)
    },
    // 本周
    viewWeek() {
      this.isActive = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
      this.getRecyclingSum(2)
    },
    // 本月
    viewMonth() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
      this.getRecyclingSum(3)
    },
    // 全年
    viewYear() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = true
      this.getRecyclingSum(4)
    },
    // 创建地图
    createMap(area = "") {
      var map = new AMap.Map("mapSite", {
        resizeEnable: true,
        mapStyle: "amap://styles/f1273472fb2eab3b0faec5ce78488ec2",
        center: [120.894255, 31.981435],
        zoom: 11,
        keyboardEnable: false
      })
      // 窗口
      var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
      // 站点类型
      var types = [["https://image.58xiaoxiang.top/map/marker1.png", "小区服务点"]]
      var positions = this.getPosition(this.communityStations)
      // console.log("positions", positions)
      for (var i = 0, marker; i < positions.length; i++) {
        marker = new AMap.Marker({
          map: map,
          position: positions[i].location,
          icon: types[0][0],
          offset: new AMap.Pixel(-13, -30)
        })

        marker.content = types[0][1]
        marker.content = `
        <div class="form_content">名称：${positions[i]["name"]}</div>
        </div>`

        marker.on("click", markerClick)
        marker.emit("click", { target: marker })
      }

      // 坐标窗体
      function markerClick(e) {
        infoWindow.setContent(e.target.content)
        infoWindow.open(map, e.target.getPosition())
      }

      // 绘制行政区域边界
      this.drawArea(map, area)
      //   map.setFitView();
    },
    getPosition(locations) {
      let positions = []
      locations.forEach(ele => {
        positions.push({
          // type: ele.type,
          // site_address: ele.site_address,
          name: ele.plotName,
          location: ele.location
        })
      })
      return positions
    },
    //绘制区域
    drawArea(map, districtName = "崇川") {
      var district = null
      var polygons = []
      //加载行政区划插件
      //实例化DistrictSearch
      var opts = {
        subdistrict: 0, //获取边界不需要返回下级行政区
        extensions: "all", //返回行政区边界坐标组等具体信息
        level: "district" //查询行政级别为 市
      }
      district = new AMap.DistrictSearch(opts)
      //行政区查询
      district.setLevel("district")
      district.search(districtName, function(status, result) {
        map.remove(polygons) //清除上次结果
        polygons = []
        if (Object.keys(result).length != 0) {
          var bounds = result.districtList[0].boundaries
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              var polygon = new AMap.Polygon({
                strokeWeight: 1,
                path: bounds[i],
                fillOpacity: 0.1,
                fillColor: "#80d8ff",
                strokeColor: "#0091ea"
              })
              polygons.push(polygon)
            }
          }
          map.add(polygons)
          map.setFitView(polygons) //视口自适应
        }
      })
    },
    // 选择月份
    showDropList({ key }) {
      this.month = key
      this.getMonthRecycle(key)
    }
  }
}
</script>

<style scoped lang="less">
#dataCenter {
  text-align: center;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/data/bei-jing.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

/deep/ .amap-icon img {
  width: 25px;
  height: 34px;
}

.head {
  height: 93px;
}

.head_title {
  width: 100%;
  position: absolute;
  top: 20px;
}

.title {
  color: #6bddff;
  font-size: 36px;
  letter-spacing: 4px;
}

.timer {
  color: #6bddff;
  font-size: 20px;
  height: 40px;
  line-height: 40px;
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

.main {
  padding: 0 20px;
}

.section_name {
  color: #6bddff;
  height: 45px;
  line-height: 45px;
  font-size: 20px;
}

.section_name2 {
  color: #6bddff;
  height: 25px;
  line-height: 25px;
  font-size: 20px;
}

.section_name3 {
  color: #6bddff;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
}

.row1-left-up {
  height: 225px;
  background-image: url("../../assets/data/kuang7.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row1-left-down {
  margin-top: 20px;
  height: 225px;
  background-image: url("../../assets/data/kuang8.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row1-center {
  margin: 20px;
  height: 450px;
  background-image: url("../../assets/data/kuang4.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  padding: 15px;
}

.row1-right {
  height: 470px;
  background-image: url("../../assets/data/kuang2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row2-left {
  height: 470px;
  background-image: url("../../assets/data/kuang.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row2-center-up {
  margin: 0 20px;
  height: 225px;
  background-image: url("../../assets/data/kuang51.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row2-center-down {
  /* margin: 20px 20px 0 20px;
  height: 200px;
  background-image: url("../../assets/data/kuang51.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%; */
}

.row2-center-down1 {
  margin: 20px 10px 0 20px;
  height: 225px;
  background-image: url("../../assets/data/kuang61.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row2-center-down2 {
  margin: 20px 20px 0 10px;
  height: 225px;
  background-image: url("../../assets/data/kuang61.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row2-right {
  height: 470px;
  background-image: url("../../assets/data/kuang.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.row1-left-up-content {
  color: #6bddff;
  margin-top: 10px;
}

.icon_label {
  width: 16px;
  height: 16px;
  margin: 0 5px;
}

.row1-left-up-label {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

.row1-left-up-result {
  color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}

.row1-left-down-right {
  float: left;
  width: 48%;
}

.row1-left-down-left {
  float: left;
  width: 48%;
}

.row1-left-down-center {
  float: left;
  width: 2%;
  height: 100px;
  line-height: 100px;
  margin: 30px 0;
  border-left: solid #6bddff 1px;
}

.row1-left-down-img {
  padding: 15px;
}

.row1-left-down {
  color: #6bddff;
}

#pie_container {
  height: 320px;
  width: 90%;
}

#selectedData {
  color: #ffffff;
  font-size: 14px;
  text-align: right;
  margin-right: 50px;
  margin-top: 40px;
}

li {
  width: 30px;
  display: inline-block;
  margin: 0 5px;
}

.active {
  color: #04ff1d;
}

.mapSite {
  height: 420px;
}

.line_container {
  height: 180px;
  padding: 0 20px;
}

.row2-center-down1-left {
  width: 33%;
  float: left;
}

.row2-center-down1-center {
  width: 33%;
  float: left;
}

.row2-center-down1-right {
  width: 33%;
  float: left;
}

.row2-center-down1-image {
  margin-top: 25px;
}

.row2-center-down1-label {
  color: #6bddff;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

.row2-center-down1-result {
  color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}

.reyleData {
  margin-top: 20px;
}

.float_button {
  color: #fff;
  // position: absolute;
  position: fixed;
  right: 16px;
  bottom: 88px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  z-index: 1500;
  overflow: hidden;
  -webkit-transition-duration: 300ms;
  transition-duration: 300ms;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  background-color: #2196f3;
  opacity: 0.8;
}

.filter-month {
  text-align: left;
  margin-left: 10%;
  color: #ffffff;
  height: 30px;
}

.icon—drop {
  margin: 0 5px;
}

.ant-dropdown-menu {
  width: 60px;
}

.ant-dropdown-link {
  color: #ffffff;
}

.empty {
  width: 229px;
  height: 189px;
  position: absolute;
  left: 30%;
  background-image: url("../../assets/icons/empty.png");
}

.toutu {
  height: 93px;
  background-image: url("../../assets/data/toutu.png");
}

.yueduhuishou {
  width: 85px;
  height: 83px;
  margin: 0 auto;
  background-image: url("../../assets/data/71.png");
}

.row2-center-down1-img {
  width: 78px;
  height: 82px;
}

.empty2 {
  position: absolute;
  top: 70px;
  left: 340px;
  margin: 0 auto;
  width: 120px;
  height: 120px;
}
</style>
