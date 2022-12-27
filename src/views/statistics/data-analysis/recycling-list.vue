<template>
  <div id="RecyclingList">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>小区：</span>
            <div class="dib"><a-input v-model="plotName" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="请输入小区名称" allowClear /></div>
          </div>
          <div>
            <span>街道：</span>
            <div class="dib"><a-input v-model="street" class="w200" show-search placeholder="请输入街道" allowClear /></div>
          </div>
          <div>
            <span>日期：</span>
            <div class="dib"><a-range-picker v-model="time" @change="timeChange" allowClear :disabled-date="disabledDate" format="YYYY-MM-DD" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getData()">搜索</a-button>
        </a-space>
        <a-space class="fr  ">
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>
      <div>
        <a-space style="margin: 20px 0;">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">回收量排行榜 top10:</div>
        </a-space>
        <div>
          <div id="line"></div>
        </div>
        <div>
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" @change="handleChange" :columns="columns" :data-source="dataSource" :pagination="false" :loading="tableLoading" :rowKey="row => this.$utils.createUUID()">
              <!-- <a-table-column key="recycleMonth" title="日期" data-index="recycleMonth" align="center" :ellipsis="true" />
              <a-table-column key="plotName" title="小区" data-index="plotName" align="center" :ellipsis="true" />
              <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
              <a-table-column key="totalWeight" title="总重量(kg)" data-index="totalWeight" sorter="true" align="center" :ellipsis="true" />
              <a-table-column key="recyclableWeight" title="可回收物(kg)" data-index="recyclableWeight" sorter="true" align="center" :ellipsis="true" />
              <a-table-column key="kitchenWasteWeight" title="厨余垃圾(kg)" data-index="kitchenWasteWeight" sorter="true" align="center" :ellipsis="true" />
              <a-table-column key="harmfulWasteWeight" title="有害垃圾(kg)" data-index="harmfulWasteWeight" sorter="true" align="center" />
              <a-table-column key="otherWeight" title="其他垃圾(kg)" data-index="otherWeight" sorter="true" align="center" :ellipsis="true" /> -->
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList(pageNum)" />
            </div>
          </a-space>
        </div>
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "RecyclingList",
  data() {
    return {
      plotList: [],
      plotName: "",
      street: "",
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
      columns: [],
      dataSource: [],
      tableLoading: false,
      total: 1,
      pageNum: 1
    }
  },
  created() {
    this.getChart()
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
      this.startTime = v[0]
      this.endTime = v[1]
    },
    // 查询所有数据
    getData() {
      this.getChart()
      this.getTableList(this.page)
    },
    // 获取物品列表
    getTableList(pageNum) {
      let startTime = this.$utils.forMatDay(this.startTime)
      let endTime = this.$utils.forMatDay(this.endTime)
      let data = {
        street: this.street || "",
        plotName: this.plotName || "",
        startTime: this.startTime == "" ? "" : startTime,
        endTime: this.endTime == "" ? "" : endTime,
        state: this.state || "",
        type: this.type || "",
        pageNum: this.pageNum
      }
      this.tableLoading = true
      this.$api.getRecycleRanking(data).then(res => {
        this.tableLoading = false
        this.columns = res.data.data.column.map((item, index) => {
          item.align = "center"
          item.ellipsis = true
          if (index > 2) {
            item.sorter = true
          }
          return item
        })
        this.dataSource = res.data.data.list.map(item => {
          item.key = item.id
          return item
        })
        this.total = res.data.total
      })
    },
    // 表格变化
    handleChange(pagination, filters, sorter) {
      if (sorter.order) {
        if (sorter.order === "ascend") {
          this.state = 2
        } else if (sorter.order === "descend") {
          this.state = 1
        } else {
          this.state = ""
        }
        this.type = sorter.field
      } else {
        this.type = ""
      }
      this.pageNum = 1
      this.getTableList(this.pageNum)
    },
    // 获取图表数据
    getChart() {
      let startTime = this.$utils.forMatDay(this.startTime)
      let endTime = this.$utils.forMatDay(this.endTime)
      let data = {
        street: this.street || "",
        plotName: this.plotName || "",
        startTime: this.startTime == "" ? "" : startTime,
        endTime: this.endTime == "" ? "" : endTime
      }
      this.$api.getRecycleRankingCharts(data).then(res => {
        if (res.data.length > 0) {
          res.data.forEach((item, index) => {
            console.log(index, "index")
            item.index = index + 1
          })
          this.$G2.initRecycleRankingChartsLine(this, res.data, "line", 350)
        } else {
          this.$G2.initRecycleRankingChartsLine(this, [], "line", 350)
        }
      })
    },
    //导出
    trackExport() {
      let startTime = this.startTime ? this.$utils.forMatDay(this.startTime) : ""
      let endTime = this.endTime ? this.$utils.forMatDay(this.endTime) : ""
      let plotName = this.plotName || ""
      let street = this.street || ""
      let type = this.type || ""
      let state = this.state || ""

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}/bid/analysis/recycleRankingExport?token=${token}&plotName=${plotName}&startTime=${startTime}&endTime=${endTime}&street=${street}&type=${type}&state=${state}`
      )
    }
  }
}
</script>

<style lang="less">
#RecyclingList {
}
</style>
