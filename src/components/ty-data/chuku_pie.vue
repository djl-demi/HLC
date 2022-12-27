<template>
  <!-- 可回收物出库情况 -->
  <div id="chuku_pie" class="chuku_pie">
    <div class="title">可回收物出库情况(单位:kg)</div>
    <div class="chuku_pie_content">
      <div class="switch_label">
        <ul>
          <li @click="viewToday" v-bind:class="{ active: isActive }">今日</li>
          <li @click="viewWeek" v-bind:class="{ active: isActive2 }">本周</li>
          <li @click="viewMonth" v-bind:class="{ active: isActive3 }">本月</li>
          <li @click="viewYear" v-bind:class="{ active: isActive4 }">全年</li>
        </ul>
      </div>
      <div id="pie_container"></div>
    </div>
  </div>
</template>

<script>
import { Pie } from "@antv/g2plot"
export default {
  name: "chuku_pie",
  data() {
    return {
      piePlot: {},
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false
    }
  },
  mounted() {
    this.getChukuData(1)
  },
  methods: {
    // 本日
    viewToday() {
      this.isActive = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.getChukuData(1)
    },
    // 本周
    viewWeek() {
      this.isActive = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
      this.getChukuData(2)
    },
    // 全月
    viewMonth() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
      this.getChukuData(3)
    },
    // 全年
    viewYear() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = true
      this.getChukuData(4)
    },
    // 获取出库数据
    getChukuData(type = 1) {
      let data = {
        type: type
      }
      this.$api.getStockoutCategory(data).then(res => {
        if (Object.keys(this.piePlot).length == 0) {
          this.createPieChart(res.data)
        } else {
          this.piePlot.changeData(res.data)
        }
      })
    },
    // 生成环形图
    createPieChart(data) {
      this.piePlot = new Pie("pie_container", {
        appendPadding: 10,
        data,
        angleField: "weight",
        colorField: "category_name",
        color: ({ category_name }) => {
          return this.$utils.getGoodsColor(category_name)
        },
        radius: 1,
        innerRadius: 0.6,
        // padding:[10, 10, 10, 5],
        label: {
          type: "outer",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
            fill: "#ffffff"
          }
        },
        legend: {
          itemName: {
            style: {
              fill: "#ffffff"
            }
          }
        },
        interactions: [{ type: "element-selected" }, { type: "element-active" }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 14,
              color: "white"
            },
            // offsetY: 17,
            content: "<div style='width:110px; height:110px; background:#0E6DE9; border-radius:55px;line-height:110px'>可回收物出库</div>"
          }
        }
      })

      this.piePlot.render()
    }
  }
}
</script>

<style scoped>
#chuku_pie {
  color: honeydew;
  width: 509px;
  height: 444px;
  background-image: url(../../assets/data/index/chuku_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 58px;
  line-height: 58px;
  color: #00e4ff;
  font-size: 16px;
}

.chuku_pie_content {
  padding: 20px;
}

#pie_container {
  padding: 20px;
  height: 300px;
  margin-top: 30px;
  z-index: -1;
}

.switch_label {
  float: right;
  z-index: 999;
  height: 30px;
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
