<template>
  <!-- 车辆类型 -->
  <div class="VehicleTyppe">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="fr">
          <a-button type="primary" icon="plus" @click="operation('add')">新增</a-button>
        </a-space>
      </div>

      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="车辆类型" data-index="typeName" align="center" :ellipsis="true" />
            <a-table-column title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="operation('edit', record)">编辑</a-button>
                <a-button type="link" size="small" @click="del(record)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="operationTitle" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="600">
      <a-form-model ref="ruleForm" :model="typeForm" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="vehicle_type" label="车辆类型" prop="vehicle_type" has-feedback>
          <a-input v-model="typeForm.vehicle_type" placeholder="请输入车辆类型" class="w100b" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "VehicleTyppe",
  data() {
    return {
      typeForm: {
        vehicle_type: ""
      },
      dataSource: [],
      operationTitle: "新增车辆类型",
      operationVisible: false,
      operationLoading: false,
      tableLoading: false,
      page: 1,
      total: 0,
      rules: {
        vehicle_type: [{ required: true, message: "请输入车辆类型", trigger: "blur" }]
      },
      edit_id: ""
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取列表
    getTableList() {
      let data = {
        pageNum: this.page,
        pageSize: 10
      }
      this.$api.getVehicleTypeList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.total = res.data.total
      })
    },
    // 操作
    operation(type, record = null) {
      this.$validator.resetFields(this)
      this.operationVisible = true
      if (type === "add") {
        this.operationTitle = "新增车辆类型"
        this.typeForm.vehicle_type = ""
      } else if (type === "edit") {
        this.operationTitle = "编辑车辆类型"
        this.edit_id = record.id
        this.typeForm.vehicle_type = record.typeName
        this.operationVisible = true
      }
    },
    // 删除
    del(record) {
      let that = this
      that.$confirm({
        title: "确认删除?",
        content: h => <div style="color:red;">确认删除该车辆类型"{record.typeName}"？</div>,
        onOk() {
          that.$api.delVehicleType({ id: record.id }).then(res => {
            that.getTableList()
            that.$message.success(res.msg)
          })
        },
        onCancel() {
          that.$message.info("取消")
        }
      })
    },
    // 新增车辆类型
    operationOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let api =
            this.operationTitle === "新增车辆类型"
              ? this.$api.saveVehicleType({ typeName: this.typeForm.vehicle_type })
              : this.$api.updateVehicleType({ id: this.edit_id, typeName: this.typeForm.vehicle_type })
          api.then(res => {
            this.getTableList()
            this.$message.success(res.msg)
            this.operationVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped></style>
