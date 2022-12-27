<template>
  <div id="AnalysisOfLaunchFrequency">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>车牌号：</span>
            <div class="dib"><a-input v-model="form.vehicle_number" placeholder="请输入车牌号" allowClear /></div>
          </div>
          <div>
            <span>车辆类型：</span>
            <div class="dib"><a-select v-model="form.vehicle_type_id" placeholder="请选择车辆类型" :options="vehicleTypeList" allowClear class="aSelect"></a-select></div>
          </div>
          <div>
            <span>申请人：</span>
            <div class="dib"><a-input v-model="form.applicant_name" show-search placeholder="请输入申请人" allowClear /></div>
          </div>
          <div>
            <span>维修类型：</span>
            <div class="dib"><a-select v-model="form.maintenance_type" :options="repairTypeList" placeholder="请选择维修类型" style="width: 200px" allowClear> </a-select></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib"><a-range-picker @change="timeChange" allowClear class="w250" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar" size="middle">
          <a-button icon="export" @click="trackExport()">导出</a-button>
        </a-space>
      </div>
      <div class="cont">
        <div style="width:1800px">
          <a-table size="middle" bordered :data-source="dataSource" align="center" :loading="tableLoading" :pagination="false">
            <a-table-column title="编号" key="number" data-index="number" align="center" :ellipsis="true" />
            <a-table-column data-index="vehicle_number" title="车牌号" align="center" :ellipsis="true" />
            <a-table-column data-index="vehicle_type_name" title="车辆类型" align="center" :ellipsis="true" />
            <a-table-column data-index="maintenance_amount" title="维修金额（元）" align="center" :ellipsis="true" />
            <a-table-column data-index="maintenance_reason" title="维修原因" align="center" :ellipsis="true" />
            <a-table-column
              data-index="repair_parts"
              title="维修部件
"
              align="center"
              :ellipsis="true"
            />

            <a-table-column data-index="maintenance_shop" title="维修厂" align="center" :ellipsis="true" />
            <a-table-column data-index="maintenance_type_name" title="维修类型" align="center" :ellipsis="true" />
            <a-table-column data-index="applicant_name" title="申请人" align="center" :ellipsis="true" />
            <a-table-column data-index="maintenance_time" title="申请维修时间" align="center" :ellipsis="true" />
            <a-table-column data-index="refuelingEvidenceUrl" title="维修申请图片" align="center" :ellipsis="true" class="refuelingEvidenceUrl">
              <template slot-scope="text, record">
                <div class="refuelingEvidenceUrlList">
                  <img :src="$com.showUpload() + item" v-for="(item, key) in record.maintenance_picture" :key="key" @click="showPicture(item)" />
                </div>
              </template>
            </a-table-column>
            <a-table-column data-index="create_time" title="创建时间" align="center" :ellipsis="true" />
            <a-table-column title="操作" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <div>
                  <a-button type="link" size="small" @click="operation('delete', record)">删除</a-button>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </div>
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
        applicant_name: undefined,
        vehicle_number: undefined,
        vehicle_type_id: undefined,
        maintenance_type: undefined,
        start_time: undefined,
        end_time: undefined
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
        { label: "大修", value: 1 },
        { label: "小修", value: 2 },
        { label: "保养", value: 3 },
        { label: "其他", value: 4 }
      ]
    }
  },
  created() {
    this.getVehicleType()
    this.getTableList()
  },
  methods: {
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    operation(type, record) {
      let _this = this
      if (type === "delete") {
        _this.$confirm({
          content: `确定删除该纪录吗？`,
          onOk() {
            _this.$api.delVehicleMaintenance({ id: record.id }).then(res => {
              _this.getTableList(1)
              _this.$message.success(res.msg)
            })
          }
        })
      }
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    // 获取车辆类型
    getVehicleType() {
      this.$api.getVehicleType().then(res => {
        if (res.code === 200) {
          this.vehicleTypeList = res.data.map(item => {
            console.log(item)
            item.label = item.type_name
            item.value = item.id
            return item
          })
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
      let data = { page }
      Object.keys(this.form).forEach(e => {
        this.form[e] ? (data[e] = this.form[e]) : null
      })

      this.tableLoading = true
      this.$api.getVehicleMaintenance(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //导出
    trackExport() {
      this.$utils.trackExport("/admin/v1/vehicle/maintenance/export", "form", this)
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
