<template>
  <div id="TradingManagement">
    发电机
    <!-- <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>订单编号：</span>
            <div class="dib"><a-input v-model="stock_no" class="w200" placeholder="请输入订单编号" allowClear /></div>
          </div>
          <div>
            <span>姓名：</span>
            <div class="dib"><a-input v-model="name" class="w200" placeholder="请输入姓名" allowClear /></div>
          </div>
          <div>
            <span>联系方式：</span>
            <div class="dib"><a-input v-model="phone" class="w200" placeholder="请输入联系方式" allowClear /></div>
          </div>
          <div>
            <span>投放类型：</span>
            <div class="dib"><a-select v-model="launch_type" class="w200" placeholder="全部类型" :options="launch_type_options" allowClear /></div>
          </div>
          <div>
            <span>支付方式：</span>
            <div class="dib"><a-select v-model="pay_way" class="w200" placeholder="全部支付方式" :options="pay_way_options" allowClear /></div>
          </div>
          <div>
            <span>订单状态：</span>
            <div class="dib"><a-select v-model="status" class="w200" placeholder="全部订单" :options="order_sataus" allowClear /></div>
          </div>
          <div>
            <span>小区：</span>
            <div class="dib"><a-input v-model="plot_name" class="w200" placeholder="请输入小区" allowClear /></div>
          </div>
          <div>
            <span>时间筛选：</span>
            <div class="dib">
              <a-range-picker v-model="dateString" class="w200" @change="onChange" :disabledDate="disabledDate" allowClear />
            </div>
          </div>
          <div>
            <span>投放方式：</span>
            <div class="dib"><a-select v-model="launch_way" class="w200" placeholder="全部方式" :options="launch_way_options" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-button icon="edit" @click="launchRate">投放准确率</a-button>
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div> 
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :scroll="{ x: 1800 }" :loading="tableLoading" :rowKey="record => record.stock_no">
            <a-table-column key="stock_no" title="订单编号" data-index="stock_no" align="center" :width="240" :ellipsis="true" />
            <a-table-column key="can_house_name" title="投放点" data-index="can_house_name" align="center" :width="200" :ellipsis="true" />
            <a-table-column key="type_text" title="投放类型" data-index="type_text" align="center" :width="200" :ellipsis="true" />
            <a-table-column key="create_time" title="创建时间" data-index="create_time" align="center" :width="160" :ellipsis="true" />
            <a-table-column key="way_name" title="投放方式" data-index="way_name" align="center" :width="200" :ellipsis="true" />
            <a-table-column key="user_name" title="居民姓名" data-index="user_name" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :width="120" :ellipsis="true" />
            <a-table-column key="category_name" title="物品品类" data-index="category_name" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="goods_name" title="物品名称" data-index="goods_name" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :width="200" :ellipsis="true" />
            <a-table-column key="house_number" title="门牌" data-index="house_number" align="center" :width="100" :ellipsis="true" /> 
            <a-table-column key="net_weight" title="净重" data-index="net_weight" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="unit_cost" title="结算单价" data-index="unit_cost" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="money" title="实付" data-index="money" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="pay_way" title="支付方式" data-index="pay_way" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="status_name" title="订单状态" data-index="status_name" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="note" title="备注" data-index="note" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="operator" title="操作人" data-index="operator" align="center" :width="100" :ellipsis="true" />
            <a-table-column key="face_pic" title="人脸照片" data-index="face_pic" align="center" :width="100" :ellipsis="true">
              <template slot-scope="text, record" v-if="record.face_pic">
                <div class="picurl-list">
                  <img width="30" height="30" :src="$com.showUpload() + record.face_pic" @click="showPicture(record.face_pic)" />
                </div>
              </template>
            </a-table-column>
            <a-table-column key="option" title="操作" data-index="option" align="center" fixed="right" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button v-if="record.status !== 3" type="link" size="small" @click="editData(record)">编辑</a-button>
                <a-button type="link" style="color: #ff4d4f" v-if="record.status === 3" size="small" @click="deleteData(record)">删除</a-button>
                <a-button v-if="record.status !== 3" type="link" size="small" @click="showModal(record)">取消订单</a-button>
                <a-button v-if="record.status === 4" type="link" size="small" @click="showAudit(record)">审核</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space> -->
    <!-- 编辑订单-->
    <!-- <a-modal title="编辑订单" :visible="editVisible" :confirm-loading="editLoading" @ok="editHandleOk" @cancel="editHandleCancel">
      <a-form-model ref="ruleForm" :model="editForm" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="category_name" label="物品品类" prop="category_name" has-feedback>
          <span>{{ editForm.category_name }}</span>
        </a-form-model-item>
        <a-form-model-item ref="goods_name" label="物品名称" prop="goods_name" has-feedback>
          <span>{{ editForm.goods_name }}</span>
        </a-form-model-item>
        <a-form-model-item ref="net_weight" label="净重" prop="net_weight" has-feedback>
          <a-input v-model="editForm.net_weight" suffix="kg" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
    <!-- 投放准确率 -->
    <!-- <a-modal title="投放准确率" :visible="launchRateVisible" :confirm-loading="confirmLoading" @ok="submitLaunchRate" @cancel="cancelLaunchRateForm">
      <a-form-model ref="launchRateForm" :model="launchRateForm" :rules="launchRateRules">
        <a-form-model-item ref="rate" label="投放准确率：" prop="rate" class="flex-center" has-feedback>
          <a-input-number v-model="launchRateForm.rate" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" style="width:200px" />
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
    <!-- 取消订单原因 -->
    <!-- <a-modal title="取消订单" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form">
        <a-textarea v-model="form.cancel_reason" placeholder="请输入取消原因(3-20字)" :rows="3" />
      </a-form-model>
    </a-modal> -->
    <!-- 审核 -->
    <!-- <a-modal v-model="showAuditVisible" title="审核" @cancel="auditCancel">
      <p>是否通过审核？</p>
      <template slot="footer">
        <a-button @click="auditCancel"> 取消 </a-button>
        <a-button type="danger" :loading="auditNoLoading" @click="auditNo"> 不通过 </a-button>
        <a-button type="primary" :loading="auditYesLoading" @click="auditYes"> 通过 </a-button>
      </template>
    </a-modal> -->

    <!-- 图片预览 -->
    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal> -->
  </div>
</template>
<script>
export default {
  name: "TradingManagement",
  data() {
    return {
      start_time: this.$moment()
        .startOf("day")
        .subtract(6, "days"),
      over_time: this.$moment().endOf("day"),
      dateString: [
        this.$moment()
          .startOf("day")
          .subtract(6, "days"),

        this.$moment().endOf("day")
      ],
      // dateString: [],
      // start_time: "",
      // over_time: "",
      stock_no: "",
      name: "",
      phone: "",
      status: undefined, //下拉选择框初始值undefined
      plot_name: "",
      pay_way: undefined,
      launch_type: undefined,
      launch_way: undefined,
      order_sataus: [
        { value: "1", label: "待入库" },
        { value: "2", label: "已入库" },
        { value: "3", label: "已取消" },
        { value: "4", label: "待审核" }
      ],
      launch_type_options: [
        { value: "4", label: "宣传活动" },
        { value: "5", label: "入户回访" },
        { value: "3", label: "上门回收" },
        { value: "6", label: "定时定点" },
        { value: "1", label: "分类厢房" },
        { value: "2", label: "其它" }
      ],
      launch_way_options: [
        { value: "2", label: "手机号" },
        { value: "1", label: "扫码" },
        { value: "3", label: "刷卡" },
        { value: "4", label: "无认证用户" },
        { value: "9", label: "人脸识别" }
        // { value: "5", label: "上门回收" },
        // { value: "6", label: "宣传" },
        // { value: "7", label: "回访" },
        // { value: "8", label: "定时定点" }
      ],
      pay_way_options: [
        { value: "1", label: "现金支付" },
        { value: "2", label: "积分支付" }
      ],
      dataSource: [], //交投管理列表
      tableLoading: false,
      total: 1,
      page: 1,
      form: {
        cancel_reason: ""
      },
      launchRateVisible: false,
      launchRateForm: {
        rate: 0
      },
      launchRateRules: {
        rate: [{ required: true, message: "请输入投放准确率", trigger: "blur" }]
      },
      visible: false,
      confirmLoading: false,
      showAuditVisible: false,
      currentOrder: {},
      auditYesLoading: false,
      auditNoLoading: false,
      picUrl: null,
      previewVisible: false,

      editVisible: false,
      editLoading: false,
      editForm: {
        category_name: "",
        goods_name: "",
        net_weight: 0
      },
      delVisible: false
    }
  },
  created() {
    // 默认给一个筛选初始时间
    // this.initDate()
    //获取列表
    // this.getTableList()
    // this.getLaunchRate()
  },
  methods: {
    // 限制3个月日期选择
    disabledDate(current) {
      return (
        current &&
        current <
          this.$moment()
            .subtract(3, "month")
            .endOf("day")
      )
    },
    //获取今天日期，格式YYYY-MM-DD
    initDate() {
      var date = new Date()
      var seperator1 = "-"
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = "0" + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
      }
      var end = year + seperator1 + month + seperator1 + strDate
      var start = year + seperator1 + month + seperator1 + "01"
      this.dateString = [start, end]
      this.start_time = start
      this.over_time = end
    },
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 获取礼品入库列表
    getTableList(page) {
      if (page) this.page = page
      let start_time = this.$utils.forMatDay(this.start_time)
      let over_time = this.$utils.forMatDay(this.over_time)
      const data = {
        stock_no: this.stock_no || "",
        name: this.name || "",
        phone: this.phone || "",
        plot_name: this.plot_name || "",
        status: this.status || "",
        start_time: this.start_time == "" ? "" : start_time,
        over_time: this.over_time == "" ? "" : over_time,
        type: this.launch_type || "",
        way: this.launch_way || "",
        pay_way: this.pay_way || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getTradingManagementList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.release_name = item.can_house_status == 1 ? item.can_name : item.house_name
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 表格删除
    deleteData(record) {
      let that = this
      this.$confirm({
        title: "删除",
        content: '是否确认删除投递订单"' + record.stock_no + '" ?',
        onOk() {
          that.$api.deleteTradingManagement({ stock_in_id: record.id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 表格编辑
    editData(record) {
      console.log(record, "record")
      this.editVisible = true
      this.editForm.goods_name = record.goods_name
      this.editForm.category_name = record.category_name
      this.editForm.net_weight = record.net_weight
      this.editForm.stock_in_id = record.id
    },
    editHandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.updateTradingManagement(this.editForm).then(res => {
            this.$message.info(res.msg)
            this.editVisible = false
            this.getTableList()
          })
        }
      })
    },
    editHandleCancel() {
      this.editVisible = false
    },
    //导出
    trackExport() {
      let stock_no = this.stock_no || ""
      let phone = this.phone || ""
      let name = this.name || ""
      let status = this.status || ""
      let plot_name = this.plot_name || ""
      let start_time = this.$utils.forMatDay(this.start_time) || ""
      let over_time = this.$utils.forMatDay(this.over_time) || ""

      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}/admin/v1/trade/export?token=${token}&name=${name}&stock_no=${stock_no}&phone=${phone}&status=${status}&plot_name=${plot_name}&start_time=${start_time}&over_time=${over_time}`
      )
    },
    //取消订单
    showModal(e) {
      this.visible = true
      this.form = this.$utils.deepCopy(e)
      this.$validator.resetFields(this)
    },
    // 审核
    showAudit(record) {
      this.currentOrder = record
      this.showAuditVisible = true
    },

    // 取消审核
    auditCancel() {
      this.showAuditVisible = false
      this.currentOrder = {}
    },

    // 审核通过
    auditYes() {
      this.auditJiaotou(this.currentOrder.id, this.currentOrder.user_id, 1)
    },

    // 审核不通过
    auditNo() {
      this.auditJiaotou(this.currentOrder.id, this.currentOrder.user_id, 2)
    },

    // 交投审核
    auditJiaotou(id, user_id, state) {
      let data = {
        id: id,
        user_id: user_id,
        state: state
      }
      state === 1 ? (this.auditYesLoading = true) : (this.auditNoLoading = true)
      this.$api
        .auditJiaotou(data)
        .then(res => {
          state === 1 ? (this.auditYesLoading = false) : (this.auditNoLoading = false)
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getTableList()
            this.showAuditVisible = false
          }
        })
        .catch(() => {
          state === 1 ? (this.auditYesLoading = false) : (this.auditNoLoading = false)
        })
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.postTradingManagement({ stock_no: this.form.stock_no, cancel_reason: this.form.cancel_reason }).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.delVisible = true
            this.getTableList()
            this.form = {
              cancel_reason: ""
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    // 获取投放准确
    getLaunchRate() {
      this.$api
        .getPrecisionRate()
        .then(res => {
          this.launchRateForm.rate = res.data.precision
        })
        .catch(err => {})
    },
    // 投放准确率
    launchRate() {
      this.launchRateVisible = true
    },
    // 提交投放准确率
    submitLaunchRate() {
      this.$refs.launchRateForm.validate(valid => {
        if (valid) {
          let data = {
            precision: this.launchRateForm.rate
          }

          this.$api
            .precisionSet(data)
            .then(res => {
              this.$message.info(res.msg)
              this.launchRateVisible = false
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 取消分类准确率
    cancelLaunchRateForm() {
      this.launchRateVisible = false
      this.$refs.launchRateForm.resetFields()
    }
  }
}
</script>

<style lang="less">
// #TradingManagement {
// }
</style>
