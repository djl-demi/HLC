<template>
  <div id="DailyAttendanceStatistics">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" style="margin-bottom:10px;" size="middle">
            <div>
              <span>考勤组：</span>
              <div class="dib"><a-select style="width:213px" v-model="sign_commuting_id" placeholder="请选择考勤组" :options="attendanceList" allowClear /></div>
            </div>
            <div>
              <span>姓名：</span>
              <div class="dib"><a-input v-model="account_name" placeholder="请输入姓名" allowClear /></div>
            </div>
            <div v-if="item.value == 1">
              <span>日期：</span>
              <div class="dib">
                <a-range-picker style="width:213px" v-model="time" @change="timeChange" allowClear />
              </div>
            </div>
            <div v-if="item.value == 2">
              <span>月份：</span>
              <div class="dib">
                <a-month-picker placeholder="请选择月份" v-model="month">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-month-picker>
              </div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button icon="export" @click="trackExport">导出</a-button>
          </a-space>
        </div>
        <a-table
          size="middle"
          bordered
          :columns="btnValue == 1 ? day_column : month_column"
          :rowKey="record => record.key"
          :data-source="data"
          align="center"
          :loading="tableLoading"
          :scroll="btnValue == 1 ? { x: 4000 } : {}"
          :pagination="false"
        />
        <div class="flex-center mt30 mb20">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import moment from "moment"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "DailyAttendanceStatistics",
  components: {},
  data() {
    return {
      btnValue: 1,
      tabList: [
        { name: "日报表", value: 1, num: null },
        { name: "月报表", value: 2, num: null }
      ],
      attendanceList: [], //考勤组
      account_name: "",
      sign_commuting_id: undefined,
      time: [],
      start_time: null,
      end_time: null,
      month: undefined,
      tableLoading: false,
      columns_number: 1,
      day_column: [
        {
          dataIndex: "info",
          key: "info",
          title: "基本信息",
          align: "center",
          // fixed: "left",
          children: [
            {
              dataIndex: "account_name",
              key: "account_name",
              title: "姓名",
              // fixed: "left",
              width: 120,
              align: "center",
              customRender: (value, row, index) => {
                if (value) {
                  const obj = {
                    children: value,
                    attrs: {}
                  }
                  if (index === row.merge_start) {
                    obj.attrs.rowSpan = row.merge_num
                  }
                  if (index > row.merge_start && index < row.merge_num + row.merge_start) {
                    obj.attrs.rowSpan = 0
                  }
                  return obj
                } else {
                  return null
                }
              }
            },
            {
              dataIndex: "sign_commuting_name",
              key: "sign_commuting_name",
              title: "考勤组",
              align: "center",
              customRender: (value, row, index) => {
                if (value) {
                  const obj = {
                    children: value,
                    attrs: {}
                  }
                  if (index === row.merge_start) {
                    obj.attrs.rowSpan = row.merge_num
                  }
                  if (index > row.merge_start && index < row.merge_num + row.merge_start) {
                    obj.attrs.rowSpan = 0
                  }
                  return obj
                } else {
                  return null
                }
              }
            }
          ]
        },
        {
          dataIndex: "class_info",
          key: "class_info",
          title: "班次信息",
          align: "center",
          children: [
            {
              dataIndex: "date",
              key: "date",
              title: "日期",
              align: "center",
              customRender: (value, row, index) => {
                if (value) {
                  const obj = {
                    children: value,
                    attrs: {}
                  }
                  if (index === row.merge_start) {
                    obj.attrs.rowSpan = row.merge_num
                  }
                  if (index > row.merge_start && index < row.merge_num + row.merge_start) {
                    obj.attrs.rowSpan = 0
                  }
                  return obj
                } else {
                  return null
                }
              }
            },
            {
              dataIndex: "work_time",
              key: "work_time",
              title: "班次",
              align: "center"
            },
            {
              dataIndex: "week",
              key: "week",
              title: "星期",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "exception_statistics",
          key: "exception_statistics",
          title: "异常统计",
          align: "center",
          children: [
            {
              dataIndex: "late_num",
              key: "late_num",
              title: "迟到次数",
              align: "center"
            },
            {
              dataIndex: "leave_early_num",
              key: "leave_early_num",
              title: "早退次数",
              align: "center"
            },
            {
              dataIndex: "missing_card_num",
              key: "missing_card_num",
              title: "缺卡次数",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "work_info",
          key: "work_info",
          title: "上班信息",
          align: "center",
          children: [
            {
              dataIndex: "start_time",
              key: "start_time",
              title: "实际上班时间",
              align: "center"
            },
            {
              dataIndex: "start_result_text",
              key: "start_result_text",
              title: "打卡结果",
              align: "center"
            },
            {
              dataIndex: "start_address",
              key: "start_address",
              title: "打卡地址",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "work_off_info",
          key: "work_off_info",
          title: "下班信息",
          align: "center",
          children: [
            {
              dataIndex: "end_time",
              key: "end_time",
              title: "实际下班时间",
              align: "center"
            },
            {
              dataIndex: "end_result_text",
              key: "end_result_text",
              title: "打卡结果",
              align: "center"
            },
            {
              dataIndex: "end_address",
              key: "end_address",
              title: "打卡地址",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "time_statistics",
          key: "time_statistics",
          title: "时长统计",
          align: "center",
          children: [
            {
              dataIndex: "should_work_time",
              key: "should_work_time",
              title: "应出勤（min）",
              align: "center"
            },
            {
              dataIndex: "real_work_time",
              key: "real_work_time",
              title: "实际出勤（min）",
              align: "center"
            },
            {
              dataIndex: "late_time",
              key: "late_time",
              title: "迟到时长（min）",
              align: "center"
            },
            {
              dataIndex: "leave_early_time",
              key: "leave_early_time",
              title: "早退时长（min）",
              align: "center"
            }
          ]
        }
      ],
      month_column: [
        {
          dataIndex: "info",
          key: "info",
          title: "基本信息",
          align: "center",
          // fixed: "left",
          children: [
            {
              dataIndex: "account_name",
              key: "account_name",
              title: "姓名",
              width: 120,
              align: "center"
            },
            {
              dataIndex: "sign_commuting_name",
              key: "sign_commuting_name",
              title: "考勤组",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "exception_statistics",
          key: "exception_statistics",
          title: "异常统计",
          align: "center",
          children: [
            {
              dataIndex: "late_num",
              key: "late_num",
              title: "迟到次数",
              align: "center"
            },
            {
              dataIndex: "late_time",
              key: "late_time",
              title: "迟到时长(min)",
              align: "center"
            },
            {
              dataIndex: "leave_early_num",
              key: "leave_early_num",
              title: "早退次数",
              align: "center"
            },
            {
              dataIndex: "leave_early_time",
              key: "leave_early_time",
              title: "早退时长(min)",
              align: "center"
            },
            {
              dataIndex: "missing_card_num",
              key: "missing_card_num",
              title: "缺卡次数",
              align: "center"
            }
          ]
        },
        {
          dataIndex: "time_statistics",
          key: "time_statistics",
          title: "出勤统计",
          align: "center",
          children: [
            {
              dataIndex: "should_work_day",
              key: "should_work_day",
              title: "应出勤天数",
              align: "center"
            },
            {
              dataIndex: "real_work_day",
              key: "real_work_day",
              title: "实际出勤天数",
              align: "center"
            },
            {
              dataIndex: "should_work_time",
              key: "should_work_time",
              title: "应出勤（min）",
              align: "center"
            },
            {
              dataIndex: "real_work_time",
              key: "real_work_time",
              title: "实际出勤（min）",
              align: "center"
            }
          ]
        }
      ],
      data: [],
      page: 1,
      total: 1
    }
  },
  beforeCreate() {},
  created() {
    this.getTableList()
    this.$com.getallcommuting(this, "attendanceList") // 考勤组
  },
  methods: {
    tabChange(e) {
      this.page = 1
      this.sign_commuting_id = undefined
      this.account_name = ""

      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },
    getTableList(page) {
      if (page) this.page = page
      this.tableLoading = true
      // 日考核
      if (this.btnValue == 1) {
        let data = {
          sign_commuting_id: this.sign_commuting_id || "",
          account_name: this.account_name || "",
          start_time: this.start_time,
          end_time: this.end_time,
          // month: this.month,
          page: this.page
        }
        this.$api.getDayreportlist(data).then(res => {
          this.tableLoading = false
          this.data = res.data.data.map((item, index) => {
            item.key = index
            return item
          })
          console.log(this.data, "this.data")

          this.total = res.data.total
        })
      }
      // 月报表
      if (this.btnValue == 2) {
        let date = this.month ? this.month.format("yyyy-MM") : ""
        let data = {
          sign_commuting_id: this.sign_commuting_id || "",
          account_name: this.account_name || "",
          month: date,
          page: this.page
        }
        this.$api.getMonthreportlist(data).then(res => {
          this.tableLoading = false
          this.data = res.data.data.map((item, index) => {
            item.key = index
            return item
          })
          console.log(this.data, "this.data")

          this.total = res.data.total
        })
      }
    },
    // 导出
    trackExport() {
      const sign_commuting_id = this.sign_commuting_id || ""
      const account_name = this.account_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      if (this.btnValue == 1) {
        const start_time = this.start_time || ""
        const end_time = this.end_time || ""
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/sitesigndayreport/dayreportexport?token=${token}&start_time=${start_time}&end_time=${end_time}&sign_commuting_id=${sign_commuting_id}&account_name=${account_name}`
        )
      }
      if (this.btnValue == 2) {
        const month = this.month || ""
        window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/sitesigndayreport/monthreportexport?token=${token}&month=${month}&sign_commuting_id=${sign_commuting_id}&account_name=${account_name}`)
      }
    }
  }
}
</script>

<style></style>
