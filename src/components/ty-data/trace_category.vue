<template>
  <!-- 可回收物出库去向 -->
  <div id="chuku_trace" class="chuku_pie">
    <div class="title">设备充放数据展示</div>
    <div class="chuku_trace_content">
      <dv-scroll-board :config="config" style="height: 390px" />
    </div>
  </div>
</template>

<script>
import { Bar, Line } from "@antv/g2plot"
export default {
  name: "chuku_pie",
  data() {
    return {
      config: {},
      dataSource: [],

      line: {},
      dayLaunch: [],
      bar: {},
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false,
      data: [
        { scales: 463, date: "12/16" },
        { scales: 476, date: "12/17" },
        { scales: 503, date: "12/18" },
        { scales: 491, date: "12/19" },
        { scales: 415, date: "12/20" },
        { scales: 362, date: "12/21" },
        { scales: 278, date: "12/22" },
        { scales: 228, date: "12/23" },
        { scales: 115, date: "12/24" },
        { scales: 117, date: "12/25" },
        { scales: 70, date: "12/26" },
        { scales: 47, date: "12/27" },
        { scales: 34, date: "12/28" },
        { scales: 25, date: "12/29" }
      ],
      data1: [
        { id: 1, stockTime: "2022-12-30 ", userName: "设备1", houseNumber: "1606", categoryName: "厨余垃圾", netWeight: "0.63" },
        { id: 2, stockTime: "2022-12-30 ", userName: "设备2", houseNumber: "201", categoryName: "可回收物", netWeight: "3.45" },
        { id: 3, stockTime: "2022-12-30 ", userName: "设备3", houseNumber: "907", categoryName: "厨余垃圾", netWeight: "0.94" },
        { id: 4, stockTime: "2022-12-30 ", userName: "设备4", houseNumber: "1002", categoryName: "可回收物", netWeight: "1.76" },
        { id: 5, stockTime: "2022-12-30 ", userName: "设备5", houseNumber: "201", categoryName: "可回收物", netWeight: "11.92" },
        { id: 6, stockTime: "2022-12-30 ", userName: "设备6", houseNumber: "303", categoryName: "可回收物", netWeight: "1.31" },
        { id: 7, stockTime: "2022-12-30 ", userName: "设备7", houseNumber: "303", categoryName: "厨余垃圾", netWeight: "0.28" },
        { id: 8, stockTime: "2022-12-30 ", userName: "设备8", houseNumber: "202", categoryName: "可回收物", netWeight: "0.55" },
        { id: 9, stockTime: "2022-12-30 ", userName: "设备9", houseNumber: "101", categoryName: "厨余垃圾", netWeight: "0.43" },
        { id: 10, stockTime: "2022-12-30 ", userName: "设备10", houseNumber: "203", categoryName: "厨余垃圾", netWeight: "0.90" },
        { id: 11, stockTime: "2022-12-30 ", userName: "设备11", houseNumber: "203", categoryName: "可回收物", netWeight: "3.12" },
        { id: 12, stockTime: "2022-12-30 ", userName: "设备12", houseNumber: "301", categoryName: "厨余垃圾", netWeight: "0.96" }
      ]
    }
  },
  mounted() {
    this.getTwoWeekStockRecoed()
    this.residentRealTimeRelease()
  },
  methods: {
    residentRealTimeRelease() {
      this.$api.getResidentInvestment().then(res => {
        // console.log("res", res)
      })
      this.data1.map((item, index) => {
        this.dataSource.push([item.stockTime, item.userName.substring(0, 3), item.houseNumber, item.netWeight])
        this.config = {
          columnWidth: [130, 120, 120, 100],
          headerBGC: null,
          oddRowBGC: null,
          evenRowBGC: null,
          rowNum: 9,
          align: ["center", "center", "center", "center"],
          header: ["充放时间", "充放设备", "设备型号",  "充放数量"],
          data: this.dataSource
        }
      })
    },
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
            text: "(兆瓦)",
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
#chuku_trace {
  color: honeydew;
  width: 509px;
  height: 368px;
  background-image: url(../../assets/data/index/trace_bg.png);
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

.chuku_trace_content {
  padding: 20px;
}

#bar_container {
  padding: 20px;
  height: 300px;
  z-index: -1;
}

.switch_label {
  float: right;
  z-index: 999;
}

li {
  width: 30px;
  display: inline-block;
  margin: 0 5px;
}

.active {
  color: #64dcf7;
}
#line_container {
  height: 385px;
  padding: 20px;
}
</style>
