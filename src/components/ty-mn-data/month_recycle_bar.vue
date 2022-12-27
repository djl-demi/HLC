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
    this.getMonthRecycleData()
  },
  methods: {
    // 年度月回收统计
    getMonthRecycleData() {
      this.$api.getTrashRecycleSimulistAll().then(res => {
        let obj = {}
        let arr = res.data.reduce((pre, next) => {
          obj[next.month] ? "" : (obj[next.month] = true && pre.push(next))
          return pre
        }, [])
        arr.sort(function(a, b) {
          return a.month - b.month
        })
        this.$bus.$emit("showData", arr) // 传值
        this.createBarChart(arr)
      })
    },
    // 创建柱形图
    createBarChart(data) {
      data = data.map(item => {
        item.month = item.month.toString()
        return item
      })

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
