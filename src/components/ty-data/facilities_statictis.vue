<template>
  <!-- 设施统计 -->
  <div id="facilities_statistics" class="facilities_statistics">
    <div class="title">设施统计</div>
    <div class="content">
      <a-row>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ huanbaoroom }}</div>
            </div>
            <div class="box_label">环保屋</div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ plotnums }}</div>
            </div>
            <div class="box_label">
              服务单位
              <a-popover placement="bottomRight" trigger="click">
                <template slot="content">
                  <p style="font-size: 16px;">服务单位数量包含：</p>
                  <span>1、小区</span><br />
                  <span>2、机关单位</span><br />
                  <span>3、学校</span><br />
                  <span>4、医院</span><br />
                </template>
                <a-icon type="question-circle" />
              </a-popover>
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ wisdomtrash }}</div>
            </div>
            <div class="box_label">智能桶</div>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ vehicles }}</div>
            </div>
            <div class="box_label">车辆数</div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ sortcenter }}</div>
            </div>
            <div class="box_label">分拣中心</div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="box">
            <div class="box_item">
              <div class="box_value">{{ dealfactories }}</div>
            </div>
            <div class="box_label">处理厂</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "facilities_statistics",
  data() {
    return {
      huanbaoroom: 7,
      plotnums: 140,
      wisdomtrash: 46,
      vehicles: 5,
      sortcenter: 1,
      dealfactories: 7
    }
  },
  mounted() {
    this.getFacilityStatistics()
  },
  methods: {
    // 获取设施统计
    getFacilityStatistics() {
      let data = {}
      this.$api.getFacilityStatistics(data).then(res => {
        this.huanbaoroom = res.data.garbage_house
        this.plotnums = res.data.plot
        this.wisdomtrash = res.data.intelligent_trash_can
        this.vehicles = res.data.vehicle
        this.sortcenter = res.data.site_info
        this.dealfactories = res.data.merchant
      })
    }
  }
}
</script>

<style scoped lang="less">
#facilities_statistics {
  color: honeydew;
  width: 509px;
  height: 444px;
  background-image: url(../../assets/data/index/facilities_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 58px;
  line-height: 58px;
  color: #00e4ff;
  font-size: 16px;
}

.box {
  text-align: center;
  width: 107px;
  height: 133px;
  margin: 25px auto;
}

.box_item {
  height: 113px;
  width: 107px;
  background-image: url(../../assets/data/index/facilities_tj_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.box_label {
  text-align: center;
  line-height: 30px;
}

.box_value {
  font-size: 28px;
  color: #ffffff;
}

/deep/ .ant-popover-inner-content {
  background-color: #0b1a43 !important;
}
</style>
