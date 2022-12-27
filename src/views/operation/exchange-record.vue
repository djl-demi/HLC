<template>
  <!-- 兑换记录 -->
  <div id="ExchangeRecord">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-left" size="middle" style="margin-bottom:20px">
          <div>
            <span>编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
            <div class="dib"><a-input v-model="searchForm.exchange_no" placeholder="请输入编号" allowClear /></div>
          </div>
          <div>
            <span>居民姓名：</span>
            <div class="dib"><a-input v-model="searchForm.user_name" placeholder="请输入居民姓名" allowClear /></div>
          </div>
          <div>
            <span>联系方式：</span>
            <div class="dib"><a-input v-model="searchForm.phone" placeholder="请输入联系方式" allowClear /></div>
          </div>
          <div>
            <span>操作人：</span>
            <div class="dib"><a-input v-model="searchForm.operator_name" placeholder="请输入操作人" allowClear /></div>
          </div>
          <div>
            <span>礼品名称：</span>
            <div class="dib"><a-input v-model="searchForm.gift_name" placeholder="请输入礼品名称" allowClear /></div>
          </div>
          <div>
            <span>活动类型：</span>
            <div class="dib"><a-select style="width:213px" v-model="searchForm.activity_type" placeholder="请选择活动类型" :options="activityType" allowClear /></div>
          </div>
          <div>
            <span>小区名称：</span>
            <div class="dib"><a-input v-model="searchForm.plot_name" placeholder="请输入小区名称" allowClear /></div>
          </div>
          <div>
            <span>活动主题：</span>
            <div class="dib"><a-input v-model="searchForm.activity_name" placeholder="请输入活动主题" allowClear /></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib">
              <a-range-picker v-model="dateString" @change="onChange" allowClear />
            </div>
          </div>
        </a-space>
        <a-space class="flex-right" size="middle">
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          <a-button icon="export" @click="trackExport">导出</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="exchange_no" title="编号" data-index="exchange_no" align="center" :width="180" :ellipsis="true" />
            <a-table-column key="user_name" title="居民姓名" data-index="user_name" align="center" :ellipsis="true" />
            <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
            <a-table-column key="activity_type_text" title="活动类型" data-index="activity_type_text" align="center" :ellipsis="true" />

            <a-table-column key="activity_name" title="活动主题" data-index="activity_name" align="center" :ellipsis="true" />

            <a-table-column key="gift_name" title="兑换礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
            <a-table-column key="unit_integral" title="积分单价" data-index="unit_integral" align="center" :ellipsis="true" />
            <a-table-column key="num" title="数量" data-index="num" align="center" :ellipsis="true" />
            <a-table-column key="integral" title="消耗积分" data-index="integral" align="center" :ellipsis="true" />
            <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" />
            <a-table-column key="create_time" title="兑换时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="cancel_reason" title="备注" data-index="cancel_reason" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" fixed="right" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button v-if="record.isEdit" type="link" size="small" @click="editData(record)">编辑</a-button>
                <a-button v-else disabled type="link" size="small">编辑</a-button>
                <a-button v-if="record.isEdit" type="link" size="small" @click="showModal(record)">取消订单</a-button>
                <a-button v-if="record.state == 2" type="link" style="color: #ff4d4f" size="small" @click="deleteData(record)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
    <!-- 编辑订单-->
    <a-modal title="编辑订单" :visible="editVisible" :confirm-loading="editLoading" @ok="editHandleOk" @cancel="editHandleCancel">
      <a-form-model ref="ruleForm" :model="editForm" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="gift_name" label="礼品名称" prop="gift_name" has-feedback>
          <span>{{ editForm.gift_name }}</span>
        </a-form-model-item>
        <a-form-model-item ref="left_number" label="剩余数量" prop="left_number" has-feedback>
          <span>{{ editForm.left_number }}</span>
        </a-form-model-item>
        <a-form-model-item ref="exchange_num" label="兑换数量" prop="exchange_num" has-feedback>
          <a-input-number v-model="editForm.exchange_num" :min="1" :max="max_num" @change="onChangeNum" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 取消订单原因 -->
    <a-modal title="取消订单" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form">
        <a-textarea v-model="form.cancel_reason" placeholder="请输入取消原因(3-20字)" :rows="3" />
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "ExchangeRecord",
  data() {
    return {
      delVisible: false,
      searchForm: {
        exchange_no: undefined,
        user_name: undefined,
        phone: undefined,
        operator_name: undefined,
        gift_name: undefined,
        activity_type: undefined,
        plot_name: undefined,
        activity_name: undefined,
        start_time: undefined,
        end_time: undefined
      },
      dateString: undefined,
      activity_theme: "",
      exchange_no: "",
      user_name: "",
      phone: "",
      plot_name: "",
      operator_name: "",
      gift_name: "",
      activity_name: "",
      activity_type: undefined,
      activityType: [
        { label: "宣传活动", value: 1, num: null },
        { label: "入门回访", value: 2, num: null },
        { label: "定时定点活动", value: 4, num: null }
      ],
      dataSource: [],

      tableLoading: false,
      total: 1,
      page: 1,
      form: {
        cancel_reason: ""
      },
      visible: false,
      confirmLoading: false,
      editVisible: false,
      editLoading: false,
      editForm: {
        gift_name: "",
        left_number: "",
        exchange_num: "",
        exchange_order_id: 0
      },
      max_num: ""
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    onChange(date, dateString) {
      this.searchForm.start_time = dateString[0]
      this.searchForm.end_time = dateString[1]
    },
    // 获取兑换记录列表
    getTableList(page) {
      if (page) this.page = page

      const data = {
        page: this.page
      }
      Object.keys(this.searchForm).forEach(e => {
        data[e] = this.searchForm[e] ? this.searchForm[e] : ""
      })
      this.tableLoading = true
      this.$api.getExchangeRecord(data).then(res => {
        const dataSource = res.data.data.map(item => {
          if (item.state == 1) {
            item.isEdit = item.activity_state == 3 || item.activity_state == 8 || item.activity_state == 11 ? true : false
          }
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
        content: '是否确认删除兑换订单"' + record.exchange_no + '" ?',
        onOk() {
          that.$api.deleteExchangeRecord({ exchange_order_id: record.id }).then(res => {
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
      this.editVisible = true
      this.editForm.gift_name = record.gift_name
      this.editForm.left_number = record.left_number
      this.editForm.exchange_num = record.num
      this.max_num = Number(record.left_number) + record.num
      console.log(this.max_num, "max_num")
      this.editForm.exchange_order_id = record.id
    },
    onChangeNum(e) {
      this.editForm.exchange_num = e
    },
    editHandleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.updateExchangeRecord(this.editForm).then(res => {
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
      this.$utils.trackExport("/admin/v1/exchange/export", "searchForm", this)
    },
    //取消订单
    showModal(e) {
      this.visible = true
      this.form = this.$utils.deepCopy(e)
      this.$validator.resetFields(this)
      this.form.cancel_reason = ""
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.cancelExchangeRecord({ id: this.form.id, cancel_reason: this.form.cancel_reason }).then(res => {
            if (res.code == 200) {
              this.$message.info(res.msg)
              this.visible = false
              this.delVisible = true
              this.getTableList()
              this.form = {
                cancel_reason: ""
              }
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.flex-auto {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
}
.flex-left {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.flex-left > div {
  margin-bottom: 10px;
}
.flex-right {
  display: flex;
  flex-direction: column;
}
.flex-right > div {
  margin-bottom: 10px;
}
</style>
