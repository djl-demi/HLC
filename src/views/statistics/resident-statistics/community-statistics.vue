<template>
  <div id="CommunityStatistics">
    <div class="oh top-bar">
      <a-space class="left-bar" size="middle">
        <div>
          <span>小区：</span>
          <a-select v-model="plot_id" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="请输入小区名称" allowClear />
        </div>
        <div>
          <span>投放方式：</span>
          <a-select v-model="way" show-search :options="wayList" :filter-option="$com.filterOption" class="w200" placeholder="全部方式" allowClear />
        </div>
        <div>
          <span>日期：</span>
          <div class="dib"><a-range-picker v-model="time" @change="timeChange" format="YYYY-MM-DD" :disabledDate="disabledDate" /></div>
        </div>

        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="right-bar">
        <a-popover placement="bottomRight" trigger="click">
          <template slot="content">
            <p style="font-size: 16px; font-weight: bold">图表数据说明：</p>
            <span>餐厨垃圾：所有小区餐厨型垃圾回收量总和。</span><br />
            <span>有害垃圾：所有小区有害类型垃圾回收量总和。</span><br />
            <span>纸类：所有小区纸类型垃圾回收量总和。</span><br />
            <span>塑料：所有小区塑料型垃圾回收量总和。</span><br />
            <span>织物：所有小区织物类型垃圾回收量总和。</span><br />
            <span>金属：所有小区金属类型垃圾回收量总和。</span><br />
            <span>电器：所有小区电器类型垃圾回收量总和。</span><br />
            <span>数码：所有小区数码类型垃圾回收量总和。</span><br />
            <span>玻璃：所有小区玻璃类型垃圾回收量总和。</span><br />
            <span>混合垃圾：所有小区混合类型垃圾回收量总和。</span><br />

            <br />
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>餐厨垃圾：该小区餐厨型垃圾回收量总和。</span><br />
            <span>有害垃圾：该小区有害类型垃圾回收量总和。</span><br />
            <span>纸类：该小区纸类型垃圾回收量总和。</span><br />
            <span>塑料：该小区塑料型垃圾回收量总和。</span><br />
            <span>织物：该小区织物类型垃圾回收量总和。</span><br />
            <span>金属：该小区金属类型垃圾回收量总和。</span><br />
            <span>电器：该小区电器类型垃圾回收量总和。</span><br />
            <span>数码：该小区数码类型垃圾回收量总和。</span><br />
            <span>玻璃：该小区玻璃类型垃圾回收量总和。</span><br />
            <span>混合垃圾：所有小区的混合类型垃圾回收量总和。</span><br />
            <span>总计：该小区以千克为单位垃圾回收量总和。</span><br />
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>
    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">回收量图表</div>
      </a-space>
      <div>
        <div id="bar"></div>
      </div>
      <div class="oh w100b mt20">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :columns="columns" :data-source="dataSource" :pagination="false" :loading="tableLoading"> </a-table>
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
  name: "CommunityStatistics",
  data() {
    return {
      columns: [],
      dataSource: [],
      tableLoading: false,
      plotList: [],
      plot_id: undefined,
      way: undefined,
      wayList: [
        { value: 1, label: "扫码" },
        { value: 2, label: "手机号" },
        { value: 3, label: "刷卡" },
        { value: 4, label: "无认证用户" },
        { value: 5, label: "上门回收" },
        { value: 6, label: "宣传" },
        { value: 7, label: "回访" },
        { value: 8, label: "定时定点" },
        { value: 9, label: "人脸识别" }
      ],
      start_time: this.$moment()
        .startOf("day")
        .subtract(6, "days"),
      end_time: this.$moment().endOf("day"),
      time: [
        this.$moment()
          .startOf("day")
          .subtract(6, "days"),

        this.$moment().endOf("day")
      ],
      page: 1,
      total: 0
    }
  },
  created() {
    this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
  },
  mounted() {
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
    // 日期筛选
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },

    // 获取数据
    getTableList(page) {
      let start_time = this.$utils.forMatDay(this.start_time)
      let end_time = this.$utils.forMatDay(this.end_time)
      let data = {
        plot_id: this.plot_id || "",
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        page
      }
      if (this.way) {
        data["way"] = this.way
      }
      this.$api.stockraterealtime(data).then(res => {
        this.columns = res.data.column.map(item => {
          item.align = "center"
          return item
        })
        this.dataSource = res.data.plot_info.data.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
        this.total = res.data.plot_info.total
        res.data.total.forEach(item => {
          item.category_id = item.category_id + ""
          item.weight = +item.weight
        })
        this.$G2.initResidentRegistrationColumn(this, res.data.total, "bar")
      })
    },

    // 导出
    exportTable() {
      const token = JSON.parse(localStorage.getItem("token"))
      let plot_id = this.plot_id ? this.plot_id : ""
      let way = this.way ? this.way : ""
      let start_time = this.start_time ? this.$utils.forMatDay(this.start_time) : ""
      let end_time = this.end_time ? this.$utils.forMatDay(this.end_time) : ""
      // console.log(way, plot_id, start_time, end_time)
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/plotstock/stockraterealtimeexport?token=${token}&way=${way}&plot_id=${plot_id}&start_time=${start_time}&end_time=${end_time}`)
    }
  }
}
</script>

<style lang="less">
#CommunityStatistics {
  .facility-title {
    margin-left: 0px;
  }
}

.left-bar {
  display: flex;
  justify-content: space-between;

  div {
    flex-shrink: 0;
  }
}

.top-bar {
  display: flex;
  flex-wrap: wrap;
}

.right-bar {
  width: 100%;
  flex: 1;
  justify-content: flex-end;
  display: flex;
}
</style>
