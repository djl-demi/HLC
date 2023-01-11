<template>
  <div id="EquipmentAlarmInfo">
    <!-- 垃圾投递亭 -->
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>设备名称：</span>
            <div class="dib"><a-input v-model="device_name" placeholder="请输入设备名称" allowClear /></div>
          </div>
          <div>
            <span>设备编号：</span>
            <div class="dib"><a-input v-model="device_number" placeholder="请输入设备编号" allowClear /></div>
          </div>
          <div>
            <span>告警归属：</span>
            <div class="dib"><a-input v-model="plot_name" placeholder="请输入告警归属" allowClear /></div>
          </div>
          <div>
            <span>时间筛选：</span>
            <div class="dib"><a-range-picker v-model="time" @change="timeChange" allowClear /></div>
          </div>
          <div>
            <span>报警编号：</span>
            <div class="dib"><a-input v-model="serial_number" placeholder="请输入报警编号" allowClear /></div>
          </div>
          <div>
            <span>告警类型：</span>
            <div class="dib"><a-select v-model="type" style="width:213px" :options="alarm_type" placeholder="请选择告警类型" allowClear /></div>
          </div>
          <div>
            <span>设备状态：</span>
            <div class="dib"><a-select v-model="state" style="width:213px" :options="optionType" placeholder="请选择状态" allowClear /></div>
          </div>
          <a-button type="primary" @click="getTableList(1)">搜索</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="dealData">处理</a-button>
          <a-table
            size="middle"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :data-source="dataSource"
            :pagination="false"
            :loading="tableLoading"
            :rowKey="record => record.id"
          >
            <a-table-column key="serial_number" title="报警编号" data-index="serial_number" align="center" :ellipsis="true" />
            <a-table-column key="device_name" title="设备名称" data-index="device_name" align="center" :ellipsis="true" />
            <a-table-column key="device_number" title="设备编号" data-index="device_number" align="center" :ellipsis="true" />
            <a-table-column key="type_text" title="告警类型" data-index="type_text" align="center" :ellipsis="true" />
            <a-table-column key="plot_name" title="告警所属" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column key="location" title="告警位置" data-index="location" align="center" :ellipsis="true" />
            <a-table-column key="warning_time" title="报警时间" data-index="warning_time" align="center" :ellipsis="true" />
            <a-table-column key="end_time" title="结束时间" data-index="end_time" align="center" :ellipsis="true" />
            <a-table-column key="state_text" title="状态" data-index="state_text" align="center" :ellipsis="true" />
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "EquipmentAlarmInfo",
  components: {},
  data() {
    return {
      device_name: "",
      device_number: "",
      plot_name: "",
      serial_number: "",
      type: undefined,
      state: undefined,
      alarm_type: [
        { value: 1, label: "垃圾满溢" },
        { value: 2, label: "开闭故障" },
        { value: 3, label: "设备故障" },
        { value: 4, label: "通讯中断" },
        { value: 5, label: "超温" },
        { value: 6, label: "超重" },
        { value: 7, label: "无桶" },
        { value: 8, label: "防夹手" }
      ],
      optionType: [
        { value: 1, label: "待处理" },
        { value: 2, label: "已处理" }
      ],
      dateString: [],
      // time: [this.$moment().subtract(1, "days"), this.$moment().subtract(1, "days")],
      // start_time: this.$moment()
      //   .subtract(1, "days")
      //   .format("YYYY-MM-DD"),
      // over_time: this.$moment()
      //   .subtract(1, "days")
      //   .format("YYYY-MM-DD"),
      time: [],
      start_time: null,
      over_time: null,
      dataSource: [],
      tableLoading: false,
      total: 0,
      page: 1,
      selectedRowKeys: [],
      delLoading: false
    }
  },
  created() {
    //获取列表
    // this.getTableList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    timeChange(e, v) {
      this.start_time = v[0]
      this.over_time = v[1]
    },

    getTableList(page) {
      if (page) this.page = page
      const data = {
        start_time: this.start_time || "",
        over_time: this.over_time || "",
        device_name: this.device_name || "",
        device_number: this.device_number || "",
        plot_name: this.plot_name || "",
        serial_number: this.serial_number || "",
        type: this.type || "",
        state: this.state || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getEquipmentAlarmInfoList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 处理
    dealData() {
      let that = this
      this.$confirm({
        title: "处理报警",
        content: "是否确定处理该数据吗?",
        onOk() {
          let flag = false //待处理
          that.dataSource.forEach(item => {
            that.selectedRowKeys.forEach(sitem => {
              if (sitem === item.key) {
                if (item.status === "已处理") flag = true
              }
            })
          })
          if (flag) {
            that.$message.error("待处理数据才需要处理")
            return false
          } else {
            that.delLoading = true
            that.tableLoading = true
            that.$api
              .dealEquipmentAlarm({ id: that.selectedRowKeys })
              .then(res => {
                that.delLoading = false
                that.tableLoading = false
                that.getTableList()
                that.$message.info(res.msg)
                that.selectedRowKeys = []
              })
              .catch(err => {
                that.delLoading = false
                that.tableLoading = false
              })
          }
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#EquipmentAlarmInfo {
}
</style>
