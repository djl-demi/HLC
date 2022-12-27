<template>
  <!-- 大屏图例 -->
  <div class="legend">
    <div class="legend_box" @click="selectType(7)"><img class="legend_icon" src="../../assets/data/index/sort_icon.png" /> 分拣中心</div>
    <div class="legend_box" @click="selectType(6)"><img class="legend_icon" src="../../assets/data/index/dealfact_marker_icon.png" /> 处理厂</div>
    <div class="legend_box" @click="selectType(1)"><img class="legend_icon" src="../../assets/data/index/plot_icon.png" /> 居民小区</div>
    <div class="legend_box" @click="selectType(2)"><img class="legend_icon" src="../../assets/data/index/gov_icon.png" /> 事业单位</div>
    <div class="legend_box" @click="selectType(3)"><img class="legend_icon" src="../../assets/data/index/wisdom_trash_icon.png" /> 智能桶</div>
    <div class="legend_box" @click="selectType(4)"><img class="legend_icon" src="../../assets/data/index/recycleroom_icon.png" /> 环保屋</div>
    <div class="legend_box" @click="selectType(5)"><img class="legend_icon" src="../../assets/data/index/vehicle_icon.png" /> 车辆</div>
    <div class="legend_box" @click="selectType(0)"><img class="legend_icon" src="../../assets/data/index/all_icon.png" /> 全部</div>
  </div>
</template>

<script>
export default {
  name: "legend",
  data() {
    return {}
  },
  props: {
    facilityType: Number
  },
  mounted() {},
  methods: {
    // 选择设置类型
    selectType(type) {
      this.$emit("getFacilityType", type)
    }
  }
}
</script>

<style scoped>
.legend {
  background-image: url(../../assets/data/index/legend_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  color: #ffffff;
  height: 238px;
}

.legend_box {
  font-size: 12px;
  height: 28px;
  line-height: 28px;
  width: 110px;
  padding: 5px 10px;
}

.legend_icon {
  padding: 0 2px;
  width: 21px;
  height: 20px;
}
</style>
