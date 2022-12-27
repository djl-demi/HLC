<template>
  <div id="PointsReport">
    <a-tabs default-active-key="1" @change="tabsChange">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name">
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>日期：</span>
              <div class="dib">
                <a-month-picker
                  :disabledDate="disabledDate"
                  v-model="item.date_time"
                  @change="
                    (e, v) => {
                      timeChange(e, v, item.key)
                    }
                  "
                  allowClear
                />
              </div>
            </div>
            <a-button type="primary" :loading="item.tableLoading" @click="item.key === '1' ? getPointsReportGain() : getPointsReportExchange()">查询</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" :columns="item.columns" :data-source="item.dataSource" :pagination="false" :loading="item.tableLoading"> </a-table>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: "PointsReport",
  data() {
    return {
      tabs: [
        { name: "积分获取", key: "1", columns: [], dataSource: [], date_time: this.$moment().subtract(1, "month"), tableLoading: false },
        {
          name: "积分兑换",
          key: "2",
          columns: [
            { title: "日期", dataIndex: "date", align: "center", ellipsis: true },
            { title: "总积分", dataIndex: "total_integral", align: "center", ellipsis: true },
            { title: "可用积分", dataIndex: "integral", align: "center", ellipsis: true },
            { title: "当月增加积分", dataIndex: "add_integral", align: "center", ellipsis: true },
            { title: "当月兑换积分", dataIndex: "exchange_integral", align: "center", ellipsis: true },
            { title: "当月未兑换积分", dataIndex: "month_integral", align: "center", ellipsis: true }
          ],
          date_time: this.$moment().subtract(1, "month"),
          dataSource: [],
          tableLoading: false
        }
      ]
    }
  },
  created() {
    this.getPointsReportGain()
    this.getPointsReportExchange()
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
    // 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03
    forMatMonth(date) {
      function formatTen(num) {
        return num > 9 ? num + "" : "0" + num
      }
      const d = new Date(date)
      return d.getFullYear() + "-" + formatTen(d.getMonth() + 1)
    },
    // 获取积分获取列表
    getPointsReportGain() {
      this.tabs[0].tableLoading = true
      let date_time = this.forMatMonth(this.tabs[0].date_time)
      console.log(date_time, "date_time")
      this.$api
        .getPointsReportGain({ date_time: this.tabs[0].date_time == "" ? "" : date_time })
        .then(res => {
          this.tabs[0].columns = res.data.header.map(item => {
            item.dataIndex = item.key
            return item
          })
          this.tabs[0].dataSource = res.data.result.map(item => {
            item.key = this.$utils.createUUID()
            return item
          })
          this.tabs[0].tableLoading = false
        })
        .catch(err => {
          this.tabs[0].tableLoading = false
        })
    },

    // 获取积分兑换列表
    getPointsReportExchange() {
      this.tabs[1].tableLoading = true
      let date_time = this.forMatMonth(this.tabs[1].date_time)
      this.$api
        .getPointsReportExchange({ date_time: this.tabs[1].date_time == "" ? "" : date_time })
        .then(res => {
          this.tabs[1].dataSource = res.data.map(item => {
            item.key = item.id
            return item
          })
          this.tabs[1].tableLoading = false
        })
        .catch(err => {
          this.tabs[1].tableLoading = false
        })
    },

    // 切换tabs
    tabsChange() {
      // this.time = undefined
      // date_time: this.$moment().subtract(1, "month"),
      this.page = 1
      this.total = 0
    },

    // 日期筛选
    timeChange(e, v, key) {
      console.log(v, "vvvv")
      this.tabs.forEach(item => {
        if (item.key === key) {
          item.date_time = v
        }
      })
    }
  }
}
</script>

<style lang="less">
// #PointsReport {
// }
</style>
