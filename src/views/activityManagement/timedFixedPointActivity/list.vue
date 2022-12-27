<template>
  <div id="TimedFixedPointActivity">
    <!-- 定时定点活动 -->
    <a-tabs v-model="tabValue" @change="tabChange">
      <a-tab-pane v-for="(item, key) in tabList" :key="key">
        <span slot="tab">
          <span style="font-size: 16px; vertical-align: middle">{{ item.name }}</span>
        </span>
        <div class="flex-auto">
          <a-space class="flex-line" size="middle">
            <div>
              <span>活动主题：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入活动主题" v-model="searchform.activityName" allowClear />
              </div>
            </div>
            <div>
              <span>负责人：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入负责人" v-model="searchform.siteAccountName" allowClear />
              </div>
            </div>
            <div>
              <span>审核人：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入审核人" v-model="searchform.examineName" allowClear />
              </div>
            </div>
            <div>
              <span>地址：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入地址" v-model="searchform.address" allowClear />
              </div>
            </div>
            <div>
              <span>小区：</span>
              <div class="dib">
                <!-- 模糊搜索 -->
                <a-input placeholder="请输入小区" v-model="searchform.plotName" allowClear />
              </div>
            </div>
            <a-button type="primary" @click="getTableList(1)" :loading="tableLoading">搜索</a-button>
            <a-button type="primary" icon="plus" @click="option('add')" v-if="tabValue === 0">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" class="w100b">
            <a-space class="w100b mt20">
              <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteActivity" v-if="tabValue === 3">删除</a-button>
              <a-button icon="stop" :disabled="!hasSelected" v-if="tabValue === 0" @click="cancelActivity">取消</a-button>
            </a-space>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
              <a-table-column key="activityName" title="活动主题" data-index="activityName" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a @click="detail(record.key)">{{ record.activityName }}</a>
                </template>
              </a-table-column>
              <a-table-column key="siteAccountName" title="负责人" data-index="siteAccountName" align="center" :width="80" />
              <a-table-column key="address" title="地址" data-index="address" align="center" />
              <a-table-column key="plotName" title="小区" data-index="plotName" align="center" />
              <a-table-column key="startTime" title="开始时间" data-index="startTime" align="center" />
              <a-table-column key="endTime" title="结束时间" data-index="endTime" align="center" />
              <a-table-column key="picUrl" title="图片" data-index="picUrl" align="center">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="$com.showUpload() + item" v-for="(item, key) in record.picUrl && record.picUrl.split(',')" :key="key" @click="showPicture(item)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="examineName" title="审核人" data-index="examineName" align="center" :width="80" />
              <a-table-column key="createTime" title="创建时间" data-index="createTime" align="center" v-if="tabValue === 0 || tabValue === 3" />
              <a-table-column key="examineTime" title="审核时间" data-index="examineTime" align="center" v-if="tabValue === 2" />
              <a-table-column key="cancelTime" title="取消时间" data-index="cancelTime" align="center" v-if="tabValue === 4" />

              <a-table-column key="operation" title="操作" data-index="operation" align="center">
                <template slot-scope="text, record">
                  <div class="operation-btn">
                    <a-button type="link" size="small" @click="checkData(record)" v-if="tabValue === 0" :disabled="record.state !== 11 && record.giftState === 1">审核</a-button>
                    <a-button type="link" size="small" @click="option('edit', text, record.key)" v-if="tabValue === 0" :disabled="(record.state === 8 || record.state === 11) && record.giftState === 1"
                      >编辑</a-button
                    >
                    <a-button type="link" size="small" @click="option('copy', text, record.key)">复制活动</a-button>
                    <a-button type="link" size="small" @click="option('over', text, record.key)" v-if="tabValue === 1" :disabled="record.state !== 10 && record.giftState === 1">结束</a-button>
                    <a-button
                      type="link"
                      size="small"
                      @click="option('resupply', text, record.key)"
                      v-if="tabValue === 1"
                      :disabled="(record.state == 10 && record.flag === true) || (record.state !== 10 && record.flag === false)"
                      >礼品补单</a-button
                    >
                  </div>
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
    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" style="width: 100%" :src="previewImage" /></div>
    </a-modal> -->
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
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
import { mapGetters, mapMutations } from "vuex"
export default {
  name: "TimedFixedPointActivity",
  data() {
    return {
      tabList: [
        { name: "已创建", value: [1, 2, 11, -1], num: null },
        { name: "已开启", value: [3, 8, 9, 10, -2], num: null },
        { name: "已结束", value: 4, num: null },
        { name: "已取消", value: 5, num: null }
      ],
      searchform: {
        activityName: undefined,
        siteAccountName: undefined,
        examineName: undefined,
        address: undefined
      },
      plotName: "",
      tabValue: 0,
      activityType: 4,
      previewImage: "",
      activity_name: "",
      site_account_name: "",
      operator_name: "",
      address: "",
      dataSource: [], // 表格数据
      selectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格
      delLoading: false,
      cancelLoading: false,
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
      confirmLoading: false,
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
    //获取列表
    this.tabValue = this.getTab
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
    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        state: this.tabList[this.tabValue].value,
        pageNum: this.page,
        activityType: this.activityType,
        plotName: this.plotName
      }
      Object.keys(this.searchform).forEach(e => {
        if (this.searchform[e]) {
          data[e] = this.searchform[e]
        }
      })
      console.log(this.tabList[this.tabValue].value, "==========")

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
      this.setTab(type === "add" || type === "copy" ? 0 : this.tabValue)
      this.$router.push({
        name: "TimedFixedPointActivityEdit",
        query: { type, id: key, activityType: this.activityType },
        params: { data: oneData[0] }
      })
    },
    detail(key = "") {
      this.setTab(this.tabValue)
      let activityType = this.activityType
      this.$router.push({
        name: "TimedFixedPointActivityDetail",
        query: { id: key, activityType }
      })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    tabChange(e) {
      this.selectedRowKeys = []
      this.dataSource = []
      this.page = 1
      setTimeout(() => {
        this.getTableList()
      }, 500)
    },
    // 取消
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
    checkData(record) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定激活定时定点活动吗?",
        onOk() {
          that.tableLoading = true
          that.$api
            .checkActivity({ id: [record.id], activityType: that.activityType })
            .then(res => {
              that.tableLoading = false
              that.getTableList()
              that.$message.info(res.msg)
            })
            .catch(err => {
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
</style>
