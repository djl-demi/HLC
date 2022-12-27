<template>
  <!-- 每日居民投放次数统计 -->
  <div class="day_resident_release">
    <div id="line_container"></div>
  </div>
</template>

<script>
import { Line } from "@antv/g2plot"
export default {
  name: "day_resident_release",
  data() {
    return {
      line: {},
      dayLaunch: []
    }
  },
  mounted() {
    this.getTwoWeekStockRecoed()
  },
  methods: {
    // 居民每日投放次数统计
    getTwoWeekStockRecoed() {
      this.$api.getUserRecycleSimulistAll().then(res => {
        this.dayLaunch = []
        res.data.map(item => {
          this.dayLaunch.push({
            Date: item.recycleDate,
            scales: item.recycleCount
          })
        })

        this.createLineChart(this.dayLaunch)
      })
    },
    // 创建折线图
    createLineChart(data) {
      this.line = new Line("line_container", {
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
          tickCount: 5,
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
          title: {
            text: "(次)",
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
                // fill: "#0082C4",
                stroke: "#0082C4",
                lineWidth: 0.5
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
#line_container {
  height: 220px;
  padding: 20px;
}
</style>
