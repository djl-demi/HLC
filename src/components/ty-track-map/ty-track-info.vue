<template>
  <div id="TyTrackInfo">
    <!-- 车辆 轨迹信息 -->
    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">车辆信息</div>
      </a-space>
      <a-descriptions size="small">
        <a-descriptions-item label="车牌号" :span="3">{{ infoData.license_plate_number }}</a-descriptions-item>
        <a-descriptions-item label="作业类型" :span="3">{{ infoData.job_type_name }}</a-descriptions-item>
        <a-descriptions-item label="车辆类型" :span="3">{{ infoData.vehicle_name }}</a-descriptions-item>
        <a-descriptions-item label="行驶里程" :span="3">{{ infoData.distance }}</a-descriptions-item>
        <a-descriptions-item label="状态" :span="3">{{ infoData.state_text }}</a-descriptions-item>
        <a-descriptions-item label="总里程" :span="3">{{ infoData.total_distance }}</a-descriptions-item>
        <a-descriptions-item label="速度" :span="3">{{ infoData.speed }}</a-descriptions-item>
        <a-descriptions-item label="方向" :span="3">{{ infoData.direction }}</a-descriptions-item>
        <a-descriptions-item label="定位时间" :span="3">{{ infoData.type_time }}</a-descriptions-item>
        <a-descriptions-item label="位置" :span="3">{{ infoData.address }}</a-descriptions-item>
        <a-descriptions-item label="载重量" :span="3">{{ infoData.load_capacity }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: "TyTrackInfo",
  props: {
    infoData: Object,
    screenHeight: Number
  },
  inject: ["pageType"],
  data() {
    return {
      collectionsNum: "",
      expandIconPosition: "right",
      isScroll: true,
      collectionTrack: true,
      collectionJob: true,
      collectionBase: true,
      collectionClean: true,
      pieData: [],
      piePlot: undefined, // 饼图实例
      pieBox: undefined // 饼图实例
    }
  },

  mounted() {
    // 设置页面可用高度
    this.getHeight(this.screenHeight)
  },
  methods: {
    // 设置页面可用高度
    getHeight(value) {
      let TyTrackInfo = document.getElementById("TyTrackInfo")
      TyTrackInfo.style.maxHeight = Number(value) - 295 + "px"
    }
  },
  watch: {
    screenHeight: {
      handler(val) {
        this.getHeight(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
#TyTrackInfo {
  width: 350px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 20px;
  overflow: auto;
  .facility-title {
    margin: 10px 20px 10px 0;
  }
  .ant-descriptions-item-content {
    vertical-align: top;
  }
  .ant-collapse-item {
    background-color: transparent !important;
  }
  .ant-collapse-borderless {
    background-color: transparent !important;
  }
}

#TyTrackInfo::-webkit-scrollbar {
  display: none;
}
</style>
