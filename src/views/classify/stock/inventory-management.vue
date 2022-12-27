<template>
  <div id="InventoryManagement">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>物品品类：</span>
            <div class="dib"><a-input v-model="category_name" placeholder="请输入物品品类" allowClear /></div>
          </div>
          <div>
            <span>物品名称：</span>
            <div class="dib"><a-input v-model="goods_name" placeholder="请输入物品名称" allowClear /></div>
          </div>
          <!-- <div>
            <span>时间筛选：</span>
            <div class="dib"><a-range-picker v-model="dateString" @change="onChange" allowClear class="w200" /></div>
          </div> -->
          <div>
            <span>投放类型：</span>
            <div class="dib">
              <a-select v-model="type" :options="typeOption" class="w200" placeholder="请选择投放类型" allowClear />
            </div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr  ">
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading" :rowKey="row => this.$utils.createUUID()">
            <a-table-column key="launchTime" title="更新时间" data-index="launchTime" align="center" :ellipsis="true" />
            <a-table-column key="deviceName" title="投放点" data-index="deviceName" align="center" :ellipsis="true" />
            <a-table-column key="categoryName" title="物品品类" data-index="categoryName" align="center" :ellipsis="true" />
            <a-table-column key="goodsName" title="物品名称" data-index="goodsName" align="center" :ellipsis="true" />
            <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
            <a-table-column key="dailyLaunch" title="当日投放总量" data-index="dailyLaunch" align="center" :ellipsis="true" />
            <a-table-column key="newOut" title="当日出库（kg）" data-index="newOut" align="center" :ellipsis="true" />
            <a-table-column key="restInventory" title="剩余库存（kg）" data-index="restInventory" align="center" :ellipsis="true" />
            <a-table-column key="monthLaunch" title="当月投放总量" data-index="monthLaunch" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record)">编辑库存</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="operationTitle" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="600">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="left_stock" label="剩余库存" prop="left_stock" has-feedback>
          <a-input v-model="form.left_stock" placeholder="请输入剩余库存" class="w100b" @change="changeStock" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="month_launch_weight" label="累计投放总量" prop="month_launch_weight" has-feedback>
          <a-input v-model="form.month_launch_weight" placeholder="请输入累计投放总量" disabled class="w100b" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "InventoryManagement",
  data() {
    return {
      // dateString: [],
      // start_time: "",
      // over_time: "",
      category_name: "",
      goods_name: "",
      type: undefined,
      typeOption: [
        { value: 0, label: "全部" },
        { value: 1, label: "环保屋" },
        { value: 2, label: "分类厢房" }
      ],
      dataSource: [], //库存管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      operationTitle: "编辑库存",
      operationVisible: false,
      operationLoading: false,
      form: {
        left_stock: 0,
        month_launch_weight: 0
      },
      stock_diff: 0,
      record: null,
      rules: {
        left_stock: [{ required: true, message: "请输入剩余库存", trigger: "blur" }],
        month_launch_weight: [{ required: true, message: "请输入当月投放总量", trigger: "blur" }]
      }
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    edit(record) {
      this.record = record
      this.form.left_stock = record.restInventory
      this.form.month_launch_weight = record.totalInventory || ""
      this.operationVisible = true
    },
    changeStock() {
      this.stock_diff = Number(this.form.left_stock) - Number(this.record.restInventory)
      this.form.month_launch_weight = Number(this.stock_diff) + Number(this.record.totalInventory ? this.record.totalInventory : 0)
    },
    operationOk() {
      let data = {
        place_id: this.record.deviceId,
        category_name: this.record.categoryName,
        goods_name: this.record.goodsName,
        new_weight: this.form.left_stock,
        old_weight: this.record.restInventory,
        type: this.record.type
      }
      // // 更新库存
      this.$api.updateRealStock(data).then(res => {
        this.getTableList()
        this.$message.info(res.msg)
        this.operationVisible = false
      })
    },
    // 导出
    trackExport() {
      let category_name = this.category_name || ""
      let goods_name = this.goods_name || ""
      let type = this.type || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/bid/management/exportInventory?token=${token}&categoryName=${category_name}&goodsName=${goods_name}&type=${type}`)
    },
    getTableList(page) {
      if (page) this.page = page
      const data = {
        categoryName: this.category_name || "",
        goodsName: this.goods_name || "",
        type: this.type || "",
        pageNum: this.page || 1
      }
      this.tableLoading = true
      this.$api
        .getInventoryList(data)
        .then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
        .catch(e => {
          console.log("sss")
        })
    }
  }
}
</script>

<style lang="less">
// #InventoryManagement {
// }
</style>
