<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>车牌号：</span>
            <div class="dib"><a-input v-model="form.vehicle_no" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>筛选未来</span>
            <div class="dib dayInput"><a-input v-model="form.expire_days" placeholder="请输入时间" allowClear></a-input></div>
            <span>天到期提醒</span>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
      </div>
      <div class="cont">
        <a-space direction="vertical">
          <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
            <a-table-column title="序号" key="key" data-index="key" align="center" :ellipsis="true">
              <span slot-scope="text, records, index">
                {{ (pageNum - 1) * pageSize + Number(index) + 1 }}
              </span>
            </a-table-column>
            <a-table-column data-index="vehicle_no" title="车牌号" align="center" :ellipsis="true" />
            <a-table-column data-index="type" title="保险类别" align="center" :ellipsis="true" />
            <a-table-column data-index="expire_date" title="保险到期日期" align="center" :ellipsis="true" />
            <a-table-column data-index="operator" title="到期提醒" align="center" :ellipsis="true">
              <template slot-scope="text, records">
                <div v-if="records.left_day > 7" class="green">{{ records.left_day }}天</div>
                <div v-else-if="records.left_day < 0" class="grey">过期{{ Math.abs(records.left_day) }}天</div>
                <div v-else class="red">{{ records.left_day }}天</div>
              </template>
            </a-table-column>
            <a-table-column title="操作" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <div>
                  <a-button type="link" size="small" @click="operation('dispose', record)">处理</a-button>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-space>
      </div>
      <div class="flex-center mt30 mb20">
        <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "AnalysisOfLaunchFrequency",
  data() {
    return {
      pageSize: 10,
      form: {
        vehicle_no: undefined,
        expire_days: undefined
      },
      vehicleTypeList: [],
      dataSource: [],
      plotName: "",
      plotList: [],
      street: "",
      userPhone: "",
      userName: "",
      tableLoading: false,
      total: 1,
      pageNum: 1,
      picUrl: null,
      previewVisible: false,

      repairTypeList: [
        { label: "大修", value: 0 },
        { label: "小修", value: 1 },
        { label: "保养", value: 2 },
        { label: "其他", value: 3 }
      ]
    }
  },
  created() {
    this.getVehicleType()
    this.getTableList()
  },
  methods: {
    operation(type, record) {
      let _this = this
      // 表格删除
      if (type === "dispose") {
        this.$confirm({
          title: "处理",
          content: "请确认已续费保险？",
          onOk() {
            _this.insuranceWarnRemove(record.id)
          },
          onCancel() {
            _this.$message.info("已取消")
          }
        })
      }
    },
    insuranceWarnRemove(id) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (!(userInfo && userInfo.name)) return
      this.$api.insuranceWarnRemove({ warn_id: id, operator: userInfo.name }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getTableList(1)
        }
      })
    },
    // 导出
    exportTable() {
      const token = JSON.parse(localStorage.getItem("token"))
      let param = ""
      for (let i in this.form) {
        if (this.form[i]) {
          param += "&" + i + "=" + this.form[i]
        }
      }
      param.length > 0 ? (param = param.slice(1)) : ""
      console.log(param)
      window.open(`${process.env.VUE_APP_BASE_URL}admin/v1/stock/showexport?token=${token}${param}`)
    },
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    // 获取车辆类型
    getVehicleType() {
      this.$api.vehicleTypeTypeDown().then(res => {
        if (res.code === 200) {
          this.vehicleTypeList = res.data.map(item => {
            item.label = item.typeName
            item.value = item.id
            return item
          })

          console.log(this.vehicleTypeList)
        }
      })
    },
    routerPush(type) {
      this.$router.push({ name: type })
    },
    // 日期筛选
    timeChange(e, v) {
      this.form.startTime = v[0]
      this.form.endTime = v[1]
    },
    // 获取车辆列表
    getTableList(pageNum) {
      let page = pageNum ? pageNum : this.pageNum
      let data = {
        page: page
      }
      Object.keys(this.form).forEach(e => {
        this.form[e] ? (data[e] = this.form[e]) : null
      })

      this.tableLoading = true
      this.$api.insuranceWarn(data).then(res => {
        this.dataSource = res.data.data.map((item, key) => {
          item.key = key
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //导出
    trackExport() {
      let plotName = this.plotName || ""
      let userName = this.userName || ""
      let street = this.street || ""
      // let userPhone = this.userPhone || ""
      let startTime = this.startTime || ""
      let endTime = this.endTime || ""

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/analysis/frequencyExport?token=${token}&plotName=${plotName}&userName=${userName}&startTime=${startTime}&endTime=${endTime}&street=${street}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-line {
  margin-top: 20px;
}
.search-line-top {
  display: flex;
  align-items: flex-end;
  margin-top: 0;
}

.refuelingEvidenceUrlList {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.refuelingEvidenceUrl {
  width: 100px;
}

.refuelingEvidenceUrlList img {
  width: 30px;
}

.w250 {
  width: 250px;
}

.cont {
  width: 100%;
  height: 600px;
  overflow-x: auto;
  padding: 0 20px 0 0;
}

.green {
  color: #31c27c;
}
.red {
  color: #f5222d;
}
.grey {
  color: rgba(0, 0, 0, 0.45);
}

.dayInput {
  margin: 0 10px;
}
</style>
