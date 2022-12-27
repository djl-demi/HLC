<template>
  <!-- 可回收物出库去向 -->
  <div id="chuku_trace" class="chuku_pie">
    <div class="title">可回收物出库去向(单位:kg)</div>
    <div class="chuku_trace_content">
      <div class="switch_label">
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
      <div id="bar_container"></div>
    </div>
  </div>
</template>

<script>
import { Bar } from "@antv/g2plot"
export default {
  name: "chuku_pie",
  data() {
    return {
      bar: {},
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false
    }
  },
  mounted() {
    // this.createBarChart()
    this.getStockCategoryout(1)
  },
  methods: {
    viewToday() {
      console.log("今日")
      this.isActive = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.getStockCategoryout(1)
    },
    viewWeek() {
      this.isActive = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
      console.log("本周")
      this.getStockCategoryout(2)
    },
    viewMonth() {
      console.log("本月")
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
      this.getStockCategoryout(3)
    },
    viewYear() {
      console.log("全年")
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = true
      this.getStockCategoryout(4)
    },
    getStockCategoryout(type = 1) {
      let data = {
        type: type
      }
      this.$api.getStockCategoryout(data).then(res => {
        console.log(res)
        if (Object.keys(this.bar).length == 0) {
          this.createBarChart(res.data)
        } else {
          this.bar.changeData(res.data)
        }
      })
    },
    // 生成条形图
    createBarChart(data) {
      this.bar = new Bar("bar_container", {
        data,
        padding: [0, 20, 30, 80], //上 右 下 左
        xField: "weight",
        yField: "merchant_name",
        color: "l(0) 0:#01A2F8 1:#00ECD6",
        legend: {
          position: "top-left"
        },
        barWidthRatio: 0.1,
        label: {
          // 可手动配置 label 数据标签位置
          position: "right", // 'left', 'middle', 'right'
          offset: 4,
          style: {
            fill: "white"
          }
        },
        barBackground: {
          style: {
            fill: "#040F53",
            fillOpacity: 0.5
          }
        },
        xAxis: {
          label: {
            style: {
              fill: "#0082C4"
            }
          },
          grid: null
        },
        yAxis: {
          label: {
            style: {
              fill: "#0082C4"
            }
          },
          line: {
            style: {
              stroke: "#0082C4",
              lineWidth: 0.5
            }
          }
        },
        interactions: [{ type: "active-region", enable: false }]
      })

      this.bar.render()
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
</style>
