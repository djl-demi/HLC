<template>
  <div>
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-row>
          <a-col class="flex-auto">
            <a-space class="flex-line" size="middle">
              <div>
                <span>车牌号：</span>
                <div class="dib"><a-input v-model="filter.licensePlateNumber" placeholder="请输入车牌号" allowClear /></div>
              </div>
              <div>
                <span>所属：</span>
                <div class="dib"><a-input v-model="filter.belong" placeholder="请输入所属" allowClear /></div>
              </div>
              <div>
                <span>车辆类型：</span>
                <div class="dib"><a-select v-model="filter.vehicleName" :options="vehicle_type_options" placeholder="请选择车辆类型" class="w200" allowClear /></div>
              </div>
              <div>
                <span>作业类型：</span>
                <div class="dib">
                  <a-select v-model="filter.jobTypeName" :options="job_type_options" placeholder="请选择作业类型" class="w200" allowClear />
                </div>
              </div>
              <div>
                <span>是否正常：</span>
                <div class="dib"><a-select v-model="filter.state" :options="normalList" class="w200" placeholder="请选择是否正常" allowClear /></div>
              </div>
              <div>
                <span>司机：</span>
                <div class="dib"><a-select v-model="filter.driverName" :options="driversList" class="w200" placeholder="请选择是否正常" allowClear /></div>
              </div>
              <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
            </a-space>
            <a-space class="ctrl-bar">
              <a-button type="primary" icon="car" @click="operation('type')">车辆类型</a-button>
              <a-button type="primary" icon="unordered-list" @click="operation('worktype')">作业类型</a-button>
              <a-button type="primary" icon="plus" @click="operation('add')">新增</a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-space class="w100b">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
            <a-button type="primary" :disabled="!hasSelected" :loading="delLoading" @click="distribute">分配司机</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <!-- <a-table-column title="车牌号" data-index="license_plate_number" align="center" :ellipsis="true" /> -->
            <a-table-column key="license_plate_number" title="车牌号" align="center" :width="150" fixed="left">
              <template slot-scope="text, record">
                <span>
                  <a-button type="link" @click="operation('viewDetail', record.id)">{{ record.licensePlateNumber }}</a-button>
                </span>
              </template>
            </a-table-column>
            <a-table-column title="车辆类型" data-index="vehicleName" align="center" :ellipsis="true" />
            <a-table-column title="作业类型" data-index="jobTypeName" align="center" :ellipsis="true" />
            <a-table-column title="载重(t)" data-index="loadCapacity" align="center" :ellipsis="true" />
            <a-table-column title="品牌" data-index="brand" align="center" :ellipsis="true" />
            <a-table-column title="司机" data-index="driverName" align="center" :ellipsis="true" />
            <a-table-column title="车辆外观" data-index="pic_url" align="center" :ellipsis="true">
              <template slot-scope="pic_url">
                <img v-show="pic_url" class="img" @click="showPicture(pic_url)" :src="pic_url" />
              </template>
            </a-table-column>
            <a-table-column title="状态" data-index="state" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.state ? '确定恢复为启用吗？' : '确定要禁用吗？'"
                  okText="确定"
                  cancelText="取消"
                  :maskClosable="false"
                  @confirm="() => ChangeState(record)"
                  @cancel="record.state = !record.state"
                >
                  <a-switch v-model="record.state" checked-children="启用" un-checked-children="禁用" />
                </a-popconfirm>
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="operation('edit', record)">编辑</a-button>
                <a-button type="link" size="small" @click="showRoute(record)">查看轨迹</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="picture" alt="example" class="picture w100b" />
    </a-modal>

    <a-modal :title="operationTitle" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="750">
      <a-form-model ref="ruleForm" :model="carform" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="vehicleName" label="车辆类型" prop="vehicleName">
              <a-select v-model="carform.vehicleName" :options="vehicle_type_options" class="w100b" placeholder="请选择车辆类型" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="brand" label="品牌" prop="brand" has-feedback>
              <a-input v-model="carform.brand" placeholder="请输入品牌" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="engineNumber" label="发动机编号" prop="engineNumber" has-feedback>
              <a-input v-model="carform.engineNumber" placeholder="请输入发动机编号" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="oilType" label="油型" prop="oilType" has-feedback>
              <a-select mode="multiple" v-model="carform.oilType" :default-value="[]" style="width: 100%" placeholder="请选择油型">
                <a-select-option v-for="item in oil_type_options" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item ref="tankVolume" label="油箱容积" prop="tankVolume" has-feedback>
              <a-input suffix="L" v-model="carform.tankVolume" placeholder="请输入油箱容积" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="tankWidth" label="油箱宽度" prop="tankWidth" has-feedback>
              <a-input suffix="cm" v-model="carform.tankWidth" placeholder="请输入油箱宽度" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="powerSupply" label="电源" prop="powerSupply" has-feedback>
              <a-input suffix="V" v-model="carform.powerSupply" placeholder="请输入电源电压" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="remarks" label="备注" prop="remarks" has-feedback>
              <a-input v-model="carform.remarks" placeholder="请输入备注" class="w100b" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="jobTypeName" label="作业类型" prop="jobTypeName" has-feedback>
              <a-select v-model="carform.jobTypeName" :options="job_type_options" class="w100b" placeholder="请选择作业类型" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="licensePlateNumber" label="车牌号" prop="licensePlateNumber" has-feedback>
              <a-input v-model="carform.licensePlateNumber" placeholder="请输入车牌号" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="licensingTime" label="上牌时间" prop="licensingTime">
              <a-date-picker v-model="carform.licensingTime" placeholder="请选择上牌时间" class="w100b" allowClear />
            </a-form-model-item>

            <a-form-model-item ref="load_capacity" label="载重量" prop="load_capacity" has-feedback>
              <a-input v-model="carform.loadCapacity" placeholder="请输入载重量" class="w100b" suffix="吨" />
            </a-form-model-item>
            <a-form-model-item ref="tankLength" label="油箱长度" prop="tankLength" has-feedback>
              <a-input v-model="carform.tankLength" placeholder="请输入油箱长度" class="w100b" suffix="cm" />
            </a-form-model-item>
            <a-form-model-item ref="tankHeight" label="油箱高度" prop="tankHeight" has-feedback>
              <a-input v-model="carform.tankHeight" placeholder="请输入油箱高度" class="w100b" suffix="cm" />
            </a-form-model-item>
            <a-form-model-item ref="belong" label="所属" prop="belong" has-feedback>
              <a-input v-model="carform.belong" placeholder="请输入所属" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="pic_url" label="车辆外观" prop="pic_url">
              <a-upload
                name="pic"
                :file-list="fileList"
                list-type="picture-card"
                class="avatar-uploader"
                :action="$com.uploadUrl()"
                :before-upload="$utils.beforeUpload"
                @change="imgChange"
                @preview="handlePreview"
              >
                <div v-if="fileList.length < 1">
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 102px; height: 102px" />
                  <div v-else>
                    <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel">
                <img alt="example" class="w100b" :src="picture" />
              </a-modal>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal :title="driverModalTitle" :visible="visibleDriverModal" :confirm-loading="confirmLoading" @ok="distributeDriver" @cancel="distributeCancel">
      <p>
        <a-space direction="vertical" class="w100b">
          <a-space class="fr">
            <a-input v-model="driver_name" placeholder="请输入司机" @change="listDriver(1)" allowClear />
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="driverSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="姓名" data-index="driverName" align="center" :ellipsis="true" />
            <a-table-column title="联系方式" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column title="区域" data-index="areaName" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page_driver" show-quick-jumper :default-current="1" :total="total_driver" @change="listDriver()" />
          </div>
        </a-space>
      </p>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment"
import mixins from "@/mixins/index.js"
export default {
  name: "VehicleManagement",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        licensePlateNumber: null,
        vehicleName: undefined,
        jobTypeName: undefined,
        belong: null,
        state: undefined,
        driverName: undefined
      },
      confirmLoading: false,
      driverModalTitle: "分配司机",
      visibleDriverModal: false,
      fileList: [],
      operationTitle: "新增", // 新增/编辑对话框标题
      operationVisible: false, // 新增/编辑对话框显示隐藏
      operationLoading: false, // 新增/编辑对话框加载状态
      picture: "",
      previewVisible: false,
      imageUrl: "", //  二进制图片流
      imgLoading: false, // 图片加载状态
      vehicle_type_options: [],
      job_type_options: [],
      oil_type_options: [],
      driversList: [],
      driver_name: "",
      carform: {
        jobTypeName: undefined,
        vehicleName: undefined,
        brand: undefined,
        licensePlateNumber: "",
        belong: "",
        licensingTime: "",
        engineNumber: "",
        loadCapacity: "",
        oilType: [],
        remarks: "",
        tankVolume: "",
        tankLength: "",
        tankWidth: "",
        tankHeight: "",
        powerSupply: "",
        pic_url: ""
      },
      normalList: [
        { label: "正常", value: 1 },
        { label: "停止", value: 2 }
      ],
      driverSource: [],
      page_driver: 1,
      total_driver: 0,
      rules: {
        licensePlateNumber: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        brand: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        oilType: [{ required: true, message: "请选择油型", trigger: "blur" }],
        jobTypeName: [{ required: true, message: "请选择作业类型", trigger: "blur" }],
        vehicleName: [{ required: true, message: "请选择车辆类型", trigger: "blur" }]
      }
    }
  },
  mounted() {
    this.getDriverList()
    this.vehicleTypeDropList()
    this.vehicleWorkTypeDropList()
    this.getOilTypeDropList()
    this.getTableList(1)
  },

  methods: {
    // 获取司机列表
    getDriverList() {
      this.$api.getDriverList().then(res => {
        res.data.map(item => {
          this.driversList.push({
            value: item.id,
            label: item.driverName
          })
        })
      })
    },
    // 车辆类型下拉列表
    vehicleTypeDropList() {
      this.$api.vehicleTypeDropList().then(res => {
        res.data.map(item => {
          this.vehicle_type_options.push({
            value: item.id,
            label: item.typeName
          })
        })
      })
    },
    // 车辆作业类型下拉列表
    vehicleWorkTypeDropList() {
      this.$api.vehicleWorkTypeDropList().then(res => {
        res.data.map(item => {
          this.job_type_options.push({
            value: item.id,
            label: item.typeName
          })
        })
      })
    },
    // 获取油型下拉列表
    getOilTypeDropList() {
      this.$api.getOilTypeList({ pageNum: 1, pageSize: 999 }).then(res => {
        res.data.data.map(item => {
          this.oil_type_options.push({
            value: item.id,
            label: item.number
          })
        })
      })
    },
    // 分配司机
    distributeDriver() {
      let vehicles = [],
        drivers = []
      this.selectedRowKeys.map(item => {
        let num_arr = item.split("_")
        if (num_arr[0] === "V") {
          vehicles.push(num_arr[1])
        } else if (num_arr[0] === "D") {
          drivers.push(num_arr[1])
        }
      })

      this.$api.assignDriver({ driverIds: drivers, vehicleIds: vehicles }).then(res => {
        this.getTableList()
        this.$message.success(res.msg)
        this.selectedRowKeys = []
        this.visibleDriverModal = false
      })
    },
    // 取消分配
    distributeCancel() {
      this.visibleDriverModal = false
    },
    // 检索司机
    // searchDriver() {
    //   let data = { nameOrPhone: this.driver_name || "" }
    //   this.$api.driverList(data).then(res => {
    //     this.driverSource = res.data.data.map(item => {
    //       item.key = "D_" + item.id
    //       return item
    //     })
    //     this.total_driver = res.data.total
    //   })
    // },
    // 搜索表格内容
    getTableList(page) {
      if (page) this.page = page
      let data = {
        licensePlateNumber: this.filter.licensePlateNumber || "",
        vehicleTypeId: this.filter.vehicleName == undefined ? "" : this.filter.vehicleName,
        jobTypeId: this.filter.jobTypeName == undefined ? "" : this.filter.jobTypeName,
        belong: this.filter.belong || "",
        state: this.filter.state == undefined ? "" : this.filter.state,
        driverId: this.filter.driverName == undefined ? "" : this.filter.driverName,
        pageNum: this.page,
        pageSize: 10
      }

      this.tableLoading = true
      this.$api.getVehicleList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = "V_" + item.id
          item.state = item.state === 1 ? true : false
          item.pic_url = item.picUrl ? this.$com.showUpload() + item.picUrl : ""
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 切换开关
    ChangeState(record) {
      let id = record.key.split("_")[1]
      this.$api
        .upVehicleState({ id: id, state: record.state ? 1 : 2 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.state = !record.state
        })
    },
    // 表格删除
    deleteData() {
      let ids = []
      this.selectedRowKeys.map(item => {
        ids.push(Number(item.split("_")[1]))
      })
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中的车辆吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delBatchVehicle({ vehicleIds: ids })
            .then(res => {
              that.delLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 查看图片
    showPicture(picture_url = "") {
      this.picture = picture_url
      this.previewVisible = true
    },

    // 关闭图片
    imgCancel() {
      this.previewVisible = false
    },

    // 图片change
    imgChange({ fileList }) {
      this.fileList = fileList
      if (fileList.length > 0) {
        // 上传中
        if (fileList[0].status === "uploading") {
          this.imgLoading = true
          return
        }
        // 上传成功
        if (fileList[0].status === "done") {
          this.imgLoading = false
          this.carform.pic_url = fileList[0].response.data.pic_url
          console.log(this.fileList, "this.fileList")
        }
      }
    },

    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.picture = file.url || this.$com.showUpload() + file.response.data.pic_url
      this.previewVisible = true
    },

    // 新增/编辑
    operation(type, item) {
      this.operationTitle = "新增"
      if (type === "edit") {
        // this.clearOperation()
        this.operationTitle = "编辑"
        this.$api.vehicleDetail({ id: item.id }).then(res => {
          let oilTypeArr = res.data.oilTypeId.split(",")
          let oilType = []
          oilTypeArr.map(item => {
            oilType.push(Number(item))
          })
          this.carform.oilType = oilType
          this.carform.licensePlateNumber = res.data.licensePlateNumber
          this.carform.jobTypeName = Number(res.data.jobTypeId)
          this.carform.vehicleName = Number(res.data.vehicleTypeId)
          this.carform.loadCapacity = res.data.loadCapacity
          this.carform.belong = res.data.belong
          this.carform.engineNumber = res.data.engineNumber
          this.carform.tankVolume = res.data.tankVolume
          this.carform.tankLength = res.data.tankLength
          this.carform.tankWidth = res.data.tankWidth
          this.carform.tankHeight = res.data.tankHeight
          this.carform.remarks = res.data.remarks
          this.carform.powerSupply = res.data.powerSupply
          this.carform.licensingTime = res.data.licensingTime ? moment(res.data.licensingTime, "YYYY-MM-DD") : ""
          this.carform.brand = res.data.brand
          this.carform.id = res.data.id
          if (res.data.picUrl) {
            this.carform.pic_url = res.data.picUrl
            this.picture = res.data.picUrl
            this.fileList = [
              {
                uid: "1",
                name: res.data.picUrl,
                status: "done",
                url: this.$com.showUpload() + res.data.picUrl
              }
            ]
          }

          console.log(this.carform, "form")
        })
      } else if (type === "type") {
        // 车辆类型
        this.$router.push({ name: "VehicleType" })
      } else if (type === "worktype") {
        // 作业类型
        this.$router.push({ name: "VehicleWorkType" })
      } else if (type === "viewDetail") {
        // 车辆详情
        this.$router.push({ name: "VehicleDetail", query: { id: item } })
      }
      this.type = type
      this.operationVisible = true
      this.$validator.resetFields(this)
    },
    // 分配
    distribute() {
      this.listDriver(1)
      this.visibleDriverModal = true
    },
    // 司机分配列表
    listDriver(page) {
      if (page) this.page_driver = page
      let data = { nameOrPhone: this.driver_name || "", pageNum: this.page_driver, pageSize: 10 }
      this.$api.listDriver(data).then(res => {
        this.driverSource = res.data.data.map(item => {
          item.key = "D_" + item.id
          return item
        })
        this.total_driver = res.data.total
      })
    },
    // 新增/编辑确定
    operationOk() {
      let oil = this.carform.oilType
      console.log("this.carform.licensingTime", this.carform.licensingTime)
      let data = {
        jobTypeId: this.carform.jobTypeName || "",
        vehicleTypeId: this.carform.vehicleName || "",
        licensePlateNumber: this.carform.licensePlateNumber || "",
        loadCapacity: this.carform.loadCapacity || "",
        belong: this.carform.belong || "",
        picUrl: this.carform.pic_url || "",
        brand: this.carform.brand || "",
        engineNumber: this.carform.engineNumber || "",
        oilType: oil.length > 0 ? oil.join(",") : "",
        licensingTime: this.carform.licensingTime ? this.carform.licensingTime.format("YYYY-MM-DD") : "",
        tankVolume: this.carform.tankVolume || "",
        tankLength: this.carform.tankLength || "",
        tankWidth: this.carform.tankWidth || "",
        tankHeight: this.carform.tankHeight || "",
        powerSupply: this.carform.powerSupply || "",
        remarks: this.carform.remarks || ""
      }
      if (this.type == "edit") {
        data.id = this.carform.id
      }

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ;(this.type === "add" ? this.$api.addVehicle(data) : this.$api.upVehicleState(data)).then(res => {
            this.getTableList()
            this.$message.success(res.msg)
            this.operationVisible = false
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },

    // 清除新增/编辑数据缓存
    clearOperation() {
      this.carform = {
        jobTypeName: undefined,
        vehicleName: undefined,
        brand: undefined,
        licensePlateNumber: "",
        belong: "",
        licensingTime: "",
        engineNumber: "",
        loadCapacity: "",
        oilType: [],
        remarks: "",
        tankVolume: "",
        tankLength: "",
        tankWidth: "",
        tankHeight: "",
        powerSupply: "",
        pic_url: ""
      }
      this.picture = ""
      this.imgLoading = false
      this.imageUrl = ""
      this.fileList.length = 0
    },

    // 查看轨迹
    showRoute(item) {
      this.$router.push({ name: "VehicleManagementRoute", query: { id: item.id } })
    }
  }
}
</script>

<style scoped>
.img {
  width: 30px;
  height: 30px;
}
</style>
