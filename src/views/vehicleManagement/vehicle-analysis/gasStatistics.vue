<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>车牌：</span>
            <div class="dib"><a-input v-model="form.vehicleNumber" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>车辆类型：</span>
            <div class="dib"><a-select v-model="form.vehicleTypeId" placeholder="请选择车辆类型" :options="vehicleTypeList" class="w150" allowClear></a-select></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib">
              <a-month-picker format="YYYY年MM月" placeholder="请选择时间" style="width: 136px" allowClear :disabled-date="disabledDate" @change="dateChange" />
            </div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
        <a-space class="ctrl-bar" size="middle">
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
          <a-table-column title="车牌" data-index="vehicleNumber" align="center" :ellipsis="true" />
          <a-table-column title="车辆类型" data-index="vehicleType" align="center" :ellipsis="true" />
          <a-table-column title="加油总量（L)" data-index="refuelingVolume" align="center" :ellipsis="true" />
          <a-table-column title="单价(元）" data-index="oilPrice" align="center" :ellipsis="true" />
          <a-table-column title="总金额(元）" data-index="realPay" align="center" :ellipsis="true" />
          <a-table-column title="总行驶里程（km）" data-index="totalKm" align="center" :ellipsis="true" />
          <a-table-column title="加油次数" data-index="refueingCount" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30 mb20">
          <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "AnalysisOfLaunchFrequency",
  data() {
    return {
      form: {
        vehicleNumber: undefined,
        vehicleTypeId: undefined,
        refuelingMonth: undefined
      },
      vehicleTypeList: [],
      dataSource: [],
      plotName: "",
      plotList: [],
      street: "",
      userPhone: "",
      userName: "",
      time: [this.$moment().subtract(1, "days"), this.$moment().subtract(1, "days")],
      // startTime:"",
      // endTime:"",
      startTime: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      endTime: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      tableLoading: false,
      total: 1,
      pageNum: 1
    }
  },
  created() {
    // this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getVehicleType()
    this.getTableList()
  },
  methods: {
    dateChange(date) {
      this.form.refuelingMonth = date ? this.forMatDate(date._d) : undefined
    },
    disabledDate(current) {
      const date = new Date()
      let month = date.getMonth()
      // 禁止当前月往前推2月且后面月份不可选
      return current.year() === date.getFullYear() && current.month() >= month
    },
    datepicker(date) {
      console.log(date)
    },
    // 获取车辆类型
    getVehicleType() {
      this.$api.vehicleTypeTypeDown().then(res => {
        if (res.code === 200) {
          this.vehicleTypeList = res.data.map(item => {
            item.label = item.typeName
            item.value = item.id
            return item
          })
        }
      })
    },
    forMatDate(date) {
      function formatTen(num) {
        return num > 9 ? num + "" : "0" + num
      }
      const d = new Date(date)
      return d.getFullYear() + "-" + formatTen(d.getMonth() + 1)
    },
    // 日期筛选
    timeChange(e, v) {
      this.startTime = v[0]
      this.endTime = v[1]
    },
    // 获取物品列表
    getTableList(pageNum) {
      this.pageNum = pageNum ? pageNum : 1
      let data = {
        pageNum: this.pageNum
      }
      Object.keys(this.form).forEach(e => {
        this.form[e] ? (data[e] = this.form[e]) : null
      })
      this.tableLoading = true
      this.$api.getMonthlyRefuelingStatistics(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //导出
    trackExport() {
      let param = "&"
      Object.keys(this.form).forEach(e => {
        param += this.form[e] ? e + "=" + this.form[e] + "&" : ""
      })
      param = param.substring(0, param.lastIndexOf("&"))
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/oil/exportMonthlyRefuelingStatistics?token=${token}${param}`)
    }
  }
}
</script>

<style lang="less">
#AnalysisOfLaunchFrequency {
}
</style>
