<template>
  <div id="RecyClingPriceList">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>设施名称：</span>
            <div class="dib"><a-input v-model="filter.house_name" placeholder="请输入设施名称" allowClear /></div>
          </div>
          <div>
            <span>价格表名称：</span>
            <div class="dib"><a-input v-model="filter.price_table_name" placeholder="请输入价格表名称" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" class="fr" @click="operation('add')">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column title="价格表名称" data-index="price_table_name" align="center" :width="300" :ellipsis="true" />
              <a-table-column title="设施类型" data-index="type_name" align="center" :width="300" :ellipsis="true" />
              <a-table-column title="设施名称" data-index="house_name" align="center" :ellipsis="true" />
              <a-table-column title="操作" data-index="option" align="center" :width="200">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="getPriceDetail(record)">查看价格</a-button>
                  <a-button type="link" size="small" @click="operation('edit', record)">编辑</a-button>
                  <a-button type="link" size="small" @click="deleteData(record.price_table_no, record.price_table_name)">删除</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </a-space>
      </div>
    </a-space>

    <a-modal v-model="priceTableShow" :footer="null" :title="priceTableTitle" :width="800">
      <a-table size="middle" :data-source="priceTableDataSource" :pagination="false" :scroll="{ y: 400 }" :loading="priceTableLoading">
        <a-table-column title="名称" data-index="goods_name" align="center" :ellipsis="true" />
        <a-table-column title="现金价格(元/千克)" data-index="cash_price" align="center" :ellipsis="true" />
        <a-table-column title="积分价格(积分/千克)" data-index="integral_price" align="center" :ellipsis="true" />
        <a-table-column v-if="currentPriceType === 2" title="单次投放量(千克)" data-index="weight" align="center" :ellipsis="true" />
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "RecyClingPriceList",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        page: 1,
        house_name: "",
        price_table_name: ""
      },
      priceTableShow: false,
      priceTableTitle: "",
      currentPriceType: 1,
      priceTableDataSource: [],
      priceTableLoading: false
    }
  },
  created() {
    // 获取列表
    this.getTableList()
  },
  computed: {},
  methods: {
    // 搜索
    getTableList(page) {
      if (page) this.page = page
      this.filter.page = this.page
      this.tableLoading = true
      this.$api.getPriceOrderList(this.filter).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          this.dataSource = res.data.data.map((item, index) => {
            item.key = index
            return item
          })
        } else {
          this.dataSource = []
        }
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 新增/编辑
    operation(type, record) {
      this.$router.push({
        name: type === "add" ? "RecyClingPriceListAdd" : "RecyClingPriceListEdit",
        query: {
          type,
          ...(record && { no: record.price_table_no }),
          ...(record && { no_type: record.type })
        }
      })
    },

    // 获取价格详情
    getPriceDetail(record) {
      this.priceTableShow = true
      this.priceTableLoading = true
      this.priceTableTitle = record.price_table_name
      this.currentPriceType = record.type
      this.$api.getPriceOrderDetail({ price_table_no: record.price_table_no }).then(res => {
        this.priceTableDataSource = res.data.map((item, index) => {
          item.key = index
          return item
        })
        this.priceTableLoading = false
      })
    },

    // 表格删除
    deleteData(price_table_no, name) {
      let that = this
      this.$confirm({
        title: "删除",
        content: '是否确认删除"' + name + '" ?',
        onOk() {
          that.$api.delPriceOrder({ price_table_no }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    }
  }
}
</script>

<style></style>
