<template>
  <div id="ParticipationRate">
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
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>户数：截止昨日该小区地址中的户数总和。</span><br />
            <span>注册数：截止昨日该小区累计增加的居民总数。</span><br />
            <span>知晓率：注册数 / 户数 x 100% 。</span><br />
            <span>＂xx＂垃圾投放参与人次（不去重）：该小区居民昨日＂xx＂垃圾类型投放的总次数。</span><br />
            <span>＂xx＂垃圾投放人次参与率：人次/户数*100%。</span><br />
            <span>＂xx＂垃圾投放参与人数（去重）：该小区昨日参与＂xx＂垃圾类型投放的总居民数。</span><br />
            <span>＂xx＂垃圾投放人数参与率：人数/户数*100%。</span><br /><br />
            <p style="color: red">* 除户数外其他指标都可根据时间段查询数据并显示。</p>
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :columns="columns" bordered :data-source="dataSource" :pagination="false" :loading="tableLoading" :scroll="{ x: columnWidth }"> </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList(page)" />
        </div>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParticipationRate",
  data() {
    return {
      columnWidth: 1800, // 表格宽度
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
      columns: [],
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
      console.log(v, "vvvvv")
      this.start_time = v[0]
      this.end_time = v[1]
    },
    // 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03
    forMatDate(date) {
      function formatTen(num) {
        return num > 9 ? num + "" : "0" + num
      }
      const d = new Date(date)
      return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate())
    },

    // 获取表格数据
    getTableList(page) {
      let start_time = this.forMatDate(this.start_time)
      let end_time = this.forMatDate(this.end_time)
      let data = {
        plot_id: this.plot_id || "",
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        page
      }
      console.log(data, "dadada")
      this.$api.getPlotStock(data).then(res => {
        // 前6列固定宽度540 + (所有列数量-固定6列 = 动态列数量) * 120
        this.columnWidth = 570 + (res.data.data.column.length - 6) * 120
        this.columns = res.data.data.column.map((item, index) => {
          item.align = "center"
          if (index < 3) {
            item.width = 120
            item.ellipsis = true
          }
          if (index >= 3 && index < 6) {
            item.width = 70
            item.ellipsis = true
          }

          if (item.children && item.children.length > 0) {
            item.children.forEach(sitem => {
              sitem.align = "center"
              sitem.ellipsis = true
            })
          }
          return item
        })
        this.dataSource = res.data.data.list.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
        this.total = res.data.total
      })
    },

    // 导出
    exportTable() {
      const token = JSON.parse(localStorage.getItem("token"))
      let plot_id = this.plot_id ? this.plot_id : ""
      let start_time = this.start_time ? this.forMatDate(this.start_time) : ""
      let end_time = this.end_time ? this.forMatDate(this.end_time) : ""
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/plotstock/exportparticipation?token=${token}&plot_id=${plot_id}&start_time=${start_time}&end_time=${end_time}`)
    }
  }
}
</script>

<style lang="less">
// #ParticipationRate {
// }
</style>
