<template>
  <div id="DailyParticipationRate">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>小区：</span>
          <a-select v-model="plot_id" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="请输入小区名称" allowClear />
        </div>
        <div>
          <span>日期：</span>
          <!-- 默认选择近7天 -->
          <div class="dib"><a-range-picker v-model="time" @change="timeChange" format="YYYY-MM-DD" :disabledDate="disabledDate" /></div>
        </div>

        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-popover placement="bottomRight" trigger="click">
          <template slot="content">
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>居民户数：该小区地址中的户数总和。 </span><br />
            <span>入住户数：该小区地址中的入住户数总和。</span><br />
            <span>总注册数：该小区截止当天累计注册的居民数量。</span><br />
            <span>参与数：该小区当天参与过积分兑换或垃圾投放的居民数量。</span><br />
            <span>参与率：参与数 / 注册数。</span><br /><br />
            <p style="color: red">* 以上指标都可更换小区后查询数据并显示。</p>
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="日期" data-index="date" align="center" :ellipsis="true" />
          <a-table-column title="小区" data-index="plot_name" align="center" :ellipsis="true" />
          <a-table-column title="街道" data-index="street" align="center" :ellipsis="true" />
          <a-table-column title="居民户数" data-index="total_num" align="center" :ellipsis="true" />
          <a-table-column title="入住户数" data-index="at_num" align="center" :ellipsis="true" />
          <a-table-column title="总注册数" data-index="register_num" align="center" :ellipsis="true" />
          <a-table-column title="参与数" data-index="day_participate_num" align="center" :ellipsis="true" />
          <!-- <a-table-column title="参与率" data-index="day_participate_rate" align="center" :ellipsis="true" /> -->
          <a-table-column title="参与率" data-index="day_participate_rate" align="center" :ellipsis="true">
            <template slot-scope="text, record"> {{ record.day_participate_rate }}% </template>
          </a-table-column>
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
  name: "DailyParticipationRate",
  data() {
    return {
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
      dataSource: [],
      tableLoading: false,
      plotList: [],
      plot_id: undefined,
      page: 1,
      total: 0
    }
  },
  created() {
    this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getTableList(1)
  },
  mounted() {},
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
    // 日期筛选
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },

    // 获取表格数据
    getTableList(page) {
      let start_time = this.$utils.forMatDay(this.start_time)
      let end_time = this.$utils.forMatDay(this.end_time)
      let data = {
        plot_id: this.plot_id || "",
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        page
      }
      this.tableLoading = true
      this.$api
        .getDailyParticipationRate(data)
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

    // 导出
    exportTable() {
      const plot_id = this.plot_id || ""
      const token = JSON.parse(localStorage.getItem("token"))
      let start_time = this.start_time ? this.$utils.forMatDay(this.start_time) : ""
      let end_time = this.end_time ? this.$utils.forMatDay(this.end_time) : ""
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/plot/user/participate/report/export?token=${token}&start_time=${start_time}&end_time=${end_time}&plot_id=${plot_id}`)
    }
  }
}
</script>

<style lang="less">
// #DailyParticipationRate {
// }
</style>
