<template>
  <div id="CommunityManagement">
    <!-- 小区信息 -->
    <a-tabs v-model="tabValue" @change="tabChange">
      <a-tab-pane v-for="(item, key) in tabList" :key="key">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <!-- <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" /> -->
        </span>
        <div class="flex-auto">
          <a-space class="flex-line" size="middle">
            <div class="in-line">
              <span>活动主题：</span>
              <div class="dib"><a-input v-model="searchform.activityName" placeholder="请输入活动主题" allowClear /></div>
            </div>
            <div class="in-line">
              <span>负责人：</span>
              <div class="dib"><a-input v-model="searchform.siteAccountName" placeholder="请输入负责人" allowClear /></div>
            </div>
            <div class="in-line">
              <span>审核人：</span>
              <div class="dib"><a-input v-model="searchform.examineName" placeholder="请输入审核人" allowClear /></div>
            </div>
            <div class="in-line">
              <span>小区：</span>
              <div class="dib"><a-input v-model="searchform.plotName" placeholder="请输入小区名称" allowClear /></div>
            </div>
            <div class="in-line">
              <span>地址：</span>
              <div class="dib"><a-input v-model="searchform.address" placeholder="请输入地址" allowClear /></div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)" class="mr10">搜索</a-button>
            <a-button type="primary" v-if="tabValue === 0" icon="plus" @click="option('add')">新增</a-button>
          </a-space>
        </div>
        <div class="oh">
          <a-space direction="vertical">
            <div class="operate-btn">
              <a-button type="primary" icon="check" :disabled="!hasSelected" :loading="checkLoading" @click="checkActivity" v-if="tabValue === 0">审核</a-button>
              <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteActivity" v-if="tabValue === 3">删除</a-button>
              <a-button icon="stop" :disabled="!hasSelected" :loading="cancelLoading" @click="cancelActivity" v-if="tabValue === 0">取消</a-button>
            </div>
            <a-table
              size="middle"
              :rowClassName="tableRowClassName"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :data-source="dataSource"
              :pagination="false"
              :loading="tableLoading"
            >
              <a-table-column key="activityName" title="活动主题" data-index="activityName" align="center" :ellipsis="true" class="w200">
                <template slot-scope="text, record">
                  <a @click="option('detail', text, record.key)">{{ record.activityName }}</a>
                </template>
              </a-table-column>
              <a-table-column key="siteAccountName" title="负责人" data-index="siteAccountName" align="center" :ellipsis="true" />
              <a-table-column key="address" title="地址" data-index="address" align="center" :ellipsis="true" />
              <a-table-column key="plotName" title="小区" data-index="plotName" align="center" :ellipsis="true" />
              <a-table-column key="startTime" title="开始时间" data-index="startTime" align="center" :ellipsis="true" />
              <a-table-column key="endTime" title="结束时间" data-index="endTime" align="center" :ellipsis="true" />
              <a-table-column key="picUrl" title="图片" data-index="picUrl" align="center">
                <template slot-scope="text, record" class="picurl-list">
                  <div class="picurl-list">
                    <img :src="$com.showUpload() + item" v-for="(item, key) in record.picUrl && record.picUrl.split(',')" :key="key" @click="showPicture(item)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="examineName" title="审核人" data-index="examineName" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true" class="w150">
                <template slot-scope="text, record">
                  <div style="btn-ctrl">
                    <div><a-button type="link" size="small" @click="option('copy', text, record.key)">复制活动</a-button></div>
                    <div>
                      <a-button
                        type="link"
                        size="small"
                        @click="option('edit', text, record.key)"
                        v-if="tabValue === 0"
                        :disabled="(record.state === 8 || record.state === 11) && record.giftState === 1"
                        >编辑</a-button
                      >
                    </div>
                    <div>
                      <a-button
                        type="link"
                        size="small"
                        @click="option('resupply', text, record.key)"
                        v-if="tabValue === 1"
                        :disabled="(record.state == 10 && record.flag === true) || (record.state !== 10 && record.flag === false)"
                        >礼品补单</a-button
                      >
                    </div>
                    <div>
                      <a-button type="link" size="small" @click="option('over', text, record.key)" v-if="tabValue === 1" :disabled="record.state !== 10 && record.giftState === 1">结束</a-button>
                    </div>
                  </div>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default {
  name: "CommunityManagement",
  computed: {
    ...mapGetters(["getTab"]),
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  data() {
    return {
      searchform: { activityName: undefined, siteAccountName: undefined, examineName: undefined, plotName: undefined, address: undefined },
      tabList: [
        { name: "已创建", value: [1, 2, 11, -1], tabName: "create" }, // 这里的状态-1是辅助判断11属于何种标签。非真实可查询的字段
        { name: "已开启", value: [3, 8, 9, 10, 11, -2], tabName: "begin" }, // 这里的状态-2是辅助判断11属于何种标签。非真实可查询的字段
        { name: "已结束", value: 4, tabName: "over" },
        { name: "已取消", value: 5, tabName: "cancel" }
      ],
      tabValue: 0,
      selectedRowKeys: [],
      checkLoading: false,
      delLoading: false,
      cancelLoading: false,
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
      dataSource: [], //小区管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      activityType: 1,
      warningRowId: null,
      picUrl: null,
      previewVisible: false,
      tab: 0
    }
  },
  created() {
    //获取列表
  },
  mounted() {
    this.tabValue = this.getTab
    this.getTableList()
  },
  methods: {
    ...mapMutations(["setTab"]),
    // 预览大图
    getCheckboxProps() {
      return {
        props: {
          disabled: this.dataSource.some(item => item.state === 3 || item.state === 9)
        }
      }
    },
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    tableRowClassName(row) {
      if (row.id === this.warningRowId) {
        return "row-warning"
      }
    },
    tabChange(e) {
      // this.selectedRowKeys = []
      // console.log('e', e)
      // this.tab = e

      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    // 表格选择项
    onSelectChange(selectedRowKeys) {
      if (this.warningRowId && !this.selectedRowKeys.includes(this.warningRowId)) {
        this.warningRowId = null
      }
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除
    deleteActivity() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .deleteActivity({ id: that.selectedRowKeys, activityType: that.activityType })
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
    // 审核
    checkActivity() {
      let that = this
      let validId = []
      this.dataSource.map(e => {
        if (this.selectedRowKeys.includes(e.id) && ((e.giftState === 1 && e.state === 11) || e.giftState === 0)) {
          validId = [...validId, e.id]
        }
      })
      this.selectedRowKeys = validId
      if (!validId.length) {
        that.$message.error("请先出库活动礼品")
        return
      }
      this.$confirm({
        title: "请确认",
        content: "确定审核选中数据吗?",
        onOk() {
          that.checkLoading = true
          that.$api
            .checkActivity({ id: that.selectedRowKeys, activityType: that.activityType })
            .then(res => {
              that.checkLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.warningRowId = err.data
              that.checkLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 取消
    cancelActivity() {
      let validId = []
      this.dataSource.map(e => {
        if (this.selectedRowKeys.includes(e.id) && e.state !== 11) {
          validId = [...validId, e.id]
        }
      })
      this.selectedRowKeys = validId
      let that = this
      if (!validId.length) {
        that.$message.error("不符合取消条件")
        return
      }
      this.$confirm({
        title: "请确认",
        content: "确定取消选中数据吗?",
        onOk() {
          that.cancelLoading = true
          that.$api
            .cancelActivity({ id: validId, activityType: that.activityType })
            .then(res => {
              that.cancelLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.cancelLoading = false
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
        state: this.tabList[this.tabValue].value,
        pageNum: this.page,
        activityType: this.activityType
        // tab: this.tab
      }
      Object.keys(this.searchform).forEach(e => {
        if (this.searchform[e]) {
          data[e] = this.searchform[e]
        }
      })
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
      let that = this
      let oneData = []
      let activityType = this.activityType
      if (key) {
        oneData = this.dataSource.filter(item => {
          return item.id === key
        })
      }
      if (oneData.length && ![1, 2].includes(oneData[0].state) && oneData[0].giftState === 1 && type === "edit") {
        this.$message.error("礼品" + (oneData.state === 8 ? "运营已签收" : oneData.state === 11 ? "已出库" : "") + "不能编辑!")
        return
      }
      if (type === "over") {
        this.$confirm({
          title: "结束",
          content: "确认结束活动吗?",
          onOk() {
            that.$api
              .endActivity({ id: [key] })
              .then(res => {
                that.selectedRowKeys = []
                that.setTab(2)
                that.tabValue = that.getTab
                that.getTableList()
              })
              .catch(err => {})
          },
          onCancel() {
            that.$message.info("已取消")
          }
        })
        return
      }
      this.setTab(type === "add" || type === "copy" ? 0 : type === "resupply" ? 1 : this.tabValue)
      this.$router.push({
        name: type === "detail" ? "PromotionalActivityDetail" : "PromotionalActivityEdit",
        query: { type, id: key, activityType, tabName: this.tabList[this.tabValue].tabName }
      })
    }
  }
}
</script>

<style scoped lang="less">
// #CommunityManagement {
//   padding: 30px;
// }
.operate-btn {
  display: flex;
  margin-top: 10px;
  button {
    margin-right: 10px;
  }
}

.in-line {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  span {
    display: flex;
    white-space: nowrap;
  }
}

.picurl-list {
  height: 50px;
  width: 50px;
  overflow: hidden;
  margin: 0 auto;
  img {
    max-width: 50px;
    max-height: 50px;
  }
}
.menu-mb {
  margin-bottom: 10px;
}

.btn-ctrl {
  display: flex;
  justify-content: center;
}

.add-btn {
  margin: 10px 0 0 0;
}
</style>
<style>
.ant-table-tbody > tr.ant-table-row-selected.row-warning td {
  background-color: #fff2e8;
}
</style>
