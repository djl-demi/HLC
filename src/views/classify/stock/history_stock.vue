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
          <div>
            <span>投放类型：</span>
            <div class="dib">
              <a-select v-model="type" :options="typeOption" class="w200" placeholder="请选择投放类型" allowClear />
            </div>
          </div>
          <div>
            <span>时间筛选：</span>
            <!-- <div class="dib"><a-date-picker v-model="dateString" placeholder="请选择时间" allowClear /></div> -->
            <div class="dib"><a-range-picker v-model="dateString" @change="onChange" allowClear class="w200" :disabledDate="disabledDate" /></div>
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
            <a-table-column key="launchTime" title="更新日期" data-index="launchTime" align="center" :ellipsis="true" />
            <a-table-column key="deviceName" title="投放点" data-index="deviceName" align="center" :ellipsis="true" />
            <a-table-column key="categoryName" title="物品品类" data-index="categoryName" align="center" :ellipsis="true" />
            <a-table-column key="goodsName" title="物品名称" data-index="goodsName" align="center" :ellipsis="true" />
            <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
            <a-table-column key="dailyLaunch" title="当日投放总量（kg）" data-index="dailyLaunch" align="center" :ellipsis="true" />
            <a-table-column key="newOut" title="当日出库（kg）" data-index="newOut" align="center" :ellipsis="true" />
            <a-table-column key="restInventory" title="剩余库存（kg）" data-index="restInventory" align="center" :ellipsis="true" />
            <a-table-column key="monthLaunch" title="当月投放总量（kg）" data-index="monthLaunch" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
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
      dateString: [this.$moment().subtract(15, "days"), this.$moment().subtract(1, "days")],
      start_time: this.$moment()
        .subtract(15, "days")
        .format("YYYY-MM-DD"),
      over_time: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
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
      page: 1
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
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
    // 导出
    trackExport() {
      let category_name = this.category_name || ""
      let goods_name = this.goods_name || ""
      let start_time = this.start_time || ""
      let over_time = this.over_time || ""
      let type = this.type || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}/bid/management/exportInventory?token=${token}&categoryName=${category_name}&goodsName=${goods_name}&startTime=${start_time}&endTime=${over_time}&type=${type}`
      )
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 获取库存管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        categoryName: this.category_name || "",
        goodsName: this.goods_name || "",
        startTime: this.start_time || "",
        endTime: this.over_time || "",
        type: this.type || "",
        pageNum: this.page
      }

      this.tableLoading = true
      this.$api.getInventoryList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    }
  }
}
</script>

<style lang="less">
// #InventoryManagement {
// }
</style>
