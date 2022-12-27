<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="flex-line" size="middle">
          <div>
            <span>姓名：</span>
            <div class="dib"><a-input v-model="userName" placeholder="请输入居民姓名" allowClear /></div>
          </div>
          <div>
            <span>小区：</span>
            <div class="dib"><a-input v-model="plotName" class="w200" show-search :filter-option="$com.filterOption" placeholder="请输入小区名称" allowClear /></div>
          </div>
          <div>
            <span>街道：</span>
            <div class="dib"><a-input v-model="street" class="w200" show-search placeholder="请输入街道" allowClear /></div>
          </div>
          <div>
            <span>日期：</span>
            <div class="dib"><a-range-picker v-model="time" @change="timeChange" allowClear :disabled-date="disabledDate" format="YYYY-MM-DD" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
          <a-table-column key="launchTime" title="日期" data-index="launchTime" align="center" :ellipsis="true" />
          <a-table-column key="userName" title="居民" data-index="userName" align="center" :ellipsis="true" />
          <!-- <a-table-column key="userPhone" title="联系方式" data-index="userPhone" align="center" :ellipsis="true" /> -->
          <a-table-column key="plotName" title="小区" data-index="plotName" align="center" :ellipsis="true" />
          <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
          <!-- <a-table-column key="plotTotalLaunch" title="小区累计投放" data-index="plotTotalLaunch" align="center" :ellipsis="true" /> -->
          <a-table-column-group>
            <span slot="title">当日投放次数</span>
            <a-table-column key="daily7to9" title="7:00-9:00" data-index="daily7to9" align="center" :ellipsis="true" />
            <a-table-column key="daily18to20" title="18:00-20:00" data-index="daily18to20" align="center" :ellipsis="true" />
          </a-table-column-group>
          <a-table-column-group>
            <span slot="title">当月投放次数</span>
            <a-table-column key="monthly7to9" title="7:00-9:00" data-index="monthly7to9" align="center" :ellipsis="true" />
            <a-table-column key="monthly18to20" title="18:00-20:00" data-index="monthly18to20" align="center" :ellipsis="true" />
          </a-table-column-group>
          <a-table-column-group>
            <span slot="title">累计投放次数</span>
            <a-table-column key="total7to9" title="7:00-9:00" data-index="total7to9" align="center" :ellipsis="true" />
            <a-table-column key="total18to20" title="18:00-20:00" data-index="total18to20" align="center" :ellipsis="true" />
          </a-table-column-group>
          <a-table-column-group>
            <span slot="title">投放占比</span>
            <a-table-column key="launchPercent7to9" title="7:00-9:00" data-index="launchPercent7to9" align="center" :ellipsis="true" />
            <a-table-column key="launchPercent18to20" title="18:00-20:00" data-index="launchPercent18to20" align="center" :ellipsis="true" />
          </a-table-column-group>
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
      dataSource: [],
      plotName: "",
      plotList: [],
      street: "",
      userPhone: "",
      userName: "",
      startTime: this.$moment()
        .startOf("day")
        .subtract(7, "days"),
      endTime: this.$moment()
        .startOf("day")
        .subtract(1, "days"),
      time: [
        this.$moment()
          .startOf("day")
          .subtract(7, "days"),

        this.$moment()
          .startOf("day")
          .subtract(1, "days")
      ],
      // startTime: "",
      // endTime: "",
      tableLoading: false,
      total: 1,
      pageNum: 1
    }
  },
  created() {
    // this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getTableList()
  },
  methods: {
    // 限制1个月日期选择
    disabledDate(current) {
      return (
        current &&
        current <
          this.$moment()
            .subtract(1, "month")
            .endOf("day")
      )
    },
    // 日期筛选
    timeChange(e, v) {
      this.startTime = v[0]
      this.endTime = v[1]
    },
    // 获取物品列表
    getTableList(pageNum) {
      let startTime = this.$utils.forMatDay(this.startTime)
      let endTime = this.$utils.forMatDay(this.endTime)
      let data = {
        street: this.street || "",
        plotName: this.plotName,
        userPhone: this.userPhone,
        userName: this.userName,
        startTime: this.startTime == "" ? "" : startTime,
        endTime: this.endTime == "" ? "" : endTime,
        pageNum: this.pageNum
      }
      this.tableLoading = true
      this.$api.getFrequencyAnalysis(data).then(res => {
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
      let plotName = this.plotName || ""
      let userName = this.userName || ""
      let street = this.street || ""
      // let userPhone = this.userPhone || ""
      let startTime = this.startTime ? this.$utils.forMatDay(this.startTime) : ""
      let endTime = this.endTime ? this.$utils.forMatDay(this.endTime) : ""

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/analysis/frequencyExport?token=${token}&plotName=${plotName}&userName=${userName}&startTime=${startTime}&endTime=${endTime}&street=${street}`)
    }
  }
}
</script>

<style lang="less">
#AnalysisOfLaunchFrequency {
}
</style>
