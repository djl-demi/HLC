<template>
  <div class="QRCodeList">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="flex-auto">
        <a-space class="single-layer" size="middle">
          <div>
            <span>二维码编码：</span>
            <div class="dib"><a-input v-model="filter.qr_no" placeholder="请输入二维码编码" allowClear /></div>
          </div>
          <div>
            <span>是否绑定：</span>
            <div class="dib"><a-select v-model="filter.is_bind" :options="bindOptions" placeholder="请选择是否绑定" style="width:213px" allowClear /></div>
          </div>
          <div>
            <span>绑定时间：</span>
            <div class="dib"><a-range-picker v-model="dateString" @change="onChangeBind" style="width:213px" /></div>
            <!-- <a-date-picker v-model="filter.bind_time" placeholder="请选择绑定时间" class="w100b" allowClear /> -->
          </div>
          <div>
            <span>绑定居民：</span>
            <div class="dib"><a-input v-model="filter.user_name" placeholder="请输入居民信息" allowClear /></div>
          </div>
          <div>
            <span>创建时间：</span>
            <div class="dib"><a-range-picker v-model="dateString2" @change="onChange" style="width:213px" /></div>
            <!-- <a-date-picker v-model="filter.export_time" placeholder="请选择导出时间" class="w100b" allowClear /> -->
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="二维码编码" data-index="qr_no" align="center" :ellipsis="true" />
            <a-table-column title="垃圾袋类型" data-index="type" align="center" :ellipsis="true" />
            <a-table-column title="是否导出" data-index="is_export_text" align="center" :ellipsis="true" />
            <a-table-column title="导出时间" data-index="export_time" align="center" :ellipsis="true" />
            <a-table-column title="绑定时间" data-index="bind_time" align="center" :ellipsis="true" />
            <a-table-column title="绑定来源" data-index="bind_source_text" align="center" :ellipsis="true" />
            <a-table-column title="绑定居民" data-index="user_name" align="center" :ellipsis="true" />
            <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button v-if="record.is_bind == 2" type="link" size="small" @click="operation('cancelBind', record)">取消绑定</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "QRCodeList",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        is_bind: undefined,
        qr_no: "",
        export_time: "",
        bind_time: "",
        user_name: ""
      },
      dateString: [],
      dateString2: [],
      export_time_start: "",
      export_time_end: "",
      bind_time_start: "",
      bind_time_end: "",
      bindOptions: [
        { value: 1, label: "否" },
        { value: 2, label: "是" }
      ]
    }
  },
  created() {
    this.getTableList(1)
  },

  methods: {
    // 搜索表格内容
    getTableList(page) {
      if (page) this.page = page
      console.log("this.filter", this.filter)
      this.filter.page = this.page
      this.tableLoading = true
      let data = {
        is_batch: 2,
        is_bind: this.filter.is_bind === undefined ? "" : this.filter.is_bind,
        qr_no: this.filter.qr_no,
        create_time_start: this.export_time_start,
        create_time_end: this.export_time_end,
        bind_time_start: this.bind_time_start,
        bind_time_end: this.bind_time_end,
        user_name: this.filter.user_name,
        page: this.filter.page
      }

      this.$api.qrcodeList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    onChange(date, dateString) {
      this.export_time_start = dateString[0]
      this.export_time_end = dateString[1]
    },
    onChangeBind(date, dateString2) {
      this.bind_time_start = dateString2[0]
      this.bind_time_end = dateString2[1]
    },
    // 操作
    operation(type, item) {
      if (type === "cancelBind") {
        let that = this
        that.$confirm({
          title: "取消绑定?",
          content: h => <div style="color:red;">是否确认取消绑定居民"{item.user_name}"？</div>,
          onOk() {
            that.$api.qrcodeCancelBind({ id: item.id }).then(res => {
              that.getTableList()
              that.$message.success(res.msg)
            })
          },
          onCancel() {
            that.$message.info("取消")
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.flex-auto {
  display: flex;
  align-content: flex-end;
}

.single-layer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  > div {
    margin-bottom: 10px;
  }
}
</style>
