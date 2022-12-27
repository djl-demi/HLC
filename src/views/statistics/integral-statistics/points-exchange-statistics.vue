<template>
  <div id="PointsExchangeStatistics">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>日期：</span>
          <div class="dib"><a-range-picker v-model="time" @change="timeChange" format="YYYY-MM-DD" :disabledDate="disabledDate" /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>
    <div class="oh w100b">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="日期" data-index="date" align="center" :ellipsis="true" />
          <a-table-column title="小区" data-index="plot_name" align="center" :ellipsis="true" />
          <a-table-column title="街道" data-index="street" align="center" :ellipsis="true" />
          <a-table-column title="名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column title="当日兑换" data-index="exchange_num" align="center" :ellipsis="true" />
          <a-table-column title="合计" data-index="total_exchange_num" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList(page)" />
        </div>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  name: "PointsExchangeStatistics",
  data() {
    return {
      tableLoading: false,
      page: 1,
      total: 0,
      start_time: this.$moment()
        .startOf("day")
        .subtract(7, "days"),
      end_time: this.$moment()
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
      dataSource: []
    }
  },
  created() {
    this.getTableList(1)
  },
  methods: {
    // 限制3个月日期选择
    disabledDate(current) {
      return (
        current &&
        current <
          this.$moment()
            .subtract(3, "month")
            .endOf("day")
      )
    },
    getTableList(page) {
      let start_time = this.$utils.forMatDay(this.start_time)
      let end_time = this.$utils.forMatDay(this.end_time)
      let data = {
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        page
      }
      this.tableLoading = true
      this.$api
        .getPointsExchangeStatistics(data)
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            item.street = item.plot_info.street
            return item
          })
          this.tableLoading = false
          this.total = res.data.total
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    // 日期筛选
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
      this.exportTime = e
    },
    // 导出
    exportTable() {
      const token = JSON.parse(localStorage.getItem("token"))
      let start_time = this.start_time ? this.$utils.forMatDay(this.start_time) : ""
      let end_time = this.end_time ? this.$utils.forMatDay(this.end_time) : ""
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/integral/exchange/report/export?token=${token}&start_time=${start_time}&end_time=${end_time}`)
    }
  }
}
</script>

<style lang="less">
// #PointsExchangeStatistics {
// }
</style>
