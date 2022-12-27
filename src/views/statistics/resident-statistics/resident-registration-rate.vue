<template>
  <div id="ResidentRegistrationRate">
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
        <!-- <div>
          <a-radio-group v-model="time" @change="timeChange" buttonStyle="solid">
            <a-radio-button value="day">昨日</a-radio-button>
            <a-radio-button value="week">本周</a-radio-button>
            <a-radio-button value="month">本月</a-radio-button>
            <a-radio-button value="year">本年</a-radio-button>
          </a-radio-group>
        </div> -->
        <a-button type="primary" :loading="tableLoading" @click="getData()">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-popover placement="bottomRight" trigger="click">
          <template slot="content">
            <p style="font-size: 16px; font-weight: bold">居民注册参与总计说明：</p>
            <span>居民户数：所有小区中的小区户数总和。查询单个小区则查出单个小区的居民户数。</span><br />
            <span>入住户数：所有小区中的入住户数总和。</span><br />
            <span>注册数：查询时间段内新增加的居民数量总和。</span><br />
            <span>参与数：截止时间前参与过活动或垃圾投放的居民数量总和。</span><br />
            <span>活跃参与数：查询时间段内参与过活动或垃圾投放的居民数量总和。</span><br />
            <span>入住占比：入住户数/居民户数*100%。</span><br />
            <span>知晓率：注册数/入住户数*100%。</span><br />
            <span>参与率：参与数/注册数*100%。</span><br />
            <span>活跃参与率：活跃参与数/注册数*100%。</span><br />
            <p style="color: red">* 以上指标都可根据查询条件获取数据并显示。</p>
            <br />
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>居民户数：统计该小区地址中的小区总户数。</span><br />
            <span>入住户数：统计该小区地址中的总入住户数。</span><br />
            <span>注册数：该小区所选时间段新增加的居民数量。</span><br />
            <span>参与数：截止查询时间前该小区参与过活动或垃圾投放的居民数量。</span><br />
            <span>活跃参与数：查询时间段内该小区参与过活动或垃圾投放的居民数量。</span><br />
            <span>知晓率：注册数/入住户数*100%。</span><br />
            <span>参与率：参与数/注册数*100%。</span><br />
            <span>活跃参与率：活跃参与数 / 注册数*100%。</span><br />
            <p style="color: red">* 除居民户数与入住户数外其他指标都可根据查询条件获取数据并显示。</p>
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" @click="exportTable">导出</a-button>
      </a-space>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">居民注册数总计</div>
      </a-space>
      <!-- <a-row type="flex" justify="space-between">
        <a-col v-for="(item, index) in registrationsList" :key="index" class="gutter-row" :span="4"> -->
      <div class="gutter-row">
        <a-card class="gutter-box" hoverable :bordered="true" v-for="(item, index) in registrationsList" :key="index">
          <img class="icon" :src="item.icon" />
          <div class="dib guttet-content">
            <div class="gutter-title">{{ item.name }}</div>
            <div>
              <span class="gutter-left-text">{{ item.num }}</span>
              <span class="gutter-right-text">{{ item.company }}</span>
            </div>
          </div>
        </a-card>
      </div>
      <!-- </a-col>
      </a-row> -->
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">居民注册参与率</div>
      </a-space>
      <div>
        <div id="bar"></div>
      </div>
      <div class="oh w100b mt20">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="小区" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column title="街道" data-index="street" align="center" :ellipsis="true" />
            <a-table-column title="区域" data-index="area_name" align="center" :ellipsis="true" />
            <a-table-column title="居民户数" data-index="total_number" align="center" :ellipsis="true" />
            <a-table-column title="入住户数" data-index="at_number" align="center" :ellipsis="true" />
            <a-table-column title="注册数" data-index="register_num" align="center" :ellipsis="true" />
            <a-table-column title="参与数" data-index="stock_in_all_num" align="center" :ellipsis="true" />
            <a-table-column title="活跃参与数" data-index="stock_in_num" align="center" :ellipsis="true" />

            <a-table-column title="知晓率" data-index="inform_rate" align="center" :ellipsis="true">
              <template slot-scope="text, record"> {{ record.inform_rate }}% </template>
            </a-table-column>
            <a-table-column title="参与率" data-index="stock_in_all_num_rate" align="center" :ellipsis="true">
              <template slot-scope="text, record"> {{ record.stock_in_all_num_rate }}% </template>
            </a-table-column>
            <a-table-column title="活跃参与率" data-index="stock_in_num_rate" align="center" :ellipsis="true">
              <template slot-scope="text, record"> {{ record.stock_in_num_rate }}% </template>
            </a-table-column>
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
  name: "ResidentRegistrationRate",
  data() {
    return {
      // time: "year",
      dataSource: [],
      tableLoading: false,
      plot_id: undefined,
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
      // selectPriceDate: "",
      // offsetDays: 86400000 * 7, //最多选择7天
      // start_time: this.$moment()
      //   .startOf("month")
      //   .format("YYYY-MM-DD"),
      // end_time: this.$moment()
      //   .subtract(0, "days")
      //   .format("YYYY-MM-DD"),
      page: 1,
      total: 0,
      plotList: [],
      registrationsList: [
        { name: "居民户数：", num: 0, company: "户", icon: require("@/assets/icons/registrations_1.png") },
        { name: "入住户数：", num: 0, company: "户", icon: require("@/assets/icons/registrations_2.png") },
        { name: "注册数：", num: 0, company: "户", icon: require("@/assets/icons/registrations_3.png") },
        { name: "参与数：", num: 0, company: "户", icon: require("@/assets/icons/registrations_4.png") },
        { name: "活跃参与数：", num: 0, company: "户", icon: require("@/assets/icons/registrations_5.png") }
      ] // 注册数总计
    }
  },
  created() {
    this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
  },
  mounted() {
    this.getData()
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
    // 按钮组变化
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
      this.selectPriceDate = ""
    },
    // 查询所有数据
    getData() {
      this.getStatisticsData()
      this.getTableList(this.page)
    },
    // 获取统计数据
    getStatisticsData() {
      let start_time = this.$utils.forMatDay(this.start_time)
      let end_time = this.$utils.forMatDay(this.end_time)
      let data = {
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        plot_id: this.plot_id || ""
      }
      this.$api
        .residentshowrealtime(data)
        .then(resp => {
          let res = resp.data
          let informRate = Number((Number(res.title.user_check_in_num) > 0 ? (Number(res.title.register_num) / Number(res.title.user_check_in_num)) * 100 : 0).toFixed(2))
          let barList = [
            {
              id: "inform_rate",
              name: "知晓率",
              nums: informRate
            },
            { id: "precision_rate", name: "分类正确率", nums: res.table.precision_rate },
            { id: "stock_in_all_num_rate", name: "参与率", nums: res.table.stock_in_all_num_rate },
            { id: "check_in_rate", name: "入住占比", nums: res.table.check_in_rate },
            { id: "stock_in_num_rate", name: "活跃参与率", nums: res.table.stock_in_num_rate }
          ]
          let max = Number(barList[0].nums)
          barList.forEach(e => {
            if (Number(e.nums) > max) max = Number(e.nums)
          })

          max = max < 100 ? 100 : max

          this.$G2.initResidentRegistrationGroupColumn(this, barList, "bar", max)
          this.registrationsList.forEach(item => {
            if (item.name === "居民户数：") item.num = res.title.user_count
            if (item.name === "入住户数：") item.num = res.title.user_check_in_num
            if (item.name === "注册数：") item.num = res.title.register_num
            if (item.name === "参与数：") item.num = res.title.stock_in_all_num
            if (item.name === "活跃参与数：") item.num = res.title.stock_in_num
          })
        })
        .catch(() => {
          this.tableLoading = false
        })
    },

    // 获取表格数据
    getTableList(page) {
      let start_time = this.$utils.forMatDay(this.start_time)
      let end_time = this.$utils.forMatDay(this.end_time)
      let data = {
        start_time: this.start_time == "" ? "" : start_time,
        end_time: this.end_time == "" ? "" : end_time,
        plot_id: this.plot_id || "",
        page
      }
      this.tableLoading = true
      this.$api
        .residentshowrealtimelist(data)
        .then(resp => {
          let res = resp.data
          this.dataSource = res.data.map(item => {
            item.key = item.id
            item.inform_rate = Number((item.at_number > 0 ? (item.register_num / item.at_number) * 100 : 0).toFixed(2))
            return item
          })
          this.tableLoading = false
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },

    // 导出
    exportTable() {
      const token = JSON.parse(localStorage.getItem("token"))
      let plot_id = this.plot_id ? this.plot_id : ""
      let start_time = this.start_time ? this.$utils.forMatDay(this.start_time) : ""
      let end_time = this.end_time ? this.$utils.forMatDay(this.end_time) : ""
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/resident/residentshowrealtimeexport?token=${token}&plot_id=${plot_id}&start_time=${start_time}&end_time=${end_time}`)
    }
  }
}
</script>

<style lang="less">
#ResidentRegistrationRate {
  .facility-title {
    margin-left: 0px;
  }
  .ant-card-body {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .gutter-box {
    padding: 5px;
    border-radius: 5px;
    width: 20%;
    margin-right: 10px;
    .gutter-title {
      white-space: nowrap;
      font-size: 20px;
    }
    .gutter-left-text {
      font-size: 30px;
      color: #31c27c;
    }
    .gutter-right-text {
      font-size: 16px;
      margin-left: 10px;
    }
    .ant-card-body {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .gutter-box:last-child {
    margin-right: 0;
  }
  .guttet-content {
    height: 76px;
    margin-left: 10px;
  }
  .icon {
    width: 76px;
    height: 76px;
  }
  .gutter-row {
    display: flex;
    justify-content: space-between;
  }
}
</style>
