<template>
  <!-- 可回收物出库情况 -->
  <div id="chuku_pie" class="chuku_pie">
    <div class="title">可回收物出库情况(单位:kg)</div>
    <div class="chuku_pie_content">
      <!-- <div class="switch_label">
        <ul>
          <li @click="viewToday" v-bind:class="{ active: isActive }">今日</li>
          <li @click="viewWeek" v-bind:class="{ active: isActive2 }">本周</li>
          <li @click="viewMonth" v-bind:class="{ active: isActive3 }">本月</li>
          <li @click="viewYear" v-bind:class="{ active: isActive4 }">全年</li>
        </ul>
      </div>
      <div id="pie_container"></div> -->
      <div class="droplist">
        <a-dropdown :trigger="['click']" style="width:40px">
          <a class="ant-dropdown-link">月份：{{ month }}月<a-icon :type="dropIcon" class="icon—drop" /> </a>
          <a-menu slot="overlay" @click="showDropList">
            <a-menu-item key="1">
              <a href="javascript:;">1月</a>
            </a-menu-item>
            <a-menu-item key="2">
              <a href="javascript:;">2月</a>
            </a-menu-item>
            <a-menu-item key="3">
              <a href="javascript:;">3月</a>
            </a-menu-item>
            <a-menu-item key="4">
              <a href="javascript:;">4月</a>
            </a-menu-item>
            <a-menu-item key="5">
              <a href="javascript:;">5月</a>
            </a-menu-item>
            <a-menu-item key="6">
              <a href="javascript:;">6月</a>
            </a-menu-item>
            <a-menu-item key="7">
              <a href="javascript:;">7月</a>
            </a-menu-item>
            <a-menu-item key="8">
              <a href="javascript:;">8月</a>
            </a-menu-item>
            <a-menu-item key="9">
              <a href="javascript:;">9月</a>
            </a-menu-item>
            <a-menu-item key="10">
              <a href="javascript:;">10月</a>
            </a-menu-item>
            <a-menu-item key="11">
              <a href="javascript:;">11月</a>
            </a-menu-item>
            <a-menu-item key="12">
              <a href="javascript:;">12月</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div>
        <a-row>
          <a-col :span="12">
            <div class="recycle_total">
              <div class="recycle_total_value">{{ data.weight }}t</div>
            </div>
            <div class="recycle_total_title">垃圾月度回收总量</div>
          </a-col>
          <a-col :span="12">
            <div class="ringContainer">
              <a-progress type="circle" :percent="recycleRate" :width="115" :strokeWidth="strokeWidth" :strokeColor="strokeColor">
                <template #format="recycleRate">
                  <span style="color: white">{{ recycleRate }}%</span>
                </template>
              </a-progress>
            </div>
            <div class="recycle_total_title">垃圾月度资源回收率</div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
// import { Pie } from "@antv/g2plot"
export default {
  name: "chuku_pie",
  data() {
    return {
      piePlot: {},
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false,
      data: [],

      month: new Date().getMonth() + 1,
      dropIcon: "down",
      data: {},
      recycleRate: 0,
      strokeWidth: 10,
      strokeColor: "#FFB729",
      list: []
    }
  },
  mounted() {
    // this.getChukuData(1)
    this.getMonthRecycleData(key)
  },
  methods: {
    // 获取月度数据
    getMonthRecycleData(month) {
      month = month ? month : new Date().getMonth() + 1
      this.month = month
      this.list.map(item => {
        if (item.month == month) {
          this.data = item
          this.recycleRate = this.data.recycleRate
        }
      })
    },

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
      this.$api.getRecycleOutSimulistAll(data).then(res => {
        this.data = res.data[type - 1].typeDetailList.map(item => {
          item.goodsType = item.goodsType == 1 ? "可回收物" : "金属"
          return item
        })
        if (Object.keys(this.piePlot).length == 0) {
          this.createPieChart(this.data)
        } else {
          console.log(this.data, "this.data")
          this.piePlot.changeData(this.data)
        }
      })
    },
    // 生成环形图
    createPieChart(data) {
      this.piePlot = new Pie("pie_container", {
        appendPadding: 10,
        data,
        angleField: "weight",
        colorField: "goodsType",
        color: ({ goodsType }) => {
          return this.$utils.getGoodsColor(goodsType)
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
  height: 360px;
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
.month_recycle {
  position: relative;
  padding: 15px;
}
.recycle_total {
  height: 155px;
  width: 147px;
  background-image: url(../../assets/data/index/recycle_total_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  margin: 10px auto;
}

.recycle_total_title {
  text-align: center;
  font-size: 16px;
}

.recycle_total_value {
  font-size: 24px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.ringContainer {
  margin: 30px auto;
  height: 115px;
  width: 115px;
}

.droplist {
  /* margin-left: 50px; */

  position: absolute;
  right: 15px;
  top: 0px;
  z-index: 999;
}

.ant-dropdown-link {
  color: #00e4ff;
}
</style>
<style scoped>

</style>
