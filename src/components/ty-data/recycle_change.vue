<template>
  <!-- 回收量变化 -->
  <div class="recycle_change_table">
    <div class="switch_labels">
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
      </ul>
    </div>
    <div>
      <a-row class="tHead">
        <a-col :span="8" v-for="(items, indexs) in tHeadColumn" :key="indexs">
          {{ items }}
        </a-col>
      </a-row>
      <ul class="tBody">
        <li v-for="(item, index) in recycleChangeData" :key="index">
          <a-row>
            <a-col :span="8" v-for="(item2, index2) in item" :key="index2">
              <span v-if="index2 > 0 && item2 > '0'"
                ><span class="increase">{{ item2 }}</span></span
              >
              <span v-else-if="index2 > 0 && item2 < '0'"
                ><span class="decrease">{{ item2 }}</span></span
              >
              <span v-else>{{ item2 }}</span>
            </a-col>
          </a-row>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "recycle_change_table",
  data() {
    return {
      isActive: true,
      isActive2: false,
      isActive3: false,
      tHeadColumn: ["品类", "同比", "环比"],
      recycleChangeData: [
        // ["家电", "9.0%", "6.50%"],
        // ["纸张", "-1.0%", "1.50%"],
        // ["玻璃", "1.9%", "11.50%"],
        // ["织物", "-9.0%", "-1.50%"],
        // ["金属", "12%", "10%"],
        // ["塑料", "1.0%", "-2.50%"],
        // ["可回收垃圾", "1.0%", "-2.50%"],
        // ["有害垃圾", "1.0%", "-2.50%"]
      ]
    }
  },
  mounted() {
    // this.getRecoveryChangeData(1)
  },
  methods: {
    viewToday() {
      this.isActive = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.getRecoveryChangeData(1)
    },
    viewWeek() {
      this.isActive = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
      this.getRecoveryChangeData(2)
    },
    viewMonth() {
      this.isActive = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
      this.getRecoveryChangeData(3)
    },
    getRecoveryChangeData(type = 1) {
      let data = {
        type: type
      }

      this.$api.getRecoveryChangeData(data).then(res => {
        this.recycleChangeData = []
        res.data.map((item, index) => {
          // 只选取前八个
          if (index < 8) {
            this.recycleChangeData.push([item.category_name, item.tongbi_weight, item.huanbi_weight])
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.recycle_change_table {
  padding: 20px;
}

.switch_labels {
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

.tHead {
  margin-top: 35px;
  background: #008aff;
  color: #fff;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.tBody {
  display: block;
  width: 100%;
  margin-left: -5px;
}

.tBody li {
  text-align: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  /* padding-left: 20px; */
  /* padding: 0 2px; */
  color: #fff;
  border-bottom: dotted 1px #2e3364;
}

.increase {
  color: red;
}

.decrease {
  color: green;
}
</style>
