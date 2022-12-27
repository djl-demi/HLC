<template>
  <div id="PointsSummary">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>小区：</span>
          <a-select v-model="plot_id" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="请输入小区名称" allowClear />
        </div>
        <div>
          <span>日期：</span>
          <div class="dib"><a-range-picker v-model="time" @change="timeChange" format="YYYY-MM-DD" :disabledDate="disabledDate" /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-popover placement="bottomRight" trigger="click">
          <template slot="content">
            <p style="font-size: 16px; font-weight: bold">统计数据说明：</p>
            <span>回收量：截止昨日所有居民参与垃圾分类投放的重量总和。</span><br />
            <span>总积分：截止昨日所有居民参与垃圾分类投放获得的积分总和。</span><br />
            <span>当前积分：截止昨日所有居民当前剩余的可用积分总和。</span><br />
            <span>兑换积分：截止到昨日所有居民累计兑换使用的积分总和。</span><br />
            <br />
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>总积分：该小区所有居民的截止到昨日累计积分总和。</span><br />
            <span>当前积分：该小区所有居民的截止到昨日当前积分总和。</span><br />
            <span>总兑换积分：该小区所有居民截止到昨日已兑换使用的积分总和。</span><br />
            <span>昨日回收量：该小区所有居民时间段内分类投放的垃圾重量总和。</span><br />
            <span>昨日兑换礼品数量：该小区所有居民时间段内兑换礼品数量总和。</span><br />
            <span>昨日兑换积分：该小区所有居民时间段内兑换礼品使用的积分总和。</span><br />
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>

    <div class="mtb20">
      <a-row type="flex" justify="space-between">
        <a-col v-for="(item, index) in summaryList" :key="index" class="gutter-row">
          <a-card class="gutter-box" hoverable :bordered="true">
            <img class="icon" :src="item.icon" />
            <div class="dib ">
              <div class="gutter-left-text text-out">{{ item.num }}</div>
              <div class="gutter-title">{{ item.name }}</div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">积分数据概览</div>
      </a-space>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="日期" data-index="date" align="center" :ellipsis="true" />
            <a-table-column title="小区" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column title="街道" data-index="street" align="center" :ellipsis="true" />
            <a-table-column title="总积分" data-index="total_integral" align="center" :ellipsis="true" />
            <a-table-column title="当前积分" data-index="current_integral" align="center" :ellipsis="true" />
            <a-table-column title="总兑换积分" data-index="exchange_integral" align="center" :ellipsis="true" />
            <a-table-column title="昨日回收量" data-index="day_weight" align="center" :ellipsis="true" />
            <a-table-column title="昨日兑换礼品数量" data-index="day_exchange_num" align="center" :ellipsis="true" />
            <a-table-column title="昨日兑换积分" data-index="day_exchange_integral" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList(page)" />
          </div>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PointsSummary",
  data() {
    return {
      plotList: [],
      plot_id: undefined,
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
      tableLoading: false,
      summaryList: [
        { name: "回收总量", num: "", icon: require("@/assets/icons/summary_1.png") },
        { name: "总积分", num: "", icon: require("@/assets/icons/summary_2.png") },
        { name: "当前积分", num: "", icon: require("@/assets/icons/summary_3.png") },
        { name: "兑换积分", num: "", icon: require("@/assets/icons/summary_4.png") }
      ], // 汇总统计图
      page: 1,
      total: 0,
      dataSource: []
    }
  },
  created() {
    this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
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
        .getPointsSummary(data)
        .then(res => {
          this.summaryList.forEach(item => {
            if (item.name === "回收总量") item.num = res.data.count.total_weight
            if (item.name === "总积分") item.num = res.data.count.total_integral
            if (item.name === "当前积分") item.num = res.data.count.current_integral
            if (item.name === "兑换积分") item.num = res.data.count.exchange_integral
          })
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
    },

    // 导出
    exportTable() {
      const plot_id = this.plot_id || ""
      const token = JSON.parse(localStorage.getItem("token"))
      let start_time = this.start_time ? this.$utils.forMatDay(this.start_time) : ""
      let end_time = this.end_time ? this.$utils.forMatDay(this.end_time) : ""
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/plot/integral/report/export?token=${token}&start_time=${start_time}&end_time=${end_time}&plot_id=${plot_id}`)
    }
  }
}
</script>

<style lang="less">
#PointsSummary {
  .ant-card-body {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .gutter-box {
    padding: 5px;
    border-radius: 5px;
    .gutter-title {
      font-size: 20px;
    }
    .gutter-left-text {
      font-size: 30px;
      color: #31c27c;
    }
    .ant-card-body {
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
    }
  }
  .guttet-content {
    // height: 76px;
    margin-left: 20px;
  }
  .icon {
    width: 76px;
    height: 76px !important;
  }
}
</style>
