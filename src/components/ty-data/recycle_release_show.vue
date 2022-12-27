<template>
  <!-- 可回收物投放量展示 -->
  <div class="recycle_show_table">
    <div>
      <dv-scroll-board :config="config" style="height: 350px" />
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "recycle_show_table",
  data() {
    return {
      config: {
        // columnWidth: [180, 180],
        // headerBGC: "#008aff",
        // oddRowBGC: null,
        // evenRowBGC: null,
        // rowNum: 9,
        // align: ["center", "center"],
        // header: ["小区名称", "可回收物投放量(kg)"],
        // data: [
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4],
        //   ["圣农小区", 14.4]
        // ],
      },
      dataSource: []
    }
  },
  mounted() {
    this.getRecycleModule()
  },
  methods: {
    // 可回收统计
    getRecycleModule() {
      this.$api.getRecycleModule().then(res => {
        res.data.map(item => {
          this.dataSource.push([item.plotName, item.weight])
          this.config = {
            columnWidth: [180, 180],
            headerBGC: "#008aff",
            oddRowBGC: null,
            evenRowBGC: null,
            rowNum: 9,
            align: ["center", "center"],
            header: ["小区名称", "可回收物投放量(kg)"],
            data: this.dataSource
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.recycle_show_table {
  padding: 20px;
}

.tHead {
  background: #008aff;
  color: #fff;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.tBody {
  display: block;
  width: 100%;
  margin-left: -5px;
}

.tBody li {
  text-align: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  /* padding-left: 20px; */
  /* padding: 0 2px; */
  color: #fff;
  border-bottom: dotted 1px #2e3364;
}

/deep/ .dv-scroll-board .header {
  font-weight: bold;
}

/deep/ .dv-scroll-board .rows .row-item {
  /* // font-size: 6px; */
  border-bottom: dotted 1px #2e3364;
  //   border-right: 0.5px solid #344d64d9;
  //   border-left: 0.5px solid #344d64d9;
}
// .dv-scroll-board .rows .ceil {
//   text-align: center;
//   width: 80px;
//   font-size: 10px;
//   padding: 0;
// }
</style>
