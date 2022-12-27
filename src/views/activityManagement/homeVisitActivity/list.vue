<template>
  <div id="CommunityManagement">
    <!-- 小区信息 -->
    <a-tabs v-model="tabValue" @change="tabChange">
      <a-tab-pane v-for="(item, key) in tabList" :key="key">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="flex-auto">
          <a-space class="flex-line" size="middle">
            <div>
              <span>活动主题：</span>
              <div class="dib"><a-input v-model="form.activityName" placeholder="请输入名称" allowClear /></div>
            </div>
            <div>
              <span>负责人：</span>
              <div class="dib"><a-input v-model="form.siteAccountName" placeholder="请输入街道" allowClear /></div>
            </div>
            <div>
              <span>审核人：</span>
              <div class="dib"><a-input v-model="form.examineName" placeholder="请输入社区" allowClear /></div>
            </div>
            <div>
              <span>小区：</span>
              <div class="dib"><a-input v-model="form.plotName" placeholder="请输入社区" allowClear /></div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
            <a-button type="primary" icon="plus" v-if="tabValue === 0" @click="option('add')">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <div class="btn-layer">
              <a-button type="primary" icon="check" :disabled="!hasSelected" :loading="authLoading" @click="checkActivity" v-if="tabValue === 0">审核</a-button>
              <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteActivity" v-if="tabValue === 3">删除</a-button>
              <a-button icon="stop" :disabled="!hasSelected" :loading="cancelLoading" @click="cancelActivity" v-if="tabValue === 0">取消</a-button>
            </div>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="activityName" title="活动主题" data-index="activityName" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a @click="option('detail', text, record.key)">{{ record.activityName }}</a>
                </template>
              </a-table-column>
              <a-table-column key="siteAccountName" title="负责人" data-index="siteAccountName" align="center" :ellipsis="true" />
              <a-table-column key="address" title="地址" data-index="address" align="center" :ellipsis="true" />
              <a-table-column key="plotName" title="小区" data-index="plotName" align="center" :ellipsis="true" />
              <a-table-column key="startTime" title="开始时间" data-index="startTime" align="center" :ellipsis="true" />
              <a-table-column key="endTime" title="结束时间" data-index="endTime" align="center" :ellipsis="true" />
              <a-table-column key="picUrl" title="图片" data-index="picUrl" align="center" :ellipsis="true" class="flex-center">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="$com.showUpload() + item" v-for="(item, key) in record.picUrl && record.picUrl.split(',')" :key="key" @click="showPicture(item)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="createName" title="创建人" data-index="createName" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div style="display:flex;flex-wrap:wrap">
                    <div><a-button type="link" size="small" @click="option('copy', text, record.key)">复制活动</a-button></div>
                    <div>
                      <a-button type="link" size="small" @click="option('edit', text, record.key)" v-if="tabValue === 0" :disabled="record.state === 11">编辑</a-button>
                    </div>
                    <div>
                      <a-button type="link" size="small" @click="option('over', text, record.key)" v-if="tabValue === 1" :disabled="record.state !== 10 && record.giftState === 1">结束</a-button>
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
  name: "homeVisitActivity",
  data() {
    return {
      form: {
        activityName: undefined,
        siteAccountName: undefined,
        examineName: undefined,
        plotName: undefined
      },
      selectedRowKeys: [],
      tabValue: 0,
      activityType: 2,
      delLoading: false,
      authLoading: false,
      cancelLoading: false,
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      btnValue: 1,
      tabList: [
        { name: "已创建", value: [1, 2, 11, -1], num: null },
        { name: "已开启", value: [3, 8, 9, 10, -2], num: null },
        { name: "已结束", value: 4, num: null },
        { name: "已取消", value: 5, num: null }
      ],
      picUrl: null,
      previewVisible: false,
      tab: 0
    }
  },
  computed: {
    ...mapGetters(["getTab"]),
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted() {
    this.tabValue = this.getTab
    //获取列表
    this.getTableList()
  },
  methods: {
    ...mapMutations(["setTab"]),
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    tabChange(e) {
      // this.tab = e
      // this.selectedRowKeys = []
      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    // 表格选择项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    cancelActivity() {
      let that = this
      let validId = []
      this.dataSource.map(e => {
        if (this.selectedRowKeys.includes(e.id) && e.state !== 11) {
          validId = [...validId, e.id]
        }
      })
      this.selectedRowKeys = validId
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
            .cancelActivity({ id: that.selectedRowKeys, activityType: that.activityType })
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
          that.authLoading = true
          that.$api
            .checkActivity({ id: that.selectedRowKeys, activityType: that.activityType })
            .then(res => {
              that.authLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.authLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
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
    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        state: this.tabList[this.tabValue].value,
        pageNum: this.page,
        activityType: this.activityType
      }
      Object.keys(this.form).forEach(e => {
        if (this.form[e]) {
          data[e] = this.form[e]
        }
      })
      if (data) this.tableLoading = true
      this.$api.activityList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
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
      let activityType = this.activityType
      let oneData = []
      if (key) {
        oneData = this.dataSource.filter(item => {
          return item.id === key
        })
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
      localStorage.removeItem("homeVisitActivity")
      this.setTab(type === "add" || type === "copy" ? 0 : type === "resupply" ? 1 : this.tabValue)
      if (oneData.length && ![1, 2].includes(oneData[0].state) && oneData[0].giftState === 1 && type === "edit") {
        this.$message.error("礼品" + (oneData.state === 8 ? "运营已签收" : oneData.state === 11 ? "已出库" : "") + "不能编辑!")
        return
      }
      this.$router.push({
        name: type === "detail" ? "PromotionalActivityDetail" : "HomeVisitActivityEdit",
        query: { type, id: key, activityType }
      })
      if (type === "resupply") {
        this.$router.push({
          name: "HomeVisitActivityGiftInfo",
          query: { type, id: key, activityType }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.btn-layer {
  display: flex;
  button {
    margin-right: 10px;
  }
  margin-top: 10px;
}

.tab-cont {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.add-btn {
  margin: 10px 0 0 0;
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

.flex-center {
  display: flex;
  justify-content: center;
}
</style>
