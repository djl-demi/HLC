<template>
  <!-- 作业数据 -->
  <div class="work_data">
    <div class="title">
      <div class="title_text">发电机充放数据</div>
    </div>
    <a-card :bordered="false" :bodyStyle="card">
      <div>
        <div class="switch">
          <div :class="today" @click="showToday()">当日数据</div>
          <div :class="month" @click="showMonth()">当月数据</div>
        </div>
        <div id="containerColumnBar"></div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { Column } from "@antv/g2plot"
export default {
  name: "work_data",
  data() {
    return {
      data: [
        { title: "12/28", number: "100", type: "发电机1", time: 1672214065233 },
        { title: "12/28", number: "110", type: "发电机2", time: 1672214065233 },
        { title: "12/28", number: "120", type: "发电机3", time: 1672214065233 },
        { title: "12/28", number: "130", type: "发电机4", time: 1672214065233 },
        { title: "12/29", number: "110", type: "发电机1", time: 1672300465233 },
        { title: "12/29", number: "30", type: "发电机2", time: 1672300465233 },
        { title: "12/29", number: "40", type: "发电机3", time: 1672300465233 },
        { title: "12/29", number: "60", type: "发电机4", time: 1672300465233 },
        { title: "12/30", number: "120", type: "发电机1", time: 1672386865233 },
        { title: "12/30", number: "70", type: "发电机2", time: 1672386865233 },
        { title: "12/30", number: "80", type: "发电机3", time: 1672386865233 },
        { title: "12/30", number: "90", type: "发电机4", time: 1672386865233 },
        { title: "12/31", number: "110", type: "发电机1", time: 1672473265233 },
        { title: "12/31", number: "44", type: "发电机2", time: 1672473265233 },
        { title: "12/31", number: "55", type: "发电机3", time: 1672473265233 },
        { title: "12/31", number: "66", type: "发电机4", time: 1672473265233 },
        { title: "01/01", number: "121", type: "发电机1", time: 1672559665233 },
        { title: "01/01", number: "77", type: "发电机2", time: 1672559665233 },
        { title: "01/01", number: "65", type: "发电机3", time: 1672559665233 },
        { title: "01/01", number: "87", type: "发电机4", time: 1672559665233 },
        { title: "01/02", number: "121", type: "发电机1", time: 1672646065233 },
        { title: "01/02", number: "75", type: "发电机2", time: 1672646065233 },
        { title: "01/02", number: "65", type: "发电机3", time: 1672646065233 },
        { title: "01/02", number: "66", type: "发电机4", time: 1672646065233 },
        { title: "01/03", number: "45", type: "发电机1", time: 1672732465233 },
        { title: "01/03", number: "55", type: "发电机2", time: 1672732465233 },
        { title: "01/03", number: "111", type: "发电机3", time: 1672732465233 },
        { title: "01/03", number: "111", type: "发电机4", time: 1672732465233 }
      ],

      stackedColumnPlot: {},
      today: "today",
      month: "month",
      card: {
        boxShadow: "0px 0px 15px 8px rgba(86, 85, 241, 0.05)",
        borderRadius: "14px"
      }
    }
  },
  mounted() {
    this.getWorkData(1) //当天
  },
  methods: {
    // 展示当日数据
    showToday() {
      this.today = "today"
      this.month = "month"
      this.getWorkData(1, 1)
    },
    // 展示当月数据
    showMonth() {
      this.today = "today2"
      this.month = "month2"
      this.getWorkData(2, 1)
    },
    // 获取当日数据
    getWorkData(type = 1, changeFlag = 0) {
      let data = {
        type: type
      }
      // this.$api.taskData(data).then(res => {
      // })
      let dataSource = this.data.map(item => {
        item.number = parseInt(item.number)
        return item
      })

      if (changeFlag) {
        this.stackedColumnPlot.changeData(dataSource)
      } else {
        this.createColumnBar(dataSource)
      }
    },
    // 生成分组柱状图
    createColumnBar(data) {
      this.stackedColumnPlot = new Column("containerColumnBar", {
        data,
        isGroup: true,
        xField: "type",
        yField: "number",
        seriesField: "title",
        // maxColumnWidth: 15,
        // dodgePadding: 0,
        columnWidthRatio: 0.5,
        /** 设置颜色 */
        color: ["#F56FD3", "#7B6FF9", "#FA6762", "#FEBF42", "#18ADFA"],
        /** 设置间距 */
        // marginRatio: 0.1,
        label: {
          // 可手动配置 label 数据标签位置
          position: "top", // 'top', 'middle', 'bottom'
          // 可配置附加的布局方法
          offset: 4
          //   layout: [
          //     // 柱形图数据标签位置自动调整
          //     { type: "interval-adjust-position" },
          //     // 数据标签防遮挡
          //     { type: "interval-hide-overlap" },
          //     // 数据标签文颜色自动调整
          //     { type: "adjust-color" }
          //   ]
        },
        legend: {
          offsetY: 0,
          spacing: 50,
          background: {
            padding: [10, 0, 40, 0],
            style: {
              lineWidth: 0
            }
          }
        },
        yAxis: {
          title: {
            text: "(兆瓦)",
            position: "end",
            autoRotate: false,
            style: {}
          },
          label: this.label,
          grid: {
            line: {
              style: {
                lineWidth: 0.5,
                opacity: 0.1
              }
            }
          }
        }
      })

      this.stackedColumnPlot.render()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  padding-bottom: 20px;
}

.title_text {
  font-size: 20px;
  font-weight: 600;
  color: #565656;
}

.ant-card {
  border-radius: 14px !important;
}

#containerColumnBar {
  height: 417px;
}

.switch {
  width: 200px;
  height: 42px;
  position: absolute;
  border: solid 1px #4e3ce6;
  border-radius: 20px;
  right: 24px;
  z-index: 999;
  cursor: pointer;
}

.today {
  width: 50%;
  text-align: center;
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  background: #4e3ce6;
  border-radius: 20px;
  color: #fff;
}

.today2 {
  width: 50%;
  text-align: center;
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #999999;
}

.month {
  width: 50%;
  text-align: center;
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #999999;
}

.month2 {
  width: 50%;
  text-align: center;
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  background: #4e3ce6;
  color: #fff;
  border-radius: 20px;
}
</style>
