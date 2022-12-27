<template>
  <!-- 居民实时投放展示 -->
  <div class="release_realtime_show">
    <div>
      <dv-scroll-board :config="config" style="height: 390px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "release_realtime_show",
  data() {
    return {
      config: {},
      dataSource: []
    }
  },
  mounted() {
    this.residentRealTimeRelease()
  },
  methods: {
    residentRealTimeRelease() {
      this.$api.getResidentInvestment().then(res => {
        // console.log("res", res)
        res.data.map((item, index) => {
          this.dataSource.push([item.stockTime, item.userName.substring(0, 3), item.houseNumber, item.categoryName, item.netWeight])
          this.config = {
            columnWidth: [160, 70, 80, 80],
            headerBGC: null,
            oddRowBGC: null,
            evenRowBGC: null,
            rowNum: 9,
            align: ["center", "center", "center", "center", "center"],
            header: ["投放时间", "投放人", "投放户号", "投放类型", "重量(kg)"],
            data: this.dataSource
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.release_realtime_show {
  padding: 20px;
}

/deep/ .dv-scroll-board .header {
  font-weight: bold;
  background: rgba(0, 96, 240, 0.5);
  box-shadow: 0px 3px 30px 0px rgba(0, 120, 255, 0.4);
  border-radius: 4px;
}

/deep/ .dv-scroll-board .rows .row-item {
  /* // font-size: 6px; */
  border-bottom: dotted 1px #2e3364;
  //   border-right: 0.5px solid #344d64d9;
  //   border-left: 0.5px solid #344d64d9;
}
</style>
