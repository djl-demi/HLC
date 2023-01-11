<template>
  <!-- 首页统计数据 -->
  <div id="index" class="index">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <!-- 设备数据 -->
        <TyVehicle :vehicleData="vehicleData"></TyVehicle>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <!-- 充放数据数据 -->
        <TyWorkData></TyWorkData>
      </a-col>
      <a-col :span="12">
        <!-- 完成率 -->
        <TyFinishRate></TyFinishRate>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TyVehicle from "./vehicle.vue"
import TyWorkData from "./work_data.vue"
import TyFinishRate from "./finish_rate.vue"
export default {
  name: "index",
  data() {
    return {
      personData: {},
      personAttendanceData: {},
      terminalData: {},
      vehicleData: {},
      workdata: {},
      facilitiesData: []
    }
  },
  components: {
    TyVehicle,
    TyWorkData,
    TyFinishRate
  },
  created() {
    // this.getOverviewData()
    this.getFacilitiesInfo()
  },
  methods: {
    // 获取总览数据
    getOverviewData() {
      this.$api.getHomePageData().then(res => {
        // 人员模块
        this.personData = {
          sanitationNum: res.data.sanitationNum || 0,
          driverNum: res.data.driverNum || 0,
          totalNum: res.data.totalNum || 0,
          manNum: res.data.manNum || 0,
          womanNum: res.data.womanNum || 0
        }
        // 签到模块
        this.personAttendanceData = {
          todayTaskNum: res.data.todayTaskNum || 0,
          todaySignNum: res.data.todaySignNum || 0,
          taskSignPercent: res.data.taskSignPercent || 0,
          noTaskSignPercent: res.data.noTaskSignPercent || 0,
          dailyPersonnelMileage: res.data.dailyPersonnelMileage || 0,
          monthlyPersonnelMileage: res.data.monthlyPersonnelMileage || 0,
          yearlyPersonnelMileage: res.data.yearlyPersonnelMileage || 0,
          dailyPersonnelAvgMileage: res.data.dailyPersonnelAvgMileage || 0
        }

        // 车辆模块
        this.vehicleData = {
          carNum: res.data.carNum || 0,
          dailyCarMileage: res.data.dailyCarMileage || 0,
          monthlyCarMileage: res.data.monthlyCarMileage || 0,
          yearlyCarMileage: res.data.yearlyCarMileage || 0,
          dailyVehicleAvgMileage: res.data.dailyVehicleAvgMileage || 0
        }
        // 作业模块
        this.workdata = {
          yearlyTotalTaskNum: res.data.yearlyTotalTaskNum || 0,
          yearlyTotalTaskMiles: res.data.yearlyTotalTaskMiles || 0,
          yearlyTaskFinishPercent: res.data.yearlyTaskFinishPercent || 0
        }
      })
    },
    // 获取智能终端和设备信息
    getFacilitiesInfo() {
      this.$api.sanitationNum().then(res => {
        const dataSource = res.data.place.map(item => {
          item.number = parseInt(item.number)
          return item
        })

        let terminalData = {}
        res.data.terminal.map(item => {
          if (item.title == "电子工牌") {
            terminalData.workCard = item.number || 0
          }
          if (item.title == "无人机") {
            terminalData.uav = item.number || 0
          }
          if (item.title == "车载设备") {
            terminalData.vehicle = item.number || 0
          }
          if (item.title == "公厕设备") {
            terminalData.toilet = item.number || 0
          }
        })
        this.terminalData = terminalData
        this.facilitiesData = dataSource
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
