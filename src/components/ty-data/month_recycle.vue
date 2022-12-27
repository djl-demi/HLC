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
            <div class="recycle_total_value">{{ month_recycle_total }}t</div>
          </div>
          <div class="recycle_total_title">垃圾月度回收总量</div>
        </a-col>
        <a-col :span="12">
          <div class="ringContainer">
            <a-progress type="circle" :percent="month_recycle_rate" :width="115" :strokeWidth="strokeWidth" :strokeColor="strokeColor">
              <template #format="percent">
                <span style="color: white">{{ percent }}%</span>
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
      month_recycle_total: 1500,
      strokeWidth: 10,
      strokeColor: "#FFB729",
      month_recycle_rate: 75
    }
  },
  mounted() {
    this.getMonthRecycleData()
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
      this.$api.getMonthRecycle({ month }).then(res => {
        this.month_recycle_total = res.data != null ? (res.data.monthWeight / 1000).toFixed(2) : 0
        this.month_recycle_rate = res.data != null ? res.data.monthWeightRecyclePercent : 0

        // 泗阳数据
        let user = localStorage.getItem("userInfo")
        let userinfo = JSON.parse(user)
        if (userinfo.project_id == 30) {
          this.month_recycle_total = 340.5
          this.month_recycle_rate = 8.07
        }
        // if (userinfo.project_id == 30) {
        //   if (month == 1) {
        //     this.month_recycle_total = 437.73
        //     this.month_recycle_rate = 62
        //   } else if (month == 2) {
        //     this.month_recycle_total = 492.15
        //     this.month_recycle_rate = 61.5
        //   } else if (month == 3) {
        //     this.month_recycle_total = 645.26
        //     this.month_recycle_rate = 66
        //   } else if (month == 4) {
        //     this.month_recycle_total = 616.37
        //     this.month_recycle_rate = 63
        //   } else if (month == 5) {
        //     this.month_recycle_total = 666.85
        //     this.month_recycle_rate = 67.9
        //   } else if (month == 6) {
        //     this.month_recycle_total = 626.71
        //     this.month_recycle_rate = 63.2
        //   } else if (month == 7) {
        //     this.month_recycle_total = 597.16
        //     this.month_recycle_rate = 61
        //   } else if (month == 8) {
        //     this.month_recycle_total = 507.4
        //     this.month_recycle_rate = 65.8
        //   } else if (month == 9) {
        //     this.month_recycle_total = 857.27
        //     this.month_recycle_rate = 68
        //   } else if (month == 10) {
        //     this.month_recycle_total = 0
        //     this.month_recycle_rate = 0
        //   } else if (month == 11) {
        //     this.month_recycle_total = 0
        //     this.month_recycle_rate = 0
        //   } else if (month == 12) {
        //     this.month_recycle_total = 0
        //     this.month_recycle_rate = 0
        //   }
        // }
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
