<template>
  <!-- 可回收物出库去向 -->
  <div id="chuku_trace" class="chuku_pie">
    <div class="title">EMS任务信息</div>
    <div class="chuku_trace_content">
      <dv-scroll-board :config="config" style="height: 285px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "chuku_pie",
  data() {
    return {
      config: {},
      dataSource: [],
      data: [
        { id: 1, stockTime: "2022-12-30 ", userName: "设备1", houseNumber: "1606", netWeight: "准备" },
        { id: 2, stockTime: "2022-12-30 ", userName: "设备2", houseNumber: "201", netWeight: "执行" },
        { id: 3, stockTime: "2022-12-30 ", userName: "设备3", houseNumber: "907", netWeight: "完成" },
        { id: 4, stockTime: "2022-12-30 ", userName: "设备4", houseNumber: "1002", netWeight: "准备" },
        { id: 5, stockTime: "2022-12-30 ", userName: "设备5", houseNumber: "201", netWeight: "准备" },
        { id: 6, stockTime: "2022-12-30 ", userName: "设备6", houseNumber: "303", netWeight: "准备" },
        { id: 7, stockTime: "2022-12-30 ", userName: "设备7", houseNumber: "303", netWeight: "执行" },
        { id: 8, stockTime: "2022-12-30 ", userName: "设备8", houseNumber: "202", netWeight: "执行" },
        { id: 9, stockTime: "2022-12-30 ", userName: "设备9", houseNumber: "101", netWeight: "执行" },
        { id: 10, stockTime: "2022-12-30 ", userName: "设备10", houseNumber: "203", netWeight: "完成" },
        { id: 11, stockTime: "2022-12-30 ", userName: "设备11", houseNumber: "203", netWeight: "完成" },
        { id: 12, stockTime: "2022-12-30 ", userName: "设备12", houseNumber: "301", netWeight: "完成" }
      ]
    }
  },
  mounted() {
    this.residentRealTimeRelease()
  },
  methods: {
    residentRealTimeRelease() {
      // this.$api.getResidentInvestment().then(res => {
      //   // console.log("res", res)
      // })
      this.data.map((item, index) => {
        this.dataSource.push([item.stockTime, item.userName.substring(0, 3), item.houseNumber, item.netWeight])
        this.config = {
          columnWidth: [130, 120, 120, 100],
          headerBGC: null,
          oddRowBGC: null,
          evenRowBGC: null,
          rowNum: 9,
          align: ["center", "center", "center", "center"],
          header: ["任务时间", "处理类型", "任务内容", "任务状态"],
          data: this.dataSource
        }
      })
    }
  }
}
</script>

<style scoped>
#chuku_trace {
  color: honeydew;
  width: 509px;
  height: 368px;
  background-image: url(../../assets/data/index/trace_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 999;
}

.title {
  text-align: center;
  height: 48px;
  line-height: 48px;
  color: #00e4ff;
  font-size: 16px;
}

.chuku_trace_content {
  padding: 20px;
}

#bar_container {
  padding: 20px;
  height: 300px;
  z-index: -1;
}

.switch_label {
  float: right;
  z-index: 999;
}

li {
  width: 30px;
  display: inline-block;
  margin: 0 5px;
}

.active {
  color: #64dcf7;
}
#line_container {
  height: 385px;
  padding: 20px;
}
</style>
