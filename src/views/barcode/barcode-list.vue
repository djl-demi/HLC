<template>
  <div class="BarCodeList">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="fl mb10" size="middle">
          <div>
            <span>条码编号：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <div>
            <span>是否绑定：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <div>
            <span>绑定时间：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <div>
            <span>绑定居民：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <div>
            <span>创建时间：</span>
            <div class="dib"><a-input v-model="filter.batchNo" placeholder="请输入批次号" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr"> </a-space>
      </div>

      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-space class="w100b">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="二维码编码" data-index="num" align="center" :ellipsis="true" />
            <a-table-column title="垃圾袋类型" data-index="num" align="center" :ellipsis="true" />
            <a-table-column title="是否导出" data-index="garbageBagNums" align="center" :ellipsis="true" />
            <a-table-column title="导出时间" data-index="garbageBagType" align="center" :ellipsis="true" />
            <a-table-column title="绑定时间" data-index="isExport" align="center" :ellipsis="true" />
            <a-table-column title="绑定来源" data-index="isExport" align="center" :ellipsis="true" />
            <a-table-column title="绑定居民" data-index="isExport" align="center" :ellipsis="true" />
            <a-table-column title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="operation('edit', record)">编辑</a-button>
                <a-button type="link" size="small" @click="resetPwd(record)">导出</a-button>
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
      <a-form-model ref="ruleForm" :model="driverForm" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="phone" label="联系方式" prop="phone" has-feedback>
          <a-input v-model="driverForm.phone" placeholder="请输入联系方式" class="w100b" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="name" label="姓名" prop="name">
          <a-input v-model="driverForm.name" placeholder="请输入姓名" class="w100b" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="green_house" label="环保屋" prop="green_house" has-feedback>
          <a-select mode="multiple" v-model="driverForm.green_house" style="width: 100%" placeholder="请选择环保屋">
            <a-select-option v-for="item in greenHouseItem" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="create_account" label="是否开通小程序账号" prop="create_account">
          <a-radio-group name="create_account" v-model="driverForm.create_account">
            <a-radio :value="1">
              正常
            </a-radio>
            <a-radio :value="2">
              停用
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "BarCodeList",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        isNormal: undefined,
        phone: "",
        driverName: ""
      },
      stateOption: [
        { value: 1, label: "正常" },
        { value: 2, label: "停止" }
      ],
      fileList: [],
      operationTitle: "新增", // 新增司机
      greenHouseItem: [
        { value: 1, label: "泗阳体育公园" },
        { value: 2, label: "上海总站" },
        { value: 3, label: "海安天楹园区" }
      ],
      default_green_house: [],
      driverForm: {
        phone: "aaaa",
        name: "qqqq",
        green_house: [1, 2],
        create_account: 1
      },
      operationVisible: false, // 新增/编辑对话框显示隐藏
      operationLoading: false, // 新增/编辑对话框加载状态
      rules: {
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        green_house: [{ required: true, message: "请选择环保屋", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getTableList(1)
  },

  methods: {
    // 搜索表格内容
    getTableList(page) {
      if (page) this.page = page
      this.filter.page = this.page
      this.tableLoading = true
      this.$api.driverList(this.filter).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.batchNo = item.id
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 表格删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delVehicle({ id: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    // 新增/编辑
    operation(type, item) {
      this.clearOperation()
      this.garbageHouseDropList()
      if (type === "edit") {
        this.$api.getVehicleDetail({ id: item.id }).then(res => {
          this.driverForm.license_plate_number = res.data.license_plate_number
          this.driverForm.job_type_name = res.data.job_type_name
          this.driverForm.vehicle_name = res.data.vehicle_name
          this.driverForm.load_capacity = res.data.load_capacity
          this.driverForm.belong = res.data.belong
          this.driverForm.id = res.data.id
        })
      }
      this.type = type
      this.operationVisible = true
      this.$validator.resetFields(this)
    },

    // 新增/编辑确定
    operationOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ;(this.type === "add" ? this.$api.addVehicle(this.form) : this.$api.putVehicle(this.form)).then(res => {
            this.getTableList()
            this.$message.success(res.msg)
            //初始密码提示todo
            this.operationVisible = false
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },

    // 清除新增/编辑数据缓存
    clearOperation() {
      this.driverForm = {
        phone: "",
        name: "",
        green_house: [],
        create_account: 1
      }
    },

    // 密码恢复
    resetPwd(item) {
      this.$confirm({
        title: "密码恢复",
        content: h => <div style="color:red;">确认恢复初始密码：a12345678</div>,
        onOk() {
          console.log("OK")
        },
        onCancel() {
          console.log("Cancel")
        }
      })
      //   this.$router.push({ name: "VehicleManagementRoute", query: { id: item.id } })
    }
  }
}
</script>

<style scoped></style>
