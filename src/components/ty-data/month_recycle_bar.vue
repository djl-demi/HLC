<template>
  <!-- 月度垃圾回收情况 -->
  <div class="month_recycle_bar">
    <div id="bar_container"></div>
  </div>
</template>

<script>
import { Column } from "@antv/g2plot"
export default {
  name: "month_recycle_bar",
  data() {
    return {
      columnPlot: {}
    }
  },
  mounted() {
    // this.getMonthRecycleData()
  },
  methods: {
    // 年度月回收统计
    getMonthRecycleData() {
      this.$api.getMonthRecycleData().then(res => {
        // 转换成吨，并保留两位小数
        res.data = res.data.map(item => {
          item.weight = parseFloat(item.weight === "0.00" || item.weight === "0" ? 0 : (item.weight / 1000).toFixed(2))
          return item
        })

        let user = localStorage.getItem("userInfo")
        let userinfo = JSON.parse(user)
        if (userinfo.project_id == 30) {
          // 泗阳
          let data = [
            { month: "1", weight: 337.73 },
            { month: "2", weight: 392.15 },
            { month: "3", weight: 445.26 },
            { month: "4", weight: 416.37 },
            { month: "5", weight: 466.85 },
            { month: "6", weight: 426.71 },
            { month: "7", weight: 497.16 },
            { month: "8", weight: 407.4 },
            { month: "9", weight: 486.3 },
            { month: "10", weight: 340.5 },
            { month: "11", weight: 0 },
            { month: "12", weight: 0 }
          ]

          res.data = data
        }
        this.createBarChart(res.data)
      })
    },
    // 创建柱形图
    createBarChart(data) {
      this.columnPlot = new Column("bar_container", {
        data,
        appendPadding: [10, 0, 0, 0],
        xField: "month",
        yField: "weight",
        label: {
          // 可手动配置 label 数据标签位置
          position: "top", // 'top', 'bottom', 'middle',
          offset: 4,
          // 配置样式
          style: {
            fill: "#FFFFFF"
            // opacity: 0.6
          }
        },
        xAxis: {
          line: {
            style: {
              fill: "#0082C4",
              stroke: "#0082C4",
              lineWidth: 0.5
            }
          },
          label: {
            autoHide: true,
            autoRotate: false,
            style: {
              fill: "#0082C4"
            }
          }
        },
        columnWidthRatio: 0.2,
        columnStyle: {
          fill: "l(270) 0:#F19106 1:#FFCD82"
        },
        yAxis: {
          label: {
            style: {
              fill: "#0082C4"
            }
          },
          grid: {
            line: {
              style: {
                stroke: "#0082C4",
                lineWidth: 0.5
              }
            }
          }
        }
      })

      this.columnPlot.render()
    }
  }
}
</script>

<style scoped>
#bar_container {
  height: 220px;
  padding: 20px;
}
</style>
