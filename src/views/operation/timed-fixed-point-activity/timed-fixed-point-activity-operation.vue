<template>
  <div id="TimedFixedPointActivityOperation">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">定时定点活动</div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="activity_name" label="活动主题：" prop="activity_name" has-feedback>
            <a-input v-model="form.activity_name" placeholder="请输入活动主题" allowClear :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="plot_id" label="小区：" prop="plot_id" has-feedback>
            <!-- 下拉搜索 -->
            <a-select
              v-model="form.plot_id"
              :options="communityChartList"
              :disabled="query.type === 'edit' ? true : false"
              mode="multiple"
              :filter-option="$com.filterOption"
              style="width: 100%"
              placeholder="请选择小区"
              allowClear
            ></a-select>
            <!-- <a-select v-model="form.plot_id" :options="communityChartList" placeholder="请选择小区" :disabled="disabled" allowClear /> -->
          </a-form-model-item>
          <a-form-model-item ref="start_time" label="开始时间：" prop="start_time" has-feedback>
            <a-date-picker v-model="form.start_time" show-time placeholder="请选择开始时间" :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="end_time" label="结束时间：" prop="end_time" has-feedback>
            <a-date-picker v-model="form.end_time" show-time placeholder="请选择结束时间" :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="site_account" label="负责人：" prop="site_account_id">
            <a-select
              v-model="form.site_account"
              :options="responsiblerList"
              mode="multiple"
              :filter-option="$com.filterOption"
              style="width: 100%"
              :disabled="disabled"
              placeholder="请选择负责人"
              allowClear
            ></a-select>
            <!-- <a-select v-model="form.site_account_id" :options="responsiblerList" placeholder="请选择负责人" :disabled="disabled" allowClear /> -->
          </a-form-model-item>
          <a-form-model-item ref="warehouse" label="仓库：" prop="warehouse">
            <a-select v-model="form.warehouse" :options="warehouseOptions" :filter-option="$com.filterOption" style="width: 100%" placeholder="请选择仓库" allowClear></a-select>
            <!-- <a-input v-model="form.warehouse" placeholder="请输入仓库" :disabled="disabled" allowClear /> -->
          </a-form-model-item>
          <a-form-model-item ref="activity_description" label="活动描述：" prop="activity_description" has-feedback>
            <a-input v-model="form.activity_description" placeholder="请输入活动描述" allowClear :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="activity_account" label="活动成员：" prop="activity_account" has-feedback>
            <a-select
              v-model="form.activity_account"
              :options="responsiblerList"
              mode="multiple"
              :filter-option="$com.filterOption"
              style="width: 100%"
              :disabled="disabled"
              placeholder="请选择活动成员"
              allowClear
            ></a-select>
          </a-form-model-item>
          <a-form-model-item ref="pic_url" label="图片" prop="pic_url">
            <a-upload
              name="pic"
              :show-upload-list="false"
              list-type="picture-card"
              class="avatar-uploader"
              :action="$com.uploadUrl()"
              :before-upload="file => $utils.beforeUpload(file, this)"
              @change="handleChange"
              @preview="handlePreview"
            >
              <img v-if="form.pic_url" :src="$com.showUpload() + form.pic_url" alt="pic_url" class="upImg" />
              <div v-else>
                <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div class="tips">支持扩展名：jpeg,png,图片大小不超过4MB,最多可上传1张图片</div>
          </a-form-model-item>
          <a-form-model-item ref="activity_gift" label="礼品：" prop="activity_gift">
            <!-- <a-select v-model="form.gift" placeholder="请选择礼品" @change="showGift" allowClear /> -->
            <a-button type="primary" @click="showGift"> 点击选择礼品 </a-button>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm"> 取消 </a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onSubmit"> 保存 </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 礼品弹窗 -->
    <a-modal :visible="visible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk" @cancel="handleCancel">
      <div class="p20">
        <a-transfer :data-source="dataSource" :titles="['未选择的礼品', '已选择的礼品']" :target-keys="targetKeys" :filter-option="filterOption" show-search :show-select-all="true" @change="onChange">
          <!-- filteredItems:	过滤后的数据-->
          <template slot="children" slot-scope="{ props: { direction, filteredItems, selectedKeys }, on: { itemSelectAll, itemSelect } }">
            <a-table :row-selection="getRowSelection({ selectedKeys, itemSelectAll, itemSelect })" :pagination="false" :data-source="filteredItems" size="small">
              <template v-if="direction === 'left'">
                <a-table-column v-for="item in leftColumns" :key="item.dataIndex" :title="item.title" :data-index="item.dataIndex" />
              </template>
              <template v-else>
                <a-table-column key="gift_name" title="名称" align="center" data-index="gift_name" />
                <a-table-column key="number" title="当前库存" align="center" data-index="number" />
                <a-table-column key="select_number" title="数量" align="center" data-index="select_number">
                  <template slot-scope="text, record">
                    <a-input-number :id="record.dataIndex" v-model="record.select_number" :precision="0" :min="0" />
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </template>
        </a-transfer>
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
        activity_name: "",
        plot_id: undefined,
        // dateString:[],
        start_time: null,
        end_time: null,
        site_account_id: undefined,
        warehouse: undefined,
        activity_description: "",
        activity_account: [],
        site_account: [],
        pic_url: "",
        activity_gift: []
      },
      warehouseOptions: [], //仓库列表
      communityChartList: [], // 小区信息列表
      responsiblerList: [], //负责人列表
      type: "add", // 页面状态 编辑/新增
      visible: false, //礼品弹窗
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
        activity_name: [{ required: true, message: "请输入活动主题", trigger: "blur" }],
        plot_id: [{ required: true, message: "请选择小区", trigger: "change" }],
        start_time: [{ required: true, message: "请选择开始时间", trigger: "change" }],
        end_time: [{ required: true, message: "请选择结束时间", trigger: "change" }],
        site_account: [{ required: true, message: "请选择负责人", trigger: "change" }],
        warehouse: [{ required: true, message: "请选择仓库", trigger: "change" }],
        activity_account: [{ required: true, message: "请选择活动成员", trigger: "change" }]
      },
      gift_id: "",
      state: ""
    }
  },
  created() {
    this.getResponsiblerList()
    this.getWareHousesList()

    this.$com.getCommunityAllList(this, "communityChartList") // 小区信息列表
    // 如果是edit类型 并且有 id 就是编辑状态
    if ((this.query.type === "edit" || "copy") && this.query.id !== "") {
      this.editShow()
    } else {
      this.show = true
    }
  },
  methods: {
    // 仓库列表
    getWareHousesList() {
      this.$api.getWarehouseName().then(res => {
        this.warehouseOptions = res.data.map(item => {
          item.label = item.name
          item.value = item.id
          return item
        })
      })
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
      this.$api.viewActivity({ id: this.id }).then(res => {
        this.state = res.data.state
        const data = res.data
        const activity_name = data.activity_name || ""
        const plot_id = data.plot_id || undefined
        const start_time = this.$moment(data.start_time) || undefined
        const end_time = this.$moment(data.end_time) || undefined

        // const site_account_id = data.site_account_id || undefined
        const warehouse = data.warehouse || ""
        const activity_description = data.activity_description || ""
        const site_account = data.site_account.map(item => {
          return item.account_id
        })
        const activity_account = data.activity_account.map(item => {
          return item.account_id
        })
        const pic_url = data.pic_url || ""
        const activity_gift = data.activity_gift || []

        this.form.activity_name = activity_name
        this.form.plot_id = plot_id
        this.form.start_time = start_time
        this.form.end_time = end_time
        this.form.site_account = site_account
        this.form.warehouse = warehouse
        this.form.activity_description = activity_description
        this.form.activity_account = activity_account
        this.form.pic_url = pic_url
        this.form.activity_gift = activity_gift

        if (this.query.type === "edit" && (res.data.state === 3 || res.data.state !== 1)) {
          this.disabled = true
        }
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //礼品列表弹窗
    showGift() {
      //获取列表
      this.getTableList(1)
      this.visible = true
    },
    // 获取礼品列表
    getTableList(page) {
      if (page) this.page = page
      this.tableLoading = true
      let data = {
        pageNum: this.page,
        pageSize: 20,
        type: 1,
        warehouseId: this.form.warehouse || "",
        giftName: ""
      }
      this.$api.giftAndMaterial(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id + ""
          item.title = item.giftName
          item.select_number = item.giftNo
          item.gift_no = item.giftNo
          item.gift_name = item.giftName
          item.number = item.shouldResidueStock
          item.sell_price = item.sellPrice
          item.integral_price = item.integralPrice
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

      // this.$api.activityGift().then(res => {
      //   this.dataSource = res.data.map(item => {
      //     item.key = item.id + ""
      //     item.title = item.gift_name
      //     item.select_number = item.number
      //     return item
      //   })
      //   // 设置应该选中的礼品
      //   this.targetKeys = []
      //   this.form.activity_gift.forEach(item => {
      //     this.dataSource.forEach(sitem => {
      //       if (item.gift_id === sitem.id) {
      //         sitem.select_number = item.number
      //       }
      //     })
      //     this.targetKeys.push(item.gift_id + "")
      //   })
      //   this.tableLoading = false
      //   this.total = res.data.total
      // })
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
    handleOk() {
      this.visible = false
      this.form.activity_gift = []
      this.dataSource.forEach(item => {
        this.targetKeys.forEach(sitem => {
          if (item.key === sitem) {
            this.form.activity_gift.push({
              gift_id: item.id,
              number: item.select_number,
              gift_name: item.gift_name
            })
          }
        })
      })
    },
    handleCancel() {
      this.visible = false
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
</style>
