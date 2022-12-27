<template>
  <div>
    <TyReturn></TyReturn>
    <a-space direction="vertical" style="width: 100%">
      <a-table size="middle" bordered :data-source="data" :pagination="false" :loading="tableLoading">
        <a-table-column key="update_time" title="更新时间" data-index="update_time" align="center" :ellipsis="true" />
        <a-table-column key="user_name" title="绑定居民" data-index="user_name" align="center" :ellipsis="true" />
        <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
      </div>
    </a-space>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  name: "bindingRecord",
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      data: [],
      tableLoading: false, //表格
      page: 1,
      total: 0
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    getTableList(page) {
      this.id = this.query.id || ""
      if (page) this.page = page
      this.tableLoading = true
      this.$api.getBindingRecord({ ic_card_id: this.id }).then(res => {
        this.data = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    }
  }
}
</script>

<style></style>
