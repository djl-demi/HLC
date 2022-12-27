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
            <div class="dib"><a-input v-model="form.vehicleTypeId" class="w200" show-search :filter-option="$com.filterOption" placeholder="请输入类型" allowClear /></div>
          </div>
          <div>
            <span>操作人：</span>
            <div class="dib"><a-input v-model="form.driverName" class="w200" show-search :filter-option="$com.filterOption" placeholder="请输入操作人" allowClear /></div>
          </div>
          <div>
            <span>截止时间：</span>
            <div class="dib"><a-date-picker v-model="form.mileageTime" class="w200" show-search placeholder="请选择截止时间" allowClear @change="dateChange" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
        <a-space class="ctrl-bar" size="middle">
          <a-button icon="export" @click="exportTable()">导出</a-button>
        </a-space>
      </div>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
          <a-table-column title="车牌" data-index="vehicleNumber" align="center" :ellipsis="true" />
          <a-table-column title="车辆类型" data-index="vehicleType" align="center" :ellipsis="true" />
          <a-table-column title="公里数(km)" data-index="totalKm" align="center" :ellipsis="true" />
          <a-table-column title="截止日期" data-index="mileageTime" align="center" :ellipsis="true" />
          <a-table-column title="操作人" data-index="driverName" align="center" :ellipsis="true" />
          <a-table-column title="操作时间" data-index="createTime" align="center" :ellipsis="true" />
          <a-table-column title="图片" data-index="mileageEvidenceUrl" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <div class="mileageEvidenceUrlList">
                <img :src="$com.showUpload() + item" v-for="(item, key) in record.mileageEvidenceUrl.split(',')" :key="key" @click="showPicture(item)" />
              </div>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30 mb20">
          <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
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
        vehicleNumber: undefined,
        vehicleTypeId: undefined,
        driverName: undefined,
        mileageTime: undefined
      },
      dataSource: [],
      plotName: "",
      plotList: [],
      street: "",
      userPhone: "",
      userName: "",
      time: [this.$moment().subtract(1, "days"), this.$moment().subtract(1, "days")],
      // startTime:"",
      // endTime:"",
      startTime: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      endTime: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      tableLoading: false,
      total: 1,
      pageNum: 1,
      picUrl: null,
      previewVisible: false
    }
  },
  created() {
    // this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getTableList()
  },
  methods: {
    //导出
    exportTable() {
      let param = "&"
      Object.keys(this.form).forEach(e => {
        param += this.form[e] ? e + "=" + this.form[e] + "&" : ""
      })
      param = param.substring(0, param.lastIndexOf("&"))
      console.log(param)
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/oil/exportMileageRecord?token=${token}${param}`)
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
    dateChange(date) {
      this.form.mileageTime = date ? this.forMatDate(date._d) : undefined
    },
    forMatDate(date) {
      function formatTen(num) {
        return num > 9 ? num + "" : "0" + num
      }
      const d = new Date(date)
      return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate())
    },
    // 日期筛选
    timeChange(e, v) {
      this.startTime = v[0]
      this.endTime = v[1]
    },
    // 获取物品列表
    getTableList(pageNum) {
      let data = {
        pageNum: this.pageNum
      }

      Object.keys(this.form).forEach(e => {
        this.form[e] ? (data[e] = this.form[e]) : null
      })

      this.tableLoading = true
      this.$api.getMileage(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    }
  }
}
</script>

<style lang="less">
.mileageEvidenceUrlList img {
  width: 50px;
  height: 50px;
}
</style>
