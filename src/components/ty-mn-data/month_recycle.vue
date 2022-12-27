<template>
  <div class="month_recycle">
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
</template>

<script>
export default {
  name: "month_recycle",
  data() {
    return {
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
    // 筛选图层设施
    this.$bus.$on("showData", data => {
      this.list = data
      this.getMonthRecycleData()
    })
  },
  methods: {
    // 下拉
    showDropList({ key }) {
      this.getMonthRecycleData(key)
    },
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
    }
  }
}
</script>

<style scoped>
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
