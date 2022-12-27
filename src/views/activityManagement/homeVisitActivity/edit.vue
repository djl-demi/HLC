<template>
  <div id="TimedFixedPointActivityOperation">
    <a-row>
      <a-col :span="15">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">
            入户回访活动
          </div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item ref="activityName" label="活动主题：" prop="activityName" has-feedback>
            <a-input v-model="form.activityName" placeholder="请输入活动主题" allowClear :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="plotId" label="小区：" prop="plotId" has-feedback>
            <!-- 下拉搜索 -->
            <a-select
              :value="form.plotId"
              :disabled="query.type === 'edit' ? true : false"
              style="width: 100%"
              placeholder="请选择小区"
              show-search
              :show-arrow="false"
              :filter-option="false"
              @change="handleChangePlot"
              @search="handleSearchPlot"
              allowClear
            >
              <a-select-option v-for="d in communityChartList" :key="d.value">
                {{ d.label }}
              </a-select-option>
            </a-select>
            <!-- <a-select v-model="form.plot_id" :options="communityChartList" placeholder="请选择小区" :disabled="disabled" allowClear /> -->
          </a-form-model-item>
          <a-form-model-item ref="startTime" label="开始时间：" prop="startTime" has-feedback>
            <a-date-picker v-model="form.startTime" show-time placeholder="请选择开始时间" :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="endTime" label="结束时间：" prop="endTime" has-feedback>
            <a-date-picker v-model="form.endTime" show-time placeholder="请选择结束时间" :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="activityDescription" label="活动描述：" prop="activityDescription" has-feedback>
            <a-input v-model="form.activityDescription" placeholder="请输入活动描述" allowClear :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item ref="picUrl" label="图片" prop="picUrl">
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
              <img v-if="form.picUrl" :src="$com.showUpload() + form.picUrl" alt="picUrl" class="upImg" />
              <div v-else>
                <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div class="tips">支持扩展名：jpeg,png,图片大小不超过4MB,最多可上传1张图片</div>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm">取消</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="onNext('HomeVisitActivityPersonInfo')" :disabled="query.type === 'edit' && ![1, 2].includes(state)">下一步</a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 礼品弹窗 -->
    <a-modal :visible="giftVisible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk" @cancel="handleCancel('gift')">
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
    <!-- 物料弹窗 -->
    <a-modal :visible="materialVisible" :confirm-loading="confirmLoading" width="1200px" @ok="handleOk" @cancel="handleCancel('material')">
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
        activityName: undefined,
        plotId: undefined,
        startTime: null,
        endTime: null,
        activityDescription: undefined,
        picUrl: undefined,
        plotNames: undefined
      },
      oriCommunityChartList: null,
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
        activityName: [{ required: true, message: "请输入活动主题", trigger: ["change", "blur"] }],
        plotId: [{ required: true, message: "请选择小区", trigger: ["change", "blur"] }],
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
        ]
      },
      gift_id: "",
      state: "",
      check: false
    }
  },
  async created() {
    // 如果是edit类型 并且有 id 就是编辑状态
    await this.handleSearchPlot(null)
    if (/edit|copy|resupply/.test(this.query.type) && this.query.id) {
      await this.editShow()
    }
    this.dataFill() // 缓存数据恢复
  },
  methods: {
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
        this.timeInvalid = ""
        callback()
      }
    },
    async handleChangePlot(value) {
      this.form.plotId = value
      this.handleSearchPlot(null)
    },
    async handleSearchPlot(value) {
      let _this = this
      if (!value && _this["oriCommunityChartList"]) {
        _this["communityChartList"] = _this["oriCommunityChartList"]
        return
      }
      let res = await _this.$api.getCommunityAllList({ plot_name: value })
      if (!res) return
      let data = res.data.map(item => {
        item.label = item.plot_name
        item.value = item.id
        return item
      })
      if (!value && !_this["oriCommunityChartList"]) {
        _this["oriCommunityChartList"] = data
      }
      _this["communityChartList"] = data
    },
    dataFill() {
      let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
      homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
      if (!homeVisitActivity) return
      Object.keys(this.form).forEach(e => {
        if (Object.prototype.hasOwnProperty.call(homeVisitActivity, e)) {
          if (/startTime|endTime/.test(e)) {
            homeVisitActivity[e] ? (this.form[e] = this.$moment(homeVisitActivity[e])) : null
          } else {
            this.form[e] = homeVisitActivity[e]
          }
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
    async editShow() {
      this.id = this.query.id || ""
      let res = await this.$api.activityDetails({ id: this.id })
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
    onNext(pageName) {
      let { type, id } = this.query
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let homeVisitActivity = JSON.parse(localStorage.getItem("homeVisitActivity"))
          homeVisitActivity = this.checkValidForlocalStorage(homeVisitActivity)
          homeVisitActivity = homeVisitActivity ? homeVisitActivity : {}
          let form = { ...this.form }
          Object.keys(form).forEach(e => {
            if (e === "startTime" || e === "endTime") {
              form[e] ? (form[e] = this.$utils.forMatDate(form[e])) : null
            }
          })
          form.plotNames = this.communityChartList.filter(e => {
            return (form.plotId.constructor === Array && form.plotId.includes(e.id)) || form.plotId === e.id
          })
          Object.assign(homeVisitActivity, form, { editTypeAndId: type + id })

          localStorage.setItem("homeVisitActivity", JSON.stringify(homeVisitActivity))

          this.$router.push({ name: pageName, query: { type, id } })
        }
      })
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
</style>
