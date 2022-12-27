<template>
  <!-- 礼品入库 -->
  <div id="GiftStorage">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" style="margin-bottom:10px;width:100%" size="middle">
            <div>
              <span>入库编号：</span>
              <div class="dib"><a-input v-model="activity_no" placeholder="请输入入库编号" allowClear /></div>
            </div>
            <div>
              <span>入库来源：</span>
              <div class="dib"><a-select style="width:213px" v-model="source" placeholder="请选择入库来源" :options="sourceType" allowClear /></div>
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
                <a-range-picker style="width:213px" v-model="time" @change="timeChange" allowClear />
              </div>
            </div>
            <div v-if="item.name === '已入库'">
              <span>入库时间：</span>
              <div class="dib">
                <a-range-picker style="width:213px" v-model="stock_time" @change="stockTimeChange" allowClear />
              </div>
            </div>

            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <!-- <a-button type="primary" icon="plus" @click="add">新增</a-button> -->
            <a-button icon="export" @click="trackExport">导出</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="activity_no" v-if="item.name === '待入库'" title="入库编号" data-index="activity_no" align="center">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="option('waitStorage', record.key)">{{ record.activity_no }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="activity_no" v-if="item.name === '已入库'" title="入库编号" data-index="activity_no" align="center">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="option('storageDone', record.key)">{{ record.activity_no }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="source_name" title="入库来源" data-index="source_name" align="center" :ellipsis="true" />
              <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :ellipsis="true" />
              <a-table-column key="activity_name" title="活动名称" data-index="activity_name" align="center" :ellipsis="true" />
              <a-table-column key="create_name" title="申请人" data-index="create_name" align="center" :ellipsis="true" />
              <a-table-column key="create_time" title="申请时间" data-index="create_time" align="center" :ellipsis="true" />
              <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" v-if="item.name === '已入库'" />
              <a-table-column key="stock_in_time" title="入库时间" data-index="stock_in_time" align="center" :ellipsis="true" v-if="item.name === '已入库'" />
              <a-table-column key="warehouse" title="仓库" data-index="warehouse" align="center" :ellipsis="true" />
              <a-table-column key="option" title="操作" data-index="option" v-if="item.name === '待入库'" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="storage(record.key)">入库</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30">
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
  name: "GiftStorage",
  data() {
    return {
      btnValue: 1,
      tabList: [
        { name: "待入库", value: 1, num: null },
        { name: "已入库", value: 2, num: null }
      ],
      sourceType: [
        { label: "定时定点活动", value: 1, num: null },
        { label: "宣传活动", value: 2, num: null },
        { label: "入户回访", value: 3, num: null }
      ],
      warehouseList: [],
      time: [],
      stock_time: [],
      activity_no: "",
      operator_name: "",
      warehouse_id: undefined,
      source: undefined,
      stock_start_time: null,
      stock_over_time: null,
      start_time: null,
      end_time: null,

      dataSource: [], // 表格数据
      tableLoading: false, //表格
      delLoading: false,
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
    tabChange(e) {
      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },
    stockTimeChange(e, v) {
      this.stock_start_time = v[0]
      this.stock_over_time = v[1]
    },
    // 获取礼品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        activity_no: this.activity_no || "",
        operator_name: this.operator_name || "",
        warehouse_id: this.warehouse_id || "",
        source: this.source || "",
        stock_start_time: this.stock_start_time || null,
        stock_over_time: this.stock_over_time || null,
        start_time: this.start_time || null,
        end_time: this.end_time || null,
        state: this.btnValue,
        page: this.page
      }
      this.tableLoading = true
      this.$api.getGiftStorageList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 轨迹导出
    trackExport() {
      const start_time = this.start_time || ""
      const end_time = this.end_time || ""

      const activity_no = this.activity_no || ""
      const operator_name = this.operator_name || ""
      const warehouse_id = this.warehouse_id || ""
      const source = this.source || ""
      const stock_start_time = this.stock_start_time || ""
      const stock_over_time = this.stock_over_time || ""
      const state = this.btnValue

      const token = JSON.parse(localStorage.getItem("token"))
      if (this.btnValue == 1) {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/gift/activity/stock/in/export?token=${token}&state=${state}&start_time=${start_time}&end_time=${end_time}&activity_no=${activity_no}&operator_name=${operator_name}&warehouse_id=${warehouse_id}&source=${source}`
        )
      } else {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/gift/activity/stock/in/export?token=${token}&state=${state}&start_time=${start_time}&end_time=${end_time}&activity_no=${activity_no}&operator_name=${operator_name}&warehouse_id=${warehouse_id}&source=${source}&stock_start_time=${stock_start_time}&stock_over_time=${stock_over_time}`
        )
      }
    },

    // 待入库/已入库详情
    option(type, record, key = "") {
      this.$router.push({
        name: type === "waitStorage" ? "waitStorage" : "storageDone",
        query: { type, id: record }
        // params: { data: oneData[0] }
      })
    },

    //入库
    storage(key = "") {
      this.$router.push({
        name: "Storage",
        query: { id: key }
        // params: { data: oneData[0] }
      })
    }
  }
}
</script>

<style lang="less">
#GiftStorage {
  .img {
    height: 24px;
  }
  .words {
    letter-spacing: 3.5px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
</style>
