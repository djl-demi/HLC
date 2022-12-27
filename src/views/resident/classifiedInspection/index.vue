<template>
  <div id="CommunityManagement">
    <!-- 小区信息 -->
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="flex-line" size="middle">
          <div>
            <span>垃圾类型：</span>
            <div class="dib"><a-select v-model="category_id" style="width: 213px;" placeholder="请选择" :options="categoryTypes" allowClear /></div>
          </div>
          <div>
            <span>居民：</span>
            <div class="dib"><a-input v-model="user_name" placeholder="请输入居民姓名" allowClear /></div>
          </div>
          <div>
            <span>小区：</span>
            <div class="dib"><a-input v-model="plot_name" placeholder="请输入居民小区" allowClear /></div>
          </div>
          <div>
            <span>垃圾袋编号：</span>
            <div class="dib"><a-input v-model="garbage_bag_number" placeholder="请输入垃圾袋编号" allowClear /></div>
          </div>
          <div>
            <span>巡检结果：</span>
            <div class="dib"><a-select v-model="Inspection_results" placeholder="请选择" style="width: 213px;" :options="inspectionResultTypes" allowClear /></div>
          </div>
          <div>
            <span>电话：</span>
            <div class="dib"><a-input v-model="phone" placeholder="请输入居民电话" allowClear :maxLength="11" @change="e => $com.checkInput(this, 'phone', e)" /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="user_name" title="居民" data-index="user_name" align="center" :ellipsis="true" />
            <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column key="building_no" title="楼号" data-index="building_no" align="center" :ellipsis="true" />
            <a-table-column key="phone" title="电话" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column key="category_name" title="垃圾类型" data-index="category_name" align="center" :ellipsis="true" />
            <a-table-column key="weight" title="重量(kg)" data-index="weight" align="center" :ellipsis="true" />
            <a-table-column key="garbage_bag_number" title="垃圾袋编码" data-index="garbage_bag_number" align="center" :ellipsis="true" />
            <a-table-column key="create_time" title="投放时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="inspection_results" title="巡检结果" data-index="inspection_results" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                {{ record.inspection_results === 1 ? "合格" : "不合格" }}
              </template>
            </a-table-column>
            <a-table-column key="integral" title="积分" data-index="integral" align="center" :ellipsis="true" />
            <a-table-column key="note" title="备注" data-index="note" align="center" :ellipsis="true" />
            <a-table-column key="pic_url" title="图片" data-index="pic_url" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <img :src="$com.showUpload() + item" v-for="(item, key) in record.pic_url" :key="key" class="list_pics" @click="showPicture(item)" />
              </template>
            </a-table-column>
            <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" hideOnSinglePage show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "CommunityManagement",
  data() {
    return {
      user_name: "",
      selectedRowKeys: [],
      delLoading: false,
      plot_name: "",
      garbage_bag_number: "",
      phone: "",
      street: "",
      community: "",
      Inspection_results: undefined,
      type: undefined,
      file: "",
      category_id: undefined,
      categoryTypes: [],
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      resultType: undefined,
      inspectionResultTypes: [
        { value: 1, label: "合格" },
        { value: 2, label: "不合格" }
      ],
      dataSource: [], //小区管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      picUrl: null,
      previewVisible: false
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    this.getTableList()
    this.goodsCategorys()
  },
  methods: {
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    goodsCategorys() {
      this.$api.goodsCategorys().then(res => {
        this.categoryTypes = res.data.map(item => {
          item.value = item.id
          item.label = item.category_name
          return item
        })

        console.log(this.categoryTypes)
      })
    },
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
              that.getTableList()
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
        user_name: this.user_name || "",
        plot_name: this.plot_name || "",
        garbage_bag_number: this.garbage_bag_number || "",
        category_id: this.category_id || "",
        phone: this.phone || "",
        Inspection_results: this.Inspection_results || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getClassifiedPatrol(data).then(res => {
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
// #CommunityManagement {
//   padding: 30px;
// }

.list_pics {
  width: 30px;
  height: 30px;
}

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
