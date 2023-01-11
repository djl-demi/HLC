<template>
  <!-- 设施统计 -->
  <div id="facilities_statistics" class="facilities_statistics">
    <div class="title">充放电折线图</div>
    <div class="content">
      <div id="container"></div>
    </div>
    <div style="justify-content: space-around;font-size: 16px;display: flex;">
      <div>最大放电： <span>1111kW</span></div>
      <div>最大充电： <span>1111kW</span></div>
    </div>
  </div>
</template>

<script>
import { Line } from "@antv/g2plot"
export default {
  name: "facilities_statistics",
  data() {
    return {
      data: [
        { title: "01/04", number: "100", type: "充电" },
        { title: "01/04", number: "10", type: "放电" },
        { title: "01/05", number: "110", type: "充电" },
        { title: "01/05", number: "20", type: "放电" },
        { title: "01/06", number: "120", type: "充电" },
        { title: "01/06", number: "30", type: "放电" },
        { title: "01/07", number: "130", type: "充电" },
        { title: "01/07", number: "40", type: "放电" },
        { title: "01/08", number: "140", type: "充电" },
        { title: "01/08", number: "50", type: "放电" },
        { title: "01/09", number: "150", type: "充电" },
        { title: "01/09", number: "60", type: "放电" },
        { title: "01/10", number: "144", type: "充电" },
        { title: "01/10", number: "70", type: "放电" }
      ]
    }
  },
  mounted() {
    this.getFinishRateData()
  },
  methods: {
    // 获取数据接口
    getFinishRateData() {
      // this.$api.taskCompletionRate().then(res => {
      // })
      let dataSource = this.data.map(item => {
        item.number = parseInt(item.number)
        return item
      })
      this.createLine(dataSource)
    },
    // 生成折线图
    createLine(data) {
      const line = new Line("container", {
        data,
        xField: "title",
        yField: "number",
        seriesField: "type",
        yAxis: {
          label: {
            style: {
              fill: "#0082C4"
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
          grid: {
            line: {
              style: {
                lineWidth: 0.5,
                stroke: "#0082C4"
              }
            }
          }
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
        tooltip: {
          formatter: datum => {
            return { name: datum.type, value: datum.number + "kW" }
          }
        },
        color: ["#FEBF42", "#7B6FF9", "#FA6762", "#F56FD3"],
        legend: {
          offsetY: 0,
          spacing: 50,
          background: {
            padding: [10, 0, 40, 0],
            style: {
              lineWidth: 0
            }
          },
          layout: "horizontal",
          position: "top-right"
        },
        smooth: true
      })

      line.render()
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  height: 48px;
  line-height: 56px;
  color: #00e4ff;
  font-size: 16px;
}

#container {
  padding: 20px;
  height: 350px;
}
#facilities_statistics {
  color: honeydew;
  width: 509px;
  height: 444px;
  background-image: url(../../assets/data/index/facilities_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}
</style>
