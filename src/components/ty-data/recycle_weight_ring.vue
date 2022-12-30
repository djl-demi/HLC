<template>
  <div class="recycle_weight_ring">
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
    <div id="ring_container"></div>
  </div>
</template>

<script>
import { Pie } from "@antv/g2plot"
export default {
  name: "recycle_weight_ring",
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
    // this.getRecyclingSum(1, 1)
  },
  methods: {
    // 今日
    viewToday() {
      this.isActive = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.getRecyclingSum(1)
    },
    // 本周
    viewWeek() {
      this.isActive = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
      this.getRecyclingSum(2)
    },
    // 本月
    viewMonth() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
      this.getRecyclingSum(3)
    },
    // 全年
    viewYear() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = true
      this.getRecyclingSum(4)
    },
    // 垃圾回收量统计
    getRecyclingSum(type = "", flag = 0) {
      let data = {
        type: type
      }
      this.$api.getRecyclingSum(data).then(res => {
        var data = []
        res.data.map(item => {
          data.push({
            type: item.type,
            value: item.value || 0
          })
        })

        this.recycleTotal = data

        if (!flag) {
          this.piePlot.destroy()
        }
        this.createRingChart(data)
      })
    },
    // 生成环形图
    createRingChart(data = []) {
      this.piePlot = new Pie("ring_container", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        color: ({ type }) => {
          return this.$utils.getGoodsColor(type)
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
        statistic: null,
        annotations: [
          {
            type: "image",
            src: "https://image.58xiaoxiang.top/fenlei/recycle_weight_ring.png",
            /** 位置 */
            position: ["0%", "50%"],
            /** 图形样式属性 */
            style: {
              width: 100,
              height: 100
            },
            /** x 方向的偏移量 */
            offsetX: -50,
            /** y 方向的偏移量 */
            offsetY: 28
          }
        ]
      })

      this.piePlot.render()
    }
  }
}
</script>

<style scoped>
.recycle_weight_ring {
  padding: 20px;
}

.switch_label {
  float: right;
  z-index: 999;
}

#ring_container {
  margin-top: 20px;
  margin-right: 20px;
  height: 280px;
  z-index: -1;
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
