<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>车牌：</span>
            <div class="dib"><a-input v-model="userName" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>车辆类型：</span>
            <div class="dib"><a-input v-model="plotName" class="w200" show-search :filter-option="$com.filterOption" placeholder="请输入类型" allowClear /></div>
          </div>
          <div>
            <span>操作人：</span>
            <div class="dib"><a-input v-model="plotName" class="w200" show-search :filter-option="$com.filterOption" placeholder="请输入操作人" allowClear /></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib"><a-input v-model="street" class="w200" show-search placeholder="请选择时间" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
      </div>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
          <a-table-column title="车牌" align="center" :ellipsis="true" />
          <a-table-column title="车辆类型" align="center" :ellipsis="true" />
          <a-table-column title="公里数(km)" align="center" :ellipsis="true" />
          <a-table-column title="截止日期" align="center" :ellipsis="true" />
          <a-table-column title="操作人" align="center" :ellipsis="true" />
          <a-table-column title="操作时间" align="center" :ellipsis="true" />
          <a-table-column title="图片" align="center" :ellipsis="true" />
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
    this.getTableList()
  },
  methods: {
    // 日期筛选
    timeChange(e, v) {
      this.startTime = v[0]
      this.endTime = v[1]
    },
    // 获取物品列表
    getTableList(pageNum) {
      let data = {
        street: this.street || "",
        plotName: this.plotName,
        userPhone: this.userPhone,
        userName: this.userName,
        startTime: this.startTime || "",
        endTime: this.endTime || "",
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
      let startTime = this.startTime || ""
      let endTime = this.endTime || ""

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
