<template>
  <!-- 小区综合排名和展示 -->
  <div class="plot_rank_show">
    <div>
      <dv-scroll-board :config="config" style="height: 390px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "plot_rank_show",
  data() {
    return {
      config: {},
      dataSource: []
    }
  },
  mounted() {
    this.plotRankData()
  },
  methods: {
    // 小区排名
    plotRankData() {
      this.$api.getComprehensiveModule().then(res => {
        res.data.map((item, index) => {
          if (index < 9) {
            let rank = ""
            if (index == 0) {
              rank = '<img src="https://image.58xiaoxiang.top/fenlei/first.png">'
            } else if (index == 1) {
              rank = '<img src="https://image.58xiaoxiang.top/fenlei/second.png">'
            } else if (index == 2) {
              rank = '<img src="https://image.58xiaoxiang.top/fenlei/third.png">'
            } else {
              rank = index + 1
            }
            // item.participantsPercent,
            // this.dataSource.push([rank, item.plotName.substring(0, 7), item.awarenessRate, item.participantsPercent, Number(item.weight)])
            this.dataSource.push([rank, item.plotName.substring(0, 7), item.awarenessRate, Number(item.weight)])
            this.config = {
              columnWidth: [60, 160, 80, 160],
              headerBGC: null,
              oddRowBGC: null,
              evenRowBGC: null,
              rowNum: 9,
              align: ["center", "center", "center", "center", "center"],
              // header: ["排名", "小区名称", "注册率", "参与率", "回收垃圾量(kg)"],
              header: ["排名", "小区名称", "注册率", "回收垃圾量(kg)"],
              data: this.dataSource
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.plot_rank_show {
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
