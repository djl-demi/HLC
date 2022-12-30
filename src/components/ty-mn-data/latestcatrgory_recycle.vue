<template>
  <!-- 最近七天各品类回收 -->
  <div id="latest_catories_recycle" class="latest_catories_recycle">
    <div class="title">近七天各品类回收情况(单位:kg)</div>
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
    this.getLatestRecycleData()
  },
  methods: {
    // 获取最近七天回收数据
    getLatestRecycleData() {
      this.$api.getRecycleTypeSimulistAll().then(res => {
        console.log(res.data, "res.data")
        res.data.map(item => {
          item.goodsType = item.goodsType == 1 ? "可回收物" : "有害垃圾"
          return item
        })
        this.createLineChart(res.data)
      })
    },
    // 创建折线图
    createLineChart(data) {
      this.line = new Line("line_container", {
        data,
        xField: "recycleDate",
        yField: "weight",
        seriesField: "goodsType",
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
  height: 368px;
  background-image: url(../../assets/data/index/lastweekrecycle_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 48px;
  line-height: 48px;
  color: #00e4ff;
  font-size: 16px;
}

#line_container {
  padding: 20px;
  height: 385px;
}
</style>
