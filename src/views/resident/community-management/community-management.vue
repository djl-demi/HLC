<template>
  <div id="CommunityManagement">
    任务接收
    <!-- <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="flex-line" size="middle">
          <div>
            <span>小区名称：</span>
            <div class="dib"><a-input v-model="plot_name" placeholder="请输入名称" allowClear /></div>
          </div>
          <div>
            <span>街道：</span>
            <div class="dib"><a-input v-model="street" placeholder="请输入街道" allowClear /></div>
          </div>
          <div>
            <span>类型：</span>
            <div class="dib"><a-select v-model="type" class="w200" placeholder="请选择" :options="type_options" allowClear /></div>
          </div>
          <div>
            <span>社区：</span>
            <div class="dib"><a-input v-model="community" placeholder="请输入社区" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          <a-space>
            <a-button type="primary" icon="plus" @click="option('add')">新增</a-button>
            <a-button icon="export" @click="trackExport">导出</a-button>
            <a-upload name="file" :action="$com.importCommunity()" :showUploadList="false" :headers="headers" @change="uploadFile">
              <a-button icon="upload">导入</a-button>
            </a-upload>
            <a href="/小区模板.xlsx" download="小区模板.xlsx">下载模板</a>
          </a-space>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="plot_name" title="小区名称" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column key="region" title="区域" data-index="region" align="center" :ellipsis="true" />
            <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
            <a-table-column key="community" title="社区" data-index="community" align="center" :ellipsis="true" />
            <a-table-column key="total_number" title="总户数" data-index="total_number" align="center" :ellipsis="true" />
            <a-table-column key="at_number" title="入住户数" data-index="at_number" align="center" :ellipsis="true" />
            <a-table-column key="smart_bucket" title="智能桶数量" data-index="smart_bucket" align="center" :ellipsis="true" />
            <a-table-column key="general_bucket" title="普通桶数量" data-index="general_bucket" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="option('edit', text, record.key)">编辑</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space> -->
  </div>
</template>

<script>
export default {
  name: "CommunityManagement",
  data() {
    return {
      selectedRowKeys: [],
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
      type_options: [
        { value: 1, label: "居民小区" },
        { value: 2, label: "事业单位" }
      ],
      dataSource: [], //小区管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      last_page: 1
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    // this.getTableList()
  },
  activated() {
    // this.getTableList() //数据编辑后，列表能实时更新
  },
  methods: {
    // 表格选择项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除
    deleteListData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delCommunityManagement({ id: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              //解决最后一页数据全删，页码异常问题
              if (that.selectedRowKeys.length === that.dataSource.length && that.page === that.last_page) {
                that.page--
              }
              that.getTableList(that.page)
              that.$message.success(res.msg)
              that.selectedRowKeys = []
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
    //导出
    trackExport() {
      let plot_name = this.plot_name || ""
      let street = this.street || ""
      let community = this.community || ""
      let type = this.type || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/plot/export?token=${token}&plot_name=${plot_name}&street=${street}&community=${community}&type=${type}`)
    },
    //上传文件 导入
    uploadFile(info) {
      if (info.file.status === "done") {
        this.getTableList()
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.msg)
          return info.file.response.msg
        }
      }
    },

    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        plot_name: this.plot_name || "",
        street: this.street || "",
        community: this.community || "",
        type: this.type || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getCommunityManagementList(data).then(res => {
        this.last_page = res.data.last_page
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          // item.pic_url = this.$com.showUpload() + item.pic_url
          item.region = `${item.province_name}${item.city_name}${item.area_name}`
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 新增/编辑
    option(type, text, key = "") {
      let oneData = []
      if (key) {
        oneData = this.dataSource.filter(item => {
          return item.id === key
        })
      }
      this.$router.push({
        name: type === "add" ? "CommunityManagementOperationAdd" : "CommunityManagementOperationEdit",
        query: { type, id: key },
        params: { data: oneData[0] }
      })
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

.ctrl-bar {
  display: flex;
  align-items: flex-end;
  flex: 1;
  width: 100%;
  margin-left: 10px;
  margin-bottom: 10px;
  a {
    white-space: nowrap;
  }
}
</style>
