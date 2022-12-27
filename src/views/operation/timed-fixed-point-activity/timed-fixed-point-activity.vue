<template>
  <div id="TimedFixedPointActivity">
    <!-- 定时定点活动 -->
    <a-tabs v-model="tabValue" @change="tabChange">
      <a-tab-pane v-for="(item, key) in tabList" :key="key">
        <span slot="tab">
          <span style="font-size: 16px; vertical-align: middle">{{ item.name }}</span>
        </span>
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>活动主题：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入活动主题" v-model="activity_name" allowClear />
              </div>
            </div>
            <div>
              <span>负责人：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入负责人" v-model="site_account_name" allowClear />
              </div>
            </div>
            <div>
              <span>审核人：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入审核人" v-model="operator_name" allowClear />
              </div>
            </div>
            <div>
              <span>地址：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入地址" v-model="address" allowClear />
              </div>
            </div>

            <a-button class="m10" type="primary" @click="getTableList(1)" :loading="tableLoading">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button type="primary" icon="plus" @click="option('add')" v-if="tabValue === 0">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" class="w100b">
            <a-space class="w100b mt20">
              <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="delectData" v-if="tabValue === 0">删除</a-button>
              <a-button type="primary" :disabled="!hasSelected" v-if="tabValue === 0 || tabValue === 2" @click="cancelData">取消</a-button>
            </a-space>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
              <a-table-column key="activity_name" title="活动主题" data-index="activity_name" align="center" :width="100" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="detail(record.key)">{{ record.activity_name }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="site_account_name" title="负责人" data-index="site_account_name" align="center" :width="80" />
              <a-table-column key="address" title="地址" data-index="address" align="center" :width="150" />
              <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :width="100" />

              <a-table-column key="start_time" title="开始时间" data-index="start_time" align="center" :width="120" />
              <a-table-column key="end_time" title="结束时间" data-index="end_time" align="center" :width="120" />
              <a-table-column key="pic_url" title="图片" data-index="pic_url" align="center" :ellipsis="true" :width="50">
                <template slot-scope="pic_url">
                  <img class="img" @click="showPicture(pic_url)" :src="pic_url ? $com.showUpload() + pic_url : ''" />
                </template>
              </a-table-column>
              <a-table-column key="examine_name" title="审核人" data-index="examine_name" align="center" :width="80" />
              <a-table-column key="create_time" title="创建时间" data-index="create_time" align="center" :width="120" v-if="tabValue === 0 || tabValue === 3" />
              <a-table-column key="examine_time" title="审核时间" data-index="examine_time" align="center" :width="120" v-if="tabValue === 2" />
              <a-table-column key="cancel_time" title="取消时间" data-index="cancel_time" align="center" :width="120" v-if="tabValue === 4" />

              <a-table-column key="operation" title="操作" data-index="operation" align="center" :width="180" fixed="right">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="checkData(record)" v-if="tabValue === 0" :disabled="record.state !== 1">审核</a-button>
                  <a-button type="link" size="small" @click="option('edit', text, record.key)" v-if="tabValue === 0 || tabValue === 0">编辑</a-button>
                  <a-button type="link" size="small" @click="option('copy', text, record.key)">复制活动</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30 mb20">
              <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" style="width: 100%" :src="previewImage" /></div>
    </a-modal>
    <!-- 复制活动弹窗 -->
    <!-- <a-modal title="活动复制" :visible="copyVisible" :confirm-loading="confirmLoading" @ok="copyOk" @cancel="copyCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="start_time" label="开始时间：" prop="start_time" has-feedback>
          <a-date-picker v-model="form.start_time" show-time placeholder="请选择开始时间" />
        </a-form-model-item>
        <a-form-model-item ref="end_time" label="结束时间：" prop="end_time" has-feedback>
          <a-date-picker v-model="form.end_time" show-time placeholder="请选择结束时间" />
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
  </div>
</template>

<script>
export default {
  name: "TimedFixedPointActivity",
  data() {
    return {
      tabList: [
        { name: "已创建", value: 1, num: null },
        { name: "已开启", value: [2, 3], num: null },
        { name: "已结束", value: 4, num: null },
        { name: "已取消", value: 5, num: null }
      ],
      tabValue: 0,
      activityType: 4,
      previewImage: "",
      previewVisible: false,
      activity_name: "",
      site_account_name: "",
      operator_name: "",
      address: "",

      dataSource: [], // 表格数据
      selectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格
      delLoading: false,
      page: 1,
      total: 0,

      delVisible: false,
      delText: "确定要删除定时定点活动吗？",
      cancelVisible: false,
      cancelText: "确定要取消定时定点活动吗？",
      disabled: false,

      //复制活动弹窗
      // copyVisible: false,
      form: {
        // id:1,
        start_time: undefined,
        end_time: undefined
      },

      id: -1,
      confirmLoading: false
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
  },
  methods: {
    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        state: this.tabList[this.tabValue].value,
        pageNum: this.page,
        activityType: this.activityType
      }
      this.tableLoading = true
      this.$api.activityList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          // item.pic_url = this.$com.showUpload() + item.pic_url
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
        name: "TimedFixedPointActivityEdit",
        query: { type, id: key, activityType: 4 },
        params: { data: oneData[0] }
      })
    },
    detail(key = "") {
      this.$router.push({
        name: "TimedFixedPointActivityDetail",
        query: { id: key }
      })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 查看图片
    showPicture(picture_url = "") {
      console.log(picture_url, "picture_url")
      this.previewImage = this.$com.showUpload() + picture_url
      this.previewVisible = true
    },

    tabChange(e) {
      this.selectedRowKeys = []
      this.dataSource = []
      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },

    // 表格删除
    delectData(state) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除该定时定点活动吗?",
        onOk() {
          that.delLoading = true
          that.tableLoading = true
          that.$api
            .dealActivity({ id: that.selectedRowKeys, state: 7 })
            .then(res => {
              that.delLoading = false
              that.tableLoading = false
              that.getTableList()
              that.$message.info(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
              that.tableLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 表格取消
    cancelData(state) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定取消该定时定点活动吗?",
        onOk() {
          that.delLoading = true
          that.tableLoading = true
          that.$api
            .dealActivity({ id: that.selectedRowKeys, state: 5 })
            .then(res => {
              that.delLoading = false
              that.tableLoading = false
              that.getTableList()
              that.$message.info(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
              that.tableLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 审核
    checkData(record) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定激活定时定点活动吗?",
        onOk() {
          that.$api
            .checkActivity({ id: record.id })
            .then(res => {
              that.tableLoading = false
              that.getTableList()
              that.$message.info(res.msg)
            })
            .catch(err => {
              that.delLoading = false
              that.tableLoading = false
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

<style lang="less">
#TimedFixedPointActivity {
  .img {
    height: 24px;
  }
}
</style>
