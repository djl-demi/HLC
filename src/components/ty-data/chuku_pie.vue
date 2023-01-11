<template>
  <!-- 可回收物出库情况 -->
  <div id="chuku_pie" class="chuku_pie">
    <div class="title">发电机管理</div>
    <div class="chuku_pie_content">
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
              <div class="recycle_total_value">{{ month_recycle_total }}兆瓦</div>
            </div>
            <div class="recycle_total_title">发电机发电总量</div>
          </a-col>
          <a-col :span="12">
            <div class="ringContainer">
              <a-progress type="circle" :percent="month_recycle_rate" :width="115" :strokeWidth="strokeWidth" :strokeColor="strokeColor">
                <template #format="percent">
                  <span style="color: white">{{ percent }}%</span>
                </template>
              </a-progress>
            </div>
            <div class="recycle_total_title">电量使用率</div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chuku_pie",
  data() {
    return {
      piePlot: {},
      isActive: true,
      isActive2: false,
      isActive3: false,
      isActive4: false,

      month: new Date().getMonth() + 1,
      dropIcon: "down",
      month_recycle_total: 1500,
      strokeWidth: 10,
      strokeColor: "#FFB729",
      month_recycle_rate: 75
    }
  },
  mounted() {
    // this.getChukuData(1)
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
      })
    }
  }
}
</script>

<style scoped>
#chuku_pie {
  color: honeydew;
  width: 509px;
  height: 360px;
  background-image: url(../../assets/data/index/facilities_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 58px;
  line-height: 45px;
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
  top: 55px;
  z-index: 999;
}

.ant-dropdown-link {
  color: #00e4ff;
}
.ant-dropdown-menu-item > a,
.ant-dropdown-menu-submenu-title > a {
  margin: -5px -25px;
}
</style>
