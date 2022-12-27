<template>
  <div id="GiftDelivery">
    <!-- 礼品出库 -->
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" style="margin-bottom:10px;width:100%" size="middle">
            <div>
              <span>出库编号：</span>
              <div class="dib"><a-input v-model="activity_no" placeholder="请输入编号" allowClear /></div>
            </div>
            <div>
              <span>出库去向：</span>
              <div class="dib">
                <a-select style="width:213px" v-model="source" placeholder="请选择出库去向" :options="actityType" allowClear />
              </div>
            </div>
            <div>
              <span class="words">申请人：</span>
              <div class="dib"><a-input v-model="operator_name" placeholder="请输入申请人" allowClear /></div>
            </div>
          </a-space>
          <a-space class="fl" size="middle">
            <div>
              <span>仓库名称：</span>
              <div class="dib"><a-select style="width:213px" v-model="warehouse_id" placeholder="请选择仓库" :options="warehouseList" allowClear /></div>
            </div>
            <div>
              <span>申请时间：</span>
              <div class="dib">
                <a-range-picker style="width:213px" v-model="operator_time" @change="timeChange" allowClear />
              </div>
            </div>
            <div v-if="item.name === '已出库'">
              <span>出库时间：</span>
              <div class="dib">
                <a-range-picker style="width:213px" v-model="out_time" @change="outTimeChange" allowClear />
              </div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button icon="export" @click="trackExport">导出</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" class="w100b">
            <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :pagination="false">
              <a-table-column key="stock_out_no" v-if="item.name === '待出库'" title="出库编号" data-index="stock_out_no" align="center" :width="120">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="option('waitDelivery', record.stock_out_no)">{{ record.stock_out_no }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="stock_out_no" v-if="item.name === '已出库'" title="出库编号" data-index="stock_out_no" align="center" :width="120">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="option('deliveryDone', record.stock_out_no)">{{ record.stock_out_no }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="source" title="出库去向" data-index="source" align="center" />
              <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" />

              <a-table-column key="activity_name" title="活动名称" data-index="activity_name" align="center" />
              <a-table-column key="create_name" title="申请人" data-index="create_name" align="center" />
              <a-table-column key="create_time" title="申请时间" data-index="create_time" align="center" />
              <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" v-if="item.name === '已出库'" />
              <a-table-column key="warehouse" title="仓库" data-index="warehouse" align="center" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center" v-if="item.name === '待出库'">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="delivery(record.stock_out_no)">出库</a-button>
                </template>
              </a-table-column>
              <a-table-column key="stock_time" title="出库时间" data-index="stock_time" align="center" v-if="item.name === '已出库'" />
            </a-table>
            <div class="flex-center mt30 mb20">
              <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "GiftDelivery",
  data() {
    return {
      source: undefined,
      warehouseList: [],
      activity_no: "",
      operator_name: "",
      warehouse_id: undefined,
      btnValue: 1,
      operator_time: [], //申请时间
      out_time: [], //出库时间
      start_time: null,
      end_time: null,
      stock_start_time: null,
      stock_over_time: null,
      tabList: [
        { name: "待出库", value: 1, num: null },
        { name: "已出库", value: 2, num: null }
      ],
      // activity_id: undefined,
      actityType: [
        { label: "定时定点活动", value: 1, num: null },
        { label: "宣传活动", value: 2, num: null },
        { label: "入户回访", value: 3, num: null }
      ],
      dataSource: [], // 表格数据
      tableLoading: false, //表格
      page: 1,
      total: 0
    }
  },
  created() {
    //获取列表
    this.getTableList()
    this.$com.getWarehouseName(this, "warehouseList") // 仓库下拉
  },
  methods: {
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },
    outTimeChange(e, v) {
      this.stock_start_time = v[0]
      this.stock_over_time = v[1]
    },
    // 获取礼品出库列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        activity_no: this.activity_no || "",
        operator_name: this.operator_name || "",
        warehouse_id: this.warehouse_id || "",
        source: this.source || "",
        start_time: this.start_time || null,
        end_time: this.end_time || null,
        stock_start_time: this.stock_start_time || null,
        stock_over_time: this.stock_over_time || null,
        state: this.btnValue,
        page: this.page
      }
      this.tableLoading = true
      this.$api.getGiftDeliveryList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          // item.pic_url = this.$com.showUpload() + item.pic_url
          // item.address = `${item.province_name}${item.city_name}${item.area_name}`
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    tabChange(e) {
      // this.selectedRowKeys = []
      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    // 轨迹导出
    trackExport() {
      const activity_no = this.activity_no || ""
      const operator_name = this.operator_name || ""
      const warehouse_id = this.warehouse_id || ""
      const source = this.source || ""
      const stock_start_time = this.stock_start_time || ""
      const stock_over_time = this.stock_over_time || ""
      const state = this.btnValue

      const start_time = this.start_time || ""
      const end_time = this.end_time || ""
      const token = JSON.parse(localStorage.getItem("token"))
      if (this.btnValue == 1) {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/giftstock/export?activity_no=${activity_no}&operator_name=${operator_name}&warehouse_id=${warehouse_id}&source=${source}&state=${state}&token=${token}&start_time=${start_time}&end_time=${end_time}`
        )
      } else {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/giftstock/export?activity_no=${activity_no}&operator_name=${operator_name}&warehouse_id=${warehouse_id}&source=${source}&state=${state}&token=${token}&start_time=${start_time}&end_time=${end_time}&stock_start_time=${stock_start_time}&stock_over_time=${stock_over_time}`
        )
      }
    },
    // 待出库/已出库详情
    option(type, record, key = "") {
      this.$router.push({
        name: type === "waitDelivery" ? "waitDelivery" : "deliveryDone",
        query: { type, no: record }
        // params: { data: oneData[0] }
      })
    },

    //出库
    delivery(key = "") {
      this.$router.push({
        name: "Delivery",
        query: { no: key }
        // params: { data: oneData[0] }
      })
    }
  }
}
</script>

<style lang="less">
.words {
  letter-spacing: 3.5px;
}
// #GiftDelivery {
// }
</style>
