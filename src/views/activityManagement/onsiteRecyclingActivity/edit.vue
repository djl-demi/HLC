<template>
  <div id="TimedFixedPointActivityOperation">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">
            上门回收活动
          </div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="userName" label="客户：" prop="userName" has-feedback>
            <a-input v-model="form.userName" placeholder="请选择客户" allowClear @click="focusAction" @input="inputAction" />
          </a-form-model-item>
          <a-form-model-item label="电话：" prop="userPhone" has-feedback class="userPhone">
            <a-input v-model="form.userPhone" disabled />
          </a-form-model-item>
          <a-form-model-item label="回收物品：" prop="goodsIdArr" has-feedback>
            <a-checkbox-group v-model="form.goodsIdArr" :options="goodsDataList" />
          </a-form-model-item>
          <a-form-model-item label="上门时间：" prop="startTime" has-feedback>
            <a-date-picker v-model="form.startTime" show-time />
          </a-form-model-item>
          <a-form-model-item label="备注：" prop="remark" has-feedback>
            <a-input v-model="form.remark" placeholder="请输入活动备注" allowClear />
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm"> 取消 </a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onSubmit" :disabled="query.type === 'edit' && state !== 1"> 保存 </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 客户弹窗 -->
    <a-modal :visible="customerVisible" :confirm-loading="confirmLoading" width="800px" @ok="handleOk" @cancel="handleCancel('customer')">
      <div class="p20">
        <div class="customerform">
          <a-input placeholder="请输入用户名" v-model="searchform.userName" allowClear class="a-input" />
          <a-button type="primary" @click="getUserTableList(1)" :loading="tableLoading">搜索</a-button>
        </div>
        <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="userDataSource" :pagination="false" :loading="tableLoading">
          <a-table-column key="userName" title="姓名" data-index="userName" align="center" :ellipsis="true" />
          <a-table-column key="phone" title="电话" data-index="phone" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getUserTableList()" />
        </div>
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
      isSubmit: false,
      userDataSource: [],
      customerVisible: false,
      total: 0,
      page: 1,
      plotDisabled: false,
      disabled: false, //禁用
      filteredItems: [],
      form: {
        userId: undefined,
        userName: undefined,
        userPhone: undefined,
        goodsIdArr: [],
        remark: undefined,
        startTime: undefined
      },
      searchform: {
        userName: undefined
      },
      goodsDataList: [],
      userInfo: [],
      communityChartList: [], // 小区信息列表
      responsiblerList: [], //负责人列表
      type: "add", // 页面状态 编辑/新增
      giftVisible: false, //礼品弹窗
      materialVisible: false, //物料弹窗
      confirmLoading: false,

      previewImage: "",
      imgLoading: false,

      selectedRowKeys: [],
      electedRowKeys: [],
      tableLoading: false, //表格

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
        userName: [{ required: true, message: "请选择用户", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择上门时间", trigger: ["change", "blur"] }]
      },
      gift_id: "",
      state: ""
    }
  },
  created() {
    this.getResponsiblerList()
    this.$com.getCommunityAllList(this, "communityChartList") // 小区信息列表
    // 如果是edit类型 并且有 id 就是编辑状态
    if (this.query.type === ("edit" || "copy") && this.query.id !== "") {
      this.editShow()
    } else {
      this.getGoodsData()
      this.show = true
    }
  },
  watch: {
    "form.userName": {
      handler(val) {
        this.$refs.userName.onFieldBlur()
      },
      deep: true
    }
  },
  methods: {
    getGoodsData(goodsName) {
      this.form.goodsIdArr = []
      this.$api.getGoodsData().then(res => {
        this.goodsDataList = res.data.filter(e => {
          e.label = e.goodsName
          e.value = e.id
          delete e.goodsName
          delete e.id
          if (Array.isArray(goodsName) && goodsName.length && goodsName.includes(e.label)) {
            this.form.goodsIdArr.push(e.value)
          }
          return e
        })
      })
    },
    inputAction() {
      this.form.userId = undefined
      this.form.userName = undefined
      this.form.userPhone = undefined
    },
    focusAction() {
      this.getUserTableList()
      this.customerVisible = true
    },
    // 获取用户信息
    getUserTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page
      }
      if (this.searchform.userName) data["userName"] = this.searchform.userName
      this.tableLoading = true
      this.$api.getUserData(data).then(res => {
        const userDataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.userDataSource = userDataSource
      })
    },
    handleOk() {
      this.customerVisible = false
      let selectedRowKeys = this.selectedRowKeys.length ? this.selectedRowKeys[0] : undefined
      this.userDataSource.forEach(e => {
        if (e.id === selectedRowKeys) {
          this.form.userId = e.id
          this.form.userName = e.userName
          this.form.userPhone = e.phone
        }
      })
      this.selectedRowKeys = []
    },
    handleCancel(popName) {
      this[popName + "Visible"] = false
      this.selectedRowKeys = []
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
    // 如果是编辑状态,需要恢复页面数据
    editShow() {
      this.id = this.query.id || ""
      this.$api.getActivityDetail({ id: this.id, type: 1 }).then(res => {
        const data = res.data
        this.state = data.state
        Object.keys(this.form).forEach(e => {
          if (/startTime/.test(e)) {
            data[e] ? (this.form[e] = this.$moment(data[e])) : null
          } else {
            data[e] !== undefined ? (this.form[e] = data[e]) : null
          }
        })
        let goodsName = data.goodsName && data.goodsName.split(",")

        this.getGoodsData(goodsName)
        // if (this.query.type === "edit") {
        //   this.plotDisabled = true
        // }
        this.show = true
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
      if (this.isSubmit) return
      this.isSubmit = true
      const data = {}
      Object.keys(this.form).forEach(e => {
        if (e === "startTime") {
          data[e] = this.$utils.forMatDate(this.form[e])
        } else if (e !== "userName" && e !== "userPhone") {
          data[e] = this.form[e]
        }
      })

      if (this.query.type === "edit") {
        // 编辑
        data.id = this.id
        this.$api
          .alterActivity(data)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: "OnsiteRecyclingActivityList" })
            }, 1000)
            this.isSubmit = false
          })
          .catch(e => {
            this.isSubmit = false
          })
      } else if (this.query.type === "add") {
        // 添加
        this.$api
          .addActivity(data)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
            } else {
              this.$message.info(res.msg)
            }
            setTimeout(() => {
              this.$router.push({ name: "OnsiteRecyclingActivityList" })
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = [selectedRowKeys.pop()]
    },
    //礼品列表弹窗
    showGift() {
      //获取列表
      this.getTableList()
      this.giftVisible = true
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

.customerform {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}
.a-input {
  width: 200px;
  margin-right: 20px;
}

.userPhone .ant-input {
  background: #fff;
  color: rgba(0, 0, 0, 0.65);
}
</style>
