<template>
  <div id="TyFacilityChartLegend">
    <a-popover trigger="click" class="popover" placement="topRight">
      <template slot="content">
        <div class="p5 cp" @click="facilityChange(7)"><img src="@/assets/icons/fenjianzhongxin_icon.png" alt="分拣中心" class="facility_state_icon" /> <span class="vam">分拣中心</span></div>
        <div class="p5 cp" @click="facilityChange(6)"><img src="@/assets/icons/chulichang_icon.png" alt="处理厂" class="facility_state_icon" /> <span class="vam">处理厂</span></div>
        <div class="p5 cp" @click="facilityChange(1)"><img src="@/assets/icons/jumingxiaoqu_icon.png" alt="居民小区" class="facility_state_icon" /> <span class="vam">居民小区</span></div>
        <div class="p5 cp" @click="facilityChange(2)"><img src="@/assets/icons/shiyedanwei_icon.png" alt="事业单位" class="facility_state_icon" /> <span class="vam">事业单位</span></div>
        <div class="p5 cp" @click="facilityChange(3)"><img src="@/assets/icons/zhinengtong_icon.png" alt="智能桶" class="facility_state_icon" /> <span class="vam">智能桶</span></div>
        <div class="p5 cp" @click="facilityChange(4)"><img src="@/assets/icons/huanbaowu_icon.png" alt="环保屋" class="facility_state_icon" /> <span class="vam">环保屋</span></div>
        <div class="p5 cp" @click="facilityChange(5)"><img src="@/assets/icons/cheliang_icon.png" alt="车辆" class="facility_state_icon" /> <span class="vam">车辆</span></div>
        <div class="p5 cp" @click="facilityChange(10)"><img src="@/assets/icons/huodong_icon.png" alt="活动" class="facility_state_icon" /> <span class="vam">活动</span></div>
        <div class="p5 cp" @click="facilityChange(9)"><img src="@/assets/icons/renyuan_icon.png" alt="人员" class="facility_state_icon" /> <span class="vam">人员</span></div>
        <div class="p5 cp" @click="facilityChange(8)"><img src="@/assets/icons/cangku_icon.png" alt="仓库" class="facility_state_icon" /> <span class="vam">仓库</span></div>
        <!-- <div class="p5 cp" @click="facilityChange(0)"><img src="@/assets/icons/all.png" alt="全部" class="facility_state_icon all" /> <span class="vam">全部</span></div> -->
      </template>
      <a-button> <img src="@/assets/icons/legend.png" alt="图例" class="legend" /> 图例</a-button>
    </a-popover>
  </div>
</template>

<script>
export default {
  name: "TyFacilityChartLegend",
  data() {
    return {}
  },
  methods: {
    // 选择设施类型
    facilityChange(type) {
      this.$bus.$emit("showFacility", { type: type, keyword: "" })
    }
  }
}
</script>
<style lang="less">
#TyFacilityChartLegend {
  .popover {
    position: absolute;
    right: 40px;
    bottom: 65px;
  }

  .legend {
    height: 25px;
    margin-right: 10px;
  }
}
.facility_state_icon {
  height: 25px;
  width: 23px;
  margin-right: 5px;
}

.all {
  height: 20px;
  width: 20px;
  margin-left: 3px;
}
</style>
