<template>
  <div id="TimedFixedPointActivityOperation">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">
            {{ activityType === 4 ? "定时定点活动" : "宣传活动" }}
          </div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="activityName" label="活动主题：" prop="activityName" has-feedback>
            <a-input v-model="form.activityName" placeholder="请输入活动主题" allowClear :disabled="query.type === 'resupply' ? true : false" />
          </a-form-model-item>
          <a-form-model-item ref="plotId" label="小区：" prop="plotId" has-feedback>
            <a-select
              v-model="form.plotId"
              :disabled="query.type === 'edit' || query.type === 'resupply' ? true : false"
              :options="communityChartList"
              mode="multiple"
              @change="handleChangePlot"
              :filter-option="$com.filterOption"
              placeholder="请选择小区"
              allowClear
            />
            <a-checkbox v-model="checkAll" class="checkbox" @change="allChange"> 全选 </a-checkbox>
          </a-form-model-item>
          <a-form-model-item ref="startTime" label="开始时间：" prop="startTime" has-feedback>
            <a-date-picker v-model="form.startTime" show-time placeholder="请选择开始时间" :disabled="query.type === 'resupply' ? true : false" format="YYYY-MM-DD HH:mm:ss" />
          </a-form-model-item>
          <a-form-model-item ref="endTime" label="结束时间：" prop="endTime" has-feedback>
            <a-date-picker v-model="form.endTime" show-time placeholder="请选择结束时间" :disabled="query.type === 'resupply' ? true : false" format="YYYY-MM-DD HH:mm:ss" />
          </a-form-model-item>
          <a-form-model-item ref="siteAccountId" label="负责人：" prop="siteAccountId">
            <a-select
              :value="form.siteAccountId"
              :options="responsiblerList"
              style="width: 100%"
              :disabled="query.type === 'resupply' ? true : false"
              placeholder="请选择负责人"
              allowClear
              show-search
              :filterOption="filteredOptions"
              @change="changeSiteAccount"
            ></a-select>
            <!-- <a-select v-model="form.site_account_id" :options="responsiblerList" placeholder="请选择负责人" :disabled="disabled" allowClear /> -->
          </a-form-model-item>
          <a-form-model-item ref="warehouseId" label="仓库：" prop="warehouseId">
            <a-select
              :value="form.warehouseId"
              :options="warehouseList"
              placeholder="请选择仓库"
              allowClear
              @change="changeWarehouse"
              :disabled="query.type === 'edit' || query.type === 'resupply' ? true : false"
            />
          </a-form-model-item>
          <a-form-model-item ref="activityDescription" label="活动描述：" prop="activityDescription" has-feedback>
            <a-input v-model="form.activityDescription" placeholder="请输入活动描述" allowClear :disabled="query.type === 'resupply' ? true : false" />
          </a-form-model-item>
          <a-form-model-item ref="accountId" label="活动成员：" prop="accountId" has-feedback>
            <a-select
              v-model="form.accountId"
              :disabled="query.type === 'edit' || query.type === 'resupply' ? true : false"
              :options="memberList"
              mode="multiple"
              @change="changeActivityPeople"
              :filter-option="$com.filterOption"
              placeholder="请选择活动成员"
              allowClear
            />
            <a-checkbox v-model="checkAllMember" class="checkbox" @change="allChangeMember"> 全选 </a-checkbox>
          </a-form-model-item>
          <a-form-model-item ref="picUrl" label="图片" prop="picUrl">
            <a-upload
              name="pic"
              :show-upload-list="false"
              list-type="picture-card"
              class="avatar-uploader"
              :action="$com.uploadUrl()"
              :before-upload="file => $utils.beforeUpload(file, this)"
              :disabled="query.type === 'resupply' ? true : false"
              @change="handleChange"
              @preview="handlePreview"
            >
              <img v-if="form.picUrl" :src="$com.showUpload() + form.picUrl" alt="picUrl" class="upImg" />
              <div v-else>
                <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div class="tips">支持扩展名：jpeg,png,图片大小不超过4MB,最多可上传1张图片</div>
          </a-form-model-item>
          <a-form-model-item ref="giftList" label="礼品：" prop="giftList">
            <!-- <a-select v-model="form.gift" placeholder="请选择礼品" @change="showGift" allowClear /> -->
            <a-button type="primary" @click="showGift"> 点击选择礼品 </a-button>
          </a-form-model-item>
          <a-form-model-item ref="materialList" label="物料：" prop="materialList" v-if="activityType === 1">
            <!-- <a-select v-model="form.gift" placeholder="请选择礼品" @change="showGift" allowClear /> -->
            <a-button type="primary" @click="showMaterial"> 点击选择物料 </a-button>
          </a-form-model-item>
          <a-form-model-item ref="isMerger" label="小区合并：" prop="isMerger" v-if="activityType === 4">
            <a-radio-group v-model="form.isMerger">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm"> 取消 </a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onSubmit" :disabled="query.type === 'edit' && ![1, 2].includes(state)"> 保存 </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 礼品弹窗 -->
    <a-modal :visible="giftVisible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk('gift')" @cancel="handleCancel('gift')">
      <div class="model-select">
        <div>
          <a-table
            size="middle"
            :row-selection="{
              selectedRowKeys: giftSourceSelectedRowKeys,
              onChange: e => onSelectChange(e, 'giftSourceSelectedRowKeys', 'gift'),
              getCheckboxProps: e => onGetCheckboxProps(e, 'giftSourceSelectedRowKeys', 'gift')
            }"
            :data-source="giftDataSource"
            :pagination="false"
          >
            <a-table-column key="giftNo" title="礼品编号" data-index="giftNo" align="center" :ellipsis="true" />
            <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
            <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
            <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
            <a-table-column key="residueStock" title="可用库存" data-index="residueStock" align="center" :ellipsis="true" />
            <a-table-column key="sellPrice" title="现金价格（元）" data-index="sellPrice" align="center" :ellipsis="true" />
            <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="giftPage" show-quick-jumper :default-current="1" :total="giftTotal" @change="getTableList(null, 'gift')" />
          </div>
        </div>
        <div class="delete"><a-button type="primary" @click="option('del', 'gift')">删除已选</a-button></div>
        <a-table
          size="middle"
          :row-selection="{
            selectedRowKeys: giftSelectedRowKeys,
            onChange: e => onSelectChange(e, 'giftSelectedRowKeys'),
            getCheckboxProps: e => onGetCheckboxProps(e, 'giftSourceSelectedRowKeys', 'gift')
          }"
          :data-source="giftListSelect"
          :rowKey="record => record.id"
        >
          <a-table-column key="giftNo" title="礼品编号" data-index="giftNo" align="center" :ellipsis="true" />
          <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="number" title="申领数量" data-index="number" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number v-model="record.number" :precision="0" :min="0" @change="e => changeNumber(record, e, 'gift')" />
            </template>
          </a-table-column>
          <a-table-column key="sellPrice" title="现金价格（元）" data-index="sellPrice" align="center" :ellipsis="true" />
          <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true" />
        </a-table>
      </div>
    </a-modal>
    <!-- 物料弹窗 -->
    <a-modal :visible="materialVisible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk('material')" @cancel="handleCancel('material')">
      <div class="model-select">
        <div>
          <a-table
            size="middle"
            :row-selection="{ selectedRowKeys: materialSourceSelectedRowKeys, onChange: e => onSelectChange(e, 'materialSourceSelectedRowKeys', 'material') }"
            :data-source="materialDataSource"
            :pagination="false"
          >
            <a-table-column key="giftNo" title="物料编号" data-index="giftNo" align="center" :ellipsis="true" />
            <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
            <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
            <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
            <a-table-column key="shouldResidueStock" title="申领数量" data-index="shouldResidueStock" align="center" :ellipsis="true" />
            <a-table-column key="sellPrice" title="现金价格（元）" data-index="sellPrice" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                {{ record.sellPrice.toFixed(2) }}
              </template>
            </a-table-column>
            <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                {{ record.integralPrice.toFixed(2) }}
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="materialPage" show-quick-jumper :default-current="1" :total="materialTotal" @change="getTableList(null, 'material')" />
          </div>
        </div>
        <div class="delete"><a-button type="primary" @click="option('del', 'material')">删除已选</a-button></div>
        <a-table
          size="middle"
          :row-selection="{ selectedRowKeys: materialSelectedRowKeys, onChange: e => onSelectChange(e, 'materialSelectedRowKeys') }"
          :data-source="materialListSelect"
          :rowKey="record => record.id"
        >
          <a-table-column key="giftNo" title="物料编号" data-index="giftNo" align="center" :ellipsis="true" />
          <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="shouldResidueStock" title="申领数量" data-index="shouldResidueStock" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number v-model="record.number" :precision="0" :min="0" @change="e => changeNumber(record, e, 'material')" />
            </template>
          </a-table-column>
          <a-table-column key="sellPrice" title="现金价格（元）" data-index="sellPrice" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              {{ record.sellPrice.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              {{ record.integralPrice.toFixed(2) }}
            </template>
          </a-table-column>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"]
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
      checkAll: false,
      checkAllMember: false,
      selectedItems: [],
      isSubmit: false,
      activityType: null,
      plotDisabled: false,
      disabled: false, //禁用
      filteredItems: [],
      state: "",
      form: {
        accountId: [],
        activityName: undefined,
        plotId: [],
        plotName: [],
        startTime: undefined,
        endTime: undefined,
        siteAccountId: undefined,
        siteAccountName: undefined,
        warehouseId: undefined,
        activityDescription: undefined,
        activityPeople: [],
        picUrl: undefined,
        giftList: [],
        materialList: [],
        isMerger: 1
      },
      warehouseList: [],
      memberList: [],
      communityChartList: [], // 小区信息列表
      responsiblerList: [], //负责人列表
      type: "add", // 页面状态 编辑/新增
      giftVisible: false, //礼品弹窗
      materialVisible: false, //物料弹窗
      confirmLoading: false,

      previewImage: "",
      imgLoading: false,
      giftListVosOrigin: [],

      giftSourceSelectedRowKeys: [],
      giftSelectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格
      giftListSelect: [],
      giftDataSource: [], //左侧表格数据
      materialListVosOrigin: [],
      materialSourceSelectedRowKeys: [],
      materialSelectedRowKeys: [],
      materialListSelect: [],
      materialDataSource: [], //左侧表格数据
      giftTargetKeys: [],
      materialTargetKeys: [],
      giftPage: 0,
      giftTotal: 0,
      materialPage: 0,
      materialTotal: 0,
      showSearch: true,

      rules: {
        activityName: [{ required: true, message: "请输入活动主题", trigger: "blur" }],
        plotId: [{ required: true, message: "请选择小区", trigger: "change" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: ["change", "blur"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: ["change", "blur"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        siteAccountId: [{ required: true, message: "请选择负责人", trigger: "change" }],
        warehouseId: [{ required: true, message: "请输入仓库", trigger: "change" }],
        accountId: [{ required: true, message: "请选择活动成员", trigger: "change" }],
        giftList: [{ required: true, message: "请选择礼品", trigger: "change" }]
      },
      gift_id: "",
      giftListEdit: [],
      check: false
    }
  },
  async mounted() {
    this.activityType = Number(this.query.activityType) || 1
    this.getResponsiblerList()
    await this.getWarehouseList()
    await this.handleSearchPlot(null) // 小区信息列表
    await this.getMemberList(null)
    if (/edit|copy|resupply/.test(this.query.type) && this.query.id !== "") {
      this.editShow()
    } else {
      this.show = true
    }
  },
  methods: {
    async handleSearchPlot(value, list) {
      let _this = this
      let res = await this.$api.getCommunityAllList({ plot_name: value })
      if (res) {
        _this["communityChartList"] = res.data.map(item => {
          item.label = item.plot_name
          item.value = item.id
          return item
        })
      }
      this.form.plotId = []
      this.checkAll = false
    },
    async getMemberList(value, list) {
      let _this = this
      let res = await this.$api.memberList({ accountName: value })
      if (res) {
        _this["memberList"] = res.data.map(item => {
          item.label = item.accountName
          item.value = item.id
          return item
        })
      }
      this.form.accountId = []
      this.checkAllMember = false
    },
    allChange(e) {
      if (this.checkAll) {
        this.form.plotId = []
        console.log("e", e.target.checked)
        console.log("e1", this.communityChartList)
        this.communityChartList.map(item => {
          this.form.plotId.push(item.id)
        })
      } else {
        this.form.plotId = []
      }
    },
    // 小区
    handleChangePlot(data) {
      let flag = true
      if (this.form.plotId.length !== this.communityChartList.length) {
        flag = false
      }
      this.checkAll = flag
    },
    allChangeMember(e) {
      if (this.checkAllMember) {
        this.form.accountId = []
        this.memberList.map(item => {
          this.form.accountId.push(item.id)
          this.form.activityPeople.push(item.accountName)
        })
      } else {
        this.form.accountId = []
        this.form.activityPeople = []
      }
    },
    // 活动成员
    changeActivityPeople(data) {
      this.form.activityPeople = []
      this.memberList.map(item => {
        data.map(el => {
          if (item.id == el) {
            this.form.activityPeople.push(item.accountName)
          }
        })
      })
      let flag = true
      if (this.form.accountId.length !== this.memberList.length) {
        flag = false
      }
      this.checkAllMember = flag
    },
    option(type, keyTarget) {
      if (type === "del") {
        this[keyTarget + "ListSelect"] = this[keyTarget + "ListSelect"].filter((e, key) => {
          return !this[keyTarget + "SelectedRowKeys"].includes(e.id)
        })
        this[keyTarget + "SourceSelectedRowKeys"] = this[keyTarget + "SourceSelectedRowKeys"].filter((e, key) => {
          return !this[keyTarget + "SelectedRowKeys"].includes(Number(e))
        })
      }
    },
    changeNumber(item, num, type) {
      console.log(item, "item")
      if (!/^(0|[1-9][0-9]*)$/.test(num)) num = 0
      console.log(num, "num")

      if (num > item.residueStock) num = item.residueStock
      console.log(this[type + "ListVosOrigin"])
      this[type + "ListVosOrigin"].some(e => {
        if (e.id === item.id) {
          if (num < e.number) {
            num = e.number
          }
          return true
        }
      })
      this[type + "ListSelect"].forEach(e => {
        if (e.id === item.id) {
          e.number = num
        }
      })
    },

    filteredOptions(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    checkTimeBetween(rule, value, callback) {
      let name = rule.field === "endTime" ? "startTime" : "endTime"
      if (!this.form.startTime || !this.form.endTime) {
        callback()
        return
      }
      if (
        this.form.startTime &&
        this.form.endTime &&
        +new Date(this.form.startTime.format("YYYY-MM-DD HH:mm:ss").replace("-", "/")) > +new Date(this.form.endTime.format("YYYY-MM-DD HH:mm:ss").replace("-", "/"))
      ) {
        this.check ? callback() : callback("开始时间不能大于结束时间！")
        if (!this.check) {
          this.check = true
          this.form[name] ? this.$refs[name].onFieldChange() : null
        } else {
          this.check = false
        }
      } else {
        if (!this.check) {
          this.check = true
          this.form[name] ? this.$refs[name].onFieldChange() : null
        } else {
          this.check = false
        }
        callback()
      }
    },

    getWarehouse(data) {
      this.form.warehouseId = data
      this.warehouseList.filter(e => {
        if (e.value === data) {
          this.form.warehouseName = e.label
        }
      })
    },
    changeWarehouse(data) {
      this.form.warehouseId = data
      this.form.giftList = []
      this.form.materialList = []
      this["giftDataSource"] = []
      this["materialDataSource"] = []
      this.warehouseList.filter(e => {
        if (e.value === data) {
          this.form.warehouseName = e.label
        }
      })
    },
    changeSiteAccount(data) {
      this.form.siteAccountId = data
      this.responsiblerList.filter(e => {
        if (e.value === data) {
          this.form.siteAccountName = e.label
        }
      })
    },
    searchActivityPeople() {},

    getResponsiblerList() {
      this.$api.getResponsiblerList().then(res => {
        this.responsiblerList = res.data.map(item => {
          item.label = item.account_name
          item.value = item.id
          return item
        })
      })
    },
    async getWarehouseList() {
      let res = await this.$api.warehouseName()
      if (res && res.data) {
        this.warehouseList = res.data.map(item => {
          item.label = item.name
          item.value = item.id
          delete item.name
          delete item.id
          return item
        })
      }
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
        this.form.picUrl = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.picUrl = ""
      }
    },

    // 如果是编辑状态,需要恢复页面数据
    editShow() {
      this.id = Number(this.query.id) || ""
      this.$api.activityDetails({ id: this.id }).then(res => {
        this.state = res.data.state
        const data = res.data
        Object.keys(this.form).forEach(e => {
          if (/startTime|endTime/.test(e)) {
            data[e] ? (this.form[e] = this.$moment(data[e])) : null
          } else if (/giftList|materialList/.test(e) && /edit/.test(this.query.type)) {
            let itemName = e === "giftList" ? "gift" : "material"
            this[e + "Select"] = data[e + "Vos"].map(e => {
              if (!this[itemName + "SourceSelectedRowKeys"].includes(e.id + "")) {
                this[itemName + "SourceSelectedRowKeys"].push(e.id + "")
              }
              return {
                id: e.id,
                giftName: e.giftName,
                giftNo: e.giftNo,
                specs: e.specs,
                sellPrice: e.sellPrice,
                integralPrice: e.integralPrice,
                number: e.number,
                brand: e.brand,
                shouldResidueStock: e.number + Number(e.shouldResidueStock),
                isReserved: true
              }
            })
            this[itemName + "ListVosOrigin"] = this.$utils.deepCopy(this[e + "Select"])
          } else if (/plotId/.test(e)) {
            this["communityChartList"].forEach(el => {
              if (el.value === data[e]) {
                this.form[e] = [data[e]]
              }
            })
          } else {
            data[e] !== undefined ? (this.form[e] = data[e]) : null
          }
        })

        this.form["accountId"] = []
        let accountIdLists = data["activityAccountLists"].map(e => {
          return e.accountId
        })
        this.memberList.forEach(e => {
          if (accountIdLists.includes(e.value)) {
            this.form["accountId"].push(e.value)
          }
        })

        this.form["plotId"] = []
        this.communityChartList.forEach(e => {
          res.data.plotId.split(",").map(item => {
            if (+item == e.value) {
              this.form["plotId"].push(e.value)
            }
          })
        })
        this.changeActivityPeople(this.form["accountId"])
        data["warehouseId"] ? this.getWarehouse(data["warehouseId"]) : (this.form["warehouseName"] = "")
        this.show = true
      })
    },

    // 确定
    onSubmit() {
      this.handleOk("gift")
      this.handleOk("material")
      if (this.query.type === "edit" && ![1, 2].includes(this.state)) return
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let that = this
          this.$refs.giftList.onFieldChange()
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
      if (this.isSubmit) return
      this.isSubmit = true
      const data = {}
      if (this.query.type === "resupply") {
        data["materialList"] = this.form["materialList"]
        data["giftList"] = this.form["giftList"]
      } else {
        data["activityType"] = this.activityType
        Object.keys(this.form).forEach(e => {
          if (e === "activityPeople") {
            data[e] = this.form[e].join()
          } else if (e === "accountId") {
            // console.log(this.form[e],"accountId");
            // console.log(this.form[e].join(), "join")
            data[e] = this.form[e].join(",")
          } else if (e === "startTime" || e === "endTime") {
            data[e] = this.$utils.forMatDate(this.form[e])
          } else if (!(this.activityType === 4 && e === "materialList")) {
            if (/giftList|materialList/.test(e) && this.query.type === "edit") {
              data[e] = this.form[e]
            } else {
              this.form[e] ? (data[e] = this.form[e]) : null
            }
          }
        })
        data["giftList"].length ? (data["giftState"] = 1) : (data["giftState"] = 0)
      }

      //校验时间
      if (data.start_time > data.end_time) {
        this.$message.error("校验失败,请检查时间")
        return false
      }
      let routerName = this.activityType === 1 ? "PromotionalActivityList" : "TimedFixedPointActivityList"
      if (this.query.type === "edit") {
        // 编辑

        data.id = this.id
        this.$api
          .propagandaPost(data)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: routerName })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      } else if (this.query.type === "add" || this.query.type === "copy") {
        // 添加
        this.$api
          .propagandaSave(data)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: routerName })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      } else if (this.query.type === "resupply") {
        data.id = this.id
        this.$api
          .propagandaSupplement(data)
          .then(res => {
            setTimeout(() => {
              this.$router.push({ name: routerName })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      }
    },
    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },

    // 表格选择
    onChange(nextTargetKeys, direction, moveKeys, type) {
      this[type + "TargetKeys"] = nextTargetKeys
      //  如果往右移动 需要把select_number字段的值恢复为礼品初始数量
      if (direction === "right") {
        this[type + "DataSource"].forEach(item => {
          moveKeys.forEach(sitem => {
            if (item.key === sitem) {
              item.select_number = item.shouldResidueStock
              let has = false
              this.form[type + "List"].forEach((e, key) => {
                if (item.id === e.id) {
                  has = true
                  this.form[type + "List"][key].number = item.select_number
                }
              })
              if (!has) {
                this.form[type + "List"].push({
                  id: item.id,
                  number: item.select_number
                })
              }
            }
          })
        })
        console.log(this.form, "this.form right")
      } else if (direction === "left") {
        this.form[type + "List"].forEach((e, key) => {
          if (moveKeys.includes(e.id + "")) {
            this.form[type + "List"].splice(key, 1)
          }
        })
        console.log(this.form, "this.form left")
      }
    },

    // 表格搜索过滤函数
    filterOption(inputValue, option) {
      return option.giftName.indexOf(inputValue) > -1
    },
    onGetCheckboxProps(selectedRowKeys, selectedRowKeysName, target) {
      return {
        props: {
          disabled:
            this.query.type == "resupply"
              ? this[target + "ListVosOrigin"].some(item => {
                  return item.id === selectedRowKeys.id ? true : false
                })
              : false
        }
      }
    },
    // 表格选择
    onSelectChange(selectedRowKeys, selectedRowKeysName, target) {
      console.log(selectedRowKeys, selectedRowKeysName, target, "表格选择")
      let lastSelectedRowKeysName = this[selectedRowKeysName]
      console.log(lastSelectedRowKeysName, "lastSelectedRowKeysName 表格选择")

      this[selectedRowKeysName] = selectedRowKeys
      if (target) {
        console.log(target, "target")
        this[target + "ListSelect"] = this[target + "ListSelect"].filter((e, key) => {
          return (!e.isReserved && selectedRowKeys.includes(e.id + "")) || e.isReserved
        })
        if (lastSelectedRowKeysName.length > selectedRowKeys.length) {
          let addSelect = lastSelectedRowKeysName.filter(e => {
            return !selectedRowKeys.includes(e)
          })

          if (addSelect.length) {
            this[target + "ListSelect"] = this[target + "ListSelect"].filter((e, key) => {
              return !addSelect.includes(e.id + "")
            })
          }
        }

        if (lastSelectedRowKeysName.length < selectedRowKeys.length) {
          console.log(selectedRowKeys, "selectedRowKeys ")
          console.log(lastSelectedRowKeysName.length < selectedRowKeys.length, "lastSelectedRowKeysName.length < selectedRowKeys.length")
          let reduceSelect = selectedRowKeys.filter(e => {
            return !lastSelectedRowKeysName.includes(e)
          })
          console.log(reduceSelect, "reduceSelect ")

          reduceSelect.forEach(key => {
            let isExist = false
            key = Number(key)
            let item =
              this[target + "ListVosOrigin"].filter(data => {
                return data.id === key
              })[0] || {}
            console.log(item, "item")
            console.log(key, "key")
            this[target + "ListSelect"].forEach(e => {
              if (key === e.id) {
                console.log(key === e.id, "key === e.id")
                console.log(this[target + "DataSource"], 'this[target + "DataSource"] 111')
                this[target + "DataSource"].forEach(ee => {
                  if (key === ee.id) {
                    e.number = item.shouldResidueStock ? item.shouldResidueStock : ee.shouldResidueStock
                  }
                })
                console.log(this[target + "DataSource"], 'this[target + "DataSource"] 222')
                isExist = true
              }
            })
            console.log(this[target + "ListSelect"], 'this[target + "ListSelect"]')
            if (!isExist) {
              console.log(!isExist, "!isExist")
              console.log(this[target + "DataSource"], 'this[target + "DataSource"] 333')
              this[target + "DataSource"].forEach(ee => {
                if (key === ee.id) {
                  console.log(key === ee.id, "key === ee.id 22")
                  console.log(this[target + "DataSource"], 'this[target + "DataSource"] 22')

                  this[target + "ListSelect"].push({
                    id: ee.id,
                    giftNo: ee.giftNo,
                    giftName: ee.giftName,
                    specs: ee.specs,
                    brand: ee.brand,
                    sellPrice: ee.sellPrice,
                    integralPrice: ee.integralPrice,
                    residueStock: item.residueStock ? item.residueStock : ee.residueStock,
                    number: item.shouldResidueStock ? item.shouldResidueStock : ee.residueStock
                  })
                  console.log(this[target + "ListSelect"], 'this[target + "ListSelect"]')
                }
              })
            }
          })
        }
      }
    },
    //礼品列表弹窗
    showGift() {
      // this.giftListSelect = []
      //获取列表
      this.getTableList(1, "gift")
    },
    //物料列表弹窗
    showMaterial() {
      // this.materialListSelect = []
      //获取列表
      this.getTableList(1, "material")
    },
    // 获取礼品列表
    getTableList(page, type) {
      if (page) this[type + "Page"] = page
      let warehouseId = this.form.warehouseId
      if (!warehouseId) {
        this.$message.error("请选择仓库！")
        return
      }
      this[type + "Visible"] = true
      this.tableLoading = true
      this.$api.giftAndMaterial({ type: type === "gift" ? 1 : 2, warehouseId: warehouseId, page: this[type + "Page"] }).then(res => {
        this[type + "DataSource"] = res.data.data.map(item => {
          item.key = item.id + ""
          item.title = item.giftName
          item.select_number = item.shouldResidueStock
          return item
        })
        // 设置应该选中的礼品
        this[type + "TargetKeys"] = []
        this.form[type + "List"].forEach(item => {
          this[type + "DataSource"].forEach(sitem => {
            if (item.id === sitem.id) {
              sitem.select_number = item.number
            }
          })
          this[type + "TargetKeys"].push(item.id + "")
        })
        console.log(this[type + "TargetKeys"], 'this[type + "TargetKeys"]')
        this.tableLoading = false
        this[type + "Total"] = res.data.total
      })
    },
    //获取选择行 selectedKeys：选中的条目 itemSelectAll:勾选条目 itemSelect:勾选一组条目
    getRowSelection({ selectedKeys, itemSelectAll, itemSelect }) {
      return {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key)
          const diffKeys = selected ? difference(treeSelectedKeys, selectedKeys) : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    handleOk(type) {
      this[type + "Visible"] = false
      this.form[type + "List"] = []
      this[type + "ListSelect"].forEach(item => {
        if (item.number > 0) {
          this.form[type + "List"].push({
            id: item.id,
            number: item.number
          })
        }
      })
      if (type === "gift") {
        this.$refs.ruleForm.validateField(type + "List")
      }
    },
    handleCancel(popName) {
      this[popName + "Visible"] = false
    }
  }
}
</script>

<style lang="less" scoped>
// #TimedFixedPointActivityOperation {

// }
.upImg {
  width: 100px;
  height: 100px;
}
.tips {
  line-height: 25px;
}

.left-select {
  width: 800px;
}
.right-select {
  width: 400px;
}
.model-select {
  padding: 20px;
}

.delete {
  margin-bottom: 10px;
}

.checkbox {
  position: absolute;
  top: -10px;
  right: -75px;
}
</style>
