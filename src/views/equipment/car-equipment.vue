<template>
  <div id="CarEquipment">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>设备序列号：</span>
            <div class="dib"><a-input v-model="filter.number" class="w200" placeholder="请输入设备序列号" allowClear /></div>
          </div>
          <div>
            <span>SIM卡号：</span>
            <div class="dib"><a-input v-model="filter.phone" class="w200" placeholder="请输入SIM卡号" allowClear /></div>
          </div>
          <div>
            <span>车牌号：</span>
            <div class="dib"><a-input v-model="filter.vehicle_num" class="w200" placeholder="请输入车牌号" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select v-model="filter.is_online" :options="$com.onlineList()" class="w200" placeholder="请选择状态" allowClear /></div>
          </div>
          <div>
            <span>是否正常：</span>
            <div class="dib"><a-select v-model="filter.is_normal" :options="$com.normalList()" class="w200" placeholder="请选择是否正常" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList()">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-button type="primary" icon="plus-square" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="设备序列号" data-index="number" align="center" :ellipsis="true" />
            <a-table-column title="SIM卡号" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column title="总里程" data-index="total_miles" align="center" :ellipsis="true" />
            <a-table-column title="当日里程" data-index="today_miles" align="center" :ellipsis="true" />
            <a-table-column title="GPS状态" data-index="is_online_text" align="center" :ellipsis="true" />
            <a-table-column title="关联车辆" data-index="vehicle_num" align="center" :ellipsis="true" />
            <a-table-column title="是否正常" data-index="is_normal" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.is_normal ? '确定恢复为启用吗？' : '确定要禁用吗？'"
                  okText="确定"
                  cancelText="取消"
                  :maskClosable="false"
                  @confirm="() => ChangeState(record)"
                  @cancel="record.is_normal = !record.is_normal"
                >
                  <a-switch v-model="record.is_normal" checked-children="启用" un-checked-children="禁用" />
                </a-popconfirm>
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
                <a-button type="link" size="small" @click="showPosition(record)">查看定位</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="brand" label="品牌：" prop="brand" has-feedback>
          <a-input v-model="form.brand" placeholder="请输入品牌" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="number" label="设备序列号：" prop="number" has-feedback>
          <a-input v-model="form.number" placeholder="请输入设备序列号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="SIM卡号：" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入SIM卡号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="vehicle_id" label="车牌号：" prop="vehicle_id" has-feedback>
          <a-select v-model="form.vehicle_id" :options="VehicleOptions" placeholder="请选择车牌号" allowClear></a-select>
        </a-form-model-item>
        <a-form-model-item ref="is_normal" label="设备状态" prop="is_normal" class="flex-center">
          <a-radio-group name="is_normal" v-model="form.is_normal">
            <a-radio :value="1"> 正常 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 查看定位 -->
    <a-modal v-model="mapVisible" :title="'车牌号：' + currentNum" :destroyOnClose="true" :footer="null" :width="1000">
      <TyShowMapPosition :position="position" :searchShow="false"></TyShowMapPosition>
      <div class="mt10">{{ positionAddress }}</div>
    </a-modal>
  </div>
</template>

<script>
import TyShowMapPosition from "@/components/ty-show-map-position/ty-show-map-position.vue"
import mixins from "@/mixins/index.js"
export default {
  name: "CarEquipment",
  components: { TyShowMapPosition },
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        number: "",
        is_normal: undefined,
        is_online: undefined,
        phone: "",
        vehicle_num: ""
      },
      VehicleOptions: [],
      form: {
        brand: "",
        number: "",
        phone: "",
        vehicle_id: undefined,
        is_normal: 1
      },
      rules: {
        brand: [{ required: true, message: "请输入品牌", trigger: "blur" }],
        number: [{ required: true, message: "请输入设备序列号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入SIM卡号", trigger: "blur" }],
        vehicle_id: [{ required: true, message: "请选择车牌号", trigger: "blur" }],
        is_normal: [{ required: true, message: "请选择是否正常", trigger: "blur" }]
      },
      visible: false,
      modelTitle: "新增",
      confirmLoading: false,
      mapVisible: false,
      currentNum: "",
      position: [],
      positionAddress: ""
    }
  },

  created() {
    this.getTableList()
    this.getVehicleOptions()
  },

  methods: {
    // 搜索
    getTableList(page) {
      if (page) this.page = page
      this.filter.page = this.page
      this.tableLoading = true
      let data = {
        page: this.filter.page,
        number: this.filter.number,
        is_normal: this.filter.is_normal == undefined ? "" : this.filter.is_normal,
        is_online: this.filter.is_online == undefined ? "" : this.filter.is_online,
        phone: this.filter.phone,
        vehicle_num: this.filter.vehicle_num
      }
      this.$api.getCarEquipmentList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.is_normal = item.is_normal === 1 ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 获取车辆下拉
    getVehicleOptions() {
      this.$api.getVehicleOptions().then(res => {
        this.VehicleOptions = res.data.map(item => {
          item.label = item.license_plate_number
          item.value = item.id
          return item
        })
      })
    },

    // 新增
    add() {
      this.form = {
        brand: "",
        number: "",
        phone: "",
        vehicle_id: undefined,
        is_normal: 1
      }
      this.visible = true
      this.modelTitle = "新增"
    },

    // 编辑
    edit(id) {
      this.modelTitle = "编辑"
      this.$api.getCarEquipmentDetail({ id }).then(res => {
        this.visible = true
        this.form.brand = res.data.brand
        this.form.number = res.data.number
        this.form.phone = res.data.phone
        this.form.is_normal = res.data.is_normal
        this.form.id = res.data.id
        this.form.vehicle_id = res.data.vehicle_id
      })
    },

    // 删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delCarEquipment({ id: that.selectedRowKeys })
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

    // 切换开关
    ChangeState(record) {
      this.$api
        .putCarEquipmentIsNormal({ id: record.key, is_normal: record.is_normal ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.is_normal = !record.is_normal
        })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          console.log(this.form, "form")
          ;(this.modelTitle === "新增" ? this.$api.addCarEquipment(this.form) : this.$api.putCarEquipment(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 查看定位
    showPosition(item) {
      this.$api.getCarEquipmentLocation({ vehicle_id: item.vehicle_id }).then(res => {
        if (res.data.address || res.data.lon) {
          this.positionAddress = res.data.address || ""
          this.position = [+res.data.lon, +res.data.lat] || []
          this.currentNum = res.data.vehicle_num || ""
          this.mapVisible = true
        } else {
          this.$message.error("暂无定位信息")
        }
      })
    }
  }
}
</script>

<style></style>
