<template>
  <div id="CommunityManagement">
    <!-- 小区信息 -->
    <a-tabs v-model="tabValue" @change="tabChange">
      <a-tab-pane v-for="(item, key) in tabList" :key="key">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
        </span>
        <div class="flex-auto">
          <a-space class="flex-line" size="middle">
            <div>
              <span>订单号：</span>
              <div class="dib"><a-input v-model="searchform.activityNo" placeholder="请输入订单号" allowClear /></div>
            </div>
            <div>
              <span>客户：</span>
              <div class="dib"><a-input v-model="searchform.userName" placeholder="请输入客户" allowClear /></div>
            </div>
            <div>
              <span>电话：</span>
              <div class="dib"><a-input v-model="searchform.userPhone" placeholder="请输入电话" :maxLength="11" allowClear @change="e => checkInput('phone', e)" /></div>
            </div>
            <div>
              <span>时间：</span>
              <div class="dib">
                <a-range-picker v-model="dateString" @change="onChange" allowClear />
              </div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
            <a-button type="primary" v-if="tabValue === 0" icon="plus" @click="option('add')">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <div class="operate-btn">
              <a-button type="primary" icon="check" :disabled="!hasSelected" :loading="checkLoading" @click="dispatchActivity" v-if="tabValue === 0">派单</a-button>
              <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteActivity" v-if="tabValue === 4">删除</a-button>
              <a-button icon="stop" :disabled="!hasSelected" :loading="cancelLoading" @click="cancelActivity" v-if="tabValue === 0 || tabValue === 1">取消</a-button>
            </div>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="activityNo" title="订单号" data-index="activityNo" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a @click="option('detail', text, record.key)">{{ record.activityNo }}</a>
                </template>
              </a-table-column>
              <a-table-column key="userName" title="客户" data-index="userName" align="center" :ellipsis="true" />
              <a-table-column key="userPhone" title="电话" data-index="userPhone" align="center" :ellipsis="true" />
              <a-table-column key="goodsName" title="回收物品" data-index="goodsName" align="center" :ellipsis="true" />
              <a-table-column key="address" title="回收地址" data-index="address" align="center" :ellipsis="true" />
              <a-table-column key="startTime" title="预约时间" data-index="startTime" align="center" :ellipsis="true" />
              <a-table-column key="remark" title="备注" data-index="remark" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
              <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true" v-if="tabValue === 0">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="option('edit', text, record.key)" v-if="tabValue === 0">编辑</a-button>
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

    <a-modal :title="modelTitle" :visible="dispatchVisible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="dispatchVisible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="leaderId" label="负责人" prop="leaderId" has-feedback>
          <a-select v-model="form.leaderId" :options="leaderList" placeholder="请选择负责人" allowClear show-search :filterOption="filteredOptions" @change="data => select('leader', data)" />
        </a-form-model-item>
        <a-form-model-item ref="memberId" label="成员" prop="memberId" has-feedback>
          <a-select v-model="form.memberId" :options="memberList" mode="multiple" :filter-option="$com.filterOption" placeholder="请选择活动成员" @change="data => select('member', data)" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default {
  name: "CommunityManagement",
  data() {
    return {
      dateString: [],
      tabList: [
        { name: "已创建", value: 1, num: null },
        { name: "已分配", value: 2, num: null },
        { name: "已接单", value: 3, num: null },
        { name: "已完成", value: 4, num: null },
        { name: "已取消", value: 5, num: null }
      ],
      searchform: {
        activityNo: undefined,
        userName: undefined,
        userPhone: undefined,
        startTime: undefined
      },
      modelTitle: "派单",
      tabValue: 0,
      selectedRowKeys: [],
      checkLoading: false,
      delLoading: false,
      cancelLoading: false,
      oriPersonList: [],
      allPersonList: [],
      leaderList: [],
      memberList: [],
      rules: { leaderId: [{ required: true, message: "请选择负责人", trigger: ["blur", "change"] }], memberId: [{ required: true, message: "请选择成员", trigger: ["blur", "change"] }] },
      confirmLoading: false,
      form: { leaderId: undefined, memberId: [] },
      dispatchVisible: false,
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      activityType: 3
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
    this.getMemberList()
  },
  methods: {
    ...mapMutations(["setTab"]),
    filteredOptions(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    checkInput(checkType, e) {
      this.searchform.userPhone = this.searchform.userPhone.replace(/[^0-9]/, "")
      if (this.searchform.userPhone.length === 11 && !/^[1][3-9][\d]{9}$/.test(this.searchform.userPhone)) {
        this.$set(this.searchform, "userPhone", undefined)
      }
    },
    onChange(date, dateString) {
      this.searchform.startTime = dateString[0]
      this.searchform.endTime = dateString[1]
    },
    select(type, data) {
      let _listType = type === "member" ? "leader" : "member"
      let _this = this
      if (type === "member") {
        this[_listType + "List"] = _this.allPersonList.filter(e => {
          return Array.isArray(data) && !data.includes(e.value)
        })
        this[type + "List"] = _this.allPersonList.filter(e => {
          return _this.form[_listType + "Id"] != e.value
        })
      } else {
        this[_listType + "List"] = _this.allPersonList.filter(e => {
          return data != e.value && !_this.form[_listType + "Id"].includes(e.value)
        })
      }
    },
    getMemberList() {
      let _this = this
      this.$api
        .memberList()
        .then(res => {
          _this.oriPersonList = res.data.filter(e => {
            e.label = e.accountName
            e.value = e.id
            delete e.accountName
            delete e.id
            return e
          })
          _this.allPersonList = _this.oriPersonList
          _this.memberList = _this.allPersonList
          _this.leaderList = _this.allPersonList
        })
        .catch(err => {})
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api
            .dispatchActivity({
              id: this.selectedRowKeys,
              leaderId: this.form.leaderId,
              memberId: this.form.memberId
            })
            .then(res => {
              this.getTableList()
              this.dispatchVisible = false
            })
            .catch(err => {
              this.dispatchVisible = false
            })
        }
      })
    },
    tabChange(e) {
      // this.selectedRowKeys = []
      this.page = 1
      this.getTableList()
    },
    // 表格选择项
    onSelectChange(selectedRowKeys) {
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
    dispatchActivity() {
      this.dispatchVisible = true
    },
    // 派单
    checkActivity() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定派单吗?",
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
      let that = this
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

    // 获取小区管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        state: this.tabList[this.tabValue].value,
        pageNum: this.page
      }
      Object.keys(this.searchform).forEach(e => {
        if (this.searchform[e]) {
          if (e === "startTime" || e === "endTime") {
            data[e] = this.searchform[e]
          } else {
            data[e] = this.searchform[e]
          }
        }
      })
      this.tableLoading = true
      this.$api.getActivity(data).then(res => {
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
      let activityType = this.activityType
      this.setTab(type === "add" || type === "copy" ? 0 : this.tabValue)
      this.$router.push({
        name: type === "detail" ? "PromotionalActivityDetail" : "OnsiteRecyclingActivityEdit",
        query: { type, id: key, activityType }
      })
    }
  }
}
</script>

<style scoped lang="less">
.operate-btn {
  display: flex;
  margin-top: 10px;
  button {
    margin-right: 10px;
  }
}
</style>
