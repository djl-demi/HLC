<template>
  <div class="VehicleDetail">
    <!-- 车辆信息详情 -->
    <a-row>
      <a-col :span="24">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">车辆详情</div>
        </a-space>
        <div class="basicInfo">
          <a-descriptions bordered :column="6">
            <a-descriptions-item label="车辆" :span="2">{{ vehicleNo }} </a-descriptions-item>
            <a-descriptions-item label="载重" :span="2"> {{ loadCapacity }} </a-descriptions-item>
            <a-descriptions-item label="发动机编号" :span="2">
              {{ engineNumber }}
            </a-descriptions-item>
            <a-descriptions-item label="车辆类型" :span="2">
              {{ vehicleType }}
            </a-descriptions-item>
            <a-descriptions-item label="油型" :span="2">
              {{ oilType }}
            </a-descriptions-item>
            <a-descriptions-item label="电源" :span="2"> {{ Voltage }} </a-descriptions-item>
            <a-descriptions-item label="作业类型" :span="2">
              {{ workType }}
            </a-descriptions-item>
            <a-descriptions-item label="上牌时间" :span="2">
              {{ licensingTime }}
            </a-descriptions-item>
            <a-descriptions-item label="司机" :span="2">{{ driverName }}</a-descriptions-item>

            <a-descriptions-item label="品牌" :span="2">
              {{ brand }}
            </a-descriptions-item>
            <a-descriptions-item label="油箱容积" :span="2"> {{ tankVolume }} </a-descriptions-item>
            <a-descriptions-item label="所属" :span="2">{{ belong }}</a-descriptions-item>

            <a-descriptions-item label="油箱长度" :span="2"> {{ tankLength }} </a-descriptions-item>
            <a-descriptions-item label="油箱高度" :span="2"> {{ tankHeight }} </a-descriptions-item>
            <a-descriptions-item label="油箱宽度" :span="2"> {{ tankWidth }} </a-descriptions-item>

            <a-descriptions-item label="车辆外观" :span="2">
              <img v-if="picUrl" :src="picUrl" class="appearance" @click="showPicture()" />
            </a-descriptions-item>
            <a-descriptions-item label="备注" :span="2">{{ remarks }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </a-col>
    </a-row>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "VehicleDetail",
  data() {
    return {
      vehicleNo: "",
      loadCapacity: "",
      tankHeight: "",
      vehicleType: "",
      oilType: "",
      Voltage: "",
      workType: "",
      licensingTime: "",
      picUrl: "",
      brand: "",
      tankVolume: "",
      remarks: "",
      driverName: "",
      tankLength: "",
      belong: "",
      engineNumber: "",
      tankWidth: "",
      previewVisible: false
    }
  },
  props: {
    query: Object
  },
  mounted() {
    // 获取详情
    this.getVehicleDetail(this.$route.query.id)
  },
  methods: {
    // 获取车辆详情
    getVehicleDetail(id) {
      this.$api.vehicleDetail({ id }).then(res => {
        this.vehicleNo = res.data.licensePlateNumber || ""
        this.loadCapacity = res.data.loadCapacity ? res.data.loadCapacity + "吨" : ""
        this.vehicleType = res.data.vehicleName || ""
        this.oilType = res.data.oilType || ""
        this.Voltage = res.data.powerSupply ? res.data.powerSupply + "v" : ""
        this.workType = res.data.jobTypeName || ""
        this.licensingTime = res.data.licensingTime || ""
        this.picUrl = res.data.picUrl ? this.$com.showUpload() + res.data.picUrl : ""
        this.brand = res.data.brand || ""
        this.remarks = res.data.remarks || ""
        this.driverName = res.data.driverName || ""
        this.tankVolume = res.data.tankVolume ? res.data.tankVolume + "L" : ""
        this.tankLength = res.data.tankLength ? res.data.tankLength + "cm" : ""
        this.tankWidth = res.data.tankWidth ? res.data.tankWidth + "cm" : ""
        this.tankHeight = res.data.tankHeight ? res.data.tankHeight + "cm" : ""
        this.belong = res.data.belong || ""
        this.engineNumber = res.data.engineNumber || ""
      })
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    // 预览大图
    showPicture() {
      this.previewVisible = true
    }
  }
}
</script>

<style>
.basicInfo,
.flight_info {
  margin: 0 20px 20px 20px;
  font-size: 16px;
}

.appearance {
  width: 50px;
  height: 50px;
}
</style>
