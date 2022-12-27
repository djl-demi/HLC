<template>
  <div id="GISScreenFacilityStatistics">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="flex-line" size="middle">
          <a-upload name="file" :action="$com.importFacilityStatistics()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/设施统计模拟数据导入模版.xlsx" download="设施统计模拟数据导入模版.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="houseSum" title="环保屋" data-index="houseSum" align="center" :ellipsis="true" />
            <a-table-column key="unitSum" title="服务单位" data-index="unitSum" align="center" :ellipsis="true" />
            <a-table-column key="bucketSum" title="智能桶" data-index="bucketSum" align="center" :ellipsis="true" />
            <a-table-column key="carSum" title="车辆数" data-index="carSum" align="center" :ellipsis="true" />
            <a-table-column key="terminalSum" title="分拣中心" data-index="terminalSum" align="center" :ellipsis="true" />
            <a-table-column key="treatmentSum" title="处理厂" data-index="treatmentSum" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" style="color: #ff4d4f" size="small" @click="deleteData(record.key)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "GISScreenFacilityStatistics",
  data() {
    return {
      delLoading: false,
      plot_name: "",
      street: "",
      community: "",
      type: undefined,
      file: "",
      list: [],
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      last_page: 1
    }
  },
  computed: {},
  created() {
    //获取列表
    this.getTableList()
  },
  mounted() {},
  methods: {
    // 获取列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page
      }
      this.tableLoading = true
      this.$api.getFacilitySimulate(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 删除
    deleteData(id) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delFacilitySimulate({ id: [id] })
            .then(res => {
              that.delLoading = false
              that.getTableList()
              that.$message.success(res.msg)
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 下载
    downloadBtn() {
      this.$utils.download("api/bid/facilitySimulate/importUpload", {}, `设施统计模板_${new Date().getTime()}.xlsx`)
    },

    //上传文件 导入
    uploadFile(info) {
      if (info.file.status === "done") {
        console.log("done")
        this.getTableList()
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.msg)
          return info.file.response.msg
        }
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
