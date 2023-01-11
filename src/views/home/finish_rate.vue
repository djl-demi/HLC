<template>
  <!-- 设施数据 -->
  <div class="facilities_module">
    <div class="title">
      <div class="title_text">电量统计展示</div>
    </div>
    <a-card :bordered="false" :bodyStyle="card">
      <div id="containerBar"></div>
    </a-card>
  </div>
</template>

<script>
import { Bar } from "@antv/g2plot"
export default {
  name: "facilities_module",
  data() {
    return {
      card: {
        boxShadow: "0px 0px 15px 8px rgba(86, 85, 241, 0.05)",
        borderRadius: "14px"
      },
      data: [
        { date: "12-1", number: "10", type: null, time: null },
        { date: "12-2", number: "20", type: null, time: null },
        { date: "12-3", number: "30", type: null, time: null },
        { date: "12-4", number: "40", type: null, time: null },
        { date: "12-5", number: "50", type: null, time: null },
        { date: "12-6", number: "60", type: null, time: null },
        { date: "12-7", number: "70", type: null, time: null },
        { date: "12-8", number: "80", type: null, time: null },
        { date: "12-9", number: "90", type: null, time: null }
      ]
    }
  },

  props: {
    facilitiesData: Array
  },
  mounted() {
    const dataSource = this.data.map(item => {
      item.number = parseInt(item.number)
      return item
    })
    this.createBarChart(dataSource)
  },
  methods: {
    // 创建柱状图
    createBarChart(data) {
      const bar = new Bar("containerBar", {
        data,
        xField: "number",
        yField: "date",
        seriesField: "date",
        legend: false,
        colorField: "type", // 部分图表使用 seriesField
        color: ["#5655F5", "#FE3973", "#F8A540", "#43DC70", "#58B3FF", "#FF611E", "#47EBD5", "#8B572A", "#9013FE"],
        barWidthRatio: 0.4,
        barBackground: {
          style: {
            fill: "#c4d7f1",
            fillOpacity: 0.25
          }
        },
        barStyle: {
          radius: [10, 10, 10, 10]
        },
        label: {
          // 可手动配置 label 数据标签位置
          position: "right",
          offset: 4
        },
        xAxis: {
          range: [0, 1],
          label: this.label,
          tickCount: 2
        }
      })

      bar.render()
    }
  },
  watch: {
    facilitiesData: {
      handler(val) {
        this.facilitiesData = val
        this.createBarChart(this.facilitiesData)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  padding-bottom: 20px;
}

.title_text {
  font-size: 20px;
  font-weight: 600;
  color: #565656;
}

.ant-card {
  border-radius: 14px !important;
}

#containerBar {
  height: 417px;
}
</style>
