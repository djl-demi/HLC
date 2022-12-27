<template>
  <div id="RecoveryAnalysis">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="flex-line" size="middle">
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
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>

      <div>
        <a-space style="margin: 20px 0;">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">回收量分析</div>
        </a-space>
        <div>
          <div id="bar"></div>
        </div>
        <div class="oh w100b mt20">
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" bordered :columns="columns" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <!-- <a-table-column key="recycleMonth" title="日期" data-index="recycleMonth" align="center" :ellipsis="true" />
              <a-table-column key="plotName" title="小区" data-index="plotName" align="center" :ellipsis="true" />
              <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
              <a-table-column key="totalWeight" title="总重量(kg)" data-index="totalWeight" align="center" :ellipsis="true" />
              <a-table-column-group>
                <span slot="title" v-if="projectName === '其他'">可回收物</span>
                <span slot="title" v-if="projectName === '泗阳'">塑料</span>
                <a-table-column key="recyclableWeight" title="回收量(kg)" data-index="recyclableWeight" align="center" :ellipsis="true" />
                <a-table-column key="recyclablePercent" title="占比" data-index="recyclablePercent" align="center" :ellipsis="true" />
              </a-table-column-group>
              <a-table-column-group>
                <span slot="title" v-if="projectName === '其他'">厨余垃圾</span>
                <span slot="title" v-if="projectName === '泗阳'">纸张</span>
                <a-table-column key="kitchenWasteWeight" title="回收量(kg)" data-index="kitchenWasteWeight" align="center" :ellipsis="true" />
                <a-table-column key="kitchenWastePercent" title="占比" data-index="kitchenWastePercent" align="center" :ellipsis="true" />
              </a-table-column-group>
              <a-table-column-group>
                <span slot="title" v-if="projectName === '其他'">有害垃圾</span>
                <span slot="title" v-if="projectName === '泗阳'">金属</span>
                <a-table-column key="harmfulWasteWeight" title="回收量(kg)" data-index="harmfulWasteWeight" align="center" :ellipsis="true" />
                <a-table-column key="harmfulWastePercent" title="占比" data-index="harmfulWastePercent" align="center" :ellipsis="true" />
              </a-table-column-group>
              <a-table-column-group>
                <span slot="title" v-if="projectName === '其他'">其他垃圾</span>
                <span slot="title" v-if="projectName === '泗阳'">玻璃</span>
                <a-table-column key="otherWeight" title="回收量(kg)" data-index="otherWeight" align="center" :ellipsis="true" />
                <a-table-column key="otherPercent" title="占比" data-index="otherPercent" align="center" :ellipsis="true" />
              </a-table-column-group> -->
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </div>
    </a-space>
  </div>
</template>
<script>
export default {
  name: "RecoveryAnalysis",
  data() {
    return {
      plotList: [],
      street: "",
      plotName: "",
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
      columns: [],
      dataSource: [],
      projectName: "",
      tableLoading: false,
      total: 1,
      pageNum: 1
    }
  },
  created() {
    // this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getTableList()
  },
  mounted() {
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
        pageNum: this.pageNum
      }
      this.tableLoading = true
      this.$api.getRecycleAnalysis(data).then(res => {
        this.tableLoading = false
        this.projectName = res.data.data.projectName
        this.columns = res.data.data.column.map((item, index) => {
          item.align = "center"
          item.ellipsis = true
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

    // 获取图表数据
    getChart() {
      let startTime = this.$utils.forMatDay(this.startTime)
      let endTime = this.$utils.forMatDay(this.endTime)
      let data = {
        plotName: this.plotName || "",
        street: this.street || "",
        startTime: this.startTime == "" ? "" : startTime,
        endTime: this.endTime == "" ? "" : endTime
      }
      this.$api.getRecycleCharts(data).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.date = item.type
            item.name = item.type
            item.nums = +item.totalWeight
          })
          this.$G2.initRecycleChartsColumn(this, res.data, "bar")
        } else {
          this.$G2.initRecycleChartsColumn(this, [], "bar")
        }
      })
    },
    //导出
    trackExport() {
      let plotName = this.plotName || ""
      let street = this.street || ""
      let startTime = this.startTime ? this.$utils.forMatDay(this.startTime) : ""
      let endTime = this.endTime ? this.$utils.forMatDay(this.endTime) : ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/analysis/recycleExport?token=${token}&plotName=${plotName}&startTime=${startTime}&endTime=${endTime}&street=${street}`)
    }
  }
}
</script>

<style lang="less">
#RecoveryAnalysis {
}
</style>
