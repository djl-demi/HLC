<template>
  <!-- 最近七天各品类回收 -->
  <div id="latest_catories_recycle" class="latest_catories_recycle">
    <div class="title">储能系统容量</div>
    <div class="content">
      <div id="line_container"></div>
    </div>
    <div style="margin: 0 35%;font-size: 16px;">
      当前状态：
      <span>放电</span>
    </div>
  </div>
</template>

<script>
import { Area } from "@antv/g2plot"
export default {
  name: "latest_catories_recycle",
  data() {
    return {
      line: {},
      dayLaunch: [],
      status:[],
      data: [
        { scales: 463, date: "00:00" },
        { scales: 476, date: "01:00" },
        { scales: 503, date: "02:00" },
        { scales: 491, date: "03:00" },
        { scales: 415, date: "04:00" },
        { scales: 362, date: "05:00" },
        { scales: 278, date: "06:00" },
        { scales: 228, date: "07:00" },
        { scales: 115, date: "08:00" },
        { scales: 117, date: "09:00" },
        { scales: 70, date: "10:00" },
        { scales: 47, date: "11:00" },
        { scales: 34, date: "12:00" },
        { scales: 25, date: "13:00" }
      ]
    }
  },
  mounted() {
    this.getTwoWeekStockRecoed()
  },
  methods: {
    getTwoWeekStockRecoed() {
      // this.$api.getTwoWeekStockRecoed().then(res => {
      //   this.dayLaunch = []

      // })
      this.data.map(item => {
        this.dayLaunch.push({
          Date: item.date,
          scales: item.scales
        })
      })

      this.createLineChart(this.dayLaunch)
    },

    // 创建折线图
    createLineChart(data) {
      this.line = new Area("line_container", {
        data,
        xField: "Date",
        yField: "scales",
        label: {
          style: {
            fill: "white"
          }
        },
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#00E4FF",
            lineWidth: 2
          }
        },
        lineStyle: {
          stroke: "#00E4FF",
          lineWidth: 0.5
        },
        xAxis: {
          line: {
            style: {
              stroke: "#0082C4",
              lineWidth: 0.5
            }
          },
          label: {
            style: {
              fill: "#0082C4"
            }
          }
        },
        yAxis: {
          line: {
            style: {
              stroke: "#0082C4",
              lineWidth: 0.5
            }
          },
          title: {
            text: "(kW)",
            position: "end",
            autoRotate: false,
            style: {
              fill: "#0082C4"
            }
          },
          label: {
            style: {
              fill: "#0082C4"
            }
          },
          grid: {
            line: {
              style: {
                fill: "#0082C4",
                stroke: "#0082C4",
                lineWidth: 0
              }
            }
          }
        },
        tooltip: { showMarkers: false },
        state: {
          active: {
            style: {
              shadowBlur: 4,
              stroke: "#000",
              fill: "red"
            }
          }
        },
        interactions: [{ type: "marker-active" }]
      })

      this.line.render()
    }
  }
}
</script>

<style scoped>
#latest_catories_recycle {
  color: honeydew;
  width: 509px;
  height: 445px;
  background-image: url(../../assets/data/index/facilities_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 48px;
  line-height: 56px;
  color: #00e4ff;
  font-size: 16px;
}

#line_container {
  padding: 20px;
  height: 350px;
}
</style>
