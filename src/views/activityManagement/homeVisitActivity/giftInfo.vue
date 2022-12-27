<template>
  <div id="HomeVisitActivityGiftInfo">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">礼品信息</div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="activity_name" label="是否赠送礼品" prop="activity_name" has-feedback>
            <a-switch default-checked @change="onSwitchChange" :checked="isOfferPresent" />
          </a-form-model-item>
          <a-form-model-item ref="warehouseId" label="仓库：" prop="warehouseId">
            <a-select
              :value="form.warehouseId"
              :options="warehouseList"
              placeholder="请选择仓库"
              :disabled="!isOfferPresent || (query.type === 'edit' && editGiftListVos.length > 0)"
              allowClear
              @change="changeWarehouse"
            />
          </a-form-model-item>
          <a-form-model-item label="礼品：">
            <!-- <a-select v-model="form.gift" placeholder="请选择礼品" @change="showGift" allowClear /> -->
            <a-button type="primary" @click="showGift" :disabled="!isOfferPresent">请选择礼品</a-button>
          </a-form-model-item>
          <a-form-model-item ref="giftListSelect" label="已选择的礼品：" prop="giftListSelect" has-feedback>
            <a-table size="middle" :data-source="giftListSelect" style="width: 800px;" :row-key="e => e.id">
              <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
              <a-table-column key="integralPrice" title="积分" data-index="integralPrice" align="center" :ellipsis="true" />
              <a-table-column key="number" title="申领数量" data-index="number" align="center" :ellipsis="true" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center">
                <template slot-scope="text, record">
                  <a-button type="primary" @click="option('delGiftSelect', record)">删除</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm">取消</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onSubmit" :disabled="query.type === 'edit' && ![1, 2].includes(state)">提交</a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 礼品弹窗 -->
    <a-modal :visible="giftVisible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk('gift')" @cancel="handleCancel('gift')">
      <div class="model-select">
        <div>
          <a-table
            size="middle"
            :row-selection="{ selectedRowKeys: giftSourceSelectedRowKeys, onChange: e => onSelectChange(e, 'giftSourceSelectedRowKeys', 'gift') }"
            :data-source="giftDataSource"
            :pagination="false"
          >
            <a-table-column key="giftNo" title="礼品编号" data-index="giftNo" align="center" :ellipsis="true" />
            <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
            <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
            <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
            <a-table-column key="shouldResidueStock" title="剩余库存" data-index="shouldResidueStock" align="center" :ellipsis="true" />
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
            <a-pagination v-model="giftPage" show-quick-jumper :default-current="1" :total="giftTotal" @change="getTableList(null, 'gift')" />
          </div>
        </div>
        <div class="delete"><a-button type="primary" @click="option('delGiftSelect', 'gift')">删除已选</a-button></div>
        <a-table
          size="middle"
          :row-selection="{ selectedRowKeys: giftSelectedRowKeys, onChange: e => onSelectChange(e, 'giftSelectedRowKeys') }"
          :data-source="giftListSelect"
          :rowKey="record => record.id"
        >
          <a-table-column key="giftNo" title="礼品编号" data-index="giftNo" align="center" :ellipsis="true" />
          <a-table-column key="giftName" title="名称" data-index="giftName" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="number" title="申领数量" data-index="number" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number v-model="record.number" :precision="0" :min="0" @change="e => changeNumber(record, e, 'giftListSelect')" />
            </template>
          </a-table-column>
          <a-table-column key="sellPrice" title="现金价格（元）" data-index="sellPrice" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              {{ typeof record.sellPrice === "number" ? record.sellPrice.toFixed(2) : record.sellPrice }}
            </template>
          </a-table-column>
          <a-table-column key="integralPrice" title="积分价格" data-index="integralPrice" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              {{ typeof record.integralPrice === "number" ? record.integralPrice.toFixed(2) : record.integralPrice }}
            </template>
          </a-table-column>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
import difference from "lodash/difference"
import { log } from "@antv/g2plot/lib/utils"
import { relativeTimeRounding } from "moment"
export default {
  name: "HomeVisitActivityGiftInfo",
  components: {},
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      isSubmit: false,
      activityType: 2,
      isOfferPresent: true,
      plotDisabled: false,
      disabled: false, //禁用
      filteredItems: [],
      form: {
        giftList: [],
        warehouseId: undefined,
        warehouseName: undefined
      },
      giftListVosOrigin: [],
      warehouseList: [],
      communityChartList: [], // 小区信息列表
      responsiblerList: [], //负责人列表
      type: "add", // 页面状态 编辑/新增
      giftSourceSelectedRowKeys: [],
      giftSelectedRowKeys: [],
      giftListSelect: [],
      giftVisible: false, //礼品弹窗
      giftDataSource: [], //左侧表格数据
      giftTargetKeys: [],
      giftPage: 0,
      giftTotal: 0,
      confirmLoading: false,
      previewImage: "",
      imgLoading: false,
      supervisorSelectedRowKeys: [],
      selectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格
      supervisorDataSource: [],
      dataSource: [], //左侧表格数据
      targetKeys: [],
      showSearch: true,
      garbageTypes: [],
      giftLeftColumns: [
        {
          dataIndex: "giftNo",
          algin: "center",
          title: "礼品编号"
        },
        {
          dataIndex: "giftName",
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
          dataIndex: "shouldResidueStock",
          algin: "center",
          title: "数量"
        },
        {
          dataIndex: "sellPrice",
          algin: "center",
          title: "现金价格（元）"
        },
        {
          dataIndex: "integralPrice",
          algin: "center",
          title: "积分价格"
        }
      ],
      rules: {},
      gift_id: "",
      state: "",
      supervisorVisible: false,
      page: 1,
      total: 1,
      editGiftListVos: [],
      editWarehouseId: undefined,
      dispatchResidentsVisble: false,
      replaceFields: {
        children: "child",
        title: "name"
      }
    }
  },
  async created() {
    await this.getWarehouseList()
    if (/edit|copy|resupply/.test(this.query.type)) {
      await this.editShow()
    }
    this.dataFill()
  },
  methods: {
    changeNumber(item, num, target) {
      if (!/^(0|[1-9][0-9]*)$/.test(num)) num = 0
      if (num > item.shouldResidueStock) num = item.shouldResidueStock
      this[target].forEach(e => {
        if (e.id === item.id) {
          e.number = num
        }
      })
    },
    changeSelectNumber(item, num, type) {
      this[type + "SelectList"].forEach(e => {
        if (e.id === item.id) {
          e.select_number = num
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
    dataFill() {
      let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
      homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
      if (!homeVisitActivity) return
      Object.keys(this.form).forEach(e => {
        if (Object.prototype.hasOwnProperty.call(homeVisitActivity, e)) {
          this.form[e] = homeVisitActivity[e]
        }
      })

      let giftListSelect = homeVisitActivity["giftListSelect"]
      giftListSelect ? (this.giftListSelect = giftListSelect) : null

      this.isOfferPresent = !giftListSelect || (giftListSelect.constructor === Array && giftListSelect.length) ? true : false
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
    changeWarehouse(data) {
      this.form.giftList = []
      this.giftListSelect = []
      this.form.warehouseId = data
    },
    async getWarehouseList() {
      let res = await this.$api.warehouseName()
      this.warehouseList = res.data.map(item => {
        item.label = item.name
        item.value = item.id
        delete item.name
        delete item.id
        return item
      })
    },
    onSwitchChange(value) {
      this.isOfferPresent = value
      if (!value) {
        this.form.warehouseId = undefined
        this.form.warehouseName = undefined
        this.form.giftList = []
        this.giftListSelect = []
        this.giftSourceSelectedRowKeys = []
        let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
        homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
        let giftListSelect = homeVisitActivity["giftListSelect"]

        if (giftListSelect.constructor === Array && giftListSelect.length) {
          homeVisitActivity["giftListSelect"] = []
          localStorage.setItem("homeVisitActivity", JSON.stringify(homeVisitActivity))
        }
      } else {
        if (this.query.type === "edit" && this.editWarehouseId) {
          this.form.warehouseId = this.editWarehouseId
        }
      }
    },
    onSelect(selectedKeys, info) {},
    onCheck(checkedKeys, info) {},
    // 新增/编辑
    option(type, record, key = "") {
      let _this = this
      // 表格删除
      if (type === "del") {
        this.$confirm({
          title: "请确认",
          content: "确定删除选中数据吗?",
          onOk() {
            _this.giftListSelect = _this.giftListSelect.filter(e => {
              return e.id !== record.id
            })
          },
          onCancel() {
            _this.$message.info("已取消")
          }
        })
      } else if (type === "delGiftSelect") {
        let keyTarget = "gift"
        if (typeof record === "object") {
          this[keyTarget + "ListSelect"] = this[keyTarget + "ListSelect"].filter((e, key) => {
            return e.id !== record.id
          })
          this[keyTarget + "SourceSelectedRowKeys"] = this[keyTarget + "SourceSelectedRowKeys"].filter((e, key) => {
            return Number(e) !== record.id
          })
        } else {
          this[keyTarget + "ListSelect"] = this[keyTarget + "ListSelect"].filter((e, key) => {
            return !this[keyTarget + "SelectedRowKeys"].includes(e.id)
          })
          this[keyTarget + "SourceSelectedRowKeys"] = this[keyTarget + "SourceSelectedRowKeys"].filter((e, key) => {
            return !this[keyTarget + "SelectedRowKeys"].includes(Number(e))
          })
        }
      } else {
        this.dispatchResidentsVisble = true
      }
    },
    getResponsiblerList() {
      this.$api.getResponsiblerList().then(res => {
        this.responsiblerList = res.data.map(item => {
          item.label = item.account_name
          item.value = item.id
          return item
        })
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
    // 表格选择
    onSelectChange(selectedRowKeys, selectedRowKeysName, target) {
      let lastSelectedRowKeysName = this[selectedRowKeysName]
      this[selectedRowKeysName] = selectedRowKeys
      if (target) {
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
          let reduceSelect = selectedRowKeys.filter(e => {
            return !lastSelectedRowKeysName.includes(e)
          })

          reduceSelect.forEach(key => {
            let isExist = false
            key = Number(key)
            let item =
              this["giftListVosOrigin"].filter(data => {
                return data.id === key
              })[0] || {}
            this[target + "ListSelect"].forEach(e => {
              if (key === e.id) {
                this[target + "DataSource"].forEach(ee => {
                  if (key === ee.id) {
                    e.number = item.shouldResidueStock ? item.shouldResidueStock : ee.shouldResidueStock
                  }
                })
                isExist = true
              }
            })
            if (!isExist) {
              this[target + "DataSource"].forEach(ee => {
                if (key === ee.id) {
                  this[target + "ListSelect"].push({
                    giftName: ee.giftName,
                    id: ee.id,
                    giftNo: ee.giftNo,
                    number: item.shouldResidueStock ? item.shouldResidueStock : ee.shouldResidueStock,
                    shouldResidueStock: item.shouldResidueStock ? item.shouldResidueStock : ee.shouldResidueStock,
                    unit: ee.unit,
                    specs: ee.specs,
                    brand: ee.brand,
                    integralPrice: ee.integralPrice,
                    sellPrice: ee.sellPrice
                  })
                }
              })
            }
          })
        }
      }
    },
    // 如果是编辑状态,需要恢复页面数据
    async editShow() {
      this.id = Number(this.query.id)
      let res = await this.$api.activityDetails({ id: this.id })
      const data = res.data
      this.query.type === "edit" ? (this.state = data.state) : null
      Object.keys(this.form).forEach(e => {
        if (e === "warehouseId") {
          if (data["giftState"] === 1) {
            this.warehouseList.filter(ee => {
              if (ee.value === data["warehouseId"]) {
                this.form[e] = data["warehouseId"]
                this.editWarehouseId = data["warehouseId"]
              }
            })
          }
        } else if (e === "giftList" && this.query.type === "edit") {
          this["giftListSelect"] = []
          this["giftListVosOrigin"] = []
          this.editGiftListVos = data["giftListVos"]
          this.isOfferPresent = data["giftListVos"].length ? true : false
          this.form[e] = data["giftListVos"].map(e => {
            if (!this["giftSourceSelectedRowKeys"].includes(e.id + "")) {
              this["giftSourceSelectedRowKeys"].push(e.id + "")
            }
            let data = {
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
            this["giftListVosOrigin"].push(data)
            this["giftListSelect"].push(data)
            return { id: e.gift_id, number: e.number }
          })

          let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
          homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
          homeVisitActivity = homeVisitActivity || {}
          homeVisitActivity["giftListSelect"] = this["giftListSelect"]
          localStorage.setItem("homeVisitActivity", JSON.stringify(homeVisitActivity))
        }
      })
    },
    onNext() {
      this.$router.push({ name: "personInfo" })
    },
    // 确定
    onSubmit() {
      let that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.warehouseList.filter(e => {
            if (e.value === this.form.warehouseId) {
              this.form.warehouseName = e.label
            }
          })

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
        }
      })
    },
    checkForm() {
      if (this.isOfferPresent && !this["giftListSelect"].length) {
        this.$message.error("请选择礼品")
        return false
      }
      return true
    },
    copySelectList(data) {
      this.form.giftList = []
      data.forEach(e => {
        this.form.giftList.push({ id: e.id, number: e.number })
      })
    },
    // 确认保存
    sureSubmit() {
      let checkFormResult = this.checkForm()
      if (this.isSubmit || !checkFormResult) return
      this.isSubmit = true
      let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
      homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
      homeVisitActivity = homeVisitActivity ? homeVisitActivity : {}
      homeVisitActivity["giftListSelect"] = this["giftListSelect"]
      this.copySelectList(this["giftListSelect"])
      let form = { ...this.form }

      Object.assign(homeVisitActivity, form)
      localStorage.setItem("homeVisitActivity", JSON.stringify(homeVisitActivity))
      // 添加
      let query = {}
      if (this.query.type === "resupply") {
        homeVisitActivity && homeVisitActivity["giftList"].length ? (query["giftList"] = homeVisitActivity["giftList"]) : (query["giftList"] = [{ id: 0, number: 0 }])
        query["materialList"] = []
      } else {
        Object.keys(homeVisitActivity).map(e => {
          e === "giftList" && !homeVisitActivity[e].length
            ? (query[e] = [{ id: 0, number: 0 }])
            : e === "plotId" && !Array.isArray(homeVisitActivity[e])
            ? (query[e] = [homeVisitActivity[e]])
            : !/giftDataSource|giftListSelect|plotNames/.test(e) && homeVisitActivity[e]
            ? (query[e] = homeVisitActivity[e])
            : null
        })
        query["giftState"] = homeVisitActivity["giftList"].length ? 1 : 0
        query["activityType"] = this.activityType
      }

      if (this.query.type === "edit") {
        query.id = this.id
        this.$api
          .propagandaPost(query)
          .then(res => {
            localStorage.removeItem("homeVisitActivity")
            if (res.code === 200) {
              this.$message.success("提交成功！")
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: "HomeVisitActivityList" })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      } else if (this.query.type === "add" || this.query.type === "copy") {
        this.$api
          .propagandaSave(query)
          .then(res => {
            localStorage.removeItem("homeVisitActivity")
            if (res.code === 200) {
              this.$message.success("提交成功！")
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: "HomeVisitActivityList" })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      } else if (this.query.type === "resupply") {
        console.log("ddd", query)
        query.id = this.id
        query.warehouseId = this.form.warehouseId
        query.warehouseName = this.form.warehouseName
        this.$api
          .propagandaSupplement(query)
          .then(res => {
            localStorage.removeItem("homeVisitActivity")
            this.$message.success("提交成功！")
            setTimeout(() => {
              this.$router.push({ name: "HomeVisitActivityList" })
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
              this[type + "SelectList"].forEach((e, key) => {
                if (item.id === e.id) {
                  has = true
                  e.select_number = item.select_number
                }
              })
              if (!has) {
                this[type + "SelectList"].push(item)
              }
            }
          })
        })
      } else if (direction === "left") {
        this[type + "SelectList"].forEach((e, key) => {
          if (moveKeys.includes(e.id + "")) {
            this[type + "SelectList"].splice(key, 1)
          }
        })
      }
    },

    // 表格搜索过滤函数
    filterOption(inputValue, option) {
      return option.gift_name.indexOf(inputValue) > -1
    },

    //礼品列表弹窗
    showGift() {
      //获取列表
      if (!this.form.warehouseId || (this.form.warehouseId.constructor === Array && !this.form.warehouseId.length)) {
        this.$message.error("请选择仓库！")
        // this.$refs.warehouseId.onFieldBlur()
      } else {
        this.getTableList(1, "gift")
      }
    },
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
        this[type + "ListSelect"].forEach(item => {
          this[type + "DataSource"].forEach(sitem => {
            if (item.id === sitem.id) {
              sitem.select_number = item.select_number
            }
          })
          this[type + "TargetKeys"].push(item.id + "")
        })
        this.tableLoading = false
        this[type + "Total"] = res.data.total
      })
    },
    handleOk1(type) {
      this[type + "Visible"] = false
      this.form[type + "List"] = []
      this[type + "SelectList"] = []
      this[type + "DataSource"].forEach(item => {
        this[type + "TargetKeys"].forEach(sitem => {
          if (item.key === sitem) {
            this[type + "SelectList"].push(item)
            this.form[type + "List"].push({
              id: item.id,
              number: item.select_number
            })
          }
        })
      })
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
    },
    handleCancel(popName) {
      this[popName + "Visible"] = false
    }
  }
}
</script>

<style lang="less" scoped>
// #HomeVisitActivityGiftInfo {

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
</style>
