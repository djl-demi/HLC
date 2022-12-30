<template>
  <!-- 最近七天各品类回收 -->
  <div id="latest_catories_recycle" class="latest_catories_recycle">
    <div class="title">电量统计展示</div>
    <div class="content">
      <div id="line_container"></div>
    </div>
  </div>
</template>

<script>
import { Line } from "@antv/g2plot"
export default {
  name: "latest_catories_recycle",
  data() {
    return {
      line: {}
    }
  },
  mounted() {
    // this.getLatestRecycleData()
  },
  methods: {
    // 获取最近七天回收数据
    getLatestRecycleData() {
      this.$api.getLatestStatistics().then(res => {
        this.createLineChart(res.data)
      })
    },
    // 创建折线图
    createLineChart(data) {
      this.line = new Line("line_container", {
        data,
        xField: "time",
        yField: "weight",
        seriesField: "category_name",
        legend: {
          layout: "horizontal",
          position: "bottom",
          itemName: {
            style: {
              fill: "#ffffff"
            }
          }
        },
        xAxis: {
          // type: "time",
          line: {
            style: {
              fill: "#0082C4",
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
          label: {
            // 数值格式化为千分位
            formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
            style: {
              fill: "#0082C4"
            }
          },
          grid: {
            line: {
              style: {
                fill: "#0082C4",
                stroke: "#0082C4",
                lineWidth: 0.5
              }
            }
          }
        }
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
  height: 385px;
}
</style>
