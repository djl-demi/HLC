<template>
  <div id="vehicleInsuranceManagement">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>车牌号：</span>
            <div class="dib"><a-input v-model="form.vehicle_no" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>保单号：</span>
            <div class="dib"><a-input v-model="form.no" placeholder="请输入车牌" allowClear /></div>
          </div>
          <div>
            <span>到期日期：</span>
            <div class="dib"><a-range-picker v-model="createTime" @change="(e, v) => timeChange(e, v, 'create')" allowClear class="w250" /></div>
          </div>
          <div>
            <span>创建时间：</span>
            <div class="dib"><a-range-picker v-model="expireTime" @change="(e, v) => timeChange(e, v, 'expire')" allowClear class="w250" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
          <a-button type="primary" icon="plus" :loading="tableLoading" @click="operation('add')" ghost>新增</a-button>
        </a-space>
      </div>
      <div>
        <div class="cont">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :rowKey="
              (record, index) => {
                return index
              }
            "
            bordered
            :loading="tableLoading"
            :pagination="false"
          >
            <template slot="type" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ typeListName[typeList.indexOf(item.type)] }}
              </div>
            </template>
            <template slot="insurance_no" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ item.no }}
              </div>
            </template>
            <template slot="company" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ item.company }}
              </div>
            </template>
            <template slot="date" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ $moment(item.date).format("YYYY-MM-DD") }}
              </div>
            </template>
            <template slot="amount" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ item.amount }}
              </div>
            </template>
            <template slot="expire" slot-scope="text, records">
              <div v-for="(item, key) in records.detail" :key="key" class="inRow">
                {{ $moment(item.expire).format("YYYY-MM-DD") }}
              </div>
            </template>

            <template slot="no" slot-scope="text, records, index">
              {{ (pageNum - 1) * pageSize + Number(index) + 1 }}
            </template>
            <template slot="operation" slot-scope="text, record">
              <div class="btn-list">
                <a-button type="primary" size="small" @click="operation('detail', record)" ghost>查看</a-button>
                <a-button type="primary" size="small" @click="operation('edit', record)" ghost>编辑</a-button>
                <a-button size="small" @click="operation('delete', record)">删除</a-button>
              </div>
            </template>
          </a-table>
        </div>
        <div class="flex-center mt30 mb20">
          <a-pagination v-model="pageNum" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </div>
    </a-space>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
const columns = [
  { title: "车牌号", dataIndex: "vehicle_no", key: "vehicle_no", align: "center" },
  {
    title: "保险类型",
    key: "type",
    align: "center",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "保单号",
    key: "insurance_no",
    scopedSlots: { customRender: "insurance_no" }
  },
  {
    title: "保险公司",
    scopedSlots: { customRender: "company" },
    key: "company"
  },
  {
    title: "投保日期",
    scopedSlots: { customRender: "date" },
    key: "date"
  },
  {
    title: "投保金额",
    scopedSlots: { customRender: "amount" },
    key: "amount"
  },
  {
    title: "到期日期",
    scopedSlots: { customRender: "expire" },
    key: "expire"
  },
  { title: "创建人", dataIndex: "creater_name", key: "creater_name" },
  { title: "创建时间", dataIndex: "create_time", key: "create_time" },
  { title: "操作", key: "operation", scopedSlots: { customRender: "operation" }, width: 80 }
]
export default {
  name: "AnalysisOfLaunchFrequency",
  data() {
    return {
      form: {
        vehicle_no: undefined,
        no: undefined,
        create_start_date: undefined,
        create_end_date: undefined,
        expire_start_date: undefined,
        expire_end_date: undefined
      },
      typeList: ["fi_", "ci_", "v_tax_"],
      typeListName: ["商业险", "交强险", "车船税"],
      createTime: [],
      expireTime: [],
      vehicleTypeList: [],
      dataSource: [],
      plotName: "",
      plotList: [],
      street: "",
      userPhone: "",
      userName: "",
      tableLoading: false,
      total: 1,
      pageSize: 10,
      pageNum: 1,
      picUrl: null,
      previewVisible: false,
      columns: columns,
      delLoading: false
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    upLoadInsurance() {},
    handleOk() {},
    operation(type, record) {
      let _this = this
      if (type === "delete") {
        this.$confirm({
          title: "请确认",
          content: "确定删除选中数据吗?",
          onOk() {
            _this.delLoading = true
            _this.$api
              .delVehicleInsurance({ insurance_id: record.id })
              .then(res => {
                _this.delLoading = false
                _this.getTableList()
                _this.$message.success(res.msg)
                _this.selectedRowKeys = []
              })
              .catch(err => {
                _this.delLoading = false
              })
          },
          onCancel() {
            _this.$message.info("已取消")
          }
        })
      } else {
        let path = {
          name: "vehicleInsuranceEdit",
          query: { type }
        }
        if (/edit|detail/.test(type)) {
          path.query.id = record.id
        }
        this.$router.push(path)
      }
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
    timeChange(e, v, type) {
      this.form[type + "_start_date"] = v[0]
      this.form[type + "_end_date"] = v[1]
    },
    // 获取车辆列表
    getTableList(pageNum) {
      let page = pageNum ? pageNum : this.pageNum
      let data = {
        page
      }
      Object.keys(this.form).forEach(e => {
        this.form[e] ? (data[e] = this.form[e]) : null
      })

      this.tableLoading = true
      this.$api.getVehicleInsurance(data).then(res => {
        this.dataSource = res.data.data.map((item, key) => {
          item.detail = []

          Object.keys(item).forEach(itemName => {
            if (/(ci_|fi_|v_tax_)[a-z]+/.test(itemName)) {
              let itemNameForType = itemName.replace(/(ci_|fi_|v_tax_)[a-z]+/, "$1")
              let index = this.typeList.indexOf(itemNameForType)
              if (index > -1) {
                let col_name = itemName.replace(this.typeList[index], "")
                if (!item.detail[index]) {
                  item.detail[index] = { type: this.typeList[index] }
                }
                item.detail[index][col_name] = item[itemName]
              }
            }
          })
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

<style lang="less">
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
.upLoadInsuranceList {
  display: flex;
  .upLoadInsuranceBtn {
    margin-right: 10px;
  }
}

.upLoadInsuranceTbl {
  width: 100%;
}

.btn-list .ant-btn {
  margin: 5px;
}
</style>
<style lang="less">
#vehicleInsuranceManagement .ant-table-thead > tr > th {
  text-align: center;
}

.ant-table-tbody > tr > td:nth-child(n + 2):nth-child(-n + 7) .inRow {
  height: 54px;
  padding: 16px 16px;
}
.ant-table-tbody > tr > td:nth-child(n + 2):nth-child(-n + 7) .inRow:not(:last-child) {
  border-bottom: 1px solid #e8e8e8;
}

.ant-table-tbody > tr > td:nth-child(n + 2):nth-child(-n + 7) {
  padding: 0;
}
</style>
