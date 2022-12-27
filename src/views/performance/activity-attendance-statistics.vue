<template>
  <div id="ActivityAttendanceStatistics">
    <div class="oh">
      <a-space class="fl" style="margin-bottom:10px;" size="middle">
        <div>
          <span>姓名：</span>
          <div class="dib"><a-input v-model="account_name" placeholder="请输入姓名" allowClear /></div>
        </div>
        <div>
          <span>月份：</span>
          <div class="dib">
            <a-month-picker placeholder="请选择月份" v-model="month">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-month-picker>
          </div>
        </div>
        <div>
          <span>活动类型：</span>
          <div class="dib"><a-select style="width:213px" v-model="activity_type" placeholder="请选择活动类型" :options="activityList" allowClear /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
      </a-space>
      <a-space class="fr">
        <a-button icon="export" @click="trackExport">导出</a-button>
      </a-space>
    </div>
    <!-- :scroll="{ x: 600 * columns_number }" -->
    <a-table size="middle" bordered :columns="columns" :data-source="dataSource" align="center" :scroll="{ x: 600 * columns_number }" :loading="tableLoading" :pagination="false" />
    <div class="flex-center mt30 mb20">
      <a-pagination v-model="page" show-quick-jumper :default-current="1" :defaultPageSize="pageSize" :total="total" show-less-items @change="getTableList()" />
    </div>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "ActivityAttendanceStatistics",
  components: {},
  data() {
    return {
      activityList: [
        { label: "宣传活动", value: 1, num: null },
        { label: "入门回访活动", value: 2, num: null },
        // { label: "上门回收活动", value: 3, num: null },
        { label: "定时定点活动", value: 4, num: null }
      ],
      account_name: "",
      month: undefined,
      activity_type: undefined,
      dataSource: [],
      columns: [],
      columns_number: 1,
      tableLoading: false,
      total: 1,
      page: 1,
      pageSize: 20
    }
  },
  beforeCreate() {},
  created() {
    this.getTableList()
  },
  methods: {
    getTableList(page) {
      if (page) this.page = page
      let date = this.month ? this.month.format("yyyy-MM") : ""
      let data = {
        account_name: this.account_name || "",
        month: date,
        activity_type: this.activity_type || "",
        page: this.page
      }

      this.tableLoading = true
      this.columns = []
      this.data = []
      this.$api.getActivityreport(data).then(res => {
        this.tableLoading = false
        // 表头
        this.columns = res.data.title.map(item => {
          item.align = "center"
          item.width = 100
          if (item.dataIndex == "name") {
            item.customRender = (value, row, index) => {
              if (value) {
                const obj = {
                  children: value,
                  attrs: {}
                }
                if (index % 4 == 0) {
                  obj.attrs.rowSpan = 4
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              } else {
                return null
              }
            }
          }
          if (item.dataIndex == "time_text") {
            item.customRender = (value, row, index) => {
              if (value) {
                const obj = {
                  children: value,
                  attrs: {}
                }
                if (index % 2 !== 0) {
                  obj.attrs.rowSpan = 0
                } else {
                  obj.attrs.rowSpan = 2
                }
                return obj
              } else {
                return null
              }
            }
          }
          return item
        })
        console.log(this.columns, "this.columns")
        // 表内容
        this.dataSource = res.data.bodys.data.map((item, index) => {
          item.key = index
          item.height = 100
          return item
        })
        this.total = res.data.bodys.total * 4
      })
    },
    trackExport() {
      const account_name = this.account_name || ""
      const month = this.month || ""
      const activity_type = this.activity_type || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/sitesigndayreport/activityexport?token=${token}&month=${month}&activity_type=${activity_type}&account_name=${account_name}`)
    }
  }
}
</script>

<style></style>
