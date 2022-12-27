<template>
  <div id="DataScreenResidentStatistics">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="flex-line" size="middle">
          <a-upload name="file" :action="$com.importResidentStatistics()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/居民统计模拟数据导入模版.xlsx" download="居民统计模拟数据导入模版.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="userNum" title="居民户数" data-index="userNum" align="center" :ellipsis="true" />
            <a-table-column key="joinNum" title="参与数" data-index="joinNum" align="center" :ellipsis="true" />
            <a-table-column key="registerNum" title="总注册数" data-index="registerNum" align="center" :ellipsis="true" />
            <a-table-column key="houseNum" title="入住户数" data-index="houseNum" align="center" :ellipsis="true" />
            <a-table-column key="joinRate" title="参与率" data-index="joinRate" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.joinRate }}%</span>
              </template>
            </a-table-column>
            <a-table-column key="classifyRate" title="注册率（分类准确率）" data-index="classifyRate" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.classifyRate }}%</span>
              </template>
            </a-table-column>
            <a-table-column key="weight" title="回收总量（kg）" data-index="weight" align="center" :ellipsis="true" />
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
  name: "DataScreenResidentStatistics",
  data() {
    return {
      delLoading: false,
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
      this.$api.getUserCountSimulate(data).then(res => {
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
            .delUserCountSimulate({ id: [id] })
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
