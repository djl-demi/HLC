<template>
  <div id="CommunityManagementOperation">
    <TyReturn></TyReturn>
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-tabs type="card" v-model="menu_select" size="small" @change="tabChange">
        <a-tab-pane v-for="(item, key) in menuList" :key="key" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col>
          <a-space class="facility-title">
            <div class="facility-title-box"></div>
            <div class="facility-title-text">{{ menuList[menu_select].name }}</div>
          </a-space>
          <a-form-model v-if="menu_select === 0" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
            <a-form-model-item ref="activityNo" label="订单号：" prop="activityNo" has-feedback>{{ form.activityNo }}</a-form-model-item>
            <a-form-model-item ref="userName" label="客户：" prop="userName">{{ form.userName }}</a-form-model-item>
            <a-form-model-item ref="userPhone" label="电话：" prop="userPhone" has-feedback>{{ form.userPhone }} </a-form-model-item>
            <a-form-model-item ref="address" label="地址：" prop="address" has-feedback> {{ form.address }}</a-form-model-item>
            <a-form-model-item ref="goodsName" label="回收物品：" prop="goodsName" has-feedback>
              {{ form.goodsName }}
            </a-form-model-item>
            <a-form-model-item ref="startTime" label="上门时间：" prop="startTime" has-feedback>
              {{ form.startTime }}
            </a-form-model-item>
            <a-form-model-item ref="remark" label="备注：" prop="remark">
              {{ form.remark }}
            </a-form-model-item>
            <a-form-model-item ref="startTime" label="创建时间：" prop="startTime">
              {{ form.startTime }}
            </a-form-model-item>
            <a-form-model-item ref="createName" label="创建人:" prop="createName">
              {{ form.createName }}
            </a-form-model-item>
          </a-form-model>
          <a-form-model v-if="menu_select === 1" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 400px">
            <a-form-model-item ref="siteAccountName" label="负责人:" prop="siteAccountName" class="flex-center" has-feedback>
              {{ form.siteAccountName }}
            </a-form-model-item>
            <a-form-model-item ref="activityPeople" label="成员:" prop="activityPeople" class="flex-center">{{ form.activityPeople }}</a-form-model-item>
            <a-form-model-item ref="dispatchTime" label="分配时间：" prop="dispatchTime" class="flex-center" has-feedback>
              {{ form.dispatchTime }}
            </a-form-model-item>
            <a-form-model-item ref="acceptTime" label="接单时间：" prop="acceptTime" class="flex-center" has-feedback>
              {{ form.acceptTime }}
            </a-form-model-item>
            <a-form-model-item ref="finishTime" label="完成时间：" prop="finishTime" class="flex-center" has-feedback>
              {{ form.finishTime }}
            </a-form-model-item>
            <a-form-model-item ref="cancelTime" label="取消时间：" prop="cancelTime" class="flex-center" has-feedback>
              {{ form.cancelTime }}
            </a-form-model-item>
          </a-form-model>
          <div v-if="menu_select === 2">
            <a-table size="middle" :data-source="recoveryData" :loading="recoveryTableLoading" :pagination="false">
              <a-table-column key="userName" title="居民姓名" data-index="userName" align="center" :ellipsis="true" />
              <a-table-column key="categoryName" title="垃圾类型" data-index="categoryName" align="center" :ellipsis="true" />
              <a-table-column key="netWeight" title="净重（kg）" data-index="netWeight" align="center" :ellipsis="true" />
              <a-table-column key="settlement" title="结算单价" data-index="settlement" align="center" :ellipsis="true" />
              <a-table-column key="paidIn" title="实付" data-index="paidIn" align="center" :ellipsis="true" />
              <a-table-column key="operator" title="操作人" data-index="operator" align="center" :ellipsis="true" />
              <a-table-column key="updateTime" title="操作时间" data-index="updateTime" align="center" :ellipsis="true" />
              <a-table-column key="qualityPic" title="图片" data-index="qualityPic" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="$com.showUpload() + item" v-for="(item, key) in record.qualityPic && record.qualityPic.split(',')" :key="key" @click="showPicture(item)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="remark" title="备注" data-index="remark" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="recoveryPage" show-quick-jumper :default-current="1" :total="recoveryTotal" @change="recovery()" />
            </div>
          </div>
          <div v-if="menu_select === 3">
            <a-table size="middle" :data-source="timeWallData" :loading="timeWallTableLoading" :pagination="false">
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="pictureUrl" title="图片" data-index="pictureUrl" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <div class="picurl-list">
                    <img :src="(/https|http/.test(record.pictureUrl) ? '' : $com.showUpload()) + record.pictureUrl" @click="showPicture(record.pictureUrl)" />
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="createTime" title="上传时间" data-index="createTime" align="center" :ellipsis="true" />
            </a-table>
          </div>
          <div v-if="menu_select === 4">
            <a-table size="middle" :data-source="operationData" :loading="operationTableLoading" :pagination="false">
              <a-table-column key="operatorName" title="操作人" data-index="operatorName" align="center" :ellipsis="true" />
              <a-table-column key="createTime" title="时间" data-index="createTime" align="center" :ellipsis="true" />
              <a-table-column key="remark" title="操作" data-index="remark" align="center" :ellipsis="true" />
              <a-table-column key="remarkDetail" title="描述" data-index="remarkDetail" align="center" :ellipsis="true" />
            </a-table>
          </div>
        </a-col>
      </a-row>
    </a-space>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
import difference from "lodash/difference"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "CommunityManagement",
  components: {
    TyReturn
  },
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      address: "",
      // query:"",
      form: {
        updateTime: "",
        activityNo: "",
        userName: "",
        userPhone: "",
        address: "",
        goodsName: "",
        startTime: "",
        remark: "",
        createTime: "",
        createName: "",
        siteAccountName: "",
        activityPeople: "",
        cancelTime: "",
        finishTime: "",
        acceptTime: "",
        dispatchTime: ""
      },
      dataSource2: [],
      dataSource3: [],
      recoveryTableLoading: false,
      recoveryData: [],
      recoveryTotal: 0,
      recoveryPage: 1,
      timeWallTableLoading: false,
      timeWallData: [],
      timeWallTotal: 0,
      timeWallPage: 1,
      operationTableLoading: false,
      operationData: [],
      operationTotal: 0,
      operationPage: 1,
      initLocation: "", // 新增时地图初始经纬度
      type: "add", // 页面状态 编辑/新增
      areaCascaderArea: {}, // 三级联动省市区名称
      locationArr: [], // 地图上的经纬度数组
      location: [], // 地图上的经纬度
      address_details: "", // 地图上的详细地址
      searchAddress: "", // 地址模糊查询
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      rules: {
        plot_name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
        region: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        street: [{ required: true, message: "请输入街道", trigger: "blur" }]
      },
      id: 0,
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
      statusList: [
        { name: "已创建", value: 1 },
        { name: "已分配", value: 2 },
        { name: "已接单", value: 3 },
        { name: "已完成", value: 4 },
        { name: "已取消", value: 5 }
      ],
      menuList: [
        { name: "基本信息", value: 1 },
        { name: "任务时间轴", value: 2 },
        { name: "回收信息", value: 3 },
        { name: "时光墙", value: 4 },
        { name: "操作记录", value: 5 }
      ],
      btnValue: 1,
      tabList: [
        { name: "已创建", value: 1, num: null },
        { name: "已分配", value: 2, num: null },
        { name: "已接单", value: 3, num: null },
        { name: "已完成", value: 4, num: null },
        { name: "已取消", value: 5, num: null }
      ],
      menu_select: 0,
      picUrl: null,
      previewVisible: false
    }
  },
  created() {
    // this.query=this.$route.query
    // 如果是edit类型 并且有 id 就是编辑状态
    // if (this.query.type === "detail" && this.query.id !== "") {

    // } else {
    //   this.show = true
    // }

    if (this.query.type === "detail" && this.query.id !== "") {
      this.id = this.query.id || ""
      this.activityDetails()
    }
  },
  methods: {
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
      // this.selectedRowKeys = []
      if (e === 0 || e === 1) {
        this.activityDetails()
      } else if (e === 2) {
        this.recovery()
      } else if (e === 3) {
        this.getActivityDetail(4, "timeWall")
      } else if (e === 4) {
        this.getActivityDetail(5, "operation")
      }
    },
    recovery() {
      this.recoveryTableLoading = true
      this.$api
        .recovery({ id: this.id, pageNum: this.recoveryPage })
        .then(res => {
          const data = res.data.data.map((e, key) => {
            e.key = key
            return e
          })
          this.recoveryTableLoading = false
          this.recoveryTotal = res.data.total
          this.recoveryData = data
        })
        .catch(e => {
          this.recoveryTableLoading = false
        })
    },
    activityDetails() {
      this.$api.activityDetails({ id: this.id }).then(res => {
        const data = res.data
        Object.keys(this.form).forEach(e => {
          this.form[e] = data[e]
        })
      })
    },
    statusChange(item) {},
    // 表格搜索过滤函数
    filterOption(inputValue, option) {
      return option.gift_name.indexOf(inputValue) > -1
    },
    showGift() {
      //获取列表
      this.getTableList()
      this.visible = true
    },
    // 获取礼品列表
    getTableList() {
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
    // back() {},
    // 地图 详细地址 => 经纬度
    mapInputChange(location) {
      if (this.query.type === "add" && this.form.location === "") {
        this.initLocation = location
      }
      if (location) this.form.location = location
    },
    // 地图拖拽 返回地址, 经纬度
    mapDraggableChange(location) {
      this.form.location = location
    },
    // 详细地址查询 选择某项
    addressSelect(e) {
      this.address = e
      // this.form.plot_name = e
    },
    // 详细地址查询 搜索
    addressSearch(e) {
      if (e !== "") {
        this.searchAddress = e
      }
    },
    // 地图返回模糊查询的列表
    addressList(list) {
      this.dataSource = list
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },

    // 如果是编辑状态,需要恢复页面数据
    getActivityDetail(type, typeName) {
      this.$api.getActivityDetail({ id: this.id, type }).then(res => {
        const data = res.data.map((item, key) => {
          item.key = key
          return item
        })
        this[typeName + "Data"] = data
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
      const data = {
        type: this.form.plot_type || "",
        plot_name: this.form.plot_name || "",
        area_id: this.form.area_id || "",
        // region: this.form.region || "",
        street: this.form.street || "",
        location: this.form.location || "",
        community: this.form.community || "",
        total_number: this.form.total_number || 0,
        at_number: this.form.at_number || 0
      }

      //如果获取不到经纬度坐标信息，则不允许添加
      if (this.form.location == "" || this.form.location == undefined) {
        this.$message.error("该地址定位识别不了")
        return false
      }

      if (this.query.type === "edit") {
        // 编辑
        data.id = this.id.toString()
        this.$api.editCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      } else if (this.query.type === "add") {
        data.create_type = this.form.is_huanbaowu || 0
        // 添加
        this.$api.addCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      }
    },

    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
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

<style lang="less" scoped>
#CommunityManagementOperation {
  .addressSearch {
    position: absolute;
    z-index: 9;
    width: 300px;
    right: 40px;
    top: 40px;
  }
}

.status-select {
  margin-bottom: 10px;
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
</style>
