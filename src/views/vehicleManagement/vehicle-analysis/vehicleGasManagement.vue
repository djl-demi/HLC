<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>车牌：</span>
            <div class="dib"><a-input v-model="form.vehicleNumber" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>车辆类型：</span>
            <div class="dib"><a-select v-model="form.vehicleTypeId" placeholder="请选择车辆类型" :options="vehicleTypeList" allowClear class="aSelect"></a-select></div>
          </div>
          <div>
            <span>加油站：</span>
            <div class="dib"><a-input v-model="form.oilStation" show-search placeholder="请输入加油站" allowClear /></div>
          </div>
          <div>
            <span>操作人：</span>
            <div class="dib"><a-input v-model="form.operator" show-search placeholder="请输入操作人" allowClear /></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib"><a-range-picker @change="timeChange" allowClear class="w250" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
        <a-space class="ctrl-bar" size="middle">
          <a-button icon="export" @click="trackExport">导出</a-button>
          <a-button type="primary" :loading="tableLoading" @click="routerPush('oilCard')">加油卡</a-button>
          <a-button type="primary" :loading="tableLoading" @click="routerPush('oilType')">油型</a-button>
        </a-space>
      </div>
      <div class="cont">
        <a-space direction="vertical">
          <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
            <a-table-column title="编号" key="refuelingNumber" data-index="refuelingNumber" align="center" :ellipsis="true" class="w200" />
            <a-table-column data-index="vehicleNumber" title="车牌" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="vehicleType" title="车辆类型" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="oilNumber" title="油型" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="totalKm" title="里程数" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="driverName" title="司机" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="driverSignUrl" title="电子签名" align="center" :ellipsis="true" class="w100">
              <template slot-scope="text, record">
                <div class="refuelingEvidenceUrlList">
                  <img :src="$com.showUpload() + record.driverSignUrl" class="driverSignUrl" @click="showPicture(record.driverSignUrl)" />
                </div>
              </template>
            </a-table-column>
            <a-table-column data-index="refuelingVolume" title="加油量(L)" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="oilPrice" title="单价(元)" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="realPay" title="金额(元)" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="oilStation" title="加油站" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="refuelingTime" title="加油时间" align="center" :ellipsis="true" class="w150" />
            <a-table-column data-index="remark" title="备注" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="refuelingEvidenceUrl" title="图片" align="center" :ellipsis="true" class="refuelingEvidenceUrl">
              <template slot-scope="text, record">
                <div class="refuelingEvidenceUrlList">
                  <img :src="$com.showUpload() + item" v-for="(item, key) in record.refuelingEvidenceUrlList" :key="key" @click="showPicture(item)" />
                </div>
              </template>
            </a-table-column>
            <a-table-column data-index="operator" title="操作人" align="center" :ellipsis="true" class="w100" />
            <a-table-column data-index="createTime" title="操作时间" align="center" :ellipsis="true" class="w150" />
          </a-table>
        </a-space>
      </div>
      <div class="flex-center mt30 mb20">
        <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
      </div>
    </a-space>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AnalysisOfLaunchFrequency",
  data() {
    return {
      form: {
        vehicleNumber: "",
        vehicleTypeId: undefined,
        oilStation: "",
        operator: "",
        startTime: undefined,
        endTime: undefined
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
      previewVisible: false
    }
  },
  created() {
    this.getVehicleType()
    this.getTableList()
  },
  methods: {
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
      let data = {
        pageNum: this.pageNum,
        pageSize: 10,
        vehicleNumber: this.form.vehicleNumber,
        vehicleTypeId: this.form.vehicleTypeId == undefined ? "" : this.form.vehicleTypeId,
        oilStation: this.form.oilStation,
        operator: this.form.operator,
        startTime: this.form.startTime == undefined ? "" : this.form.startTime,
        endTime: this.form.endTime == undefined ? "" : this.form.endTime
      }

      this.tableLoading = true
      this.$api.getRefuelingRecord(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.refuelingEvidenceUrlList = item.refuelingEvidenceUrl.split(",")
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //导出
    trackExport() {
      let vehicleNumber = this.form.vehicleNumber || ""
      let vehicleTypeId = this.form.vehicleTypeId || ""
      let oilStation = this.form.oilStation || ""
      let operator = this.form.operator || ""
      let startTime = this.form.startTime == undefined ? "" : this.form.startTime
      let endTime = this.form.endTime == undefined ? "" : this.form.endTime

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}/bid/oil/exportRefuelingRecord?token=${token}&vehicleNumber=${vehicleNumber}&startTime=${startTime}&endTime=${endTime}&vehicleTypeId=${vehicleTypeId}&oilStation=${oilStation}&operator=${operator}`
      )
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
</style>
