<template>
  <div id="SortingStationInventory">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>分拣站：</span>
              <div class="dib"><a-input v-model="site_info_name" placeholder="请输入分拣站" allowClear /></div>
            </div>
            <div>
              <span>物品品类：</span>
              <div class="dib"><a-input v-model="category_name" placeholder="请输入物品品类" allowClear /></div>
            </div>

            <div>
              <span>物品名称：</span>
              <div class="dib"><a-input v-model="goods_name" placeholder="请输入物品名称" allowClear /></div>
            </div>

            <div v-if="item.value == 2">
              <span>时间筛选：</span>
              <div class="dib">
                <a-range-picker v-model="dateString" @change="onChange" allowClear style="width: 213px" />
              </div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button icon="export" @click="trackExport">导出</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <!--  -->
            <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading" :rowKey="row => $utils.createUUID()">
              <a-table-column key="datetime" title="日期" data-index="datetime" align="center" :ellipsis="true" />
              <a-table-column key="site_info_name" title="分拣站" data-index="site_info_name" align="center" :ellipsis="true" />
              <a-table-column key="category_name" title="品类" data-index="category_name" align="center" :ellipsis="true" />
              <a-table-column key="goods_name" title="物品" data-index="goods_name" align="center" :ellipsis="true" />
              <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
              <a-table-column key="new_inventory" title="当日入库(kg)" data-index="new_inventory" align="center" :ellipsis="true" />
              <a-table-column key="new_out_weight" title="当日出库(kg)" data-index="new_out_weight" align="center" :ellipsis="true" />
              <a-table-column key="residue_stock" title="剩余库存(kg)" data-index="residue_stock" align="center" :ellipsis="true" />
              <a-table-column key="month_stock_out" title="当月出库总量(kg)" data-index="month_stock_out" align="center" :ellipsis="true" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center" fixed="right" v-if="item.name === '实时库存'">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="edit(record)">编辑库存</a-button>
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
    <!-- 编辑 -->
    <a-modal title="编辑库存" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="600">
      <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="old_weight" label="剩余库存" prop="old_weight" has-feedback>
          <a-input v-model="form.old_weight" placeholder="请输入剩余库存" class="w100b" allowClear @pressEnter="inputChange" />
        </a-form-model-item>
        <a-form-model-item ref="month_stock_out" label="当月出库总量" prop="month_stock_out" has-feedback>
          <a-input v-model="form.month_stock_out" placeholder="请输入当月出库总量" class="w100b" :disabled="disabled" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "SortingStationInventory",
  data() {
    return {
      btnValue: 1,
      tabList: [
        { name: "实时库存", value: 1, num: null },
        { name: "历史库存", value: 2, num: null }
      ],
      site_info_name: "",
      category_name: "",
      goods_name: "",
      dateString: [this.$moment().subtract(15, "days"), this.$moment().subtract(1, "days")],
      start_time: this.$moment()
        .subtract(15, "days")
        .format("YYYY-MM-DD"),
      over_time: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      // dateString: [],
      // start_time: "",
      // over_time: "",
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,

      operationVisible: false,
      operationLoading: false,
      form: {
        old_weight: "",
        month_stock_out: "",
        place_id: "",
        new_weight: "",
        type: 3
      },
      disabled: false,
      weight: ""
      // id: this.$utils.createUUID()
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 切换
    tabChange() {
      setTimeout(() => {
        this.getTableList(1)
      }, 500)
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 按下回车时的回调
    inputChange(e) {
      this.form.month_stock_out = e.target._value - this.weight
    },
    getTableList(page) {
      if (page) this.page = page
      const data = {
        site_info_name: this.site_info_name || "",
        category_name: this.category_name || "",
        goods_name: this.goods_name || "",
        page: this.page
      }
      this.tableLoading = true
      if (this.btnValue == 1) {
        this.$api.getRealStockList(data).then(res => {
          const dataSource = res.data.data.map(item => {
            item.id = this.$utils.createUUID()
            item.key = item.id
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      } else {
        this.$api.getHistoryStockList({ ...data, start_time: this.start_time, over_time: this.over_time }).then(res => {
          const dataSource = res.data.data.map(item => {
            item.id = this.$utils.createUUID()
            item.key = item.id
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      }
    },
    edit(record) {
      this.disabled = true
      this.operationVisible = true
      this.form.old_weight = record.residue_stock
      this.weight = record.residue_stock
      this.form.month_stock_out = record.month_stock_out

      this.form.category_name = record.category_name
      this.form.goods_name = record.goods_name
      this.form.type = 3
      this.form.place_id = record.site_info_id
    },
    // 确认
    operationOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.operationLoading = true
          let data = {
            place_id: this.form.place_id,
            category_name: this.form.category_name,
            goods_name: this.form.goods_name,

            old_weight: this.weight,
            new_weight: this.form.old_weight,
            month_stock_out: this.form.month_stock_out,
            type: this.form.type
          }

          this.$api
            .updateRealStock(data)
            .then(res => {
              this.$message.success(res.msg)
              this.operationLoading = false
              this.getTableList()
              this.operationVisible = false
            })
            .catch(() => {
              this.operationLoading = false
            })
        }
      })
    },
    //导出
    trackExport() {
      let start_time = this.start_time || ""
      let over_time = this.over_time || ""
      let site_info_name = this.site_info_name || ""
      let category_name = this.category_name || ""
      let goods_name = this.goods_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      if (this.btnValue == 1) {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/site/info/realstockexport?token=${token}&site_info_name=${site_info_name}&category_name=${category_name}&goods_name=${goods_name}&start_time=${start_time}&over_time=${over_time}`
        )
      } else {
        window.open(
          `${process.env.VUE_APP_BASE_URL}/admin/v1/site/info/stock/export?token=${token}&category_name=${category_name}&goods_name=${goods_name}&site_info_name=${site_info_name}&start_time=${start_time}&over_time=${over_time}`
        )
      }
    }
  }
}
</script>

<style lang="less">
// #SortingStationInventory {
// }
</style>
