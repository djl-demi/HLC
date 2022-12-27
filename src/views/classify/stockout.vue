<template>
  <div class="Stockout">
    水平车
    <!-- <a-space direction="vertical" size="large" class="w100b">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>出库编号：</span>
            <div class="dib"><a-input v-model="filter.stock_no" placeholder="请输入出库编号" allowClear /></div>
          </div>
          <div>
            <span>出库时间：</span>
            <div class="dib"><a-range-picker @change="onChangeTime" allowClear /></div>
          </div>
          <div>
            <span>站点名称：</span>
            <div class="dib"><a-input v-model="filter.site_name" placeholder="请输入站点名称" allowClear /></div>
          </div>
          <div>
            <span>出库至：</span>
            <div class="dib w200">
              <a-select v-model="filter.type" :options="outlist_options" placeholder="请选择出口目的地" class="w200" allowClear />
            </div>
          </div>
          <div>
            <span>出库物品：</span>
            <div class="dib"><a-input v-model="filter.goods_name" placeholder="请输入出库物品" allowClear /></div>
          </div>
          <div>
            <span>司机：</span>
            <div class="dib"><a-input v-model="filter.driver_name" placeholder="请输入司机" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-button type="primary" icon="export" @click="exportTable()">导出</a-button>
        </a-space>
      </div>


      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="出库编号" data-index="stock_no" align="center" :ellipsis="true" />
            <a-table-column title="站点名称" data-index="house_name" align="center" :ellipsis="true" />
            <a-table-column title="物品品类" data-index="category_name" align="center" :ellipsis="true" />
            <a-table-column title="物品" data-index="goods_name" align="center" :ellipsis="true" />
            <a-table-column title="重量" data-index="weight" align="center" :ellipsis="true" />
            <a-table-column title="单位" data-index="unit" align="center" :ellipsis="true" />
            <a-table-column title="出库至" data-index="site_name" align="center" :ellipsis="true" />
            <a-table-column title="司机" data-index="driver_name" align="center" :ellipsis="true" />
            <a-table-column title="出库时间" data-index="stock_time" align="center" :ellipsis="true" />
            <a-table-column title="操作时间" data-index="delete_time" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button v-if="record.status == 1" type="link" size="small" @click="cancelStock(record)">取消出库</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space> -->
  </div>
</template>

<script>
export default {
  name: "Stockout",
  data() {
    return {
      filter: {
        stock_no: "",
        out_date: "",
        site_name: undefined,
        type: undefined,
        goods_name: "",
        driver_name: ""
      },
      start_time: "",
      end_time: "",
      outlist_options: [
        { value: 1, label: "分拣站" },
        { value: 2, label: "处理厂" }
      ],
      tableLoading: false,
      dataSource: [],
      page: 1,
      total: 0
    }
  },
  mounted() {
    // this.getTableList(1)
  },

  methods: {
    // 时间区间选择
    onChangeTime(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 出库列表
    getTableList(page) {
      if (page) this.page = page

      let data = {
        site_type: 1,
        start_time: this.start_time || "",
        over_time: this.over_time || "",
        type: this.filter.type == undefined ? "" : this.filter.type,
        site_name: this.filter.site_name == undefined ? "" : this.filter.site_name,
        stock_no: this.filter.stock_no,
        goods_name: this.filter.goods_name,
        driver_name: this.filter.driver_name,
        page: this.page
      }
      this.tableLoading = true
      this.$api.stockoutList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 取消出库
    cancelStock(item) {
      let that = this
      that.$confirm({
        title: "确认取消?",
        content: h => <div style="color:red;">是否确认取消出库单？</div>,
        onOk() {
          console.log("OK", item)
          that.$api.cancelStockOut({ id: item.id, site_type: 1 }).then(res => {
            that.$message.info("取消成功")
            that.getTableList(1)
          })
        },
        onCancel() {
          that.$message.info("取消操作")
        }
      })
    },
    // 导出
    exportTable() {
      let start_time = this.start_time || ""
      let over_time = this.over_time || ""
      let type = this.filter.type == undefined ? "" : this.filter.type
      let site_name = this.filter.site_name == undefined ? "" : this.filter.site_name
      let stock_no = this.filter.stock_no || ""
      let driver_name = this.filter.driver_name || ""
      let goods_name = this.filter.goods_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}admin/v1/stock/showexport?token=${token}&site_type=1&type=${type}&goodsName=${goods_name}&start_time=${start_time}&over_time=${over_time}&site_name=${site_name}&stock_no=${stock_no}&driver_name=${driver_name}`
      )
    }
  }
}
</script>

<style scoped lang="less">
.flex-line {
  display: flex;
  align-items: flex-start;
  margin-right: 10px;

  .flex-left {
    display: flex;
    flex-wrap: wrap;
  }
  .flex-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    button {
      margin-bottom: 10px;
    }
  }
  .fill-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-right: 10px;
    span {
      white-space: nowrap;
    }
  }
}
</style>
