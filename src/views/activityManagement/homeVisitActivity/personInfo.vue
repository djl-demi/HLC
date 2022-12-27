<template>
  <div id="TimedFixedPointActivityOperation">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">
            人员信息
          </div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="siteAccountId" label="负责人" prop="siteAccountId" has-feedback>
            <a-select :value="form.siteAccountId" :options="responsiblerList" style="width: 100%" :disabled="disabled" placeholder="请选择负责人" allowClear @change="changeSiteAccount"></a-select>
          </a-form-model-item>
          <a-form-model-item ref="userType" label="居民类型:" prop="userType" has-feedback>
            <a-select :value="form.userType" :options="userTypeList" placeholder="请选择居民类型" allowClear @change="changeUserType" />
          </a-form-model-item>
          <a-form-model-item ref="supervisorDataSource" label="指导员：" prop="supervisorDataSource">
            <a-button type="primary" @click="showSupervisor">请选择指导员</a-button>
          </a-form-model-item>
          <a-form-model-item ref="supervisorSelected" label="已选择的指导员" prop="supervisorSelected">
            <a-button type="primary" @click="option('del')">删除</a-button>
            <a-table
              size="middle"
              :row-selection="{ selectedRowKeys: supervisorSelectedRowKeys, onChange: e => onSelectChange(e, 'supervisor') }"
              :data-source="form.supervisorDataSource"
              :pagination="false"
              :loading="tableLoading"
              style="width: 500px;"
            >
              <a-table-column key="accountName" title="姓名" data-index="accountName" align="center" width="80px" :ellipsis="true" />
              <a-table-column key="account" title="电话" data-index="account" align="center" :ellipsis="true" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center">
                <template slot-scope="text, record">
                  <div class="ctrl-line">
                    <a-button type="primary" @click="option('dispatchResidents', record)" class="mr10">分配居民</a-button>
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm">取消</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onNext('HomeVisitActivityGiftInfo')" :disabled="query.type === 'edit' && ![1, 2].includes(state)">下一步</a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 指导员弹窗 -->
    <a-modal :visible="supervisorVisible" :confirm-loading="confirmLoading" width="600px" @ok="handleOk('supervisor')" @cancel="handleCancel('supervisor')">
      <div class="memberList">
        <a-table
          size="middle"
          :row-selection="{ selectedRowKeys: memberSelectedRowKeys, onChange: e => onSelectChange(e, 'member') }"
          :data-source="memberList"
          :pagination="false"
          :loading="tableLoading"
        >
          <a-table-column key="accountName" title="姓名" data-index="accountName" align="center" :ellipsis="true" />
          <a-table-column key="account" title="电话" data-index="account" align="center" :ellipsis="true" />
        </a-table>
      </div>
    </a-modal>
    <!-- 分配居民弹窗 -->
    <a-modal :visible="dispatchResidentsVisible" :confirm-loading="confirmLoading" width="900px" @ok="handleOk('dispatchResidents')" @cancel="handleCancel('dispatchResidents')">
      <div class="p20">
        <a-form-model ref="ruleForm" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item ref="activity_name" label="指导员：" prop="activity_name1" has-feedback>
            {{ currentSupervisor && currentSupervisor.accountName }}
          </a-form-model-item>
          <a-form-model-item ref="activity_name" label="小区：" prop="activity_name2" has-feedback>
            <div>
              <div v-for="(item, key) in form.plotNames" :key="key">{{ item.plot_name }}</div>
            </div>
          </a-form-model-item>
          <a-form-model-item ref="activity_name" label="楼栋号：" prop="activity_name3" has-feedback>
            <a-tree checkable :tree-data="buildingNoList" :replace-fields="replaceFields" v-model="buildingNoListSelected" class="buildingNoList" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import difference from "lodash/difference"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "TimedFixedPointActivityOperation",
  components: {},
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      plotDisabled: false,
      disabled: false, //禁用
      filteredItems: [],
      form: {
        siteAccountId: undefined,
        plotNames: [],
        userType: undefined,
        supervisorDataSource: []
      },
      userTypeList: [
        { value: 1, label: "没有参与记录" },
        { value: 2, label: "月活跃居民" },
        { value: 3, label: "巡检不合格" },
        { value: 4, label: "活动指定时间内未参与" },
        { value: 5, label: "已投递智能桶" }
      ],
      currentSupervisor: null,
      buildingNoListSelected: undefined,
      garbageTypes: [],
      communityChartList: [], // 小区信息列表
      responsiblerList: [], //负责人列表
      memberList: [],
      type: "add", // 页面状态 编辑/新增
      giftVisible: false, //礼品弹窗
      materialVisible: false, //物料弹窗
      confirmLoading: false,
      previewImage: "",
      imgLoading: false,
      supervisorSelectedRowKeys: [],
      memberSelectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格
      supervisorDataSource: [],
      dataSource: [], //左侧表格数据
      targetKeys: [],
      showSearch: true,
      leftColumns: [
        {
          dataIndex: "gift_no",
          algin: "center",
          title: "礼品编号"
        },
        {
          dataIndex: "gift_name",
          algin: "center",
          title: "名称"
        },
        {
          dataIndex: "specs",
          algin: "center",
          title: "规格"
        },
        {
          dataIndex: "brand",
          algin: "center",
          title: "品牌"
        },
        {
          dataIndex: "number",
          algin: "center",
          title: "数量"
        },
        {
          dataIndex: "sell_price",
          algin: "center",
          title: "现金价格（元）"
        },
        {
          dataIndex: "integral_price",
          algin: "center",
          title: "积分价格"
        }
      ],
      rules: {
        siteAccountId: [{ required: true, message: "请选择负责人", trigger: "change" }],
        userType: [{ required: true, message: "请选择居民类型", trigger: "change" }],
        supervisorDataSource: [{ required: true, message: "请选择指导员", trigger: "change" }],
        supervisorSelected: [{ required: true, message: "", trigger: "change" }]
      },
      gift_id: "",
      state: "",
      supervisorVisible: false,
      page: 1,
      total: 1,
      dispatchResidentsVisible: false,
      treeData: [],
      buildingNoList: [],
      replaceFields: {
        children: "children",
        title: "label",
        key: "key"
      }
    }
  },
  async created() {
    // 如果是edit类型 并且有 id 就是编辑状态
    await this.getResponsiblerList()
    if ((this.query.type === "edit" || "copy") && this.query.id !== "") {
      await this.editShow()
    } else {
      this.show = true
    }
    let member_res = await this.getMemberList()
    if (member_res && member_res.data.length) {
      this.memberList = member_res.data.map(item => {
        item.key = item.id
        return item
      })
    }
    this.dataFill()
  },
  methods: {
    changeUserTypeList(userType) {
      this.getUserList(userType)
    },
    dataFill() {
      let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
      homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
      if (!homeVisitActivity) return
      Object.keys(this.form).forEach(e => {
        if (Object.prototype.hasOwnProperty.call(homeVisitActivity, e)) {
          this.form[e] = homeVisitActivity[e]
        }
      })
      let memberListFromlocal = []
      if (homeVisitActivity["instructor"]) {
        this.memberList.filter(e => {
          homeVisitActivity["instructor"].forEach(ee => {
            if (ee.instructorId === e.id) {
              memberListFromlocal.push({ ...e, instructorId: ee.instructorId, userId: ee.userId })
            }
          })
        })
      }
      this.form.supervisorDataSource = memberListFromlocal
    },
    changeUserType(data) {
      this.form.userType = data
    },
    changeSiteAccount(data) {
      this.form.siteAccountId = data
      this.responsiblerList.filter(e => {
        if (e.value === data) {
          this.form.siteAccountName = e.label
        }
      })
    },
    async getUserList() {
      let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
      homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
      if (!homeVisitActivity) return
      let plotId = homeVisitActivity.plotId
      let userType = this.form.userType
      if (!userType) {
        this.$message.error("请先选择居民类型")
        return
      }

      let res = await this.$api.getUserList({ userType, plotId })
      this.buildingNoList = []
      let data = res.data
      data.map((e, key) => {
        let item = { key: "main" + key, label: e.label, children: [] }

        e.children.map((ee, kk) => {
          item.children.push({ key: ee.value, label: ee.label })
        })
        this.buildingNoList.push(item)
      })
      return true
    },
    // 新增/编辑
    async option(type, record, key = "") {
      let _this = this

      // 表格删除
      if (type === "del") {
        this.$confirm({
          title: "请确认",
          content: "确定删除选中数据吗?",
          onOk() {
            _this.form.supervisorDataSource = _this.form.supervisorDataSource.filter(e => {
              return !_this.supervisorSelectedRowKeys.includes(e.id)
            })
          },
          onCancel() {
            _this.$message.info("已取消")
          }
        })
      } else {
        if (type === "dispatchResidents") {
          let res = await this.getUserList()
          if (!res) return
          this[type + "Visible"] = true
          this.checkTreedisable(record.id)
          this.currentSupervisor = record
          this.buildingNoListSelected = []
          this.form.supervisorDataSource.forEach(e => {
            if (e.id === record.id && e.userId) {
              this.buildingNoListSelected = e.userId
            }
          })
        }
      }
    },
    checkTreedisable(currentId) {
      let disableUserId = []
      this.form.supervisorDataSource.forEach(e => {
        if (e.id !== currentId && e.userId) {
          disableUserId = [...disableUserId, ...e.userId]
        }
      })
      this.buildingNoList.forEach(e => {
        let disableCount = 0
        e.children.forEach(ee => {
          if (disableUserId.includes(ee.key)) {
            ee.disableCheckbox = true
            disableCount++
          } else {
            ee.disableCheckbox = false
          }
        })
        e.disableCheckbox = e.children.length === disableCount ? true : false
      })
    },
    async getResponsiblerList() {
      let res = await this.$api.getResponsiblerList()
      this.responsiblerList = res.data.map(item => {
        item.label = item.account_name
        item.value = item.id
        return item
      })
    },
    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || this.$com.showUpload() + file.response.data.pic_url
      this.previewVisible = true
    },

    // 图片change
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.pic_url = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.pic_url = ""
      }
    },

    // 如果是编辑状态,需要恢复页面数据
    async editShow() {
      this.id = this.query.id || ""
      let res = await this.$api.activityDetails({ id: this.id }).catch(e => {
        return null
      })
      if (!res) return
      const data = res.data
      this.state = data.state
      Object.keys(this.form).forEach(e => {
        if (/startTime|endTime/.test(e)) {
          data[e] ? (this.form[e] = this.$moment(data[e])) : null
        } else if (/plotId/.test(e)) {
          this.form[e] = data[e]
            .toString()
            .split(",")
            .map(Number)
        } else if (/activityPeople/.test(e)) {
          this.form["accountId"] = []
          let person = data[e].split(",")
          this.memberList.forEach(e => {
            if (person.includes(e.label)) {
              this.form["accountId"].push(e.value)
            }
          })
          this.form["activityPeople"] = person
        } else {
          data[e] !== undefined ? (this.form[e] = data[e]) : null
        }
      })
    },
    checkValidForlocalStorage(data) {
      let { type, id } = this.query
      if (!data || (data && data.editTypeAndId !== type + id)) {
        localStorage.removeItem("homeVisitActivity")
        return null
      }
      return data
    },
    onNext(pageName) {
      let { type, id } = this.query
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
          homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
          homeVisitActivity = homeVisitActivity ? homeVisitActivity : {}
          this.responsiblerList.forEach(e => {
            if (e.value === this.form.siteAccountId) {
              homeVisitActivity["siteAccountId"] = e.value
              homeVisitActivity["siteAccountName"] = e.label
            }
          })
          homeVisitActivity["userType"] = this.form.userType
          let activityPeople = []
          let supervisorDataSource = []
          let accountId = []
          let hasDispatch = true
          this.form.supervisorDataSource.map(e => {
            if (!e.userId || (Array.isArray(e.userId) && !e.userId.length)) {
              if (hasDispatch) this.$message.error("请分配居民")
              hasDispatch = false
            }
            activityPeople.push(e.accountName)
            accountId.push(e.id)
            supervisorDataSource.push({ instructorId: e.id, userId: e.userId })
          })
          if (!hasDispatch) return

          homeVisitActivity["activityPeople"] = activityPeople.join(",")
          homeVisitActivity["instructor"] = supervisorDataSource
          homeVisitActivity["accountId"] = accountId.join(",")
          localStorage.setItem("homeVisitActivity", JSON.stringify(homeVisitActivity))
          this.$router.push({ name: pageName, query: { type, id } })
        }
      })
    },
    // 确定
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let that = this
          this.$confirm({
            // title: "省市区不对应",
            content: "请确认是否继续保存",
            okText: "继续保存",
            cancelText: "取消保存",
            icon: "info-circle",
            onOk() {
              that.sureSubmit()
            },
            onCancel() {
              that.$message.info("已取消")
            }
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 确认保存
    sureSubmit() {
      let activity_account = []
      let site_account = []
      this.responsiblerList.forEach(item => {
        this.form.activity_account.forEach(sitem => {
          if (item.id === sitem) {
            activity_account.push({
              account_id: item.id,
              account_name: item.account_name
            })
          }
        })
        this.form.site_account.forEach(sitem => {
          if (item.id === sitem) {
            site_account.push({
              account_id: item.id,
              account_name: item.account_name
            })
          }
        })
      })
      const data = {
        activity_name: this.form.activity_name || "",
        plot_id: this.form.plot_id || undefined,
        start_time: this.form.start_time ? this.$utils.forMatDate(this.form.start_time._d) : null,
        end_time: this.form.end_time ? this.$utils.forMatDate(this.form.end_time._d) : null,
        // site_account_id: this.form.site_account_id || undefined,
        warehouse: this.form.warehouse || "",
        activity_description: this.form.activity_description || "",
        site_account: site_account || [],
        activity_account: activity_account || [],
        pic_url: this.form.pic_url || "",
        activity_gift: this.form.activity_gift || []
      }

      //校验时间
      if (data.start_time > data.end_time) {
        this.$message.error("校验失败,请检查时间")
        return false
      }
      if (this.query.type === "edit") {
        // 编辑
        data.id = this.id
        this.$api.editActivity(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "TimedFixedPointActivity" })
          }, 1000)
        })
      } else if (this.query.type === "add" || this.query.type === "copy") {
        // 添加
        this.$api.addActivity(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "TimedFixedPointActivity" })
          }, 1000)
        })
      }
    },
    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
    // 表格选择
    onChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      //  如果往右移动 需要把select_number字段的值恢复为礼品初始数量
      if (direction === "right") {
        this.dataSource.forEach(item => {
          moveKeys.forEach(sitem => {
            if (item.key === sitem) {
              item.select_number = item.number
            }
          })
        })
      }
    },
    // 表格搜索过滤函数
    filterOption(inputValue, option) {
      return option.gift_name.indexOf(inputValue) > -1
    },
    // 表格选择
    onSelectChange(selectedRowKeys, type) {
      this[type + "SelectedRowKeys"] = selectedRowKeys
    },
    //指导员
    showSupervisor() {
      //获取列表
      this.supervisorVisible = true
    },
    async getMemberList() {
      let res = await this.$api.memberList()
      return res
    },
    //物料列表弹窗
    showMaterial() {
      //获取列表
      this.getTableList()
      this.materialVisible = true
    },
    // 获取礼品列表
    getTableList(page) {
      if (page) this.page = page
      this.tableLoading = true
      this.$api.activityGift().then(res => {
        this.dataSource = res.data.map(item => {
          item.key = item.id + ""
          item.title = item.gift_name
          item.select_number = item.number
          return item
        })
        // 设置应该选中的礼品
        this.targetKeys = []
        this.form.activity_gift.forEach(item => {
          this.dataSource.forEach(sitem => {
            if (item.gift_id === sitem.id) {
              sitem.select_number = item.number
            }
          })
          this.targetKeys.push(item.gift_id + "")
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    handleOk(popName) {
      this[popName + "Visible"] = false
      if (popName === "supervisor") {
        let supervisorSelect = this.memberList.filter(e => {
          return this.memberSelectedRowKeys.includes(e.id)
        })
        if (Array.isArray(supervisorSelect)) {
          supervisorSelect.forEach(e => {
            this.form.supervisorDataSource.forEach(ee => {
              if (ee.id === e.id && ee.userId) {
                e.userId = ee.userId
              }
            })
          })
        }

        this.form.supervisorDataSource = supervisorSelect
        this.$refs.supervisorDataSource.onFieldChange()
      }
      if (popName === "dispatchResidents") {
        let buildingNoListSelected = this.buildingNoListSelected.filter(e => {
          return !/main/.test(e)
        })
        this.form.supervisorDataSource.forEach(e => {
          if (e.id === this.currentSupervisor.id) {
            e.userId = buildingNoListSelected
          }
        })
      }
    },
    handleCancel(popName) {
      this[popName + "Visible"] = false
    }
  }
}
</script>

<style lang="less">
// #TimedFixedPointActivityOperation {

// }
.upImg {
  width: 100px;
  height: 100px;
}
.tips {
  line-height: 25px;
}

.ctrl-line {
  display: flex;
  justify-content: center;
}

.buildingNoList {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 33.3%;
  }
}

.memberList {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  margin: 20px;
}
</style>
