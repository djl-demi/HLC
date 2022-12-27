<template>
  <div id="OrderRecords">
    指令反馈
  </div>
</template>

<script>
const columns = [
  { title: "订单编号", dataIndex: "exchange_no", key: "exchange_no" },
  { title: "下单时间", dataIndex: "create_time", key: "create_time" },
  { title: "居民姓名", key: "user_info", scopedSlots: { customRender: "user_info" } },
  { title: "电话", dataIndex: "phone", key: "phone" },
  { title: "小区", dataIndex: "plot_name", key: "plot_name" },
  { title: "楼号", dataIndex: "building_no", key: "building_no" },
  { title: "订单总价", dataIndex: "integral", key: "integral" },
  { title: "状态", dataIndex: "state_text", key: "state_text" },
  { title: "操作", key: "operation", scopedSlots: { customRender: "operation" } }
]
const innerColumns = [
  { title: "商品详情", dataIndex: "good", key: "good" },
  { title: "单价（积分）", dataIndex: "unit_integral", key: "unit_integral" },
  { title: "数量", dataIndex: "num", key: "num" }
]
export default {
  components: {},
  name: "OrderRecords",
  data() {
    return {
      columns,
      innerColumns,
      dataSource: [{}],
      exchange_no: "",
      merchandise_brand: "",
      merchandise_name: "",
      user_name: "",
      plot_name: "",
      building_no: "",
      phone: "",
      total: 1,
      page: 1,
      tableLoading: false,
      selectedRowKeys: [],
      delLoading: false,
      status: undefined,
      order_sataus: [
        { value: 1, label: "待发货" },
        { value: 2, label: "待收货" },
        { value: 3, label: "已完成" },
        { value: 4, label: "已取消" }
      ],
      //弹窗相关
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        courier_number: ""
      },

      rules: {
        courier_number: [{ required: true, message: "请输入快递单号", trigger: "blur" }]
      }
    }
  },
  computed: {},
  created() {
    //获取列表
    // this.getTableList()
  },
  methods: {
    // 获取分拣站列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        exchange_no: this.exchange_no || "",
        merchandise_brand: this.merchandise_brand || "",
        merchandise_name: this.merchandise_name || "",
        user_name: this.user_name || "",
        plot_name: this.plot_name || "",
        building_no: this.building_no || "",
        phone: this.phone || "",
        state: this.status || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.orderList(data).then(res => {
        let dataSource = [],
          goods = [],
          total_integral = 0
        res.data.data.map((item, index) => {
          dataSource[index] = {
            exchange_no: item.exchange_no,
            create_time: item.create_time,
            user_name: item.user_name,
            building_no: item.building_no,
            plot_name: item.plot_name,
            phone: item.phone,
            state_text: item.state_text,
            state: item.state,
            key: item.id,
            integral: 0,
            innerDataSource: []
          }
          ;(goods = []), (total_integral = 0)
          item.exchange_detail.map((item2, index2) => {
            total_integral += item2.integral
            goods[index2] = {
              good: item2.merchandise_type_name + "-" + item2.merchandise_name,
              unit_integral: item2.unit_integral,
              num: item2.num,
              key: item.id + "-" + index2
            }
          })
          dataSource[index].integral = total_integral
          dataSource[index].innerDataSource = goods
        })
        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 编辑
    sendGoods(id) {
      this.form.courier_number = ""
      this.form.id = id
      this.visible = true
    },

    // 确定发货
    handleOk() {
      this.$api.orderSend(this.form).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.visible = false
          this.getTableList()
        }
      })
    },
    // 取消订单
    sendCancel(id = "", orderNo = "") {
      let that = this
      that.$confirm({
        title: "取消",
        content: '是否确认取消订单"' + orderNo + '"',
        onOk() {
          that.$api.orderCancel({ id }).then(res => {
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
    }
  }
}
</script>

<style lang="less">
.words {
  letter-spacing: 3.5px;
}
// #OrderRecords {
// }
</style>
