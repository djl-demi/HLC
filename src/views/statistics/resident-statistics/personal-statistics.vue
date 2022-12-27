<template>
  <!-- 个人投放量统计 -->
  <div id="PersonalStatistics">
    <div>
      <a-space class="flex-line" size="middle">
        <div>
          <span>电话：</span>
          <div class="dib">
            <a-input v-model="form.phone" placeholder="请输入电话" allowClear />
          </div>
        </div>
        <div>
          <span>小区：</span>
          <a-select v-model="form.plot_id" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="请输入小区名称" allowClear />
        </div>
        <div>
          <span>所属区域：</span>
          <TyAreaCascader :model="region" @change="areaChange" placeholder="请选择省市区"></TyAreaCascader>
        </div>
        <div>
          <span>统计物品品类：</span>
          <a-input v-model="form.category_name" placeholder="请输入统计物品品类" allowClear />
        </div>
        <!-- <div>
          <span>是否为无认证用户：</span>
          <a-select v-model="form.plot_id" show-search :options="plotList" :filter-option="$com.filterOption" class="w200" placeholder="全部" allowClear />
        </div> -->

        <div>
          <span>姓名：</span>
          <div class="dib">
            <a-input v-model="form.user_name" placeholder="请输入姓名" allowClear />
          </div>
        </div>
        <div>
          <span>日期：</span>
          <div class="dib">
            <a-range-picker v-model="form.time" @change="timeChange" format="YYYY-MM-DD" :disabledDate="disabledDate" />
          </div>
        </div>

        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        <a-popover placement="bottomRight" trigger="click">
          <template slot="content">
            <p style="font-size: 16px; font-weight: bold">表格数据说明：</p>
            <span>当前积分：该居民的当前可用积分总和。</span><br />
            <span>累计积分：该居民在时间段内累计投放物品的积分之和。</span><br />
            <span>累计现金：该居民在时间段内累计投放物品的现金之和。</span><br />
            <span>累计投放量: 该居民在时间段内累计投放的已入库的垃圾重量（千克）。</span><br />
            <span>累计投放次数: 该居民在时间段内累计投放的次数。</span><br /><br />
            <p style="color: red">* 除当前积分外其他指标都可根据时间段查询数据并显示。</p>
          </template>
          <a-button icon="info-circle">说明</a-button>
        </a-popover>
        <a-button icon="export" :disabled="disabledExport" @click="exportTable">{{ exportName }}</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :columns="columns" :data-source="dataSource" :pagination="false" :row-key="record => record.key" @change="handleChange" :loading="tableLoading">
          <span slot="action" slot-scope="text, record">
            <a @click="showDetail('detail', record.key)">查看明细</a>
            <a-divider type="vertical" />
            <a @click="showDetail('statistics', record.key)">查看品类重量统计</a>
          </span>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList(page)" />
        </div>
      </a-space>
      <a-modal :width="700" :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose :footer="null" @cancel="handleCancel">
        <a-space direction="vertical" class="w100b">
          <a-table :columns="showColumns" :data-source="dataDetailSoucre" :pagination="false"></a-table>
          <div class="flex-center mt30" v-if="modalVisible">
            <a-pagination v-model="modalpage" show-quick-jumper :default-current="1" :total="modaltotal" @change="getUserDetail(modalpage)" />
          </div>
        </a-space>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "PersonalStatistics",
  components: {
    TyAreaCascader
  },
  data() {
    return {
      form: {
        province_id: "",
        city_id: "",
        area_id: "",
        category_name: undefined,

        plot_id: undefined,
        phone: undefined,
        user_name: undefined,

        sort: undefined,
        type: undefined,
        start_time: this.$moment()
          .startOf("day")
          .subtract(6, "days"),
        end_time: this.$moment().endOf("day"),
        time: [
          this.$moment()
            .startOf("day")
            .subtract(6, "days"),

          this.$moment().endOf("day")
        ]
      },
      region: undefined,
      dataNestingSource: [],
      showColumns: [],
      dataDetailSoucre: [],
      nestingColumns: [
        { title: "积分", dataIndex: "integral", key: "integral" },
        { title: "现金", dataIndex: "real_price", key: "real_price" },
        { title: "来源", dataIndex: "type_text", key: "type_text" },
        { title: "垃圾类型", dataIndex: "category_name", key: "category_name" },
        { title: "重量", dataIndex: "net_weight", key: "net_weight" },
        { title: "操作人", dataIndex: "operator", key: "operator" },
        { title: "操作时间", dataIndex: "stock_time", key: "stock_time" }
      ],
      statisticsColumns: [
        { title: "品类", dataIndex: "category_name", key: "category_name" },
        { title: "重量（千克）", dataIndex: "weight", key: "weight" }
      ],
      columns: [
        { title: "姓名", align: "center", dataIndex: "user_name" },
        { title: "电话", align: "center", dataIndex: "phone" },
        { title: "所属区域", align: "center", dataIndex: "address" },
        { title: "小区", align: "center", dataIndex: "plot_name" },
        { title: "楼号", align: "center", dataIndex: "building_no" },
        { title: "单元", align: "center", dataIndex: "element" },
        { title: "门牌号", align: "center", dataIndex: "house_number" },
        { title: "当前积分", align: "center", sorter: true, dataIndex: "integral" },
        { title: "累计积分", align: "center", sorter: true, dataIndex: "total_integral" },
        { title: "累计现金", align: "center", sorter: true, dataIndex: "real_price" },
        { title: "累计投放量（千克）", align: "center", sorter: true, dataIndex: "total_weight" },
        { title: "累计投放次数 ", align: "center", sorter: true, dataIndex: "count" },
        { title: "操作", align: "center", key: "action", scopedSlots: { customRender: "action" } }
      ],
      dataSource: [],
      tableLoading: false,
      plotList: [],
      plot_id: undefined,
      phone: "",
      user_name: "",
      page: 1,
      total: 0,
      modelTitle: "明细",
      visible: false,
      confirmLoading: false,
      disabledExport: false,
      exportFileUrl: "",
      exportName: "导出",
      param: {},
      modalVisible: false,
      modalpage: 1,
      modaltotal: 0,
      detailParam: {}
      // curExpandedRowKeys: [],
      // expanded: false
    }
  },
  created() {
    this.$com.getCommunityAllList(this, "plotList") // 小区信息列表
    this.getTableList(1)
  },
  watch: {},
  mounted() {},
  methods: {
    // 限制3个月日期选择
    disabledDate(current) {
      return (
        current &&
        current <
          this.$moment()
            .subtract(3, "month")
            .endOf("day")
      )
    },
    // 个人投放明细
    getUserDetail(page) {
      console.log(page)
      this.detailParam.page = page
      let that = this
      that.$api.getPersonalStatisticsDetail(this.detailParam).then(res => {
        that.tableLoading = false
        let dataNestingSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        that.modalVisible = true
        that.modaltotal = res.data.total
        that.dataDetailSoucre = dataNestingSource
      })
    },
    // 查看明细
    showDetail(type = "", id = "") {
      let start_time = this.$utils.forMatDay(this.form.start_time)
      let end_time = this.$utils.forMatDay(this.form.end_time)
      this.detailParam = {
        user_id: id,
        start_time: this.form.start_time == "" ? "" : start_time,
        end_time: this.form.end_time == "" ? "" : end_time
      }
      if (type == "detail") {
        this.modelTitle = "统计明细"
        this.detailParam.type = 2
        this.showColumns = this.nestingColumns
        this.getUserDetail(1)
      } else if (type == "statistics") {
        this.modelTitle = "各物品品类统计"
        this.showColumns = this.statisticsColumns
        let that = this
        that.$api.getGoodsStatistics(this.detailParam).then(res => {
          that.tableLoading = false
          let dataNestingSource = res.data.map(item => {
            item.key = item.category_id
            return item
          })

          that.modalVisible = false
          that.dataDetailSoucre = dataNestingSource
        })
      }
      this.visible = true
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.city_name = name.city_name
      this.area_name = name.area_name
      this.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
      // console.log(e, "e")
    },
    // 日期筛选
    timeChange(e, v) {
      this.form.start_time = v[0]
      this.form.end_time = v[1]
    },
    // 展开或折叠
    // onExpand(expanded, record) {
    //   if (expanded) {
    //     this.curExpandedRowKeys = []
    //     this.curExpandedRowKeys.push(record.key)
    //   } else {
    //     this.curExpandedRowKeys = []
    //   }
    //   let start_time = this.$utils.forMatDay(this.start_time)
    //   let end_time = this.$utils.forMatDay(this.end_time)
    //   let data = {
    //     user_id: record.user_id,
    //     start_time: this.start_time == "" ? "" : start_time,
    //     end_time: this.end_time == "" ? "" : end_time,
    //     type: 2,
    //     order_by: "total_weight"
    //   }

    //   let that = this
    //   that.$api.getPersonalStatisticsDetail(data).then(res => {
    //     that.tableLoading = false
    //     let dataNestingSource = res.data.map(item => {
    //       item.key = item.id
    //       return item
    //     })

    //     that.dataNestingSource = dataNestingSource
    //   })
    // },
    // 表格变化
    handleChange(pagination, filters, sorter) {
      if (sorter.order) {
        if (sorter.order === "ascend") {
          this.type = 2
        } else if (sorter.order === "descend") {
          this.type = 1
        } else {
          this.type = ""
        }
        this.sort = sorter.columnKey
      } else {
        this.sort = ""
      }
      this.page = 1
      this.getTableList(this.page)
    },

    // 获取表格数据
    getTableList(page) {
      // this.curExpandedRowKeys = []
      let data = {
        page
      }
      Object.keys(this.form).forEach(e => {
        data[e] = this.form[e] ? this.form[e] : ""
      })
      this.tableLoading = true
      this.$api.getNewPersonalStatistics(data).then(res => {
        this.tableLoading = false
        // let colKeys = res.data.column.map(e => {
        //   return { name_key: e.name_key, weight_value: e.weight_value }
        // })
        // console.log('res',res)
        this.dataSource = res.data.data.map((item, key) => {
          // if (key === 0) {
          //   colKeys.forEach((colKey, index) => {
          //     Object.keys(item).forEach(e => {
          //       if (e === colKey.name_key) {
          //         colKeys[index].name_value = item[e]
          //       }
          //     })
          //   })
          //   this.columns = this.columns.filter(col => {
          //     return col.dataIndex !== "category_name"
          //   })
          //   if (colKeys.length > 0) {
          //     this.columns
          //     this.columns.push({
          //       title: "投递物品品类重量统计 ",
          //       align: "center",
          //       sorter: true,
          //       dataIndex: "category_name"
          //     })
          //     this.columns.forEach(col => {
          //       if (col.dataIndex === "category_name") {
          //         col.children = []
          //         colKeys.map(e => {
          //           col.children.push({
          //             title: e.name_value,
          //             dataIndex: e.weight_value,
          //             key: e.weight_value
          //           })
          //         })
          //       }
          //     })
          //   }
          // }
          item.key = item.user_id
          return item
        })

        this.total = res.data.total
      })
    },

    // 导出
    exportTable() {
      let start_time = this.$utils.forMatDay(this.form.start_time)
      let end_time = this.$utils.forMatDay(this.form.end_time)
      let data = {
        plot_id: this.form.plot_id == undefined ? "" : this.form.plot_id,
        phone: this.form.phone == undefined ? "" : this.form.phone,
        user_name: this.form.user_name == undefined ? "" : this.form.area_id,
        start_time: this.form.start_time == "" ? "" : start_time,
        end_time: this.form.end_time == "" ? "" : end_time,
        sort: this.form.sort == undefined ? "" : this.form.sort,
        type: this.form.type == undefined ? "" : this.form.type,
        province_id: this.form.province_id ? this.form.province_id : "",
        city_id: this.form.city_id ? this.form.city_id : "",
        area_id: this.form.area_id ? this.form.area_id : ""
      }
      if (this.exportFileUrl) {
        this.exportName = "导出"
        window.open(`${process.env.VUE_APP_BASE_URL}storage/` + this.exportFileUrl)
        this.exportFileUrl = ""
      } else {
        // 置灰，并开启定时器，循环请求接口
        this.disabledExport = true
        this.exportName = "正在导出中..."
        this.$message.info("请不要离开当前页面，正在后台导出中...")
        let that = this
        let clock = setInterval(function() {
          that.$api.exportGoodsStatistics(data).then(res => {
            that.exportName = res.msg
            if (res.data.code == 2) {
              that.exportFileUrl = res.data.url
              clearInterval(clock)
              that.disabledExport = false
            } else {
              that.$message.info(res.msg)
            }
          })
        }, 10000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// #PersonalStatistics {
// }
.flex-line {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.flex-line .ant-space-item > div {
  display: flex;
  margin-bottom: 10px;

  span {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
}
</style>
