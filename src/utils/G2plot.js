import { Column, Line, Bar } from "@antv/g2plot"
import { log } from "@antv/g2plot/lib/utils"
import utils from "./utils"
const G2 = {
  // 居民知晓率 柱状图
  initResidentRegistrationColumn(that, data, boxName) {
    let options = {
      data,
      xField: "category_id",
      yField: "weight",
      limitInPlot: true,
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false
        }
      },
      columnStyle: { radius: [10, 10, 0, 0] },
      color: ({ category_id }) => {
        let color = ""
        data.forEach(item => {
          if (category_id === item.category_id) {
            color = utils.getGoodsColor(item.category_name)
          }
        })
        return color
      },
      maxColumnWidth: 30,
      meta: {
        weight: {
          alias: "重量",
          formatter: value => {
            return value + "千克"
          }
        },
        category_id: {
          alias: "名称",
          formatter: value => {
            return data.find(item => {
              return item.category_id === value
            }).category_name
          }
        }
      }
    }

    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Column(boxName, options)
      that[boxName].render()
    }
  },
  // 居民知晓率 分组柱状图
  initResidentRegistrationGroupColumn(that, data, boxName, max) {
    let options = {
      data,
      xField: "name",
      yField: "nums",
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false
        }
      },
      // isPercent: true,
      yAxis: {
        max: max,
        min: 0
        // label: {
        //   formatter: value => {
        //     return value + "%"
        //   }
        // }
      },
      maxColumnWidth: 30,
      seriesField: "name",
      isGroup: "true",
      columnStyle: { radius: [10, 10, 0, 0] },
      meta: {
        nums: {
          alias: "比率",
          formatter: value => {
            return value + "%"
          }
        },
        name: {
          alias: "名称"
        }
      },
      legend: {
        offsetY: -7
      }
    }
    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Column(boxName, options)
      that[boxName].render()
    }
  },
  //回收量分析 柱状图
  initRecycleChartsColumn(that, data, boxName) {
    let options = {
      data,
      xField: "date",
      yField: "nums",
      color: ({ name }) => {
        let color = ""
        data.forEach(item => {
          if (name === item.name) {
            color = utils.getGoodsColor(item.name)
          }
        })
        return color
      },
      xAxis: {
        label: {
          // autoHide: true,
          // autoRotate: false
        }
      },
      yAxis: {
        label: {
          formatter: value => {
            return value + "kg"
          }
        }
      },
      maxColumnWidth: 30,
      seriesField: "name",
      isGroup: "true",
      tooltip: {
        // fields: ["date", "nums"],
        customContent: (title, data) => {
          let info = []
          data.forEach(item => {
            if (item.name === "有害垃圾")
              info.push(
                "<div class='mtb10 w200' ><div class='column-title'>有害垃圾</div><div class='mtb10 w200' style='height:14px;line-height:14px;'><div class='tag-box' style='background-color: #CE001D;'></div>总重量 &nbsp;: &nbsp;&nbsp;&nbsp    " +
                  item.data.totalWeight +
                  "kg</div><div><div class='tag-box' style='background-color: #F56E53;'></div>占比&nbsp;:&nbsp;&nbsp;&nbsp " +
                  item.data.totalPercent +
                  "</div></div>"
              )
            if (item.name === "可回收物")
              info.push(
                "<div class='mtb10 w200' ><div class='column-title'>可回收物</div><div class='mtb10 w200' style='height:14px;line-height:14px;'><div class='tag-box' style='background-color: #029EE6;'></div>总重量 &nbsp;: &nbsp;&nbsp;&nbsp    " +
                  item.data.totalWeight +
                  "kg</div><div><div class='tag-box' style='background-color: #F56E53;'></div>占比&nbsp;:&nbsp;&nbsp;&nbsp " +
                  item.data.totalPercent +
                  "</div></div>"
              )
            if (item.name === "厨余垃圾")
              info.push(
                "<div class='mtb10 w200' ><div class='column-title'>厨余垃圾</div><div class='mtb10 w200' style='height:14px;line-height:14px;'><div class='tag-box' style='background-color: #03AD17;'></div>总重量 &nbsp;: &nbsp;&nbsp;&nbsp    " +
                  item.data.totalWeight +
                  "kg</div><div><div class='tag-box' style='background-color: #F56E53;'></div>占比&nbsp;:&nbsp;&nbsp;&nbsp " +
                  item.data.totalPercent +
                  "</div></div>"
              )
            if (item.name === "其它垃圾")
              info.push(
                "<div class='mtb10 w200' ><div class='column-title'>其它垃圾</div><div class='mtb10 w200' style='height:14px;line-height:14px;'><div class='tag-box' style='background-color: #A1A1A4;'></div>总重量 &nbsp;: &nbsp;&nbsp;&nbsp    " +
                  item.data.totalWeight +
                  "kg</div><div><div class='tag-box' style='background-color: #F56E53;'></div>占比&nbsp;:&nbsp;&nbsp;&nbsp " +
                  item.data.totalPercent +
                  "</div></div>"
              )
          })
          return info.join("")
        }
      },
      // columnStyle: { radius: [20, 20, 20, 20] },
      meta: {}
    }
    console.log(boxName, "boxName")

    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Column(boxName, options)
      that[boxName].render()
    }
  },
  // 回收量排行榜折线图
  initRecycleRankingChartsLine(that, data, boxName, height) {
    let options = {
      data,
      xField: "rank",
      yField: "totalWeight",
      xAxis: {
        tickCount: 10
      },
      yAxis: {
        label: {
          formatter: value => {
            return value + "kg"
          }
        },
        tickCount: 5,
        min: 0
      },
      // seriesField: "name",
      // smooth: true,
      tooltip: {
        customContent: (title, data) => {
          let info = []
          data.forEach(item => {
            info.push(
              "<div class='mtb10 ' style='width:200px'><div class='column-title'>" +
                item.data.plotName +
                "</div><div class='line-box' style='width: 150px;' ><div class='tag-box' style='background-color: #029EE6;'></div><p style='display: inline-block;'>总重量: </p><p style='display: inline-block;'>" +
                item.data.totalWeight +
                "kg</p></div><div class='line-box' style='width: 150px;' ><div class='tag-box' style='background-color: #029EE6;'></div><p style='display: inline-block;'>排名: </p><p style='display: inline-block;color:rgba(0, 204, 132, 1);font-size:16px;'> TOP" +
                item.data.index +
                "</p></div></div>"
            )
          })
          return info.join("")
        }
      }
    }
    if (height) {
      options.height = height
    } else {
      options.height = 400
    }
    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Line(boxName, options)
      that[boxName].render()
    }
  },
  // 站点回收情况
  createRingChart(that, data, boxName) {
    let options = {
      data: data.reverse(),
      isStack: true,
      xField: "value",
      yField: "name",
      seriesField: "type",
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: "#0082C4",
              lineWidth: 0.5
            }
          }
        },
        label: {
          autoHide: true,
          autoRotate: false,
          style: {
            fill: "#0082C4",
            fontSize: 12
          }
        }
      },
      yAxis: {
        label: {
          style: {
            fill: "#0082C4",
            fontSize: 12
          }
        }
      },
      legend: {
        itemName: {
          style: {
            fill: "#C7CBD8" //图例文本的颜色
          }
        }
      },
      color: ["#2FA7F6", "#8C74EE", "#D1D1D0", "#EA79A6", "#20BEB2", "#92D050", "#ED7D31"], //各数据颜色
      label: {
        style: {
          fill: "#fff" //柱子中value的颜色
        },
        // 可手动配置 label 数据标签位置
        position: "middle", // 'left', 'middle', 'right'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: "interval-adjust-position" },
          // 数据标签防遮挡
          { type: "interval-hide-overlap" }
          // 数据标签文颜色自动调整
          // { type: "adjust-color" }
        ]
      }
    }
    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Bar(boxName, options)
      that[boxName].render()
    }
  }
}
export default G2
